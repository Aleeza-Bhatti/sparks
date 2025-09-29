import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ---- Sparks Theme ----
const theme = {
  gradientStart: '#FFE5D2', // light peach
  gradientEnd:   '#FFB27D', // soft orange
  primary:       '#D23A3A', // red accent (buttons/icons)
  card:          '#FFF8F5', // off-white card bg
  textDark:      '#2B2B2B',
  textLight:     '#6B6F7A',
  gold:          '#F7C948', // celebratory "spark"
};

const MOCK_BUSINESSES = [
  { id:'b1', name:'Bean & Bloom Coffee', tags:['Cafe','Local','Study-friendly'],
    img:'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1400&auto=format&fit=crop',
    blurb:'Small-batch espresso, house syrups, and sunny patio seating.' },
  { id:'b2', name:'Sunrise Thrift', tags:['Thrift','Vintage','Affordable'],
    img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop',
    blurb:'Curated second-hand finds supporting neighborhood programs.' },
  { id:'b3', name:'Lotus Street Eats', tags:['Food Truck','Asian Fusion','Spicy'],
    img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop',
    blurb:'Late-night noodles and bao. Vegan options available!' },
  { id:'b4', name:'Page Turners Bookshop', tags:['Books','Indie','Events'],
    img:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop',
    blurb:'Author readings every Thursday. Cozy reading nooks inside.' },
];

