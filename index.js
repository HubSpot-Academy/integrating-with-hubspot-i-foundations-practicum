const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKKEN;
const CUSTOM_OBJECT_ID = "p_songs";
const SONG_TO_CONTACT_ASSOCIATION_ID = 22;

const PRIVATE_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_API_URL = "https://api.hubapi.com/crm/v3/";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  const contactsEndpoint =
    "https://api.hubapi.com/crm/v3/objects/contacts?properties=firstname,lastname,email";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const contactsResponse = await axios.get(contactsEndpoint, { headers });
    const contacts = contactsResponse.data.results;

    const contactsWithSongsPromises = contacts.map(async (contact) => {
      const contactId = contact.id;
      const associationsEndpoint = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/${CUSTOM_OBJECT_ID}`;

      const associationsResponse = await axios.get(associationsEndpoint, {
        headers,
      });
      const songAssociations = associationsResponse.data.results;

      let songs = [];
      if (songAssociations && songAssociations.length > 0) {
        const songDetailPromises = songAssociations.map((association) => {
          const songId = association.id;
          const songEndpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}/${songId}?properties=name,genre,singer`;
          return axios.get(songEndpoint, { headers });
        });

        const songDetailResponses = await Promise.all(songDetailPromises);
        songs = songDetailResponses.map((response) => response.data);
      }

      return {
        ...contact,
        songs: songs.length > 0 ? [songs[0]] : [],
      };
    });

    const contactsWithSongs = await Promise.all(contactsWithSongsPromises);

    res.render("homepage", { data: contactsWithSongs });
  } catch (error) {
    console.error("Error fetching data from HubSpot:", error.message);
    if (error.response) {
      console.error("HubSpot Response:", error.response.data);
    }
    res.status(500).send("Error fetching data from HubSpot");
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get("/update-cobj", async (req, res) => {
  const { id, name, genre, singer, contactId } = req.query;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  const contactsEndpoint = `${HUBSPOT_API_URL}objects/contacts?properties=firstname,lastname`;

  try {
    // Fetch all contacts to populate the dropdown
    const contactsResponse = await axios.get(contactsEndpoint, { headers });
    const contacts = contactsResponse.data.results;

    res.render("updates", { id, name, genre, singer, contacts, contactId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error fetching contacts from HubSpot");
  }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/add-cobj", async (req, res) => {
  const HUBSPOT_API_URL_SONGS = `${HUBSPOT_API_URL}objects/${CUSTOM_OBJECT_ID}`;

  const { recordId, contactId, ...properties } = req.body;

  const hubspotRequest = {
    properties,
  };

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    if (recordId) {
      // This is an update
      const updateUrl = `${HUBSPOT_API_URL_SONGS}/${recordId}`;
      await axios.patch(updateUrl, hubspotRequest, { headers });
    } else {
      // This is a create
      const createResponse = await axios.post(
        HUBSPOT_API_URL_SONGS,
        hubspotRequest,
        { headers }
      );
      const newSongId = createResponse.data.id;

      // If a contact was selected, create the association
      if (contactId && newSongId) {
        const associationUrl = `${HUBSPOT_API_URL}objects/${CUSTOM_OBJECT_ID}/${newSongId}/associations/contacts/${contactId}/${SONG_TO_CONTACT_ASSOCIATION_ID}`;
        await axios.put(associationUrl, null, { headers });
      }
    }
    res.redirect("/");
  } catch (err) {
    console.error(err.message);
    if (err.response) {
      console.error("HubSpot Error:", err.response.data);
      if (err.response.context.ASSOCIATION_USER_CONFIG_LIMIT_EXCEEDED.length > 0){
        res.send(503).send('Association limit has exceeded for this user.')
      }
    }
    res.status(500).send("An error occurred while communicating with HubSpot.");
  }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
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
