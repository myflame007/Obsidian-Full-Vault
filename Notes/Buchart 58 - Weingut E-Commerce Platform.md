---
categories:
  - "[[Buchart58]]"
tags:
  - Shop
created: 2026-02-05
---


> Premium-Webshop und Erlebnis-Plattform für ein österreichisches Weingut

  

---

  

## Vision & Endgoal

  

Eine vollständige E-Commerce-Plattform mit:

- **Online Shop** für Weine und Accessoires mit Checkout & Zahlung

- **Erlebnis-Buchungen** (Verkostungen, Wanderungen, Events)

- **Personalisierung** (Etiketten-Designer, Geschmacks-Quiz)

- **User Accounts** mit Bestellhistorie, Buchungen, Wunschliste

- **Admin Panel / CMS** für Produkt- und Bestellverwaltung

- **Marketing-Tools** (Angebote, Rabatte, E-Mail-Automation)

- **Premium UX** auf Award-Winning Niveau

  

---

  

## Tech Stack (Finalisiert)

  

```

┌─────────────────────────────────────────────────────────────────┐

│ FRONTEND │

├─────────────────────────────────────────────────────────────────┤

│ Astro 5 (SSG + SSR Hybrid) │

│ ├── Statische Seiten: Homepage, Produkte, Info-Seiten │

│ ├── Server-Seiten: Account, Checkout, Admin │

│ └── React Islands: Interaktive Komponenten │

│ │

│ UI: Tailwind CSS v4 + Framer Motion │

│ State: Nanostores (Client) + Astro Sessions (Server) │

└─────────────────────────────────────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────────┐

│ BACKEND │

├─────────────────────────────────────────────────────────────────┤

│ Astro API Routes (/api/*) │

│ ├── /api/auth/* → Supabase Auth │

│ ├── /api/checkout/* → Stripe Webhooks │

│ ├── /api/bookings/* → Buchungslogik │

│ ├── /api/admin/* → CMS Endpoints │

│ └── /api/marketing/* → Aktionen, Rabatte, Newsletter │

└─────────────────────────────────────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────────┐

│ SUPABASE (All-in-One) │

├─────────────────────────────────────────────────────────────────┤

│ │

│ ┌─────────────────────────────────────────────────────────┐ │

│ │ PostgreSQL │ │

│ ├─────────────────────────────────────────────────────────┤ │

│ │ • Users & Auth (eingebaut) │ │

│ │ • Products, Orders, OrderItems │ │

│ │ • Bookings, Addresses, Wishlists │ │

│ │ • Reviews, Comments │ │

│ │ • Promotions, Discounts, Coupons │ │

│ │ • Newsletter Subscribers │ │

│ │ • Email Campaigns & Logs │ │

│ └─────────────────────────────────────────────────────────┘ │

│ │ │

│ ▼ │

│ ┌─────────────────────────────────────────────────────────┐ │

│ │ pgvector │ │

│ ├─────────────────────────────────────────────────────────┤ │

│ │ • Wine name embeddings → Fuzzy Search │ │

│ │ • Description embeddings → Semantic Search │ │

│ │ • Taste profiles → "Ähnliche Weine" │ │

│ └─────────────────────────────────────────────────────────┘ │

│ │

│ ┌─────────────────────────────────────────────────────────┐ │

│ │ Supabase Storage │ │

│ ├─────────────────────────────────────────────────────────┤ │

│ │ • Produktbilder │ │

│ │ • Custom Etiketten (User-Uploads) │ │

│ │ • Kleine Assets │ │

│ └─────────────────────────────────────────────────────────┘ │

│ │

└─────────────────────────────────────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────────┐

│ EXTERNE SERVICES │

├─────────────────────────────────────────────────────────────────┤

│ Vercel → Hosting (Astro SSG + SSR) │

│ Stripe → Zahlungen, Subscriptions, Coupons │

│ Resend → Transaktionale E-Mails + Marketing │

│ Cloudflare R2 → Große Assets (Panoramen, Videos) │

│ OpenAI / Claude → Embeddings für Vector Search │

└─────────────────────────────────────────────────────────────────┘

```

  

### Warum diese Kombination?

  

| Service | Grund |

|---------|-------|

| **Supabase** | Auth + DB + Storage + Vectors in einem, Free Tier reicht |

