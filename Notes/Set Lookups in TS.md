---
categories:
  - "[[D365]]"
  - "[[Help]]"
tags:
  - Lookup
  - Typescript
created: 2026-01-22
---

## 1. AM selben Form

  

Ein Lookup-Feld in D365 akzeptiert **nur ein Array**, das ein oder mehrere Objekte enthält.

Jedes Lookup-Objekt **muss genau diese drei Properties haben**:

  

```ts

{

  id: "{GUID}",        // immer MIT geschweiften Klammern

  name: "Anzeigename", // optional, aber empfohlen

  entityType: "entitylogicalname"

}
```


Per XRM Web Api

```ts

 await Xrm.WebApi.updateRecord(
                        ava_bbu_kontaktaufnahmeMetadata.logicalName,
                        id,
                        { "ownerid@odata.bind": `/systemusers(${userId})` }
                    );
```

Mehrzahlt vom logischen namen der Entität ist hier wichtig
Ich selbst prüfe das meist mit "[[Level Up 4 Dynamics]]", weil es am schnellsten geht
