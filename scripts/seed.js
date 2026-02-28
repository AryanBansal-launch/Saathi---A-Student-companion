/**
 * Seed MongoDB with dummy data for Saarthi.
 * Creates collections: users, listings, reviews, vendors, interactions.
 *
 * Run from project root: node scripts/seed.js
 * Requires: MONGODB_URI in .env.local (loaded by this script)
 */

require("./load-env.js");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Add it to .env.local");
  process.exit(1);
}

const SALT_ROUNDS = 12;
const DUMMY_PASSWORD = "password123";

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  const db = mongoose.connection.db;

  // Drop existing collections (optional - comment out to keep existing data)
  const collections = await db.listCollections().toArray();
  const names = collections.map((c) => c.name);
  for (const name of ["users", "listings", "reviews", "vendors", "interactions"]) {
    if (names.includes(name)) {
      await db.collection(name).drop();
      console.log("Dropped collection:", name);
    }
  }
  console.log("");

  const passwordHash = await bcrypt.hash(DUMMY_PASSWORD, SALT_ROUNDS);

  // ----- Users -----
  const usersColl = db.collection("users");
  const users = [
    { name: "Admin User", email: "admin@saarthi.com", passwordHash, role: "admin", phone: "+91 9876543210", city: "Delhi", location: { lat: 28.6139, lng: 77.209 }, preferences: { budget: 15000, categories: ["hostel", "mess"] }, savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Vendor One", email: "vendor1@saarthi.com", passwordHash, role: "vendor", phone: "+91 9876543211", city: "Delhi", savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Vendor Two", email: "vendor2@saarthi.com", passwordHash, role: "vendor", phone: "+91 9876543212", city: "Mumbai", savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Vendor Bangalore", email: "vendor.blr@saarthi.com", passwordHash, role: "vendor", phone: "+91 9876543213", city: "Bangalore", savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Vendor Pune", email: "vendor.pune@saarthi.com", passwordHash, role: "vendor", phone: "+91 9876543214", city: "Pune", savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Vendor Hyderabad", email: "vendor.hyd@saarthi.com", passwordHash, role: "vendor", phone: "+91 9876543215", city: "Hyderabad", savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Vendor Chennai", email: "vendor.chennai@saarthi.com", passwordHash, role: "vendor", phone: "+91 9876543216", city: "Chennai", savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Student Rahul", email: "rahul@example.com", passwordHash, role: "student", city: "Delhi", preferences: { budget: 10000, categories: ["hostel", "mess", "books"] }, savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Student Priya", email: "priya@example.com", passwordHash, role: "student", city: "Bangalore", preferences: { budget: 12000, categories: ["accommodation", "laundry"] }, savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Student Arjun", email: "arjun@example.com", passwordHash, role: "student", city: "Mumbai", preferences: { budget: 14000, categories: ["hostel", "bike"] }, savedListings: [], createdAt: new Date(), updatedAt: new Date() },
    { name: "Student Sneha", email: "sneha@example.com", passwordHash, role: "student", city: "Pune", preferences: { budget: 9000, categories: ["mess", "books"] }, savedListings: [], createdAt: new Date(), updatedAt: new Date() },
  ];

  const insertedUsers = await usersColl.insertMany(users);
  const userIds = insertedUsers.insertedIds;
  console.log("Inserted users:", users.length);

  const adminId = userIds["0"];
  const vendor1Id = userIds["1"];
  const vendor2Id = userIds["2"];
  const vendorBlrId = userIds["3"];
  const vendorPuneId = userIds["4"];
  const vendorHydId = userIds["5"];
  const vendorChennaiId = userIds["6"];
  const student1Id = userIds["7"];
  const student2Id = userIds["8"];
  const student3Id = userIds["9"];
  const student4Id = userIds["10"];

  // ----- Vendors -----
  const vendorsColl = db.collection("vendors");
  await vendorsColl.insertMany([
    { userId: vendor1Id, businessName: "Comfy Stay Hostels", verified: true, totalListings: 10, rating: 4.5, createdAt: new Date(), updatedAt: new Date() },
    { userId: vendor2Id, businessName: "City Mess & Tiffin", verified: true, totalListings: 10, rating: 4.2, createdAt: new Date(), updatedAt: new Date() },
    { userId: vendorBlrId, businessName: "Koramangala Stay", verified: true, totalListings: 9, rating: 4.4, createdAt: new Date(), updatedAt: new Date() },
    { userId: vendorPuneId, businessName: "Pune Student Services", verified: true, totalListings: 8, rating: 4.3, createdAt: new Date(), updatedAt: new Date() },
    { userId: vendorHydId, businessName: "Gachibowli Hostels", verified: true, totalListings: 9, rating: 4.1, createdAt: new Date(), updatedAt: new Date() },
    { userId: vendorChennaiId, businessName: "Chennai Mess & PG", verified: true, totalListings: 9, rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log("Inserted vendors: 6");

  // ----- Listings (multiple cities, all categories) -----
  const listingsColl = db.collection("listings");
  const listingsData = [
    // Delhi
    { vendorId: vendor1Id, category: "hostel", title: "Comfy PG near IIT Delhi", description: "Clean rooms, WiFi, food optional. Safe for students.", price: 12000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-hostel1/800/600"], location: { address: "Hauz Khas", city: "Delhi", lat: 28.5445, lng: 77.2066 }, amenities: ["WiFi", "AC", "Food", "Laundry"], availability: true, contactPhone: "+91 9876543211", rating: 4.5, reviewCount: 12, saarthiScore: 78, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "hostel", title: "Girls PG in Saket", description: "Secure girls hostel with 24/7 security and mess.", price: 11000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-hostel2/800/600"], location: { address: "Saket", city: "Delhi", lat: 28.5244, lng: 77.1855 }, amenities: ["WiFi", "Security", "Mess"], availability: true, contactPhone: "+91 9876543211", rating: 4.3, reviewCount: 8, saarthiScore: 72, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "bike", title: "Scooty Rent - Monthly", description: "Activa 5G, good condition. Monthly rental.", price: 3500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-bike1/800/600"], location: { address: "Green Park", city: "Delhi", lat: 28.5682, lng: 77.225 }, amenities: ["Helmet", "Docs"], availability: true, contactPhone: "+91 9876543211", rating: 4.7, reviewCount: 5, saarthiScore: 80, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "accommodation", title: "Shared Flat in Dwarka", description: "2BHK, one room available. Near metro.", price: 8000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-acc1/800/600"], location: { address: "Dwarka Sector 12", city: "Delhi", lat: 28.5921, lng: 77.0466 }, amenities: ["WiFi", "Parking", "Kitchen"], availability: true, contactPhone: "+91 9876543211", rating: 4.4, reviewCount: 6, saarthiScore: 74, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "mess", title: "Delhi Mess - Veg North Indian", description: "Roti, dal, sabzi, rice. Breakfast and dinner.", price: 3200, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-mess-del1/800/600"], location: { address: "Karol Bagh", city: "Delhi", lat: 28.6519, lng: 77.1905 }, amenities: ["Breakfast", "Dinner"], availability: true, contactPhone: "+91 9876543211", rating: 4.4, reviewCount: 18, saarthiScore: 76, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "laundry", title: "Laundry Hub - South Delhi", description: "Wash, dry, fold. Per kg rates. Pickup available.", price: 55, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-laundry-del1/800/600"], location: { address: "Lajpat Nagar", city: "Delhi", lat: 28.5670, lng: 77.2431 }, amenities: ["Pickup", "Delivery"], availability: true, contactPhone: "+91 9876543211", rating: 4.5, reviewCount: 22, saarthiScore: 77, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "books", title: "Academic Books - DU North Campus", description: "Textbooks, reference books. Buy or rent. JEE, NEET, graduation.", price: 150, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-books-del1/800/600"], location: { address: "North Campus", city: "Delhi", lat: 28.6906, lng: 77.2090 }, amenities: ["Delivery", "Exchange"], availability: true, contactPhone: "+91 9876543211", rating: 4.5, reviewCount: 30, saarthiScore: 78, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "furniture", title: "Study Table & Chair - Rent", description: "Monthly rental. Wooden study table with chair. Delivery in Delhi.", price: 450, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-furniture-del1/800/600"], location: { address: "Rajouri Garden", city: "Delhi", lat: 28.6510, lng: 77.1210 }, amenities: ["Delivery", "Pickup"], availability: true, contactPhone: "+91 9876543211", rating: 4.4, reviewCount: 14, saarthiScore: 74, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor1Id, category: "other", title: "Phone & Laptop Repair", description: "Screen replacement, battery, software. Quick turnaround.", price: 200, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-repair-del1/800/600"], location: { address: "Connaught Place", city: "Delhi", lat: 28.6304, lng: 77.2177 }, amenities: ["Same-day", "Warranty"], availability: true, contactPhone: "+91 9876543211", rating: 4.6, reviewCount: 45, saarthiScore: 79, approved: true, createdAt: new Date(), updatedAt: new Date() },
    // Mumbai
    { vendorId: vendor2Id, category: "mess", title: "Monthly Mess - North Indian", description: "Full meals twice a day. Roti, rice, dal, sabzi.", price: 3500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-mess1/800/600"], location: { address: "Andheri East", city: "Mumbai", lat: 19.1136, lng: 72.8697 }, amenities: ["Breakfast", "Dinner"], availability: true, contactPhone: "+91 9876543212", rating: 4.2, reviewCount: 25, saarthiScore: 75, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "mess", title: "Tiffin Service - South Indian", description: "Daily tiffin with rice, sambar, curd. Flexible timing.", price: 2500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-mess2/800/600"], location: { address: "Bandra", city: "Mumbai", lat: 19.0596, lng: 72.8295 }, amenities: ["Lunch"], availability: true, contactPhone: "+91 9876543212", rating: 4.0, reviewCount: 15, saarthiScore: 68, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "laundry", title: "Wash & Iron - Per Kg", description: "Pickup and delivery. Same day for small orders.", price: 60, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-laundry1/800/600"], location: { address: "Powai", city: "Mumbai", lat: 19.1197, lng: 72.9081 }, amenities: ["Pickup", "Delivery"], availability: true, contactPhone: "+91 9876543212", rating: 4.4, reviewCount: 30, saarthiScore: 76, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "hostel", title: "PG near VIT Vile Parle", description: "Walking distance to station. Food included.", price: 13000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-hostel3/800/600"], location: { address: "Vile Parle West", city: "Mumbai", lat: 19.0992, lng: 72.8486 }, amenities: ["WiFi", "Mess", "Security"], availability: true, contactPhone: "+91 9876543212", rating: 4.5, reviewCount: 18, saarthiScore: 79, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "bike", title: "Scooter Rent - Andheri", description: "Activa monthly. Good for local commute.", price: 3800, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-bike-mum1/800/600"], location: { address: "Andheri West", city: "Mumbai", lat: 19.1334, lng: 72.8467 }, amenities: ["Helmet", "Docs"], availability: true, contactPhone: "+91 9876543212", rating: 4.3, reviewCount: 11, saarthiScore: 74, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "accommodation", title: "Shared Room - Goregaon", description: "1BHK shared. Near metro and offices.", price: 9000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-acc-mum1/800/600"], location: { address: "Goregaon East", city: "Mumbai", lat: 19.1596, lng: 72.8612 }, amenities: ["WiFi", "Kitchen"], availability: true, contactPhone: "+91 9876543212", rating: 4.2, reviewCount: 9, saarthiScore: 71, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "books", title: "Second-hand Books - Andheri", description: "Engineering, MBA, competitive exam books. Buy or sell.", price: 180, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-books-mum1/800/600"], location: { address: "Andheri West", city: "Mumbai", lat: 19.1334, lng: 72.8467 }, amenities: ["Delivery"], availability: true, contactPhone: "+91 9876543212", rating: 4.3, reviewCount: 28, saarthiScore: 75, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "furniture", title: "Furniture Rent - Mumbai", description: "Bed, table, chair. Monthly rental. Delivery in western suburbs.", price: 800, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-furniture-mum1/800/600"], location: { address: "Malad", city: "Mumbai", lat: 19.1872, lng: 72.8489 }, amenities: ["Delivery", "Assembly"], availability: true, contactPhone: "+91 9876543212", rating: 4.4, reviewCount: 19, saarthiScore: 76, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendor2Id, category: "other", title: "Appliance & Electronics Repair", description: "AC, fridge, laptop, phone repair. Home visit available.", price: 250, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-repair-mum1/800/600"], location: { address: "Borivali", city: "Mumbai", lat: 19.2307, lng: 72.8562 }, amenities: ["Home visit", "Warranty"], availability: true, contactPhone: "+91 9876543212", rating: 4.5, reviewCount: 52, saarthiScore: 78, approved: true, createdAt: new Date(), updatedAt: new Date() },
    // Bangalore
    { vendorId: vendorBlrId, category: "hostel", title: "PG in Koramangala", description: "Near tech parks. AC rooms, WiFi, cafeteria.", price: 14000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-hostel4/800/600"], location: { address: "Koramangala 5th Block", city: "Bangalore", lat: 12.9352, lng: 77.6245 }, amenities: ["WiFi", "AC", "Cafeteria", "Gym"], availability: true, contactPhone: "+91 9876543213", rating: 4.6, reviewCount: 22, saarthiScore: 82, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorBlrId, category: "mess", title: "Bengaluru Mess - Veg", description: "Home-style meals. Breakfast + lunch + dinner.", price: 4000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-mess3/800/600"], location: { address: "HSR Layout", city: "Bangalore", lat: 12.9121, lng: 77.6446 }, amenities: ["Breakfast", "Lunch", "Dinner"], availability: true, contactPhone: "+91 9876543213", rating: 4.3, reviewCount: 20, saarthiScore: 77, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorBlrId, category: "bike", title: "Bike Rental - Indiranagar", description: "Honda Activa, monthly. Good for daily commute.", price: 4000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-bike2/800/600"], location: { address: "Indiranagar", city: "Bangalore", lat: 12.9784, lng: 77.6408 }, amenities: ["Helmet", "Insurance"], availability: true, contactPhone: "+91 9876543213", rating: 4.5, reviewCount: 12, saarthiScore: 78, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorBlrId, category: "laundry", title: "Laundry - Whitefield", description: "Per kg. Pickup and delivery in Whitefield.", price: 65, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-laundry-blr1/800/600"], location: { address: "Whitefield", city: "Bangalore", lat: 12.9698, lng: 77.7499 }, amenities: ["Pickup", "Delivery"], availability: true, contactPhone: "+91 9876543213", rating: 4.4, reviewCount: 19, saarthiScore: 75, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorBlrId, category: "accommodation", title: "Room in Bellandur", description: "Single room in 3BHK. Near tech parks.", price: 12000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-acc-blr1/800/600"], location: { address: "Bellandur", city: "Bangalore", lat: 12.9260, lng: 77.6762 }, amenities: ["WiFi", "AC", "Parking"], availability: true, contactPhone: "+91 9876543213", rating: 4.5, reviewCount: 14, saarthiScore: 78, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorBlrId, category: "books", title: "Tech & Engineering Books - Koramangala", description: "CS, ECE, textbooks. Buy/sell/rent. Near colleges.", price: 220, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-books-blr1/800/600"], location: { address: "Koramangala", city: "Bangalore", lat: 12.9352, lng: 77.6245 }, amenities: ["Delivery", "Exchange"], availability: true, contactPhone: "+91 9876543213", rating: 4.6, reviewCount: 35, saarthiScore: 80, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorBlrId, category: "furniture", title: "Furniture on Rent - HSR", description: "Study table, bed, wardrobe. Monthly. Free delivery.", price: 1200, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-furniture-blr1/800/600"], location: { address: "HSR Layout", city: "Bangalore", lat: 12.9121, lng: 77.6446 }, amenities: ["Delivery", "Pickup", "Assembly"], availability: true, contactPhone: "+91 9876543213", rating: 4.5, reviewCount: 24, saarthiScore: 77, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorBlrId, category: "other", title: "Laptop & Phone Repair - Indiranagar", description: "Screen, battery, software. Student discount.", price: 300, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-repair-blr1/800/600"], location: { address: "Indiranagar", city: "Bangalore", lat: 12.9784, lng: 77.6408 }, amenities: ["Same-day", "Warranty"], availability: true, contactPhone: "+91 9876543213", rating: 4.7, reviewCount: 60, saarthiScore: 82, approved: true, createdAt: new Date(), updatedAt: new Date() },
    // Pune
    { vendorId: vendorPuneId, category: "hostel", title: "Boys PG near COEP", description: "Close to college. Mess included, WiFi.", price: 9500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-hostel5/800/600"], location: { address: "Shivajinagar", city: "Pune", lat: 18.5314, lng: 73.8446 }, amenities: ["WiFi", "Mess", "Laundry"], availability: true, contactPhone: "+91 9876543214", rating: 4.2, reviewCount: 14, saarthiScore: 73, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorPuneId, category: "furniture", title: "Study Table & Chair Rent", description: "Monthly rental. Delivery and pickup.", price: 500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-furniture1/800/600"], location: { address: "FC Road", city: "Pune", lat: 18.5074, lng: 73.8077 }, amenities: ["Delivery", "Pickup"], availability: true, contactPhone: "+91 9876543214", rating: 4.6, reviewCount: 8, saarthiScore: 76, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorPuneId, category: "books", title: "Engineering Books - Buy/Sell", description: "JEE, B.Tech books. Second hand available.", price: 200, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-books1/800/600"], location: { address: "Deccan", city: "Pune", lat: 18.5167, lng: 73.8412 }, amenities: ["Delivery"], availability: true, contactPhone: "+91 9876543214", rating: 4.4, reviewCount: 25, saarthiScore: 75, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorPuneId, category: "mess", title: "Pune Mess - Veg", description: "Maharashtrian style. Breakfast + lunch + dinner.", price: 3500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-mess-pune1/800/600"], location: { address: "Shivajinagar", city: "Pune", lat: 18.5314, lng: 73.8446 }, amenities: ["Breakfast", "Lunch", "Dinner"], availability: true, contactPhone: "+91 9876543214", rating: 4.3, reviewCount: 16, saarthiScore: 74, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorPuneId, category: "laundry", title: "Quick Wash - Pune", description: "Per kg. Same-day pickup and delivery.", price: 50, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-laundry-pune1/800/600"], location: { address: "Kothrud", city: "Pune", lat: 18.5074, lng: 73.8077 }, amenities: ["Pickup", "Delivery"], availability: true, contactPhone: "+91 9876543214", rating: 4.5, reviewCount: 20, saarthiScore: 76, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorPuneId, category: "bike", title: "Scooter Rent - Pune", description: "Monthly rental. Well maintained.", price: 3200, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-bike-pune1/800/600"], location: { address: "FC Road", city: "Pune", lat: 18.5074, lng: 73.8077 }, amenities: ["Helmet"], availability: true, contactPhone: "+91 9876543214", rating: 4.4, reviewCount: 10, saarthiScore: 73, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorPuneId, category: "accommodation", title: "Room near COEP", description: "Single room. Shared bathroom. WiFi.", price: 7000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-acc-pune1/800/600"], location: { address: "Shivajinagar", city: "Pune", lat: 18.5314, lng: 73.8446 }, amenities: ["WiFi"], availability: true, contactPhone: "+91 9876543214", rating: 4.2, reviewCount: 8, saarthiScore: 70, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorPuneId, category: "other", title: "Repair Services - FC Road", description: "Phone, laptop, bike puncture, electrical. Quick fix.", price: 150, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-repair-pune1/800/600"], location: { address: "FC Road", city: "Pune", lat: 18.5074, lng: 73.8077 }, amenities: ["Walk-in", "Same-day"], availability: true, contactPhone: "+91 9876543214", rating: 4.4, reviewCount: 38, saarthiScore: 75, approved: true, createdAt: new Date(), updatedAt: new Date() },
    // Hyderabad
    { vendorId: vendorHydId, category: "hostel", title: "PG near Gachibowli", description: "IT hub area. AC, WiFi, 24/7 security.", price: 15000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-hostel6/800/600"], location: { address: "Gachibowli", city: "Hyderabad", lat: 17.4401, lng: 78.3489 }, amenities: ["WiFi", "AC", "Security", "Gym"], availability: true, contactPhone: "+91 9876543215", rating: 4.5, reviewCount: 30, saarthiScore: 81, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorHydId, category: "mess", title: "Hyderabad Mess - Biryani Special", description: "Non-veg options. Lunch and dinner.", price: 4500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-mess4/800/600"], location: { address: "Madhapur", city: "Hyderabad", lat: 17.4485, lng: 78.3908 }, amenities: ["Lunch", "Dinner"], availability: true, contactPhone: "+91 9876543215", rating: 4.4, reviewCount: 28, saarthiScore: 79, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorHydId, category: "laundry", title: "Quick Laundry - HITEC City", description: "Express service. Per kg and bulk.", price: 70, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-laundry2/800/600"], location: { address: "HITEC City", city: "Hyderabad", lat: 17.4482, lng: 78.3908 }, amenities: ["Pickup", "Delivery", "Express"], availability: true, contactPhone: "+91 9876543215", rating: 4.3, reviewCount: 15, saarthiScore: 74, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorHydId, category: "bike", title: "Bike Rental - Gachibowli", description: "Activa monthly. For IT park commute.", price: 4200, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-bike-hyd1/800/600"], location: { address: "Gachibowli", city: "Hyderabad", lat: 17.4401, lng: 78.3489 }, amenities: ["Helmet", "Insurance"], availability: true, contactPhone: "+91 9876543215", rating: 4.4, reviewCount: 13, saarthiScore: 76, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorHydId, category: "accommodation", title: "Shared Flat - Madhapur", description: "Room in 2BHK. Near Durgam Cheruvu.", price: 11000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-acc-hyd1/800/600"], location: { address: "Madhapur", city: "Hyderabad", lat: 17.4485, lng: 78.3908 }, amenities: ["WiFi", "AC", "Parking"], availability: true, contactPhone: "+91 9876543215", rating: 4.5, reviewCount: 17, saarthiScore: 78, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorHydId, category: "books", title: "Books - Gachibowli", description: "Engineering, coding, GATE books. Buy or rent.", price: 200, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-books-hyd1/800/600"], location: { address: "Gachibowli", city: "Hyderabad", lat: 17.4401, lng: 78.3489 }, amenities: ["Delivery"], availability: true, contactPhone: "+91 9876543215", rating: 4.4, reviewCount: 22, saarthiScore: 76, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorHydId, category: "furniture", title: "Furniture Rent - HITEC City", description: "Bed, study table, chair. Monthly. Delivery in IT corridor.", price: 900, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-furniture-hyd1/800/600"], location: { address: "HITEC City", city: "Hyderabad", lat: 17.4482, lng: 78.3908 }, amenities: ["Delivery", "Assembly"], availability: true, contactPhone: "+91 9876543215", rating: 4.5, reviewCount: 18, saarthiScore: 77, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorHydId, category: "other", title: "Electronics Repair - Madhapur", description: "Laptop, phone, printer repair. On-site available.", price: 280, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-repair-hyd1/800/600"], location: { address: "Madhapur", city: "Hyderabad", lat: 17.4485, lng: 78.3908 }, amenities: ["Same-day", "Warranty"], availability: true, contactPhone: "+91 9876543215", rating: 4.6, reviewCount: 42, saarthiScore: 79, approved: true, createdAt: new Date(), updatedAt: new Date() },
    // Chennai
    { vendorId: vendorChennaiId, category: "hostel", title: "PG in T Nagar", description: "Central location. Girls and boys blocks.", price: 10000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-hostel7/800/600"], location: { address: "T Nagar", city: "Chennai", lat: 13.0418, lng: 80.2341 }, amenities: ["WiFi", "Mess", "AC"], availability: true, contactPhone: "+91 9876543216", rating: 4.1, reviewCount: 16, saarthiScore: 71, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorChennaiId, category: "mess", title: "Tamil Nadu Style Mess", description: "Traditional meals. Rice, sambar, curd, veggies.", price: 3000, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-mess5/800/600"], location: { address: "Adyar", city: "Chennai", lat: 13.0067, lng: 80.2206 }, amenities: ["Lunch", "Dinner"], availability: true, contactPhone: "+91 9876543216", rating: 4.5, reviewCount: 35, saarthiScore: 80, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorChennaiId, category: "bike", title: "Scooter Rent - Near IIT Madras", description: "Monthly rental. Well maintained.", price: 3800, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-bike3/800/600"], location: { address: "Guindy", city: "Chennai", lat: 13.0067, lng: 80.2206 }, amenities: ["Helmet"], availability: true, contactPhone: "+91 9876543216", rating: 4.2, reviewCount: 9, saarthiScore: 72, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorChennaiId, category: "laundry", title: "Laundry - T Nagar", description: "Wash and iron. Per kg. Pickup available.", price: 58, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-laundry-chen1/800/600"], location: { address: "T Nagar", city: "Chennai", lat: 13.0418, lng: 80.2341 }, amenities: ["Pickup", "Delivery"], availability: true, contactPhone: "+91 9876543216", rating: 4.4, reviewCount: 21, saarthiScore: 75, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorChennaiId, category: "accommodation", title: "Room in Velachery", description: "Single room. Near metro. WiFi.", price: 8500, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-acc-chen1/800/600"], location: { address: "Velachery", city: "Chennai", lat: 12.9792, lng: 80.2134 }, amenities: ["WiFi", "Parking"], availability: true, contactPhone: "+91 9876543216", rating: 4.3, reviewCount: 12, saarthiScore: 73, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorChennaiId, category: "books", title: "Academic Books - T Nagar", description: "Engineering, medical, UPSC. Second-hand. Buy/sell.", price: 175, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-books-chen1/800/600"], location: { address: "T Nagar", city: "Chennai", lat: 13.0418, lng: 80.2341 }, amenities: ["Delivery", "Exchange"], availability: true, contactPhone: "+91 9876543216", rating: 4.5, reviewCount: 40, saarthiScore: 78, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorChennaiId, category: "furniture", title: "Furniture Rental - Adyar", description: "Study table, cot, cupboard. Monthly rent. Delivery.", price: 600, priceUnit: "month", images: ["https://picsum.photos/seed/saarthi-furniture-chen1/800/600"], location: { address: "Adyar", city: "Chennai", lat: 13.0067, lng: 80.2206 }, amenities: ["Delivery", "Pickup"], availability: true, contactPhone: "+91 9876543216", rating: 4.4, reviewCount: 16, saarthiScore: 74, approved: true, createdAt: new Date(), updatedAt: new Date() },
    { vendorId: vendorChennaiId, category: "other", title: "Repair & Services - Guindy", description: "Laptop, phone, bike service. Near IIT and colleges.", price: 220, priceUnit: "item", images: ["https://picsum.photos/seed/saarthi-repair-chen1/800/600"], location: { address: "Guindy", city: "Chennai", lat: 13.0067, lng: 80.2206 }, amenities: ["Same-day", "Student discount"], availability: true, contactPhone: "+91 9876543216", rating: 4.5, reviewCount: 48, saarthiScore: 77, approved: true, createdAt: new Date(), updatedAt: new Date() },
  ];

  const insertedListings = await listingsColl.insertMany(listingsData);
  const listingIds = insertedListings.insertedIds;
  const listingIdArr = Object.values(listingIds);
  console.log("Inserted listings:", listingIdArr.length);

  // ----- Reviews -----
  const reviewsColl = db.collection("reviews");
  const reviewsData = [
    { listingId: listingIdArr[0], userId: student1Id, rating: 5, comment: "Very clean and peaceful. Recommended!", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[0], userId: student2Id, rating: 4, comment: "Good stay. Food could be better.", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[4], userId: student1Id, rating: 4, comment: "Tasty food, on time delivery.", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[2], userId: student2Id, rating: 5, comment: "Scooty was in great condition.", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[8], userId: student2Id, rating: 5, comment: "Best PG in Koramangala. Worth it!", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[9], userId: student2Id, rating: 4, comment: "Good mess. Portions are generous.", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[11], userId: student3Id, rating: 4, comment: "Nice PG, close to metro.", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[14], userId: student4Id, rating: 5, comment: "Biryani days are the best!", createdAt: new Date(), updatedAt: new Date() },
    { listingId: listingIdArr[18], userId: student4Id, rating: 4, comment: "Authentic Tamil meals.", createdAt: new Date(), updatedAt: new Date() },
  ];
  await reviewsColl.insertMany(reviewsData);
  console.log("Inserted reviews:", reviewsData.length);

  // ----- Interactions -----
  const interactionsColl = db.collection("interactions");
  const interactionsData = [
    { userId: student1Id, listingId: listingIdArr[0], type: "view", timestamp: new Date() },
    { userId: student1Id, listingId: listingIdArr[0], type: "save", timestamp: new Date() },
    { userId: student1Id, listingId: listingIdArr[4], type: "view", timestamp: new Date() },
    { userId: student2Id, listingId: listingIdArr[2], type: "view", timestamp: new Date() },
    { userId: student2Id, listingId: listingIdArr[2], type: "contact", timestamp: new Date() },
    { userId: student2Id, listingId: listingIdArr[8], type: "view", timestamp: new Date() },
    { userId: student2Id, listingId: listingIdArr[8], type: "save", timestamp: new Date() },
    { userId: student3Id, listingId: listingIdArr[7], type: "view", timestamp: new Date() },
    { userId: student4Id, listingId: listingIdArr[12], type: "view", timestamp: new Date() },
    { userId: student4Id, listingId: listingIdArr[18], type: "view", timestamp: new Date() },
  ];
  await interactionsColl.insertMany(interactionsData);
  console.log("Inserted interactions:", interactionsData.length);

  // Update savedListings for students
  await usersColl.updateOne({ _id: student1Id }, { $set: { savedListings: [listingIdArr[0]], updatedAt: new Date() } });
  await usersColl.updateOne({ _id: student2Id }, { $set: { savedListings: [listingIdArr[8]], updatedAt: new Date() } });

  console.log("\n--- Each city has at least: hostel, mess, laundry, bike, accommodation, books, furniture, other (repair) ---");
  console.log("--- Cities: Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai ---");

  console.log("\n--- Demo logins (password for all: " + DUMMY_PASSWORD + ") ---");
  console.log("Admin:  admin@saarthi.com");
  console.log("Vendor: vendor1@saarthi.com, vendor2@saarthi.com, vendor.blr@saarthi.com, vendor.pune@saarthi.com, vendor.hyd@saarthi.com, vendor.chennai@saarthi.com");
  console.log("Student: rahul@example.com, priya@example.com, arjun@example.com, sneha@example.com");

  await mongoose.disconnect();
  console.log("\nDisconnected. Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