| **Vercel** | Bestes Astro-Hosting, Preview Deployments, Edge |

| **Stripe** | Standard für Payments, hat eingebaute Coupon-Verwaltung |

| **Resend** | Modern, günstig, gute API, React Email Templates |

| **Cloudflare R2** | Keine Egress-Kosten für große Dateien |

  

### Geschätzte Kosten

  

| Service | Free Tier | Bei Wachstum |

|---------|-----------|--------------|

| Supabase | 500MB DB, 1GB Storage, 50k Users | $25/mo (Pro) |

| Vercel | 100GB Bandwidth | $20/mo (Pro) |

| Stripe | - | 1.4% + €0.25/Transaktion |

| Resend | 3000 E-Mails/mo | $20/mo |

| Cloudflare R2 | 10GB Storage | ~$0.015/GB |

| **Total MVP** | **€0/mo** | **~€65/mo + Stripe Fees** |

  

---

  

## Feature Übersicht

  

### Phase 1: MVP - Core E-Commerce

> Ziel: Funktionierender Shop mit Checkout

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| Produktkatalog (Weine) | ✅ Done | 8 Beispiel-Weine, Grid, Filter |

| Warenkorb | ✅ Done | Add/Remove, localStorage |

| Produktdetailseiten | ✅ Done | Dynamisch aus Daten |

| Checkout Flow | ⬜ Todo | Versand, Zahlung, Bestätigung |

| Stripe Integration | ⬜ Todo | Kreditkarte, Apple Pay, Google Pay |

| Bestellbestätigung | ⬜ Todo | E-Mail + Seite |

| Gast-Checkout | ⬜ Todo | Ohne Account bestellen |

  

### Phase 2: User Accounts

> Ziel: Registrierung, Login, persönlicher Bereich

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| Registrierung | ⬜ Todo | E-Mail/Passwort (Supabase Auth) |

| Login/Logout | ⬜ Todo | Session-basiert |

| OAuth | ⬜ Todo | Google, Apple Login |

| Passwort vergessen | ⬜ Todo | E-Mail Reset Flow |

| Account-Seite | ⬜ Todo | Profil bearbeiten |

| Bestellhistorie | ⬜ Todo | Alle Bestellungen einsehen |

| Adressen verwalten | ⬜ Todo | Liefer- & Rechnungsadressen |

| Wunschliste | ⬜ Todo | Produkte speichern |

  

### Phase 3: Erlebnis-Buchungen

> Ziel: Events online buchen und bezahlen

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| Buchungskalender | ⬜ Todo | Verfügbare Termine anzeigen |

| Weinverkostung buchen | ⬜ Todo | Termin, Personenzahl, Zahlung |

| Wanderung buchen | ⬜ Todo | Termin, Gruppengröße |

| Picknick buchen | ⬜ Todo | Spot wählen, Korb-Optionen |

| Rebstock-Miete | ⬜ Todo | Jahres-Abo mit Urkunde |

| Buchungen im Account | ⬜ Todo | Übersicht, Stornierung |

| Buchungsbestätigung | ⬜ Todo | E-Mail mit Details |

  

### Phase 4: Personalisierung

> Ziel: Einzigartige Kundenerlebnisse

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| Etiketten-Designer | ⬜ Todo | Canvas-Editor für eigene Designs |

| Bild-Upload | ⬜ Todo | Eigene Fotos hochladen |

| Text-Editor | ⬜ Todo | Schriften, Farben, Layout |

| Vorschau | ⬜ Todo | 3D Flasche mit Etikett |

| Design speichern | ⬜ Todo | Im Account für später |

| Magnum-Flaschen | ✅ Done | Info-Seite (Bestellung manuell) |

  

### Phase 5: Admin Panel / CMS

> Ziel: Selbstständige Verwaltung durch Weingut

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| Admin Login | ⬜ Todo | Separater Auth-Flow, Role-based |

| **Produkte verwalten** | ⬜ Todo | CRUD für Weine + Accessoires |

| Kategorien/Tags | ⬜ Todo | Rot, Weiß, Rosé, etc. |

| Bestand verwalten | ⬜ Todo | Stock-Levels, Low-Stock Alerts |

| **Bestellungen** | ⬜ Todo | Liste, Status ändern, Versand |

| **Buchungen** | ⬜ Todo | Kalender, Bestätigung, Storno |