const LIKE_KEY = 'sparks_likes_v1';
const loadLikes = async () => {
  try { const raw = await AsyncStorage.getItem(LIKE_KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
};
const saveLikes = async (ids) => { try { await AsyncStorage.setItem(LIKE_KEY, JSON.stringify(ids)); } catch {} };

// ---- Nav Tabs ----
function TopTabs({ screen, setScreen }) {
  return (
    <View style={styles.tabs}>
      {['welcome','swipe','favorites'].map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => setScreen(s)}
          style={[styles.tab, screen===s && styles.tabActive]}>
          <Text style={[styles.tabText, screen===s && styles.tabTextActive]}>
            {s==='welcome'?'Welcome':s==='swipe'?'Swipe':'Favorites'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ---- Screen: Welcome ----
function Welcome({ setScreen }) {
  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.gradientFill}>
      <View style={styles.centerWrap}>
        <Text style={styles.h1}>Find small businesses you love</Text>
        <Text style={styles.sub}>
          Swipe right to save, left to pass. We’ll add Firebase later to pull real listings.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setScreen('swipe')}>
          <Text style={styles.primaryBtnText}>Start Swiping</Text>
        </TouchableOpacity>

        <View style={styles.threeCols}>
          {['Discover','Support','Share'].map((label) => (
            <View key={label} style={styles.infoCard}>
              <Text style={styles.infoTitle}>{label}</Text>
              <Text style={styles.infoText}>
                {label==='Discover'?'Explore local shops and eats.'
                  : label==='Support'?'Save and revisit your favs.'
                  : 'Send your picks to friends.'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

// ---- Tiny tag chip ----
const Tag = ({ children }) => (
  <View style={styles.tag}><Text style={styles.tagText}>{children}</Text></View>
);

// ---- Screen: Swipe (deck) ----
function SwipeScreen({ data, onLike, onPass }) {
  const [cardIndex, setCardIndex] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.gradientStart }}>
      <Swiper
        cards={data}
        cardIndex={cardIndex}
        renderCard={(biz) => (
          <View style={styles.card}>
            <Image source={{ uri: biz.img }} style={styles.cardImg} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{biz.name}</Text>
              <View style={styles.tagRow}>{biz.tags.map((t) => <Tag key={t}>{t}</Tag>)}</View>
              <Text style={styles.cardBlurb}>{biz.blurb}</Text>
            </View>
          </View>
        )}
        onSwiped={(i) => setCardIndex(i + 1)}
        onSwipedRight={(i) => onLike(data[i])}
        onSwipedLeft={(i) => onPass(data[i])}
        backgroundColor={'transparent'}
        stackSize={2}
        stackSeparation={15}
        disableBottomSwipe
        disableTopSwipe
        overlayLabels={{
          left:  { title: 'PASS', style: { label: styles.overlay, wrapper: styles.overlayWrapLeft } },
          right: { title: 'LIKE', style: { label: styles.overlayLike, wrapper: styles.overlayWrapRight } },
        }}
      />
      {cardIndex >= data.length && (
        <View style={styles.doneWrap}><Text style={styles.doneText}>You’re all caught up 🎉</Text></View>
      )}
    </View>
  );
}

// ---- Screen: Favorites ----
function Favorites({ likes }) {
  if (!likes.length) {
    return (
      <View style={[styles.centerWrap, { backgroundColor: theme.gradientStart }]}>
        <Text style={styles.sub}>No favorites yet. Swipe right to save a business.</Text>
      </View>
    );
  }
  return (
    <FlatList
      contentContainerStyle={{ padding: 16, backgroundColor: theme.gradientStart }}
      data={likes}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <View style={styles.favCard}>
          <Image source={{ uri: item.img }} style={styles.favImg} />
          <View style={{ padding: 8 }}>
            <Text style={styles.favTitle}>{item.name}</Text>
            <Text style={styles.favTags}>{item.tags.join(' • ')}</Text>
          </View>
        </View>
      )}
    />
  );
}

// ---- App ----
export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [likes, setLikes] = useState([]);

  const deck = useMemo(() => {
    const likedIds = new Set(likes.map((l) => l.id));
    return MOCK_BUSINESSES.filter((b) => !likedIds.has(b.id));
  }, [likes]);

  useEffect(() => { (async () => {
    const ids = await loadLikes();
    if (ids.length && typeof ids[0] === 'string') {
      const recovered = ids.map((id) => MOCK_BUSINESSES.find((b) => b.id === id)).filter(Boolean);
      setLikes(recovered);
    }
  })(); }, []);

  const handleLike = async (biz) => {
    const next = [...likes, biz];
    setLikes(next);
    await saveLikes(next.map((b) => b.id));
  };
  const handlePass = () => {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.gradientStart }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.brand}>✨ Sparks</Text>
        <TopTabs screen={screen} setScreen={setScreen} />
      </View>

      {screen === 'welcome'   && <Welcome setScreen={setScreen} />}
      {screen === 'swipe'     && <SwipeScreen data={deck} onLike={handleLike} onPass={handlePass} />}
      {screen === 'favorites' && <Favorites likes={likes} />}

      <View style={styles.footer}><Text style={styles.footerText}>Sparks • Expo + Deck Swiper</Text></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: theme.gradientStart },
  brand: { fontSize: 18, fontWeight: '700', color: theme.textDark },

  tabs: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F2D9C7' },
  tabActive: { backgroundColor: theme.primary },
  tabText: { color: theme.textDark },
  tabTextActive: { color: '#fff' },

  gradientFill: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, width: '100%' },

  h1: { fontSize: 26, fontWeight: '700', color: theme.textDark, textAlign: 'center' },
  sub: { marginTop: 8, color: theme.textLight, textAlign: 'center' },

  primaryBtn: { marginTop: 16, backgroundColor: theme.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },

  threeCols: { marginTop: 24, width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  infoCard: { flex: 1, backgroundColor: theme.card, padding: 12, borderRadius: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#F4C6A8' },
  infoTitle: { fontWeight: '600', color: theme.textDark },
  infoText: { marginTop: 4, fontSize: 12, color: theme.textLight },

  card: { backgroundColor: theme.card, borderRadius: 20, overflow: 'hidden', height: width * 1.2, alignSelf: 'center', width: width - 32,
          shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
  cardImg: { width: '100%', height: '60%' },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.textDark },
  cardBlurb: { marginTop: 6, color: theme.textLight },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  tag: { backgroundColor: '#FDE1CF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 12, color: theme.textDark },

  overlay: { borderWidth: 4, borderColor: theme.textDark, color: theme.textDark, fontWeight: '800', fontSize: 24, padding: 8 },
  overlayLike: { borderWidth: 4, borderColor: theme.primary, color: theme.primary, fontWeight: '800', fontSize: 24, padding: 8 },
  overlayWrapLeft: { alignItems: 'flex-end', marginTop: 30, marginLeft: -30 },
  overlayWrapRight: { alignItems: 'flex-start', marginTop: 30, marginLeft: 30 },

  doneWrap: { position: 'absolute', top: 24, left: 0, right: 0, alignItems: 'center' },
  doneText: { color: theme.textLight },

  favCard: { backgroundColor: theme.card, borderRadius: 16, overflow: 'hidden', flex: 1, marginBottom: 12, borderWidth: 1, borderColor: '#F4C6A8' },
  favImg: { height: 110, width: '100%' },
  favTitle: { fontWeight: '700', color: theme.textDark },
  favTags: { marginTop: 2, color: theme.textLight, fontSize: 12 },

  footer: { alignItems: 'center', paddingVertical: 10, backgroundColor: theme.gradientStart },
  footerText: { color: '#9A8D85', fontSize: 12 },
});

