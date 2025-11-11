# Welcome to the Integrating With HubSpot I: Foundations Practicum

Este repositorio contiene la práctica de integración con HubSpot I (Foundations) usando **Node.js + Express + Axios + Pug**.

## Rutas nuevas (requisito)
- `GET /` → Lista objetos personalizados (mascotas) en tabla (sin mostrar ID).
- `GET /update-cobj` → Muestra formulario para crear un registro de Mascota (propiedades: `nombre`, `tipo_de_animal`, `edad`).
- `POST /update-cobj` → Envía el formulario y crea el registro en HubSpot; redirige a `/`.

## Cómo ejecutar
1. Clonar repo y entrar a la carpeta.
2. `npm install`
3. Crear archivo `.env` a partir de `.env.example`con los siguientes campos:

HS_TOKEN=<TU_TOKEN_PRIVATE_APP>
HS_CUSTOM_OBJECT=<OBJECT TYPE ID o API name> # ej. p_mascota
HS_PROPS=nombre,tipo_de_animal,edad

4. `node index.js` (o `npx nodemon index.js`)
5. Abrir `http://localhost:3000`

**Put your HubSpot developer test account custom objects URL link here:** https://app.hubspot.com/contacts/50564796/objects/2-52812418/views/all/list

## Notas de seguridad
- No se incluye el token real en el repo.

## Historial de confirmaciones
Commits atómicos por feature: rutas, vistas, README y .env.example.
___
## Tips:
- Commit to your repository often. Even if you make small tweaks to your code, it’s best to be committing to your repository frequently.
- The subject of the custom object is up to you. Feel free to get creative!
- Please create a test account and include your private app access token in your repo.
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