| Kunden einsehen | ⬜ Todo | Liste, Details, Bestellhistorie |

| **Statistiken** | ⬜ Todo | Umsatz, Bestseller, Conversion |

  

#### Marketing & Aktionen (NEU)

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| **Angebote erstellen** | ⬜ Todo | Zeitlich begrenzte Aktionen |

| **Rabatt-Codes** | ⬜ Todo | Prozent oder Fixbetrag |

| **Gutscheine** | ⬜ Todo | Geschenkkarten mit Guthaben |

| **Bundle-Angebote** | ⬜ Todo | "3 für 2", Pakete |

| **Flash Sales** | ⬜ Todo | Countdown-Timer auf der Seite |

| **Automatische E-Mails** | ⬜ Todo | Bei neuen Aktionen an Subscriber |

| Newsletter verwalten | ⬜ Todo | Subscriber-Liste, Segmente |

| E-Mail Kampagnen | ⬜ Todo | Templates, Versand, Tracking |

| **Abandoned Cart** | ⬜ Todo | Erinnerung bei Warenkorbabbruch |

  

### Phase 6: Erweiterungen

> Nice-to-have Features

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| Accessoires Shop | ⬜ Todo | Gläser, Kühler, Dekanter |

| Wein-Abo | ⬜ Todo | Monatliche Lieferung (Stripe Sub) |

| Bewertungen | ⬜ Todo | Sterne + Kommentare |

| Blog | ⬜ Todo | News, Rezepte, Ernte |

| Mehrsprachigkeit | ⬜ Todo | DE + EN |

| B2B Portal | ⬜ Todo | Gastronomie-Preise |

| Food Pairing | ⬜ Todo | Empfehlungen zu Speisen |

| Geschmacks-Quiz | ⬜ Todo | "Finde deinen Wein" |

  

### Technische Features

  

| Feature | Status | Beschreibung |

|---------|--------|--------------|

| Vector Search | ⬜ Todo | Fuzzy Matching für Weinnamen (pgvector) |

| Semantische Suche | ⬜ Todo | Suche in Beschreibungen |

| "Ähnliche Weine" | ⬜ Todo | Empfehlungen via Vectors |

| AI Sommelier | ⬜ Todo | Chat-basierte Beratung |

| 3D Weingut Tour | ⬜ Todo | Three.js + Drohnen-Video |

| Picknick Map Experience | ⬜ Todo | Mapbox + Pannellum (siehe docs/) |

  

---

  

## Datenmodell

  

### Core Tables

  

```sql

-- Supabase Auth handles: users, sessions, etc.

  

-- Zusätzliche User-Daten

profiles (

id UUID PRIMARY KEY REFERENCES auth.users,

full_name TEXT,

phone TEXT,

newsletter_subscribed BOOLEAN DEFAULT false,

created_at TIMESTAMPTZ DEFAULT now()

)

  

addresses (

id UUID PRIMARY KEY,

user_id UUID REFERENCES auth.users,

type TEXT CHECK (type IN ('shipping', 'billing')),

street TEXT,

city TEXT,

zip TEXT,

country TEXT DEFAULT 'AT',

is_default BOOLEAN DEFAULT false

)

  

-- Produkte (auch in DB für dynamische Preise/Stock)

products (

id UUID PRIMARY KEY,

slug TEXT UNIQUE,

name TEXT,

category TEXT,

price DECIMAL(10,2),

compare_at_price DECIMAL(10,2), -- Für "War: €X"

stock INTEGER DEFAULT 0,

description TEXT,

image_url TEXT,

gallery JSONB, -- Array of image URLs

metadata JSONB, -- year, grape, region, alcohol, etc.

is_active BOOLEAN DEFAULT true,

created_at TIMESTAMPTZ DEFAULT now()

)

  

orders (

id UUID PRIMARY KEY,

user_id UUID REFERENCES auth.users, -- NULL für Gäste

guest_email TEXT,

status TEXT DEFAULT 'pending',

subtotal DECIMAL(10,2),

discount_amount DECIMAL(10,2) DEFAULT 0,

shipping_cost DECIMAL(10,2),

total DECIMAL(10,2),

shipping_address JSONB,

billing_address JSONB,

stripe_payment_intent_id TEXT,

coupon_code TEXT,

notes TEXT,

created_at TIMESTAMPTZ DEFAULT now()

)

  

order_items (

id UUID PRIMARY KEY,

order_id UUID REFERENCES orders ON DELETE CASCADE,

product_id UUID REFERENCES products,

product_name TEXT, -- Snapshot

quantity INTEGER,

unit_price DECIMAL(10,2),

custom_label_url TEXT -- Für personalisierte Etiketten

)

  

bookings (

id UUID PRIMARY KEY,

user_id UUID REFERENCES auth.users,

experience_type TEXT, -- 'tasting', 'hiking', 'picnic', 'vineyard_rental'

date DATE,

time TIME,

guests INTEGER,

spot_id TEXT, -- Für Picknick

status TEXT DEFAULT 'pending',

total DECIMAL(10,2),

notes TEXT,

created_at TIMESTAMPTZ DEFAULT now()

)

  

wishlists (

id UUID PRIMARY KEY,

user_id UUID REFERENCES auth.users,

product_id UUID REFERENCES products,

added_at TIMESTAMPTZ DEFAULT now(),

UNIQUE(user_id, product_id)

)

  

reviews (

id UUID PRIMARY KEY,

product_id UUID REFERENCES products,

user_id UUID REFERENCES auth.users,

rating INTEGER CHECK (rating >= 1 AND rating <= 5),

title TEXT,

content TEXT,

verified_purchase BOOLEAN DEFAULT false,

created_at TIMESTAMPTZ DEFAULT now()

)

```

  

