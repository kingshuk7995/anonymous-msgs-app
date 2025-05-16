import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { connectDB, User } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB(DB_URL);

// 1. Landing page
app.get("/", (req, res) => {
    res.render("home");
});

// 2. Show login/signup
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));

// 3. Handle signup
app.post("/signup", async (req, res) => {
    const { name, password } = req.body;
    const existing = await User.findOne({ name });
    if (existing) return res.send("User already exists. Try login.");

    const user = await User.create({ name, password });
    res.redirect(`/user/${user._id}`);
});

// 4. Handle login
app.post("/login", async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (!user || user.password !== password)
        return res.send("Invalid login. Try again.");

    res.redirect(`/user/${user._id}`);
});

// 5. User dashboard
app.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.send("User not found");

    res.render("dashboard", { user });
});

// 6. Anonymous message send page
app.get("/send/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.send("Invalid link");
    res.render("send_message", { user });
});

// 7. Message POST
app.post("/api/messages/:id", async (req, res) => {
    const { message } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.messages.push({ text: message });
    await user.save();
    res.json({ status: "Message sent successfully" });
});

app.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`);
});
