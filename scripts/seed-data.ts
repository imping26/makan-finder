import type { Cuisine, MalaysianState, OpeningHours } from "../src/lib/db/schema";

/**
 * ⚠️ 全部是虚构的示范数据（店名、地址都是编的），只用来开发。
 * 上线前换成真实餐厅，或者在网站上清楚标明 "sample data"。
 */
export type SeedRestaurant = {
  name: string;
  description: string;
  state: MalaysianState;
  city: string;
  address: string;
  cuisine: Cuisine;
  priceRange: 1 | 2 | 3;
  isHalal: boolean;
  lat: number;
  lng: number;
  hours: keyof typeof HOURS;
};

export const HOURS = {
  breakfast: daily("06:30", "14:00", ["1"]),
  allDay: daily("08:00", "22:00"),
  dinner: daily("17:00", "23:30", ["2"]),
  mamak24: daily("00:00", "23:59"),
  cafe: daily("09:00", "18:00", ["3"]),
  lunchDinner: daily("11:00", "22:00"),
} satisfies Record<string, OpeningHours>;

function daily(open: string, close: string, closedDays: string[] = []): OpeningHours {
  const hours: OpeningHours = {};
  for (const d of ["0", "1", "2", "3", "4", "5", "6"] as const) {
    hours[d] = closedDays.includes(d) ? { closed: true } : { open, close };
  }
  return hours;
}

export const SEED_USERS = [
  { id: "seed-user-aiman", name: "Aiman Hakim", email: "aiman@example.com" },
  { id: "seed-user-meiling", name: "Tan Mei Ling", email: "meiling@example.com" },
  { id: "seed-user-priya", name: "Priya Raj", email: "priya@example.com" },
  { id: "seed-user-jason", name: "Jason Lim", email: "jason@example.com" },
  { id: "seed-user-nurul", name: "Nurul Izzah", email: "nurul@example.com" },
  { id: "seed-user-daniel", name: "Daniel Wong", email: "daniel@example.com" },
] as const;

export const REVIEW_TEMPLATES: Record<1 | 2 | 3 | 4 | 5, string[]> = {
  5: [
    "Confirm will come back again. Worth every ringgit!",
    "Best I've had in the area, the queue is worth it.",
    "Sedap gila, portion pun besar. Highly recommended.",
  ],
  4: [
    "Food is good, service a bit slow during lunch hour.",
    "Solid choice, parking is the only headache.",
    "Tasty and reasonably priced. Will try other dishes next time.",
  ],
  3: [
    "Okay lah, nothing special but not bad.",
    "Average taste, nice ambience though.",
  ],
  2: ["A bit overpriced for the portion.", "Waited 40 minutes, food came out lukewarm."],
  1: ["Not my cup of tea, quite disappointed."],
};

