require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose   = require("mongoose");
const bcrypt     = require("bcryptjs");
const Orphanage  = require("../models/Orphanage");
const Child      = require("../models/Child");
const User       = require("../models/User");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing seed data
  await Orphanage.deleteMany({});
  await Child.deleteMany({});
  await User.deleteMany({ role: "owner" });
  console.log("🗑️  Cleared existing orphanages, children and owners");

  // Create 3 dummy owners
  const hashedPw = await bcrypt.hash("owner123", 10);

  const owners = await User.insertMany([
    { name: "Rajesh Kumar",  email: "owner1@orphanconnect.com", password: hashedPw, phone: "9876543210", role: "owner", status: "active" },
    { name: "Sunita Patil",  email: "owner2@orphanconnect.com", password: hashedPw, phone: "9876543211", role: "owner", status: "active" },
    { name: "Anil Sharma",   email: "owner3@orphanconnect.com", password: hashedPw, phone: "9876543212", role: "owner", status: "active" }
  ]);

  // Create 3 dummy orphanages
  const orphanages = await Orphanage.insertMany([
    {
      name:        "Shanti Nivas Orphanage",
      about:       "Shanti Nivas has been a safe haven for children in Hubli since 1998. We provide holistic care including education, healthcare, and emotional support to over 80 children.",
      address:     "Near Old Bus Stand, Vidyanagar, Hubli, Karnataka 580021",
      established: "1998",
      capacity:    80,
      occupied:    65,
      vacant:      15,
      facilities:  ["🍽️ Meals", "📚 Library", "🏥 Medical", "🛏️ Dormitory", "⚽ Sports", "🧹 Hygiene"],
      mapLink:     "",
      ownerName:   "Rajesh Kumar",
      ownerEmail:  "owner1@orphanconnect.com",
      ownerPhone:  "9876543210",
      ownerId:     owners[0]._id,
      status:      "approved"
    },
    {
      name:        "Anjali Balakashrama",
      about:       "Anjali Balakashrama is dedicated to the development of underprivileged children in the Dharwad district. We focus on education, vocational training, and life skills.",
      address:     "Keshwapur Main Road, Dharwad, Karnataka 580008",
      established: "2005",
      capacity:    60,
      occupied:    52,
      vacant:      8,
      facilities:  ["🍽️ Meals", "📚 Library", "🏥 Medical", "🛏️ Dormitory", "🎨 Arts & Crafts", "💻 Computer Lab"],
      mapLink:     "",
      ownerName:   "Sunita Patil",
      ownerEmail:  "owner2@orphanconnect.com",
      ownerPhone:  "9876543211",
      ownerId:     owners[1]._id,
      status:      "approved"
    },
    {
      name:        "SOS Children's Village Hubli",
      about:       "SOS Children's Village provides a family-like environment for orphaned and abandoned children. Each child grows up in a loving home with a dedicated caregiver.",
      address:     "Gokul Road, Hubballi, Karnataka 580030",
      established: "2010",
      capacity:    100,
      occupied:    78,
      vacant:      22,
      facilities:  ["🍽️ Meals", "📚 Library", "🏥 Medical", "🛏️ Dormitory", "⚽ Sports", "🧹 Hygiene", "💻 Computer Lab", "🎨 Arts & Crafts"],
      mapLink:     "",
      ownerName:   "Anil Sharma",
      ownerEmail:  "owner3@orphanconnect.com",
      ownerPhone:  "9876543212",
      ownerId:     owners[2]._id,
      status:      "approved"
    }
  ]);

  // Update owners with orphanageId
  await User.findByIdAndUpdate(owners[0]._id, { orphanageId: orphanages[0]._id });
  await User.findByIdAndUpdate(owners[1]._id, { orphanageId: orphanages[1]._id });
  await User.findByIdAndUpdate(owners[2]._id, { orphanageId: orphanages[2]._id });

  console.log("✅ Created 3 orphanages");

  // Children for Orphanage 1
  const children1 = [
    { orphanageId: orphanages[0]._id, name: "Arjun",  age: 7,  gender: "boy",  about: "Loves drawing and cricket. Very energetic and friendly.",            tags: ["Playful", "Creative"],     available: true },
    { orphanageId: orphanages[0]._id, name: "Priya",  age: 5,  gender: "girl", about: "Quiet and sweet. Loves books and singing songs.",                     tags: ["Gentle", "Curious"],       available: true },
    { orphanageId: orphanages[0]._id, name: "Ravi",   age: 10, gender: "boy",  about: "Good at studies and helps younger kids in the orphanage.",            tags: ["Responsible", "Smart"],    available: true },
    { orphanageId: orphanages[0]._id, name: "Meera",  age: 3,  gender: "girl", about: "Toddler who loves playing with toys and clapping.",                   tags: ["Bubbly", "Adorable"],      available: true },
    { orphanageId: orphanages[0]._id, name: "Suresh", age: 12, gender: "boy",  about: "Loves football and is great at making friends.",                      tags: ["Active", "Social"],        available: true }
  ];

  // Children for Orphanage 2
  const children2 = [
    { orphanageId: orphanages[1]._id, name: "Karan",  age: 8,  gender: "boy",  about: "Loves football and making new friends easily.",                       tags: ["Active", "Social"],        available: true },
    { orphanageId: orphanages[1]._id, name: "Ananya", age: 6,  gender: "girl", about: "Loves dancing and drawing colorful pictures.",                        tags: ["Artistic", "Cheerful"],    available: true },
    { orphanageId: orphanages[1]._id, name: "Dev",    age: 12, gender: "boy",  about: "Responsible and helps staff with daily chores.",                      tags: ["Mature", "Helpful"],       available: true },
    { orphanageId: orphanages[1]._id, name: "Kavya",  age: 4,  gender: "girl", about: "A curious toddler who loves animals and the outdoors.",               tags: ["Curious", "Energetic"],    available: true }
  ];

  // Children for Orphanage 3
  const children3 = [
    { orphanageId: orphanages[2]._id, name: "Sita",   age: 4,  gender: "girl", about: "Loves teddy bears and sleeping in the sun.",                         tags: ["Calm", "Sweet"],           available: true },
    { orphanageId: orphanages[2]._id, name: "Rahul",  age: 9,  gender: "boy",  about: "Very smart, loves maths and puzzles.",                               tags: ["Intelligent", "Focused"],  available: true },
    { orphanageId: orphanages[2]._id, name: "Nisha",  age: 14, gender: "girl", about: "Teenage girl who loves reading novels and cooking.",                  tags: ["Independent", "Mature"],   available: true },
    { orphanageId: orphanages[2]._id, name: "Vikram", age: 11, gender: "boy",  about: "Loves science experiments and building things with his hands.",       tags: ["Creative", "Smart"],       available: true },
    { orphanageId: orphanages[2]._id, name: "Asha",   age: 7,  gender: "girl", about: "Cheerful and loves singing and dancing at every occasion.",           tags: ["Cheerful", "Artistic"],    available: true }
  ];

  await Child.insertMany([...children1, ...children2, ...children3]);
  console.log("✅ Created 14 children across 3 orphanages");

  console.log("\n🎉 Seed complete! Here are your test credentials:");
  console.log("──────────────────────────────────────────────");
  console.log("Admin:    admin@orphanconnect.com  / admin123");
  console.log("Owner 1:  owner1@orphanconnect.com / owner123");
  console.log("Owner 2:  owner2@orphanconnect.com / owner123");
  console.log("Owner 3:  owner3@orphanconnect.com / owner123");
  console.log("──────────────────────────────────────────────");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
