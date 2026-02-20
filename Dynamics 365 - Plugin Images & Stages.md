# Dynamics 365 – Plugin Images & Stages

## Die Plugin-Stages

```
User klickt "Speichern"
        │
        ▼
┌─────────────────────┐
│  PreValidation (10) │  ← Vor der DB-Transaktion
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  PreOperation  (20) │  ← In der Transaktion, vor dem Schreiben
└─────────────────────┘
        │
        ▼
   [DB-Schreibvorgang]
        │
        ▼
┌─────────────────────┐
│  PostOperation (40) │  ← In der Transaktion, nach dem Schreiben
└─────────────────────┘
```

---

## Verfügbarkeit nach Stage

| | PreValidation | PreOperation | PostOperation |
|---|---|---|---|
| **Target** | ✅ | ✅ | ✅ |
| **PreImage** | ✅ (registrierbar) | ✅ (registrierbar) | ✅ (registrierbar) |
| **PostImage** | ❌ nie | ❌ nie | ✅ (registrierbar) |

---

## Was steckt in den einzelnen Kontexten?

### Target
- Immer verfügbar, **kein Registrieren nötig**
- Bei **Update**: nur die **explizit geänderten Felder**
- Bei **Create**: alle Felder des neuen Records
- Bei **Delete**: nur die EntityReference

```csharp
// User hat nur ava_Type geändert → Target enthält NUR ava_Type
target.ava_Type   // ✅ gesetzt
target.OwnerId    // ❌ null (war nicht im Update-Payload)
```

### PreImage
- **Zustand des Records VOR der Änderung**
- Muss registriert werden: `Image1Type = ImageTypeEnum.PreImage`
- Verfügbar in allen Stages

```csharp
preImage.ava_Type   // ✅ alter Wert
preImage.OwnerId    // ✅ immer gesetzt
```

### PostImage
- **Zustand des Records NACH der Änderung** (direkt aus der DB)
- Muss registriert werden: `Image1Type = ImageTypeEnum.PostImage`
- **Nur in PostOperation verfügbar**

```csharp
postImage.ava_Type   // ✅ neuer Wert
postImage.OwnerId    // ✅ immer gesetzt
```

### Subject (= PreImage + Target zusammengeführt)
- **Kein CRM-Konzept** – wird von `BuildSubject()` im Framework gebaut
- PreImage-Attribute als Basis, Target-Attribute legen sich darüber
- Ergibt den **effektiven aktuellen Zustand** ohne Extra-DB-Abfrage
- ⚠️ **Funktioniert nur korrekt wenn PreImage registriert ist!**

```csharp
// PreImage registriert → Subject ist vollständig:
subject.ava_Type   // ✅ neuer Wert (aus Target überschrieben)
subject.OwnerId    // ✅ aus PreImage

// Nur PostImage registriert → Subject ist unvollständig:
subject.ava_Type   // ✅ aus Target
subject.OwnerId    // ❌ null! (PreImage war null)
```

---

## ImageTypeEnum.Both – Das Beste aus beiden Welten

`ImageTypeEnum.Both = 2` registriert **ein einziges Image** das in BEIDEN Collections erscheint:
- `PreEntityImages["DefaultImage"]` → `context.PreImage` (Zustand vor Update)
- `PostEntityImages["DefaultImage"]` → `context.PostImage` (Zustand nach Update)

```csharp
Image1Type = ImageTypeEnum.Both   // ← eine Zeile, beide Images verfügbar
```

**Wann sinnvoll**: Wenn du gleichzeitig prüfen willst ob sich ein Feld geändert hat (PreImage) UND den vollständigen aktuellen Record brauchst (PostImage).

```csharp
// context.PreImage → War ava_Type vorher null?
if (context.PreImage?.ava_Type != null) return;  // war schon gesetzt → skip

// context.Subject (= PreImage + Target) → vollständiger aktueller Zustand
// context.PostImage → garantiert alle Felder nach dem Update
```

---

## Wann was registrieren?

