# ares-api

A lightweight, zero-dependency static API for the complete discography and works of **Antonio Martínez Ares** – powered entirely by JSON and hosted on GitHub Pages.

## Overview

**ares-api** is a headless data provider serving structured information about the compositions, lyrical works, and historical context of Antonio Martínez Ares' career. The entire system runs without databases, server runtimes, or external dependencies.

- 📦 **Pure Static:** JSON files as the single source of truth
- 🌐 **CORS-Enabled:** Global access via GitHub Pages
- ⚡ **Zero Dependencies:** No servers, no build steps
- 📱 **Mobile-Friendly:** Sub-second load times over standard networks
- 📖 **MIT Licensed:** 100% Open Source

---

## API Endpoints

### Base URL
```
https://nandovejer.github.io/ares-api/data/
```

### Available Endpoints

#### 1. Search Index (Lightweight Typeahead)
```
GET /data/search-index.json
```
Returns a minimal lookup table for implementing fast autocomplete features without downloading full payloads.

**Response:**
```json
[
  {
    "id": "1998-los-piratas",
    "tokens": "1998 los piratas comparsa angel subiela aguja de oro"
  }
]
```

#### 2. Data Chunks (By Era)
```
GET /data/chunk-1965-1979.json
GET /data/chunk-1980-1999.json
GET /data/chunk-2000-2019.json
GET /data/chunk-2020-2033.json
```
Returns all works from a given era as an array of work objects.

**Response (Single Work):**
```json
{
  "id": "1998-los-piratas",
  "year": 1998,
  "name": "Los Piratas",
  "type": "comparsa",
  "director": "Ángel Subiela",
  "coac": true,
  "awards": {
    "coac_rank": 1,
    "other": ["Aguja de Oro"]
  },
  "lyrics": {
    "presentacion": "Antonio Martínez Ares",
    "pasodoble": "Antonio Martínez Ares",
    "cuple": "Antonio Martínez Ares",
    "estribillo": "Antonio Martínez Ares",
    "popurri": "Antonio Martínez Ares"
  },
  "music": {
    "presentacion": "Antonio Martínez Ares",
    "pasodoble": "Antonio Martínez Ares",
    "cuple": "Antonio Martínez Ares",
    "estribillo": "Antonio Martínez Ares",
    "popurri": "Antonio Martínez Ares"
  },
  "sources": [
    {
      "name": "Diario de Cádiz",
      "url": "https://www.diariodecadiz.es/carnaval-cadiz/los-piratas-martinez-ares-historia_0_123456.html"
    }
  ]
}
```

---

## Usage Examples

### Vanilla JavaScript (Fetch API)

#### Get all works from a specific decade
```javascript
const BASE_API = 'https://nandovejer.github.io/ares-api/data/';

async function getChunkByYear(year) {
  let start = 1980, end = 1999;
  
  if (year >= 2000 && year <= 2019) { start = 2000; end = 2019; }
  else if (year >= 2020) { start = 2020; end = 2029; }

  try {
    const response = await fetch(`${BASE_API}chunk-${start}-${end}.json`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from ares-api:', error);
    return [];
  }
}

// Usage
getChunkByYear(1998).then(data => {
  const work = data.find(item => item.id === '1998-los-piratas');
  console.log('Work:', work);
});
```

#### Implement typeahead search
```javascript
async function searchWorks(query) {
  try {
    const response = await fetch(`${BASE_API}search-index.json`);
    const index = await response.json();
    
    const lowerQuery = query.toLowerCase();
    return index.filter(item => 
      item.tokens.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

// Usage
searchWorks('piratas').then(results => {
  console.log('Results:', results);
});
```

### React Example
```jsx
import { useState, useEffect } from 'react';

function AresWorksViewer() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://nandovejer.github.io/ares-api/data/chunk-1998-2010.json')
      .then(res => res.json())
      .then(data => {
        setWorks(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {works.map(work => (
        <li key={work.id}>
          <h3>{work.name} ({work.year})</h3>
          <p>Type: {work.type}</p>
          {work.coac && <span className="badge">COAC Winner</span>}
        </li>
      ))}
    </ul>
  );
}

export default AresWorksViewer;
```

---

## Data Schema

### Work Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier (format: `YYYY-slug`) |
| `year` | number | ✓ | Publication/premiere year |
| `name` | string | ✓ | Official work title |
| `type` | string | ✓ | Genre (e.g., `comparsa`, `chirigota`, `murga`, `coro`) |
| `director` | string | ✓ | Primary director/arranger |
| `coac` | boolean | ✓ | Whether work competed in COAC |
| `awards` | object | ✓ | Award rankings and mentions |
| `awards.coac_rank` | number | – | COAC final ranking (1-based) |
| `awards.other` | array | – | Other awards/mentions |
| `lyrics` | object | ✓ | Lyricists by song section |
| `music` | object | ✓ | Composers by song section |
| `sources` | array | – | External references and documentation links |

---

## Performance & Optimization

### Data Chunking Strategy
Data is segmented by era to balance payload size and request overhead:
- **chunk-1965-1979.json:** ~400 KB max
- **chunk-1980-1999.json:** ~400 KB max
- **chunk-2000-2019.json:** ~400 KB max
- **chunk-2020-2033.json:** ~400 KB max

This ensures sub-second downloads even on 3G networks.

### Infrastructure Features
- ✅ **Brotli Compression:** Enabled automatically by GitHub Pages
- ✅ **HTTP/2 Multiplexing:** Fast concurrent requests
- ✅ **CDN Distribution:** Global edge caching
- ✅ **Zero Cold Starts:** Instant first response

---

## Development & Contributing

### JSON Validation
Ensure all JSON files are strictly valid:
```bash
node -e "JSON.parse(require('fs').readFileSync('./data/chunk-1980-1999.json'))"
```

### File Organization
```
├── README.md               # This file
├── data/
│   ├── search-index.json   # Global search index
│   ├── chunk-1965-1979.json# Era 1 data
│   ├── chunk-1980-1999.json# Era 2 data
│   ├── chunk-2000-2019.json# Era 3 data
│   └── chunk-2020-2033.json# Era 4 data
├── .gitignore              # Git ignore rules
└── LICENSE                 # MIT License
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/add-new-works`)
3. Update the relevant data chunks and search index
4. Validate JSON with above command
5. Submit a pull request

---

## Licensing

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for complete details.

All data represents public artistic works and historical records.

---

## Changelog

### v1.0.0 (2026-05-16)
- Initial release with three data chunks (1980–2029)
- Search index for typeahead functionality
- Complete API documentation and integration examples
- MIT Open Source license

---

## Support & Questions

For issues, feature requests, or questions:
- **GitHub Issues:** [Create an issue](../../issues)
- **Documentation:** See examples above or review the data schema

---

**Built with ❤️ for the complete works of Antonio Martínez Ares**
