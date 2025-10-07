import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const OBJECT_TYPE = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE || "2-192837072"; // from user's URL
let PROPERTY_LIST = (process.env.HUBSPOT_CUSTOM_PROPERTIES || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static("./public/css"));

const hs = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  },
  timeout: 15000
});

function requireToken(req, res, next) {
  if (!HUBSPOT_ACCESS_TOKEN) {
    return res.status(500).send("Missing HUBSPOT_ACCESS_TOKEN in .env. Copy .env.example to .env and set your token.");
  }
  next();
}

// Fetch schema properties (string props) if PROPERTY_LIST not provided
async function getDefaultProperties() {
  try {
    const { data } = await hs.get(`/crm/v3/schemas/${encodeURIComponent(OBJECT_TYPE)}`);
    const props = (data?.properties || [])
      .filter(p => p.type === "string")
      .map(p => p.name);
    const set = new Set(props);
    const ordered = [];
    if (set.has("name")) { ordered.push("name"); set.delete("name"); }
    for (const p of props) if (p !== "name") ordered.push(p);
    return ordered.slice(0, 5);
  } catch (e) {
    console.error("Failed to load schema, using fallback ['name']:", e.response?.data || e.message);
    return ["name"];
  }
}

async function ensureProperties() {
  if (!PROPERTY_LIST.length) PROPERTY_LIST = await getDefaultProperties();
  return PROPERTY_LIST;
}

/**
 * Route 1: Homepage — list records as a table
 */
app.get("/", requireToken, async (req, res) => {
  try {
    const columns = await ensureProperties();
    const { data } = await hs.get(`/crm/v3/objects/${encodeURIComponent(OBJECT_TYPE)}`, {
      params: { properties: columns.join(",") }
    });
    const records = (data.results || []).map(row => {
      const out = {};
      for (const p of columns) out[p] = row.properties?.[p] ?? "";
      return out;
    });
    res.render("homepage", { title: "Custom Object List | IWH I Practicum (EU1)", records, columns });
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Unknown error";
    res.status(500).render("homepage", {
      title: "Custom Object List | IWH I Practicum (EU1)",
      error: msg,
      records: [],
      columns: PROPERTY_LIST.length ? PROPERTY_LIST : ["name"]
    });
  }
});

/**
 * Route 2: Render the form to create a record
 */
app.get("/update-cobj", requireToken, async (req, res) => {
  const fields = await ensureProperties();
  res.render("updates", {
    title: "Update Custom Object Form | IWH I Practicum (EU1)",
    fields
  });
});

/**
 * Route 3: Handle form submission and create a record
 */
app.post("/update-cobj", requireToken, async (req, res) => {
  try {
    const fields = await ensureProperties();
    const props = {};
    for (const p of fields) {
      if (req.body[p] != null && req.body[p] !== "") props[p] = req.body[p];
    }
    await hs.post(`/crm/v3/objects/${encodeURIComponent(OBJECT_TYPE)}`, { properties: props });
    res.redirect("/");
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Unknown error";
    const fields = await ensureProperties();
    res.status(500).render("updates", { title: "Update Custom Object Form | IWH I Practicum (EU1)", error: msg, fields });
  }
});

app.listen(port, () => { console.log(`Server running on http://localhost:${port}`); });