| Anwendungsfall | Stage | Image registrieren |
|---|---|---|
| Wert validieren bevor gespeichert | PreValidation / PreOperation | PreImage (wenn Vergleich nötig) |
| Feld vor dem Speichern überschreiben | PreOperation | PreImage (wenn Vergleich nötig) |
| Auf Änderung reagieren + `HasChanged` nutzen | PostOperation | **PreImage** |
| Vollständigen Record nach Update brauchen | PostOperation | PostImage |
| `Subject` verwenden (Standard-Pattern) | PostOperation | **PreImage** ← immer! |
| Vorher-/Nachher-Vergleich + vollständige Daten | PostOperation | **Both** ← PreImage + PostImage in einem |

---

## Faustregel

> [!tip] Merksatz
> - `Subject` verwenden → **PreImage** registrieren
> - `HasChanged()` nutzen → **PreImage** registrieren
> - Vollständiger Record nach Save ohne Subject → **PostImage**
> - Vorher-/Nachher-Vergleich UND vollständige Daten → **Both**
> - Pre-Stage (PreValidation / PreOperation) → **PostImage niemals möglich**

---

## Häufige Fehler

> [!warning] Klassische Bugs
>
> **PostImage registriert, aber Subject verwendet**
> → Subject hat nur Target-Felder → nicht geänderte Felder (z.B. `OwnerId`, `ava_LegalConsellingId`) sind `null`
>
> **PreImage nicht registriert, aber `HasChanged()` genutzt**
> → `pre` ist `null` → `FieldChecker.HasChanged(null, target, field)` gibt immer `true` zurück → Vergleich funktioniert nicht
>
> **PostImage in PreOperation registriert**
> → PostImage ist immer `null` in Pre-Stages – der DB-Schreibvorgang hat noch nicht stattgefunden
>
> **Subject verwendet um "war vorher null" zu prüfen, aber kein PreImage**
> → `pre?.ava_Type != null` mit `pre = null` → ist immer `false` → Prüfung greift nie

---

## Beispiel: PostUpdate mit Subject + HasChanged (PreImage)

```csharp
// ✅ PreImage registrieren wenn Subject oder HasChanged genutzt wird
[CrmPluginRegistration(
    MessageNameEnum.Update,
    MyEntity.EntityLogicalName,
    StageEnum.PostOperation,
    ExecutionModeEnum.Synchronous, "",
    "MyPlugin.PostUpdate", 1, IsolationModeEnum.Sandbox,
    Image1Name = XrmPluginContext.PluginImageName,
    Image1Type = ImageTypeEnum.PreImage,
    Image1Attributes = "")]
public class PostUpdate : XrmPluginBase<MyEntity>, IPlugin
{
    protected override void ExecuteCrmPlugin(XrmPluginContext<MyEntity> context)
    {
        // context.Subject = PreImage + Target → vollständig ✅
        // context.PreImage = Zustand vor Update ✅
        // context.Target = nur geänderte Felder ✅
        context.Subject.DoSomething(
            context.CrmUserContext,
            context.Target,
            context.PreImage,
            context.TracingService);
    }
}
```

## Beispiel: PostUpdate mit Both (PreImage + PostImage)

```csharp
// ✅ Both wenn: Vorher-Prüfung (pre) UND vollständige Daten nach Update (post) benötigt
[CrmPluginRegistration(
    MessageNameEnum.Update,
    MyEntity.EntityLogicalName,
    StageEnum.PostOperation,
    ExecutionModeEnum.Synchronous, "",
    "MyPlugin.PostUpdate", 1, IsolationModeEnum.Sandbox,
    Image1Name = XrmPluginContext.PluginImageName,
    Image1Type = ImageTypeEnum.Both,   // ← Pre + Post in einem
    Image1Attributes = "")]
public class PostUpdate : XrmPluginBase<MyEntity>, IPlugin
{
    protected override void ExecuteCrmPlugin(XrmPluginContext<MyEntity> context)
    {
        // context.PreImage  = Zustand VOR Update  (für Vergleiche) ✅
        // context.PostImage = Zustand NACH Update (alle Felder garantiert) ✅
        // context.Subject   = PreImage + Target   (effektiver aktueller Stand) ✅
        context.Subject.DoSomething(
            context.CrmUserContext,
            context.Target,
            context.PreImage,
            context.TracingService);
    }
}
```

---

## Tags
#dynamics365 #plugin #crm #development