### Marketing & Promotions Tables

  

```sql

-- Rabatt-Codes / Gutscheine

coupons (

id UUID PRIMARY KEY,

code TEXT UNIQUE,

type TEXT CHECK (type IN ('percent', 'fixed', 'free_shipping')),

value DECIMAL(10,2), -- 10 = 10% oder €10

min_order_amount DECIMAL(10,2),

max_uses INTEGER,

used_count INTEGER DEFAULT 0,

valid_from TIMESTAMPTZ,

valid_until TIMESTAMPTZ,

is_active BOOLEAN DEFAULT true,

created_at TIMESTAMPTZ DEFAULT now()

)

  

-- Zeitlich begrenzte Aktionen

promotions (

id UUID PRIMARY KEY,

name TEXT,

description TEXT,

type TEXT, -- 'sale', 'bundle', 'flash_sale'

discount_percent INTEGER,

product_ids UUID[], -- Welche Produkte betroffen

category TEXT, -- Oder ganze Kategorie

starts_at TIMESTAMPTZ,

ends_at TIMESTAMPTZ,

banner_image TEXT,

is_active BOOLEAN DEFAULT true,

created_at TIMESTAMPTZ DEFAULT now()

)

  

-- Newsletter Subscribers

newsletter_subscribers (

id UUID PRIMARY KEY,

email TEXT UNIQUE,

user_id UUID REFERENCES auth.users, -- NULL wenn nicht registriert

status TEXT DEFAULT 'active', -- 'active', 'unsubscribed'

source TEXT, -- 'checkout', 'footer', 'popup'

subscribed_at TIMESTAMPTZ DEFAULT now(),

unsubscribed_at TIMESTAMPTZ

)

  

-- E-Mail Kampagnen

email_campaigns (

id UUID PRIMARY KEY,

name TEXT,

subject TEXT,

content TEXT, -- HTML oder Template-ID

type TEXT, -- 'promotion', 'newsletter', 'abandoned_cart'

promotion_id UUID REFERENCES promotions,

status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'

scheduled_for TIMESTAMPTZ,

sent_at TIMESTAMPTZ,

recipient_count INTEGER,

open_count INTEGER DEFAULT 0,

click_count INTEGER DEFAULT 0,

created_at TIMESTAMPTZ DEFAULT now()

)

  

-- Abandoned Carts (für E-Mail Reminder)

abandoned_carts (

id UUID PRIMARY KEY,

user_id UUID REFERENCES auth.users,

email TEXT, -- Falls Gast E-Mail eingegeben hat

cart_data JSONB, -- Snapshot des Warenkorbs

reminder_sent BOOLEAN DEFAULT false,

reminder_sent_at TIMESTAMPTZ,

recovered BOOLEAN DEFAULT false,

created_at TIMESTAMPTZ DEFAULT now()

)

```

  

### Vector Search Tables

  

