#!/usr/bin/env bash
set -e
set -a
source "$(dirname "$0")/.env"
set +a

export TOKEN=$HUBSPOT_TOKEN

echo "Creating schema..."
SCHEMA_RESPONSE=$(curl -s --request POST \
  --url "https://api.hubapi.com/crm-object-schemas/v3/schemas" \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "launch_vehicle",
    "labels": { "singular": "Launch Vehicle", "plural": "Launch Vehicles" },
    "primaryDisplayProperty": "name",
    "requiredProperties": ["name"],
    "properties": [
      { "name": "name", "label": "Name", "type": "string", "fieldType": "text", "isPrimaryDisplayLabel": true },
      { "name": "manufacturer", "label": "Manufacturer", "type": "string", "fieldType": "text" },
      { "name": "payload_to_leo_kg", "label": "Payload to LEO (kg)", "type": "number", "fieldType": "number" },
      { "name": "first_launch_date", "label": "First Launch Date", "type": "date", "fieldType": "date" }
    ],
    "associatedObjects": ["CONTACT", "COMPANY"]
  }')

echo "$SCHEMA_RESPONSE"

OBJECT_TYPE_ID=$(echo "$SCHEMA_RESPONSE" | grep -o '"objectTypeId":"[^"]*"' | head -n 1 | cut -d'"' -f4)

if [ -z "$OBJECT_TYPE_ID" ]; then
  echo "Schema creation failed. Stopping."
  exit 1
fi

echo "Object type ID: $OBJECT_TYPE_ID"
echo "Creating records..."

curl -s --request POST \
  --url "https://api.hubapi.com/crm/v3/objects/$OBJECT_TYPE_ID/batch/create" \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "inputs": [
      { "properties": { "name": "Falcon 9", "manufacturer": "SpaceX", "payload_to_leo_kg": "22800", "first_launch_date": "2010-06-04" } },
      { "properties": { "name": "Atlas V", "manufacturer": "United Launch Alliance", "payload_to_leo_kg": "18850", "first_launch_date": "2002-08-21" } },
      { "properties": { "name": "Space Launch System", "manufacturer": "Boeing / NASA", "payload_to_leo_kg": "95000", "first_launch_date": "2022-11-16" } }
    ]
  }'