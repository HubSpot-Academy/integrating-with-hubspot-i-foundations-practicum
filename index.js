require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get("/", async (req, res) => {
	const cats =
		"https://api.hubspot.com/crm/v3/objects/cats?properties=id,name,cat_size_descriptor,chill,cat_color";
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		"Content-Type": "application/json",
	};
	try {
		const resp = await axios.get(cats, { headers });
		const data = resp.data.results;
		res.render("homepage", {
			title: "Cats | HubSpot APIs",
			data: data,
			message: req.query.message || "", // Pass the message to the template
		});
	} catch (error) {
		console.error(error);
	}
});

// ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// * SHOW - Render the form for both creating and updating cats
app.get("/cats/:id?", async (req, res) => {
	const catId = req.params.id;
	const catsUrl = catId
		? `https://api.hubspot.com/crm/v3/objects/cats/${catId}?properties=name,cat_size_descriptor,chill,cat_color`
		: null; // For new cat, the URL is null

	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		"Content-Type": "application/json",
	};

	try {
		let catData = null;

		// If we have a catId, fetch the cat details. Otherwise, initialize an empty object.
		if (catId) {
			const resp = await axios.get(catsUrl, { headers });
			catData = resp.data;
		}

		res.render("update", {
			title: catId
				? "Update Custom Object Form | Integrating With HubSpot I Practicum"
				: "Create Custom Object Form | Integrating With HubSpot I Practicum",
			cat: catData || {
				properties: {
					name: "",
					cat_size_descriptor: "",
					chill: "false",
					cat_color: "",
				},
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Error retrieving cat data.");
	}
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
// * CREATE or UPDATE - Handle form submissions
app.post("/update-cobj/:id?", async (req, res) => {
	const catId = req.params.id;
	const { name, cat_size_descriptor, chill, cat_color } = req.body;

	const catData = {
		properties: {
			name,
			cat_size_descriptor,
			chill,
			cat_color,
		},
	};

	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		"Content-Type": "application/json",
	};

	let url = "https://api.hubspot.com/crm/v3/objects/cats";
	let method = "POST"; // Default to POST for creating a new cat

	if (catId !== "undefined" && catId.length > 0) {
		url = `https://api.hubspot.com/crm/v3/objects/cats/${catId}`;
		method = "PATCH"; // Use PATCH for updating an existing cat
	}

	try {
		// Send either a POST or PATCH request depending on whether it's a new or existing cat
		const resp = await axios({
			method,
			url,
			data: catData,
			headers,
		});

		// After successful creation or update, redirect to the cat page
		res.redirect(`/?message=Change%20successful`);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error processing cat data.");
	}
});

// app.get("/contacts", async (req, res) => {
// 	const contacts = "https://api.hubspot.com/crm/v3/objects/contacts";
// 	const headers = {
// 		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
// 		"Content-Type": "application/json",
// 	};
// 	try {
// 		const resp = await axios.get(contacts, { headers });
// 		const data = resp.data.results;
// 		res.render("contacts", { title: "Contacts | HubSpot APIs", data });
// 	} catch (error) {
// 		console.error(error);
// 	}
// });

/**
* * This is sample code to give you a reference for how you should structure your calls.

* * App.get sample
app.get("/contacts", async (req, res) => {
	const contacts = "https://api.hubspot.com/crm/v3/objects/contacts";
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		"Content-Type": "application/json",
	};
	try {
		const resp = await axios.get(contacts, { headers });
		const data = resp.data.results;
		res.render("contacts", { title: "Contacts | HubSpot APIs", data });
	} catch (error) {
		console.error(error);
	}
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
