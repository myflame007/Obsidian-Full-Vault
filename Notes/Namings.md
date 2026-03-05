---
categories:
  - "[[Help]]"
tags:
  - dynamics365
created: 2026-03-05
---
## Naming Conventions – Fields

### Text / Decimal / Date / Currency

- **Schema Name Format**: Capital letter for the first letter of each word 

- **Name Template**: `ava_XxxxxYyyy` 

- **Example**: `ava_ClientName`

---
### Choice

- **Schema Name Format**: Capital letter for the first letter of each word + suffix `Code` 

- **Name Template**: `ava_XxxxxYyyyCode` 

- **Example**: `ava_ClientCategoryCode`

---
### Choices (MultiSelect Choice)

- **Schema Name Format**: Capital letter for the first letter of each word + suffix `Codes` 

- **Name Template**: `ava_XxxxxYyyyCodes` 

- **Example**: `ava_ClientCategoryCodes`

---
### Boolean (Two Options)

- **Schema Name Format**: Capital letter for the first letter of each word + prefix `is` 

- **Name Template**: `ava_IsXxxxxYyyy` 

- **Example**: `ava_IsRegularClient`

---
### Lookup

- **Schema Name Format**: Capital letter for the first letter of each word + suffix `Id` 

- **Name Template**: `ava_XxxxxYyyyId` 

- **Example**: `ava_ClientId`