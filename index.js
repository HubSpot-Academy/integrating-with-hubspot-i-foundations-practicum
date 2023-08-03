const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "pat-na1-71755005-7249-49b0-b27d-5996388af0a3";

/*app.post("/update", async (req, res) => {
	const update = {
		properties: {
			favorite_book: req.body.newVal,
		},
	};

	const email = req.query.email;
	const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		"Content-Type": "application/json",
	};

	try {
		await axios.patch(updateContact, update, { headers });
		res.redirect("back");
	} catch (err) {
		console.error(err);
	}
});*/

app.get("/", async (req, res) => {
	const config =
		"https://api.hubapi.com/crm/v3/objects/planets?limit=10&archived=false&properties=name,colour,about";
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		"Content-Type": "application/json",
	};
	try {
		const resp = await axios.get(config, { headers });
		const data = await resp.data.results.map((event) => ({
			about: event.properties.about,
			colour: event.properties.colour,
			name: event.properties.name,
		}));
		if (data.length) {
			res.render("homepage", {
				title: "Planet Table",
				data,
			});
		}
	} catch (err) {
		console.error(err);
	}
});

app.get("/update-cobj", async (req, res) => {
	try {
		const title =
			"Update Custom Object Form | Integrating With HubSpot I Practicum";
		res.render("updates", { title: title });
	} catch (err) {
		console.error(err);
	}
});
app.post("/update-cobj", async (req, res) => {
	const formData = req.body;

	const customObjectData = JSON.stringify({
		properties: {
			name: formData.name,
			about: formData.about,
			colour: formData.colour,
		},
	});

	const planet = `https://api.hubapi.com/crm/v3/objects/planets`;
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		"Content-Type": "application/json",
	};

	try {
		await axios.post(planet, customObjectData, { headers });
		res.redirect("/");
	} catch (err) {
		console.error(err);
	}
});
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
