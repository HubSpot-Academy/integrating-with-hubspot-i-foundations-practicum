require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;

const OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE; // "contacts"
const PROP_1 = process.env.PROP_1; // firstname
const PROP_2 = process.env.PROP_2; // lastname
const PROP_3 = process.env.PROP_3; // email

if (!TOKEN || !OBJECT_TYPE || !PROP_1 || !PROP_2 || !PROP_3) {
  console.error(
    "Missing required env vars. Check .env for HUBSPOT_PRIVATE_APP_TOKEN, CUSTOM_OBJECT_TYPE, PROP_1/2/3."
  );
  process.exit(1);
}

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const hs = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

// GET /  -> show table of records
app.get("/", async (req, res) => {
  try {
    const props = [PROP_1, PROP_2, PROP_3].join(",");
    const response = await hs.get(`/crm/v3/objects/${OBJECT_TYPE}`, {
      params: { limit: 100, properties: props },
    });

    const results = response.data.results || [];

    const rows = results.map((r) => ({
      id: r.id,
      p1: r.properties?.[PROP_1] ?? "",
      p2: r.properties?.[PROP_2] ?? "",
      p3: r.properties?.[PROP_3] ?? "",
    }));

    res.render("homepage", {
      title: "Homepage | Integrating With HubSpot I Practicum",
      objectType: OBJECT_TYPE,
      prop1: PROP_1,
      prop2: PROP_2,
      prop3: PROP_3,
      rows,
    });
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    res.status(500).send({
      message: "Failed to fetch records from HubSpot.",
      status,
      data,
    });
  }
});

// GET /update-cobj -> render form
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Form | Integrating With HubSpot I Practicum",
    objectType: OBJECT_TYPE,
    prop1: PROP_1,
    prop2: PROP_2,
    prop3: PROP_3,
  });
});

// POST /update-cobj -> create record then redirect to /
app.post("/update-cobj", async (req, res) => {
  try {
    const payload = {
      properties: {
        [PROP_1]: req.body[PROP_1],
        [PROP_2]: req.body[PROP_2],
        [PROP_3]: req.body[PROP_3],
      },
    };

    await hs.post(`/crm/v3/objects/${OBJECT_TYPE}`, payload);

    return res.redirect("/");
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    res.status(500).send({
      message: "Failed to create record in HubSpot.",
      status,
      data,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
