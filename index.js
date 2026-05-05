require("dotenv").config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;


const OBJECT_ID = "2-229237597";


//  ROUTE 1 — HOMEPAGE (GET DATA)
app.get("/", async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}?properties=name,publisher,price`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            },
        });

        const records = response.data.results;

        res.render("homepage", { records });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send("Error fetching data");
    }
});


//  ROUTE 2 — FORM PAGE
app.get("/update-cobj", (req, res) => {
    res.render("updates");
});


//  ROUTE 3 — CREATE RECORD
app.post("/update-cobj", async (req, res) => {
    const { name, publisher, price } = req.body;

    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;

    try {
        await axios.post(
            url,
            {
                properties: {
                    name,
                    publisher,
                    price,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.redirect("/");
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send("Error creating record");
    }
});


//  SERVER
app.listen(3000, () => console.log('Listening on http://localhost:3000'));