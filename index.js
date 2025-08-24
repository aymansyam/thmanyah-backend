import express from "express";
import morgan from "morgan";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

const PORT = process.env.PORT || 8080;
const AUTH_URL = process.env.AUTH_URL || "http://auth:8081";
const STORE_URL = process.env.STORE_URL || "http://store:8082";

// Health endpoints
app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/readyz", (_req, res) => res.json({ auth: AUTH_URL, store: STORE_URL }));

// Simple auth middleware -> calls /validate
async function requireAuth(req, res, next) {
  try {
    const token = req.headers["authorization"] || "";
    await axios.get(`${AUTH_URL}/validate`, { headers: { Authorization: token } });
    next();
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
}

// Protected “whoami”
app.get("/api", requireAuth, async (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Proxy to store list
app.get("/api/files", requireAuth, async (req, res) => {
  const r = await axios.get(`${STORE_URL}/files`);
  res.json(r.data);
});

app.listen(PORT, () => console.log(`backend listening on :${PORT}`));