```sql

-- pgvector Extension

CREATE EXTENSION IF NOT EXISTS vector;

  

wine_embeddings (

id UUID PRIMARY KEY,

product_id UUID REFERENCES products ON DELETE CASCADE,

name_embedding vector(1536), -- OpenAI text-embedding-3-small

description_embedding vector(1536),

taste_profile_embedding vector(1536),

updated_at TIMESTAMPTZ DEFAULT now()

)

  

-- Index für schnelle Suche

CREATE INDEX ON wine_embeddings

USING ivfflat (name_embedding vector_cosine_ops)

WITH (lists = 100);

```

  

---

  

## E-Mail Automation

  

### Automatische E-Mails

  

| Trigger | E-Mail | Timing |

|---------|--------|--------|

| Neue Bestellung | Bestellbestätigung | Sofort |

| Bestellung versendet | Versandbestätigung + Tracking | Sofort |

| Neue Buchung | Buchungsbestätigung | Sofort |

| Buchung morgen | Erinnerung | 24h vorher |

| Warenkorbabbruch | Reminder | Nach 1h + 24h |

| Neue Aktion erstellt | Promo an Subscriber | Geplant |

| Geburtstag (optional) | Gutschein | Am Tag |

  

### E-Mail Flow: Neue Aktion

  

```

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐

│ Admin erstellt │ │ System prüft │ │ Resend sendet │

│ neue Aktion │ ──► │ Subscriber │ ──► │ E-Mail an alle │

│ im CMS │ │ mit Opt-in │ │ │

└─────────────────┘ └─────────────────┘ └─────────────────┘

│ │

▼ ▼

┌─────────────────┐ ┌─────────────────┐

│ Option: │ │ Tracking: │

│ • Sofort │ │ • Opens │

│ • Geplant │ │ • Clicks │

│ • Entwurf │ │ • Conversions │

└─────────────────┘ └─────────────────┘

```

  

### E-Mail Templates (React Email + Resend)

  

```

src/

└── lib/

└── email/

├── templates/

│ ├── OrderConfirmation.tsx

│ ├── ShippingNotification.tsx

│ ├── BookingConfirmation.tsx

│ ├── BookingReminder.tsx

│ ├── AbandonedCart.tsx

│ ├── PromotionAnnouncement.tsx

│ ├── Newsletter.tsx

│ └── WelcomeEmail.tsx

├── send.ts # Resend API Wrapper

└── automation.ts # Trigger-Logik

```

  

---

  

## Admin Panel Struktur

  

```

/admin

├── /dashboard # Übersicht, KPIs, Quick Actions

├── /products

│ ├── / # Liste aller Produkte

│ ├── /new # Neues Produkt

│ └── /[id] # Produkt bearbeiten

├── /orders

│ ├── / # Alle Bestellungen

│ └── /[id] # Bestellung Details

├── /bookings

│ ├── / # Kalender + Liste

│ └── /[id] # Buchung Details

├── /customers

│ ├── / # Kundenliste

│ └── /[id] # Kunde Details

├── /marketing

│ ├── /promotions # Aktionen verwalten

│ ├── /coupons # Rabatt-Codes

│ ├── /newsletter # Subscriber + Kampagnen

│ └── /emails # E-Mail Templates

└── /settings

├── /shop # Versand, Steuern, etc.

└── /users # Admin-User verwalten

```

  

---

  

## Produktdaten-Strategie

  

### Hybrid: DB + Static Build

  

```

┌────────────────────────────────────────────────────────────────┐

│ ADMIN PANEL │

│ │ │

│ Produkt erstellen/bearbeiten │

│ │ │

│ ▼ │

│ ┌─────────────────┐ │

│ │ Supabase │ │

│ │ PostgreSQL │ │

│ └─────────────────┘ │

│ │ │ │

│ ┌─────────┘ └─────────┐ │

│ ▼ ▼ │

│ ┌─────────────┐ ┌─────────────┐ │

│ │ Webhook │ │ Runtime │ │

│ │ Vercel │ │ Queries │ │

│ └─────────────┘ └─────────────┘ │

│ │ │ │

│ ▼ ▼ │

│ ┌─────────────┐ ┌─────────────┐ │

│ │ Rebuild │ │ Dynamisch: │ │

│ │ Statische │ │ • Stock │ │

│ │ Seiten │ │ • Preise │ │

│ │ (SEO) │ │ • Aktionen │ │

│ └─────────────┘ └─────────────┘ │

└────────────────────────────────────────────────────────────────┘

```

  

