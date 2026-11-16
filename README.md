# Welcome to the Integrating With HubSpot I: Foundations Practicum

This repository is for the Integrating With HubSpot I: Foundations course. This practicum is one of two requirements for receiving your Integrating With HubSpot I: Foundations certification. You must also take the exam and receive a passing grade (at least 75%).

To read the full directions, please go to the [practicum instructions](https://app.hubspot.com/academy/l/tracks/1092124/1093824/5493?language=en).

**HubSpot Vehicles custom object list view:** [Open the list view](https://app.hubspot.com/contacts/248019139/objects/2-271933748/views/all/list)

___
## Automotive demo app

This Node.js app creates three HubSpot custom objects: **Vehicles**, **Inventory**, and **Warranties**. Each has a string property labeled **Name** and additional dealership-specific properties. The objects are associated with HubSpot contacts and companies; inventory and warranty records can also be associated with vehicles.

1. Create a HubSpot developer test account and a private app with these scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.companies.read`, `crm.objects.companies.write`, `crm.objects.custom.read`, `crm.objects.custom.write`, `crm.schemas.custom.read`, and `crm.schemas.custom.write`.
2. Copy `.env.template` to `.env` and set `PRIVATE_ACCESS_KEY` to your private app token. Keep `.env` local; never commit or share the token.
3. Install packages with `npm install`, then start the app with `node index.js`.
4. Open [http://localhost:3000](http://localhost:3000) and select **Set up demo workspace**. The app creates or reuses the schemas, then adds three fictional records to each custom object and links them to demo contacts and a demo company.

The setup action is safe to repeat: it looks up the demo records using their unique email, VIN, SKU, warranty number, or company name before creating them.

## Tips:
- Commit to your repository often. Even if you make small tweaks to your code, it’s best to be committing to your repository frequently.
- The subject of the custom object is up to you. Feel free to get creative!
- Please create a HubSpot developer test account and use a private app token stored only in your local `.env` file.
- Ensure you re-merge any working branches into the main branch.
- DO NOT ADD YOUR PRIVATE APP TOKEN TO YOUR REPOSITORY. 

## Pre-requisites:
- Using [Node](https://nodejs.org/en/download) and node packages
- Using [Express](https://expressjs.com/en/starter/installing.html)
- Using [Axios](https://axios-http.com/docs/intro)
- Using [Pug templating system](https://pugjs.org/api/getting-started.html)
- Using the command line
- Using [Git and GitHub](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)

## Requirements
- All work must be your own. During the grading process we will check the revision history. Submissions that do not meet this requirement will not be considered.
- You must have at least two new routes in your index.js file and one new pug template for the homepage.
- You must create a developer test account and link to it in your README.md file. Submissions that do not meet this requirement will not be considered.
