require("dotenv").config();

const path = require("path");
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Required env vars
 */
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE;
const CUSTOM_PROPERTIES = (process.env.HUBSPOT_CUSTOM_PROPERTIES || "name")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

// Fail fast (helps debugging)
if (!HUBSPOT_ACCESS_TOKEN) {
  console.error("Missing env: HUBSPOT_ACCESS_TOKEN");
  process.exit(1);
}
if (!CUSTOM_OBJECT_TYPE) {
  console.error("Missing env: HUBSPOT_CUSTOM_OBJECT_TYPE");
  process.exit(1);
}
if (!CUSTOM_PROPERTIES.includes("name")) {
  console.error('HUBSPOT_CUSTOM_PROPERTIES must include "name"');
  process.exit(1);
}

/**
 * Middleware
 */
app.use(express.urlencoded({ extended: true })); // for HTML form POST
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

/**
 * View engine
 */
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/**
 * HubSpot API client
 */
const hubspot = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

function normalizeHubSpotError(err) {
  return {
    message: err?.message || "Unknown error",
    status: err?.response?.status,
    data: err?.response?.data,
  };
}

/**
 * GET /update-cobj
 * Render form (updates.pug)
 */
app.get("/update-cobj", (req, res) => {
  return res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    properties: CUSTOM_PROPERTIES,
  });
});

/**
 * POST /update-cobj
 * Create record then redirect to homepage
 */
app.post("/update-cobj", async (req, res) => {
  try {
    const propertiesPayload = {};

    // Only accept expected properties (prevents junk inputs)
    for (const prop of CUSTOM_PROPERTIES) {
      if (typeof req.body[prop] !== "undefined") {
        propertiesPayload[prop] = String(req.body[prop]).trim();
      }
    }

    // Required by practicum: "name" must be present
    if (!propertiesPayload.name) {
      return res.status(400).send('Validation error: property "name" is required.');
    }

    await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      properties: propertiesPayload,
    });

    return res.redirect("/");
  } catch (err) {
    const e = normalizeHubSpotError(err);
    console.error("POST /update-cobj failed:", e);
    return res.status(500).send({
      error: "Failed to create CRM record",
      details: e,
    });
  }
});

/**
 * GET /
 * Fetch records and render homepage.pug table
 */
app.get("/", async (req, res) => {
  try {
    const qs = new URLSearchParams();
    qs.set("limit", "100");

    // Repeat "properties" keys to avoid 400 Invalid request in some portals
    for (const prop of CUSTOM_PROPERTIES) {
      qs.append("properties", prop);
    }

    const url = `/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?${qs.toString()}`;

    const response = await hubspot.get(url);

    const results = response?.data?.results || [];

    const records = results.map((r) => ({
      id: r.id,
      properties: r.properties || {},
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return res.render("homepage", {
      title: "Homepage | Integrating With HubSpot I Practicum",
      properties: CUSTOM_PROPERTIES,
      records,
    });
  } catch (err) {
    const e = normalizeHubSpotError(err);
    console.error("GET / failed:", e);
    return res.status(500).send({
      error: "Failed to fetch CRM records",
      details: e,
    });
  }
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
  console.log(`Custom Object Type: ${CUSTOM_OBJECT_TYPE}`);
  console.log(`Properties: ${CUSTOM_PROPERTIES.join(", ")}`);
});