**Statisch (Build-Zeit):**

- Produktseiten HTML

- SEO Meta Tags

- Bilder optimiert

  

**Dynamisch (Runtime):**

- Aktueller Preis (Aktionen!)

- Lagerbestand

- Bewertungen

- Aktive Promotions

  

---

  

## Aktueller Stand (Februar 2025)

  

### Erledigt ✅

  

**Grundstruktur:**

- Astro 5 + React 19 + Tailwind v4 + Framer Motion

- Design System (Farben, Fonts, Animationen)

- Dark/Light Mode

- Responsive Layouts

  

**Seiten (21 Seiten):**

- Homepage mit Hero, Features, WineShowcase

- Shop mit Produktgrid und Filtern

- 8 Produktdetailseiten (dynamisch)

- 5 Erlebnis-Seiten

- Weingut, Kontakt, Impressum, Datenschutz, AGB

  

**Funktionalität:**

- Warenkorb (localStorage, Add/Remove, Mengen)

- Beispiel-Produktdaten

  

**Dokumentation:**

- PROJECT.md (dieses Dokument)

- Picknick Map Experience Spec (docs/)

  

### Entschieden ✅

  

- [x] **Datenbank**: Supabase (PostgreSQL)

- [x] **Auth**: Supabase Auth

- [x] **Vector Search**: pgvector in Supabase

- [x] **Hosting**: Vercel

- [x] **E-Mail**: Resend

- [x] **Payments**: Stripe

- [x] **Storage**: Supabase Storage + Cloudflare R2 (große Files)

- [x] **CMS**: Custom Admin Panel

  

### Als Nächstes 📋

  

1. **Supabase Setup** - Projekt erstellen, Schema, RLS Policies

2. **Auth Integration** - Login/Register mit Supabase

3. **Checkout Flow** - Stripe Integration

4. **Admin Panel Basics** - Produkte CRUD

5. **E-Mail Setup** - Resend + Templates

  

---

  

## Projektstruktur (Ziel)

  

```

ExamleShop/

├── public/

│ ├── fonts/

│ └── images/

├── src/

│ ├── components/

│ │ ├── ui/ # Basis-Komponenten (Button, Input, Card)

│ │ ├── shop/ # Shop-spezifisch (ProductCard, Cart)

│ │ ├── booking/ # Buchungs-Komponenten

│ │ ├── account/ # Account-Bereich

│ │ ├── admin/ # Admin Panel Komponenten

│ │ └── layout/ # Header, Footer, Navigation

│ ├── lib/

│ │ ├── supabase/ # Client, Server Client, Types

│ │ ├── stripe/ # Stripe-Integration

│ │ ├── email/ # Resend + Templates

│ │ └── vectors/ # Embedding-Logik

│ ├── pages/

│ │ ├── api/ # API Routes

│ │ ├── admin/ # Admin Panel Seiten

│ │ ├── account/ # Account Seiten

│ │ ├── shop/ # Shop Seiten

│ │ ├── erlebnisse/ # Erlebnis Seiten

│ │ └── checkout/ # Checkout Flow

│ ├── stores/ # Nanostores

│ ├── styles/ # Global CSS

│ └── types/ # TypeScript Types

├── supabase/

│ ├── migrations/ # SQL Migrations

│ └── seed.sql # Test-Daten

├── docs/ # Feature-Dokumentationen

├── PROJECT.md # ← Du bist hier

├── TODO.md # Aktuelle Tasks

└── Design.md # Design-Dokumentation

```

  

---

  

## Referenzen & Links

  

### Dokumentation

- [Astro Docs](https://docs.astro.build)

- [Supabase Docs](https://supabase.com/docs)

- [Supabase Auth](https://supabase.com/docs/guides/auth)

- [pgvector](https://github.com/pgvector/pgvector)

- [Stripe Docs](https://stripe.com/docs)

- [Resend Docs](https://resend.com/docs)

- [React Email](https://react.email)

  

### Inspiration

- Stripe.com (UI/UX)

- Vercel.com (Design)

- Apple Store (Premium Feel)

- Vivino (Wein-E-Commerce)

  

---

  

*Zuletzt aktualisiert: Februar 2025*