# Integrating With HubSpot I: Foundations Practicum

A full-stack Node.js application built for the HubSpot Academy "Integrating With HubSpot I: Foundations" practicum. This application integrates with the HubSpot CRM API to display and create custom CRM object records.

---

# Project Overview

This application demonstrates:

- HubSpot CRM API integration
- Node.js and Express server setup
- Axios API requests
- Pug templating
- CRUD-style functionality
- Git and GitHub workflow
- Environment variable security with dotenv

The application allows users to:

- View custom CRM object records in a table
- Create new CRM object records using a form
- Store and retrieve data from HubSpot CRM

---

# Technologies Used

- Node.js
- Express.js
- Axios
- Pug
- dotenv
- HTML5
- CSS3

---

# Custom Object Information

## Custom Object Name

Plants

## Custom Properties

| Property Label | Internal Name | Type |
|---|---|---|
| Name | name | Single-line text |
| Species | species | Single-line text |
| Watering Schedule | watering_schedule | Single-line text |

---

# HubSpot Custom Object List View

Replace the values below with your actual account ID and object ID before submitting.

```txt
https://app.hubspot.com/contacts/ACCOUNT_ID/objects/OBJECT_ID/views/all/list
```

Example:

```txt
https://app.hubspot.com/contacts/12345678/objects/2-9876543/views/all/list
```

---

# Project Structure

```txt
project-root/
│
├── public/
│   └── css/
│       └── style.css
│
├── views/
│   ├── homepage.pug
│   ├── updates.pug
│   └── contacts.pug
│
├── .gitignore
├── .env
├── index.js
├── package.json
├── README.md
```

---

# Installation Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
```

---

## 2. Navigate Into the Project Folder

```bash
cd YOUR_REPOSITORY_NAME
```

---

## 3. Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

Add the following:

```env
PRIVATE_APP_ACCESS_TOKEN=private_app_access_token
PORT=3000
```

Replace:

```txt
your_private_app_access_token
```

with your actual HubSpot private app token.

---

# Running the Application

Start the server:

```bash
node index.js
```

---

# Open the Application

Visit:

```txt
http://localhost:3000
```

---

# Application Routes

| Route | Method | Description |
|---|---|---|
| `/` | GET | Displays all custom object records |
| `/update-cobj` | GET | Renders form to create a new record |
| `/update-cobj` | POST | Creates a new CRM record |

---

# Features

- Retrieve CRM records from HubSpot API
- Display records in a responsive table
- Submit new records through a form
- Redirect users after successful submission
- Styled user interface using custom CSS
- Secure environment variable handling

---

# API Endpoints Used

## Get Custom Object Records

```txt
GET /crm/v3/objects/{objectType}
```

---

## Create Custom Object Record

```txt
POST /crm/v3/objects/{objectType}
```

---

# Git Workflow

The project was developed using:

- Feature branch workflow
- Frequent commits
- Merge back into main branch

---

# Security Notes

The following files are ignored using `.gitignore`:

```txt
node_modules
.env
```

Private app access tokens are never committed to GitHub.

---

# Author

Md Nurnabi Rana

---

# Practicum Requirements Completed

- Created a HubSpot developer test account
- Created a private app with required scopes
- Created and associated a custom object
- Added custom object records
- Implemented required GET and POST routes
- Built two required Pug templates
- Used Express, Axios, dotenv, and Pug
- Created GitHub repository with commit history
- Added custom object list view link to README

---

# License

This project was created for educational purposes as part of the HubSpot Academy Integrating With HubSpot I: Foundations practicum.