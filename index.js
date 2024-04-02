const express = require('express');
const hubspot = require('@hubspot/api-client');

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const accessToken = "";
const hubspotClient = new hubspot.Client({ accessToken: accessToken });

const objectType = "students";
const limit = 100;
let after = undefined;
const studentProperties = ["name", "gender", "age"];
const propertiesWithHistory = undefined;
const associations = undefined;
const archived = false;

async function createStudent (formData){

    //properties from POST
    const properties = {
        "name": formData.name,
        "gender": formData.gender,
        "age": formData.age
    };

    const SimplePublicObjectInputForCreate = { associations, properties};

    try {
        const apiResponse = await hubspotClient.crm.objects.basicApi.create(objectType, SimplePublicObjectInputForCreate);
        console.log(JSON.stringify(apiResponse, null, 2));
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

app.get("/", async (req, res) => {

    const pageTitle = "List of Students";

    try {
        const studentRes = await hubspotClient.crm.objects.basicApi.getPage(
            objectType,
            limit,
            after,
            studentProperties,
            propertiesWithHistory,
            associations,
            archived);
        console.log(JSON.stringify(studentRes, null, 2));

        const students = studentRes.results;

        res.render('homepage', { pageTitle, students });

    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
});

app.get("/update-cobj", async (req, res) => {
    const pageTitle = "Update Custom Object Form | Integrating With HubSpot I Practicum";
    res.render('updates', { pageTitle });
});

app.post("/update-cobj", async (req, res) => {
    await createStudent(req.body);
    res.redirect('/');
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));