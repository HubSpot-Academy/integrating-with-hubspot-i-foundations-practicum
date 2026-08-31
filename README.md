# Integrating With HubSpot I: Foundations Practicum

## Overview

This project is a Node.js application created for the Integrating With HubSpot I: Foundations practicum.

The application uses the HubSpot CRM API to retrieve and create records for a custom object.

## Custom Object

The custom object created for this practicum is:

**Books**

### Custom Properties

- Name
- Author
- Genre

The `Name` property is a string property and is the primary display property.

The Books custom object is associated with the HubSpot Contacts object.

## HubSpot Custom Object

[View the Books custom object in HubSpot](https://app.hubspot.com/contacts/2661297/objects/68468166/views/all/list)

## Application Routes

### Homepage

`GET /`

Retrieves Books records from the HubSpot CRM API and displays them in an HTML table.

### Add Book Form

`GET /update-cobj`

Displays the Pug form used to create a new Book record.

### Create Book

`POST /update-cobj`

Sends the submitted form data to the HubSpot CRM API to create a new Book record and redirects back to the homepage.

## Technologies

- Node.js
- Express
- Axios
- Pug
- dotenv
- HubSpot CRM API

## Running the Application

Install dependencies:

```bash
