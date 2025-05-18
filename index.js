import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import User from './models/User.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB(DB_URL);

// Views
app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));

// Auth Routes
app.use("/user", userRoutes);

// Message page
app.get("/send/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.send("Invalid link");
  res.render("send_message", { user });
});

app.post("/api/messages/:id", async (req, res) => {
  const { message } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  user.messages.push({ text: message });
  await user.save();
  res.json({ status: "Message sent successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