export const SEED_RESTAURANTS: SeedRestaurant[] = [
  // ── Kuala Lumpur ───────────────────────────────────────────
  { name: "Nasi Lemak Pak Mat Kampung Baru", description: "Old-school nasi lemak wrapped in banana leaf, famous for its sambal sotong and rendang ayam.", state: "kuala-lumpur", city: "Kampung Baru", address: "12 Jalan Raja Muda Musa, Kampung Baru", cuisine: "malay", priceRange: 1, isHalal: true, lat: 3.1655, lng: 101.7046, hours: "breakfast" },
  { name: "Restoran Seri Bukit Bintang", description: "Air-conditioned mamak with roti canai stretched to order and a teh tarik that hits the spot after midnight.", state: "kuala-lumpur", city: "Bukit Bintang", address: "45 Jalan Alor, Bukit Bintang", cuisine: "mamak", priceRange: 1, isHalal: true, lat: 3.1456, lng: 101.7088, hours: "mamak24" },
  { name: "Ah Keong Claypot Chicken Rice", description: "Charcoal-fired claypot chicken rice with salted fish and lap cheong. The crispy rice at the bottom is the prize.", state: "kuala-lumpur", city: "Pudu", address: "8 Jalan Pasar Baharu, Pudu", cuisine: "chinese", priceRange: 1, isHalal: false, lat: 3.1372, lng: 101.7131, hours: "dinner" },
  { name: "Brickfields Banana Leaf House", description: "Generous banana leaf rice with unlimited refills of vegetables and rasam, plus a fiery mutton varuval.", state: "kuala-lumpur", city: "Brickfields", address: "101 Jalan Tun Sambanthan, Brickfields", cuisine: "indian", priceRange: 1, isHalal: true, lat: 3.1297, lng: 101.6864, hours: "lunchDinner" },
  { name: "Kopi Sudut Bangsar", description: "Specialty coffee bar with local beans, kaya toast reinvented and a quiet upstairs for laptop work.", state: "kuala-lumpur", city: "Bangsar", address: "23 Jalan Telawi 3, Bangsar Baru", cuisine: "cafe", priceRange: 2, isHalal: false, lat: 3.1322, lng: 101.6713, hours: "cafe" },
  { name: "Sakura Tei Mont Kiara", description: "Omakase-style counter with weekly fish flown in, and a good-value lunch chirashi set.", state: "kuala-lumpur", city: "Mont Kiara", address: "Lot G-12, Jalan Kiara 1, Mont Kiara", cuisine: "japanese", priceRange: 3, isHalal: false, lat: 3.1689, lng: 101.6522, hours: "lunchDinner" },
  { name: "Chow Kit Sup Tulang", description: "Bright red sup tulang ZZ-style: sticky, sweet-spicy mutton bones you eat with your hands.", state: "kuala-lumpur", city: "Chow Kit", address: "77 Jalan Haji Hussein, Chow Kit", cuisine: "malay", priceRange: 1, isHalal: true, lat: 3.1646, lng: 101.6987, hours: "dinner" },
  { name: "Hanok Charcoal Grill TTDI", description: "Korean BBQ with charcoal grills, banchan refills and a strong kimchi jjigae.", state: "kuala-lumpur", city: "TTDI", address: "5 Lorong Rahim Kajai 14, Taman Tun Dr Ismail", cuisine: "korean", priceRange: 2, isHalal: false, lat: 3.1431, lng: 101.6292, hours: "lunchDinner" },

  // ── Selangor ───────────────────────────────────────────────
  { name: "SS2 Wantan Mee Corner", description: "Springy hand-made noodles in dark sauce with char siu that is more fat than lean — in the best way.", state: "selangor", city: "Petaling Jaya", address: "31 Jalan SS2/64, Petaling Jaya", cuisine: "chinese", priceRange: 1, isHalal: false, lat: 3.1186, lng: 101.6213, hours: "breakfast" },
  { name: "Warung Mak Teh Shah Alam", description: "Home-style lauk campur with over 30 dishes daily. Go early for the ikan bakar.", state: "selangor", city: "Shah Alam", address: "14 Jalan Plumbum, Seksyen 7", cuisine: "malay", priceRange: 1, isHalal: true, lat: 3.0733, lng: 101.4918, hours: "breakfast" },
  { name: "Damansara Uptown Roti Bakar", description: "Charcoal-toasted bread with butter and kaya, half-boiled eggs and strong kopi-o.", state: "selangor", city: "Petaling Jaya", address: "9 Jalan SS21/37, Damansara Utama", cuisine: "malay", priceRange: 1, isHalal: true, lat: 3.1354, lng: 101.6236, hours: "breakfast" },
  { name: "Subang Thai Kitchen", description: "Proper Thai heat: tom yum with a punch, basil pork rice and mango sticky rice in season.", state: "selangor", city: "Subang Jaya", address: "52 Jalan SS15/4, Subang Jaya", cuisine: "thai", priceRange: 2, isHalal: false, lat: 3.0757, lng: 101.5869, hours: "lunchDinner" },
  { name: "Puchong Prawn Mee House", description: "Rich prawn-head broth simmered for hours, topped with pork ribs and kangkung.", state: "selangor", city: "Puchong", address: "18 Jalan Puteri 2/4, Bandar Puteri", cuisine: "chinese", priceRange: 1, isHalal: false, lat: 3.0219, lng: 101.6203, hours: "breakfast" },
  { name: "Klang Bak Kut Teh Lama", description: "Herbal, peppery bak kut teh served in claypots, with you char kuey for dipping.", state: "selangor", city: "Klang", address: "6 Jalan Stesen, Klang", cuisine: "chinese", priceRange: 2, isHalal: false, lat: 3.0438, lng: 101.4456, hours: "breakfast" },
  { name: "Cyberjaya Fusion Lab", description: "Office-crowd favourite mixing local flavours with western plating: rendang pasta, sambal burgers.", state: "selangor", city: "Cyberjaya", address: "Block C, Jalan Teknokrat 3", cuisine: "fusion", priceRange: 2, isHalal: true, lat: 2.9213, lng: 101.6559, hours: "allDay" },
  { name: "Kajang Satay Corner", description: "Charcoal-grilled satay sold by the stick with chunky peanut sauce and nasi impit.", state: "selangor", city: "Kajang", address: "3 Jalan Semenyih, Kajang", cuisine: "malay", priceRange: 1, isHalal: true, lat: 2.9935, lng: 101.7871, hours: "dinner" },
  { name: "Bangi Dessert Bar", description: "ABC, cendol and bingsu under one roof, with a durian menu in the season.", state: "selangor", city: "Bangi", address: "27 Jalan 9/9C, Seksyen 9, Bandar Baru Bangi", cuisine: "dessert", priceRange: 1, isHalal: true, lat: 2.9634, lng: 101.7639, hours: "allDay" },
  { name: "The Grillhouse Kota Damansara", description: "Steaks, lamb chops and a well-made mushroom soup. Popular for birthday dinners.", state: "selangor", city: "Petaling Jaya", address: "10 Jalan PJU 5/9, Kota Damansara", cuisine: "western", priceRange: 3, isHalal: true, lat: 3.1508, lng: 101.5904, hours: "lunchDinner" },

  // ── Penang ─────────────────────────────────────────────────
  { name: "Lorong Char Koay Teow Uncle", description: "Wok hei-heavy char koay teow with big prawns and duck egg, cooked over charcoal.", state: "penang", city: "George Town", address: "15 Lorong Selamat, George Town", cuisine: "chinese", priceRange: 1, isHalal: false, lat: 5.4141, lng: 100.3288, hours: "breakfast" },
  { name: "Nyonya Rumah Lama", description: "Peranakan home cooking: assam prawns, jiu hu char and a perfect kuih platter.", state: "penang", city: "George Town", address: "40 Jalan Kelawai, George Town", cuisine: "nyonya", priceRange: 2, isHalal: false, lat: 5.4256, lng: 100.3192, hours: "lunchDinner" },
  { name: "Banjir Nasi Kandar Penang Road", description: "Pile your rice high and ask for banjir — mixed curries poured over everything.", state: "penang", city: "George Town", address: "177 Jalan Penang, George Town", cuisine: "mamak", priceRange: 1, isHalal: true, lat: 5.4185, lng: 100.3330, hours: "mamak24" },
  { name: "Bukit Bendera Asam Laksa", description: "Sour, fishy asam laksa with torch ginger, mint and a spoon of hae ko.", state: "penang", city: "Air Itam", address: "Jalan Pasar, Air Itam", cuisine: "malay", priceRange: 1, isHalal: true, lat: 5.3998, lng: 100.2785, hours: "allDay" },
  { name: "Batu Ferringhi Seaside Grill", description: "Seafood by the beach: chilli crab, butter prawns and grilled stingray at sunset.", state: "penang", city: "Batu Ferringhi", address: "Jalan Batu Ferringhi", cuisine: "chinese", priceRange: 3, isHalal: false, lat: 5.4721, lng: 100.2463, hours: "dinner" },

  // ── Perak ──────────────────────────────────────────────────
  { name: "Ipoh Lama Bean Sprout Chicken", description: "Silky poached chicken with crunchy local bean sprouts and kway teow soup.", state: "perak", city: "Ipoh", address: "49 Jalan Yau Tet Shin, Ipoh", cuisine: "chinese", priceRange: 2, isHalal: false, lat: 4.5975, lng: 101.0794, hours: "dinner" },
  { name: "Kopi Putih Heritage House", description: "Ipoh white coffee roasted in-house, egg tarts out of the oven every hour.", state: "perak", city: "Ipoh", address: "8 Jalan Bandar Timah, Ipoh", cuisine: "cafe", priceRange: 1, isHalal: false, lat: 4.5962, lng: 101.0779, hours: "cafe" },
  { name: "Taiping Mee Udang", description: "Freshwater prawns the size of your palm in a sweet-spicy noodle gravy.", state: "perak", city: "Taiping", address: "22 Jalan Kota, Taiping", cuisine: "malay", priceRange: 2, isHalal: true, lat: 4.8517, lng: 100.7415, hours: "allDay" },

  // ── Melaka ─────────────────────────────────────────────────
  { name: "Jonker Chicken Rice Ball", description: "Chicken rice moulded into balls, served with roast chicken and chilli-ginger sauce.", state: "melaka", city: "Melaka", address: "31 Jalan Hang Jebat, Melaka", cuisine: "chinese", priceRange: 1, isHalal: false, lat: 2.1956, lng: 102.2475, hours: "lunchDinner" },
  { name: "Baba Nyonya Kitchen Heeren", description: "Ayam pongteh, itik tim and a cendol with gula Melaka from a family recipe.", state: "melaka", city: "Melaka", address: "60 Jalan Tun Tan Cheng Lock, Melaka", cuisine: "nyonya", priceRange: 2, isHalal: false, lat: 2.1960, lng: 102.2459, hours: "lunchDinner" },
  { name: "Asam Pedas Hang Tuah", description: "Tangy, fiery asam pedas ikan pari cooked in a claypot, best with white rice and ulam.", state: "melaka", city: "Melaka", address: "4 Jalan Hang Tuah, Melaka", cuisine: "malay", priceRange: 1, isHalal: true, lat: 2.2005, lng: 102.2502, hours: "lunchDinner" },

  // ── Johor ──────────────────────────────────────────────────
  { name: "JB Mee Rebus Corner", description: "Thick sweet-potato gravy over yellow noodles, topped with egg, tauhu and green chilli.", state: "johor", city: "Johor Bahru", address: "13 Jalan Dhoby, Johor Bahru", cuisine: "malay", priceRange: 1, isHalal: true, lat: 1.4610, lng: 103.7609, hours: "breakfast" },
  { name: "Kluang Junction Kopitiam", description: "Kopi and roti bakar beside the railway line, a stop for travellers for decades.", state: "johor", city: "Kluang", address: "Jalan Stesen, Kluang", cuisine: "cafe", priceRange: 1, isHalal: true, lat: 2.0300, lng: 103.3185, hours: "cafe" },
  { name: "Mount Austin Korean Table", description: "Neighbourhood Korean spot with stone-pot bibimbap and generous fried chicken.", state: "johor", city: "Johor Bahru", address: "21 Jalan Austin Heights 8/3, Mount Austin", cuisine: "korean", priceRange: 2, isHalal: false, lat: 1.5612, lng: 103.7814, hours: "lunchDinner" },

  // ── Sabah & Sarawak ────────────────────────────────────────
  { name: "Kota Kinabalu Tuaran Mee House", description: "Egg noodles fried until springy with char siu and greens, Sabah-style.", state: "sabah", city: "Kota Kinabalu", address: "9 Jalan Gaya, Kota Kinabalu", cuisine: "chinese", priceRange: 1, isHalal: false, lat: 5.9838, lng: 116.0750, hours: "breakfast" },
  { name: "Sabah Waterfront Seafood", description: "Pick your seafood from tanks, choose a cooking style, eat by the sea.", state: "sabah", city: "Kota Kinabalu", address: "Jalan Tun Fuad Stephens, Kota Kinabalu", cuisine: "chinese", priceRange: 3, isHalal: false, lat: 5.9799, lng: 116.0706, hours: "dinner" },
  { name: "Kuching Laksa Sarawak Stall", description: "Sambal belacan-based laksa with prawns, omelette strips and lime. Breakfast of champions.", state: "sarawak", city: "Kuching", address: "Jalan Carpenter, Kuching", cuisine: "malay", priceRange: 1, isHalal: true, lat: 1.5575, lng: 110.3453, hours: "breakfast" },
  { name: "Kolo Mee Padungan", description: "Springy kolo mee tossed in shallot oil with minced pork and char siu.", state: "sarawak", city: "Kuching", address: "88 Jalan Padungan, Kuching", cuisine: "chinese", priceRange: 1, isHalal: false, lat: 1.5539, lng: 110.3527, hours: "breakfast" },
];
