---
categories:
  - "[[D365]]"
  - "[[Help]]"
tags:
  - Typescript
created: 2026-02-10
---
In D365 Model-Driven Apps brauchst du keine URL selbst bauen. Die Xrm API übernimmt das:

```typescript
// Navigation über entityName + entityId - keine URL nötig
Xrm.Navigation.openForm({
  entityName: "ava_legalconsellingactivity",
  entityId: "00000000-0000-0000-0000-000000000000",
});
```

`Xrm.Navigation.openForm` löst intern die korrekte URL auf (inkl. Environment-URL und App-ID aus dem aktuellen Kontext). Du musst `baseUrl` und `appId` nur dann manuell zusammenbauen, wenn du eine URL als **Text** anzeigen willst (z.B. als klickbaren Fallback-Link bei Fehlern) - genau wie es jetzt im `.catch()` gemacht wird.