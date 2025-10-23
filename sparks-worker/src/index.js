/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import businesses from "./data/business.json";

// Helper for sending JSON responses with CORS
function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type"
		}
	});
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// Handle preflight CORS requests
		if (request.method === "OPTIONS") {
			return jsonResponse({});
		}

		// Basic health route
		if (url.pathname === "/health") {
			return jsonResponse({ ok: true, message: "Server running" });
		}

		// Seed businesses into KV (one-time setup)
		if (url.pathname === "/seed" && request.method === "POST") {
			await env.BUSINESSES.put("clothing", JSON.stringify(businesses));
			return jsonResponse({ message: "Businesses seeded successfully" });
		}

		//endpoint for getting businesses
		if (url.pathname === "/businesses" && request.method === "GET") {
			const data = await env.BUSINESSES.get("clothing", { type: "json" });

			if (!data) {
				return jsonResponse({ error: "No businesses found" }, 404);
			}

			return jsonResponse(data);
		}

		//endpoint for holding user prererences
		if (url.pathname === "/preferences" && request.method === "POST") {
			const body = await request.json();
			const { userId, values, extra } = body;

			// Define which quiz values are allowed
			const validOptions = [
				"ethically sourced",
				"handmade",
				"BIPOC owned",
				"local",
				"eco-friendly",
				"affordable"
			];

			// Filter the quiz selections to only valid ones
			const filteredValues = (values || []).filter(v => validOptions.includes(v));

			// Validation for missing or invalid core quiz data
			if (!userId || filteredValues.length === 0) {
				return jsonResponse({ error: "Missing or invalid quiz data" }, 400);
			}

			// Save both structured quiz answers and open-ended text
			const userPrefs = {
				values: filteredValues,
				extra: extra || "" // keep the open-ended response (can be empty)
			};

			await env.FAVORITES.put(`prefs:${userId}`, JSON.stringify(userPrefs));

			return jsonResponse({
				message: "Preferences saved successfully",
				preferences: userPrefs
			});
		}

		//match endpoint that, using gemeni, matches users preferences to businesses
		// Match endpoint: uses Gemini to match user preferences with businesses
		if (url.pathname === "/match" && request.method === "POST") {
			try {
				const body = await request.json();
				const { userId } = body;

				if (!userId) {
					return jsonResponse({ error: "Missing userId" }, 400);
				}

				// 1️⃣ Retrieve user preferences
				const userPrefs = await env.FAVORITES.get(`prefs:${userId}`, { type: "json" });
				if (!userPrefs) {
					return jsonResponse({ error: "No preferences found for this user" }, 404);
				}

				// 2️⃣ Retrieve businesses from KV
				const businessList = await env.BUSINESSES.get("clothing", { type: "json" });
				if (!businessList || businessList.length === 0) {
					return jsonResponse({ error: "No businesses available" }, 404);
				}

				// 3️⃣ Prepare prompt for Gemini
				const prompt = `
You are an AI assistant that matches user shopping values with small businesses.

User Preferences:
${JSON.stringify(userPrefs, null, 2)}

Available Businesses (each includes name, description, and tags):
${JSON.stringify(businessList, null, 2)}

Return a valid JSON array of the top 3 matching businesses.
Each object must include:
- "name": the business name
- "score": a number between 0 and 1 indicating match strength
- "reason": one sentence explaining why it matches
Respond ONLY with a JSON array.
    `;

				// 4️⃣ Define Gemini model and endpoint
				const GEMINI_MODEL = "gemini-2.5-flash";
				const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

				// 5️⃣ Call Gemini API
				const response = await fetch(GEMINI_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						contents: [{ parts: [{ text: prompt }] }]
					})
				});

				const result = await response.json();
				const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

				// 6️⃣ Parse Gemini output safely
				let matches;
				try {
					matches = JSON.parse(aiText);
				} catch {
					matches = [{ error: "AI response could not be parsed", raw: aiText }];
				}

				// 7️⃣ Return the ranked matches
				return jsonResponse({ matches });

			} catch (err) {
				console.error("Gemini /match error:", err);
				return jsonResponse(
					{ error: "Internal server error", details: err.message },
					500
				);
			}
		}



		// Default 404
		return jsonResponse({ error: "Not found" }, 404);
	}
};
