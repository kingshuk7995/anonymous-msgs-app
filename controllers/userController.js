import { createHmac, randomBytes } from 'crypto';
import User from '../models/User.js';

const Hmac_algo = "sha256";

function hashPassword(password, salt) {
  return createHmac(Hmac_algo, salt).update(password).digest("hex");
}

export async function registerUser(req, res) {
  const { username, name, password } = req.body;
  const salt = randomBytes(16).toString('hex');
  const hashed_pass = hashPassword(password, salt);

  try {
    const user = await User.create({
      username,
      name,
      password_hashed: hashed_pass,
      salt
    });
    res.render("dashboard", { user });
  } catch (error) {
    console.error("Signup error:", error);
    res.redirect("/view/failed/signup");
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.redirect("/view/failed/login");

    const hash = hashPassword(password, user.salt);
    if (hash !== user.password_hashed) {
      return res.redirect("/view/failed/login");
    }

    res.render("dashboard", { user });
  } catch (error) {
    console.error("Login error:", error);
    res.redirect("/view/failed/login");
  }
}
