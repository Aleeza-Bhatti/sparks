/**
 * Script that automatically adds sample businesses to
 * our Firestore "businessses" colllection in our database
 * 
 * Uses Faker.js to generate realistic bus names + website
 * Uses Unsplash API to fetch 3 images per business
 * 
 */


import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { faker } from "@faker-js/faker";
import axios from "axios";
import 'dotenv/config';


// Firebase config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Unsplash API key for random images
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Industry-specific tag config
const industryConfig = {
    Fashion: { tags: ["Sustainable", "Modest-Friendly", "Handmade"], query: "fashion" },
    Food: { tags: ["Local", "Vegan", "Organic"], query: "food" },
    Skincare: { tags: ["Natural", "Vegan", "Handmade"], query: "skincare" }
};

// Function to fetch Unsplash images for a given keyword
async function fetchUnsplashImages(query, count = 3) {
    try {
        const response = await axios.get(
            `https://api.unsplash.com/photos/random?query=${query}&count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        return response.data.map(img => img.urls.small); // returns array of image URLs
    } catch (error) {
        console.error("Error fetching Unsplash images:", error.message);
        return [];
    }
}

// Function that adds businesses to our fire store database
async function addExampleData(num = 1) {
    const industries = Object.keys(industryConfig);

    for (let i = 0; i < num; i++) {
        const industry = faker.helpers.arrayElement(industries);
        const config = industryConfig[industry];

        // Get 3 Unsplash images for this industry
        const images = await fetchUnsplashImages(config.query, 3);

        const newBusiness = {
            name: faker.company.name(),
            industry,
            tags: faker.helpers.arrayElements(config.tags, { min: 1, max: 2 }),
            images,
            website: faker.internet.url()
        };

        await addDoc(collection(db, "businesses"), newBusiness);
        console.log("Added:", newBusiness.name, "| Industry:", industry);
    }
}

addExampleData();



/** 
*Adding Fashion related businesses only to database

const fashionConfig = {
  tags: ["Sustainable", "Modest-Friendly", "Handmade", "Streetwear", "Luxury"],
  query: "fashion",
  nameSuffixes: ["Clothing", "Apparel", "Threads", "Styles", "Wear"]
};

async function addFashionData(num = 15) {
  for (let i = 0; i < num; i++) {
    const images = await fetchUnsplashImages(fashionConfig.query, 3);

    // Fashion-specific name
    const baseName = faker.company.name();
    const suffix = faker.helpers.arrayElement(fashionConfig.nameSuffixes);
    const fashionName = `${baseName} ${suffix}`;

    const newBusiness = {
      name: fashionName,
      industry: "Fashion",
      tags: faker.helpers.arrayElements(fashionConfig.tags, { min: 1, max: 2 }),
      images,
      website: faker.internet.url()
    };

    await addDoc(collection(db, "businesses"), newBusiness);
    console.log("Added fashion brand:", newBusiness.name);
  }
}

addFashionData();

*/