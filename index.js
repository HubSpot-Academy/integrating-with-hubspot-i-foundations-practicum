const axios = require("axios");
const express = require("express");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "";

app.get("/", async (req, res) => {
  const contacts =
    "https://api.hubspot.com/crm/v3/objects/pets?properties=pet_type,pet_name,pet_bio";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(contacts, { headers });
    const data = resp.data.results;
    res.render("homepage", { title: "Contacts | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("update-cobj.pug", { title: "Pets | HubSpot APIs" });
});

app.post("/create", async (req, res) => {
  console.log(req.body);

  const create = {
    inputs: [
      {
        properties: {
          pet_name: req.body.pet_name,
          pet_type: req.body.pet_type,
          pet_bio: req.body.pet_bio,
        },
      },
    ],
  };

  const createContact = `https://api.hubspot.com/crm/v3/objects/pets/batch/create`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    await axios.post(createContact, create, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
