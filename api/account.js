const crypto = require("crypto");
const { promisify } = require("util");
const { MongoClient } = require("mongodb");
const scrypt = promisify(crypto.scrypt);
const COOKIE = "dhanu_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const MAX_BODY_BYTES = 128 * 1024;
let clientPromise;
const attempts = new Map();

function json(res, status, payload) { return res.status(status).json(payload); }
function b64(value) { return Buffer.from(value).toString("base64url"); }
function safeEqual(a, b) {
  const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || ""));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function sign(value, secret) {
  const body = b64(JSON.stringify(value));
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return body + "." + sig;
}
function verify(token, secret) {
  if (typeof token !== "string" || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const expected = crypto.createHmac("sha256", secret).update(parts[0]).digest("base64url");
  if (!safeEqual(parts[1], expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return data.exp > Math.floor(Date.now() / 1000) ? data : null;
  } catch { return null; }
}
function cookieValue(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return "";
}
function setCookie(res, value, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", COOKIE + "=" + encodeURIComponent(value) + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + maxAge + secure);
}
function checkOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const u = new URL(origin);
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
    return u.host === host;
  } catch { return false; }
}
function rateLimited(req, key) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const id = ip + ":" + key, now = Date.now(), old = attempts.get(id) || [];
  const recent = old.filter(t => now - t < 15 * 60 * 1000);
  if (recent.length >= 12) { attempts.set(id, recent); return true; }
  recent.push(now); attempts.set(id, recent);
  if (attempts.size > 3000) for (const [k, v] of attempts) if (!v.length || now - v[v.length - 1] > 15 * 60 * 1000) attempts.delete(k);
  return false;
}
async function dbCollection() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5 });
    clientPromise = client.connect().then(c => c).catch(e => { clientPromise = null; throw e; });
  }
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "dhanu_movie_adda");
  const users = db.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  return users;
}
function cleanEmail(value) {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}
async function passwordHash(password, salt) {
  return (await scrypt(password, salt, 64)).toString("hex");
}
function validateSnapshot(input) {
  if (!input || typeof input !== "object" || !Array.isArray(input.profiles) || !input.libraries || typeof input.libraries !== "object") return null;
  if (input.profiles.length < 1 || input.profiles.length > 6) return null;
  const profiles = [];
  for (const p of input.profiles) {
    if (!p || typeof p.id !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(p.id) || typeof p.name !== "string") return null;
    const name = p.name.trim().slice(0, 24);
    if (!name) return null;
    profiles.push({ id: p.id, name, avatar: (typeof p.avatar === "string" ? p.avatar : name[0]).slice(0, 2) });
  }
  const libraries = {};
  for (const p of profiles) {
    const lib = input.libraries[p.id] || {};
    const watchlist = Array.isArray(lib.watchlist) ? lib.watchlist.filter(x => typeof x === "string" && x.length <= 220).slice(0, 1000) : [];
    const favourites = Array.isArray(lib.favourites) ? [...new Set(lib.favourites.filter(x => typeof x === "string" && x.length <= 220))].slice(0, 1000) : [];
    const sourceActivity = lib.activity && typeof lib.activity === "object" && !Array.isArray(lib.activity) ? lib.activity : {};
    const activity = {};
    for (const [title, a] of Object.entries(sourceActivity).slice(0, 1000)) {
      if (title.length > 220 || !a || typeof a !== "object") continue;
      const progress = Math.max(0, Math.min(100, Number(a.progress) || 0));
      const parsed = Date.parse(a.updatedAt || "");
      activity[title] = { progress, watched: Boolean(a.watched) || progress >= 100, updatedAt: Number.isFinite(parsed) ? new Date(parsed).toISOString() : new Date(0).toISOString() };
    }
    libraries[p.id] = { watchlist: [...new Set(watchlist)], favourites, activity };
  }
  const activeId = profiles.some(p => p.id === input.activeId) ? input.activeId : profiles[0].id;
  return { profiles, activeId, libraries };
}
function mergeSnapshots(left, right) {
  if (!left) return right;
  const profiles = [...left.profiles];
  for (const p of right.profiles) {
    const i = profiles.findIndex(x => x.id === p.id);
    if (i >= 0) profiles[i] = p;
    else if (profiles.length < 6) profiles.push(p);
  }
  const libraries = {};
  for (const p of profiles) {
    const a = left.libraries[p.id] || { watchlist: [], activity: {} };
    const b = right.libraries[p.id] || { watchlist: [], activity: {} };
    const activity = { ...a.activity };
    for (const [title, item] of Object.entries(b.activity)) {
      const previous = activity[title];
      if (!previous || Date.parse(item.updatedAt) >= Date.parse(previous.updatedAt)) activity[title] = item;
    }
    libraries[p.id] = { watchlist: [...new Set([...(a.watchlist || []), ...(b.watchlist || [])])].slice(0, 1000), favourites: [...new Set([...(a.favourites || []), ...(b.favourites || [])])].slice(0, 1000), activity };
  }
  return { profiles, activeId: right.profiles.some(p => p.id === right.activeId) ? right.activeId : left.activeId, libraries };
}
async function currentUser(req, users, secret) {
  const session = verify(cookieValue(req, COOKIE), secret);
  if (!session?.sub) return null;
  return users.findOne({ _id: new (require("mongodb").ObjectId)(session.sub) }, { projection: { email: 1, data: 1 } });
}
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Cookie");
  const action = String(req.query?.action || "");
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT") return json(res, 405, { error: "Method not allowed." });
  if (req.method !== "GET" && !checkOrigin(req)) return json(res, 403, { error: "Request origin rejected." });
  if (req.method !== "GET" && !String(req.headers["content-type"] || "").toLowerCase().startsWith("application/json")) return json(res, 415, { error: "Send account changes as JSON." });
  if (action === "logout" && req.method === "POST") { setCookie(res, "", 0); return json(res, 200, { ok: true }); }
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return json(res, 503, { error: "SESSION_SECRET must be configured with at least 32 characters." });
  if (req.method !== "GET" && ((req.headers["content-length"] && Number(req.headers["content-length"]) > MAX_BODY_BYTES) || Buffer.byteLength(JSON.stringify(req.body || {})) > MAX_BODY_BYTES)) return json(res, 413, { error: "Request is too large." });
  try {
    const users = await dbCollection();
    if (action === "register" || action === "login") {
      if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
      if (rateLimited(req, action)) return json(res, 429, { error: "Too many attempts. Try again later." });
      const body = req.body || {};
      const email = cleanEmail(body.email), password = body.password;
      if (!email || typeof password !== "string" || password.length < 8 || password.length > 128) return json(res, 400, { error: "Enter a valid email and a password between 8 and 128 characters." });
      let user;
      if (action === "register") {
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = await passwordHash(password, salt);
        try {
          const result = await users.insertOne({ email, salt, passwordHash: hash, createdAt: new Date(), data: null });
          user = { _id: result.insertedId, email };
        } catch (e) { if (e.code === 11000) return json(res, 409, { error: "An account with this email already exists." }); throw e; }
      } else {
        user = await users.findOne({ email });
        const candidate = user ? await passwordHash(password, user.salt) : await passwordHash(password, "00000000000000000000000000000000");
        if (!user || !safeEqual(candidate, user.passwordHash)) return json(res, 401, { error: "Email or password is incorrect." });
      }
      const token = sign({ sub: String(user._id), exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }, secret);
      setCookie(res, token, SESSION_SECONDS);
      return json(res, 200, { ok: true, user: { email: user.email } });
    }
    const user = await currentUser(req, users, secret);
    if (!user) return json(res, 401, { error: "Sign in to use cloud sync." });
    if (action === "me" && req.method === "GET") return json(res, 200, { user: { email: user.email } });
    if (action === "sync" && req.method === "GET") return json(res, 200, { data: user.data || null });
    if (action === "sync" && req.method === "PUT") {
      const incoming = validateSnapshot(req.body);
      if (!incoming) return json(res, 400, { error: "The library backup format is invalid or exceeds its limits." });
      const merged = mergeSnapshots(validateSnapshot(user.data), incoming);
      await users.updateOne({ _id: user._id }, { $set: { data: merged, updatedAt: new Date() } });
      return json(res, 200, { data: merged });
    }
    return json(res, 400, { error: "Unsupported account action." });
  } catch (error) {
    const message = error.message === "MONGODB_URI is not configured." ? error.message : "Account service is temporarily unavailable.";
    return json(res, 503, { error: message });
  }
};
