# 🟠 HubSpot Custom Object Practicum — Pets App

This repository contains my submission for the **Integrating With HubSpot I: Foundations Practicum**.

I created a custom CRM object called **Pets**, where users can:
- View all pets stored in HubSpot CRM
- Add new pets via a form
- Display them in a table on the homepage

---

## 🐾 Custom Object Details

| Property | Type | Required |
|---------|------|---------|
| name    | String | ✅ Yes |
| type    | String (Dog / Cat / etc.) | ❌ No |
| age     | Number | ❌ No |

---

## 🔗 HubSpot Developer Account Custom Object URL

https://app-eu1.hubspot.com/contacts/147184378/objects/2-194124358/views/all/list

---

## 🚀 Features Implemented

✅ Created HubSpot developer test account  
✅ Created a custom object (**Pets**)  
✅ Added 3 sample records  
✅ Created Express server  
✅ `.env` used for storing private token securely  
✅ GET route to fetch custom object records  
✅ GET route to display form  
✅ POST route to add new records  
✅ Pug templates for homepage & form  
✅ Local testing completed on port 3000  

---

## 📂 Routes Overview

| Route | Description |
|-------|------------|
| `/` | Homepage showing pets table |
| `/update-cobj` | Form page to add pets |
| `POST /update-cobj` | Sends form data to HubSpot & redirects to homepage |

---

