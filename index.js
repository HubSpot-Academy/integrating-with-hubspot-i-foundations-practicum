require("dotenv").config();

const path = require("path");
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE; 
const CUSTOM_PROPERTIES = (process.env.HUBSPOT_CUSTOM_PROPERTIES || "name")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

// Fail fast (helps troubleshooting)
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

// Middleware
app.use(express.urlencoded({ extended: true })); //  POST
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// HubSpot API client
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
 * Renders the HTML form (updates.pug)
 */
app.get("/update-cobj", (req, res) => {
  return res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    properties: CUSTOM_PROPERTIES,
  });
});

/**
 * POST /update-cobj
 * Creates a new custom object record, then redirects to /
 */
app.post("/update-cobj", async (req, res) => {
  try {
    const propertiesPayload = {};

    // Pull only the properties you expect from the form
    for (const prop of CUSTOM_PROPERTIES) {
      if (typeof req.body[prop] !== "undefined") {
        propertiesPayload[prop] = String(req.body[prop]).trim();
      }
    }

    // Required by practicum: "name" must exist
    if (!propertiesPayload.name) {
      return res.status(400).send('Validation error: property "name" is required.');
    }

    await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      properties: propertiesPayload,
    });

    // Required redirect
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
 * Fetches records and renders homepage.pug as an HTML table
 */
app.get("/", async (req, res) => {
  try {
    const params = {
      limit: 100,
      properties: CUSTOM_PROPERTIES.join(","),
    };

    const response = await hubspot.get(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      params,
    });

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

// Start server
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
  console.log(`Custom Object Type: ${CUSTOM_OBJECT_TYPE}`);
  console.log(`Properties: ${CUSTOM_PROPERTIES.join(", ")}`);
});
