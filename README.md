# Integrating With HubSpot I: Foundations Practicum

Node + Express + Pug + Axios. Crea y lista registros de un Custom Object en HubSpot.

## Custom Object (vista de lista)
https://app.hubspot.com/contacts/<PORTAL_ID>/objects/<OBJECT_TYPE_ID>/views/all/list

## Ejecutar
```bash
cp .env.example .env  # o crear .env
# .env:
# TOKEN_HUBSPOT=pat-xxxxx
npm install
node index.js
# http://localhost:3000
```