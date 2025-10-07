# IWH I Practicum — EU1 Custom Object Setup

Pre-configured for your EU1 test account and custom object:
- Test account id: **146990843**
- Custom object type id: **2-192837072**
- HubSpot list: https://app-eu1.hubspot.com/contacts/146990843/objects/2-192837072/views/all/list

## Features
- 3 routes: `/` (list), `GET /update-cobj` (form), `POST /update-cobj` (create)
- Auto-detects string properties from the schema if `HUBSPOT_CUSTOM_PROPERTIES` is empty (ensures `name` if present)
- Pug templates + simple CSS
- `.env` for secrets (never commit your token)

## Setup
```bash
npm install
cp .env.example .env
# edit .env and set HUBSPOT_ACCESS_TOKEN=pat-... (from your Private App)
npm start
# open http://localhost:3000
```

## Configure properties (optional)
Set explicit columns/fields using internal names:
```
HUBSPOT_CUSTOM_PROPERTIES=name,bio,species
```

## Troubleshooting
- 401 → invalid token or scopes missing
- 404 → wrong object type id; this project uses `2-192837072` from your link
- Empty cells → property names mismatch internal names or values missing\nNote: Created working-branch for practicum PR requirement.
