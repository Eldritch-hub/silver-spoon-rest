// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import reservationRoutes from "./routes/reservationRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: ["https://portfolio-9m68a3gfw-unorthodoxs-projects.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/menu", menuRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running and MongoDB is connected!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    // Auto-seed menu if empty
    const Menu = (await import("./models/menu.js")).default;
    const count = await Menu.countDocuments();
    if (count === 0) {
      console.log("🔄 Seeding menu items...");
      const items = [
        {
          name: "Suya Platter",
          price: 4500,
          description: "Skewered spicy beef suya with tomatoes, onions, and suya pepper",
          image: "https://th.bing.com/th/id/OIP.AxdzY99HtE1Qt6mHmVuYwQHaHa?w=152&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
          category: "grill",
          spicy: true,
          available: true
        },
        {
          name: "Grilled Catfish (Point & Kill)",
          price: 6800,
          description: "Freshly grilled catfish spiced and served with pepper sauce & yam fries",
          image: "https://images.unsplash.com/photo-1555993539-1732fc15a2d3?auto=format&fit=crop&w=800&q=80",
          category: "fish",
          spicy: true,
          available: true
        },
        {
          name: "Efo Riro Deluxe",
          price: 3200,
          description: "Spinach stew cooked with palm oil, locust beans, and tender goat meat",
          image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
          category: "stew",
          spicy: false,
          available: true
        },
        {
          name: "Pounded Yam & Egusi",
          price: 4000,
          description: "Hand-pounded yam served with rich melon seed soup and assorted beef",
          image: "https://images.unsplash.com/photo-1583174818912-78071cbc40ea?auto=format&fit=crop&w=800&q=80",
          category: "swallow",
          spicy: false,
          available: true
        },
        {
          name: "Jollof Rice Special",
          price: 3200,
          description: "Smoky party-style jollof rice served with plantain and grilled chicken",
          image: "https://images.unsplash.com/photo-1572441710635-e3eab16d3b31?auto=format&fit=crop&w=800&q=80",
          category: "rice",
          spicy: false,
          available: true
        },
        {
          name: "Fried Rice & Turkey",
          price: 3500,
          description: "Nigerian fried rice with veggies and crispy turkey wing",
          image: "https://images.unsplash.com/photo-1512058564366-c99b64304dca?auto=format&fit=crop&w=800&q=80",
          category: "rice",
          spicy: false,
          available: true
        },
        {
          name: "Amala & Gbegiri + Ewedu",
          price: 2900,
          description: "Classic Ibadan combo served with beef and assorted meats",
          image: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2a025?auto=format&fit=crop&w=800&q=80",
          category: "swallow",
          spicy: false,
          available: true
        },
        {
          name: "Afang Soup & Fufu",
          price: 3500,
          description: "Rich vegetable soup cooked with beef, kpomo, and stockfish",
          image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
          category: "stew",
          spicy: false,
          available: true
        },
        {
          name: "Goat Meat Pepper Soup",
          price: 3500,
          description: "Spicy herbal pepper soup featuring tender goat meat chunks",
          image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679b8?auto=format&fit=crop&w=800&q=80",
          category: "soup",
          spicy: true,
          available: true
        },
        {
          name: "Asun pepper chops",
          price: 4200,
          description: "Spicy roasted goat meat sautéed in pepper sauce",
          image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f0e?auto=format&fit=crop&w=800&q=80",
          category: "grill",
          spicy: true,
          available: true
        },
        {
          name: "Beans & Dodo with Titus Fish",
          price: 3500,
          description: "Honey beans stew with fried plantain and grilled fish",
          image: "https://images.unsplash.com/photo-1574339864658-0156cb4bb1cf?auto=format&fit=crop&w=800&q=80",
          category: "main",
          spicy: false,
          available: true
        },
        {
          name: "Ofada Rice & Ayamase",
          price: 3000,
          description: "Local ofada rice served with spicy green pepper sauce & assorted beef",
          image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
          category: "rice",
          spicy: true,
          available: true
        },
        {
          name: "Boli & Fish",
          price: 2200,
          description: "Roasted plantain served with peppered tilapia fish",
          image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
          category: "snack",
          spicy: true,
          available: true
        },
        {
          name: "Nkwobi",
          price: 3500,
          description: "Soft cow foot cooked in rich palm oil sauce with utazi leaves",
          image: "https://images.unsplash.com/photo-1556911220-e15b29be8c9a?auto=format&fit=crop&w=800&q=80",
          category: "grill",
          spicy: false,
          available: true
        }
      ];

      await Menu.insertMany(items);
      console.log("✅ Menu seeded successfully!");
    } else {
      console.log("ℹ️ Menu already seeded (documents count:", count, ")");
    }
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
