# api-coac: Project Documentation

## Overview

**api-coac** is a zero-dependency, static JSON API dedicated to serving structured data about the works and discography of authors from the **COAC** (Concurso Oficial de Agrupaciones Carnavalescas) of Cádiz.

The system is built as a **Jamstack application** hosted on GitHub Pages, serving data entirely through static JSON files with no databases, server runtimes, or external dependencies.

---

## Project Context

### Purpose
Provide a structured, searchable, and globally accessible API for researchers, carnival enthusiasts, and digital platforms to access comprehensive information about COAC compositions, including:
- Work metadata (year, title, type, director)
- Lyrical and musical credits
- Award history and COAC rankings
- Historical sources and documentation

### Scope
- **Authors:** Multiple COAC authors, each with their own data subfolder
- **Current authors:** Antonio Martínez Ares (1965–2033)
- **Consumers:** Web frontends, mobile apps, academic projects, carnival databases
- **Distribution:** GitHub Pages with native CORS enabled
- **Licensing:** MIT Open Source

---

## Architecture

### Stack
```
GitHub Pages (CDN)
    ↓
Static JSON Files (per-author data chunks)
    ↓
Consumer Apps (React, Vue, vanilla JS)
```

### Directory Structure

```
api-coac/
├── index.html                     # Portal: lists all authors
├── CLAUDE.md                      # This file
├── README.md                      # Public API documentation
│
├── data/
│   ├── authors.json               # Author registry
│   ├── search-index.json          # Global search index (all authors)
│   └── <author-id>/               # Per-author data folder
│       ├── chunk-1965-1979.json
│       ├── chunk-1980-1999.json
│       ├── chunk-2000-2019.json
│       └── chunk-2020-2033.json
│
├── authors/
│   └── <author-id>/
│       └── index.html             # Per-author timeline page
│
├── landing/
│   ├── css/styles.css             # Shared styles (portal + author pages)
│   └── js/timeline.js             # carnival-timeline Web Component
│
└── agents/
    └── dev-webcomponent/          # Agent for building Web Components
```

### Author Registry (`data/authors.json`)

```json
[
  {
    "id": "martinez-ares",
    "name": "Antonio Martínez Ares",
    "role": "Letrista y compositor",
    "bio": "...",
    "active_since": 1984,
    "page": "authors/martinez-ares/",
    "data_path": "data/martinez-ares/",
    "chunks": ["chunk-1965-1979.json", "chunk-1980-1999.json", "chunk-2000-2019.json", "chunk-2020-2033.json"]
  }
]
```

### Work Object Schema

```typescript
{
  id: string              // Unique identifier (YYYY-slug)
  year: number            // Publication/premiere year
  name: string            // Official title
  type: string            // Genre (comparsa, chirigota, coro, cuarteto...)
  director: string | null // Primary director
  coac: boolean           // Competed in COAC?
  awards: {
    coac_rank: number | null
    other: string[]
  }
  lyrics: {
    [section]: string     // Lyricist names per section
  }
  music: {
    [section]: string     // Composer names per section
  }
  sources: {
    name: string
    url: string
  }[]
}
```

---

## Adding a New Author

1. **Create data folder:** `data/<author-id>/`
2. **Add chunk files** for the relevant eras
3. **Register in** `data/authors.json`
4. **Create author page:** `authors/<author-id>/index.html`
   (copy from `authors/martinez-ares/index.html` and update hero text + `data-api` path)
5. **Add card** to `index.html` authors grid
6. **Update search index** if applicable

---

## Adding New Works (Existing Author)

1. **Determine the correct chunk** based on the year
2. **Create a unique ID** in lowercase: `YYYY-slug`
3. **Add the work object** to the appropriate chunk array
4. **Update search-index.json** with tokenized search terms
5. **Validate JSON** before committing

**Example:**
```json
{
  "id": "2026-la-nueva-era",
  "year": 2026,
  "name": "La Nueva Era",
  "type": "comparsa",
  "director": "Ángel Subiela",
  "coac": true,
  "awards": { "coac_rank": 1, "other": ["Aguja de Oro"] },
  "lyrics": { "pasodoble": "Antonio Martínez Ares" },
  "music":  { "pasodoble": "Antonio Martínez Ares" },
  "sources": []
}
```

### JSON Validation

```bash
node -e "JSON.parse(require('fs').readFileSync('./data/martinez-ares/chunk-1980-1999.json'))"
```

---

## Consumer Integration

### Base URL
```
https://nandovejer.github.io/ares-api/data/
```

### Quick Start

```javascript
const BASE = 'https://nandovejer.github.io/ares-api/data/';

// List all authors
const authors = await fetch(BASE + 'authors.json').then(r => r.json());

// Fetch works for a specific author + era
const works = await fetch(BASE + 'martinez-ares/chunk-1980-1999.json').then(r => r.json());

// Global search
const index = await fetch(BASE + 'search-index.json').then(r => r.json());
const results = index.filter(item =>
  item.tokens.toLowerCase().includes(query.toLowerCase())
);
```

---

## Performance Targets

- **Chunk size:** Max 500 KB uncompressed per file
- **Network latency:** Sub-second delivery over 3G
- **Compression:** Brotli + HTTP/2 (automatic via GitHub Pages)

---

**Last Updated:** 2026-05-16
**Maintainer:** Fernando Muñoz Muñoz
