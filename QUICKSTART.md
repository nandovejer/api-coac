# Quick Start Guide

Get up and running with **ares-api** in 5 minutes.

---

## 1. Setup (Optional - Only if Contributing)

If you're just consuming the API, skip to **Usage**. If you want to contribute:

```bash
# Clone your fork
git clone https://github.com/<your-username>/ares-api.git
cd ares-api

# Install Node.js dependencies (optional, for validation)
pnpm install

# Validate JSON
pnpm validate
```

---

## 2. Find Your GitHub Pages URL

Once deployed to GitHub Pages, your API will be at:

```
https://nandovejer.github.io/ares-api/data/
```

> **Replace `nandovejer` with your actual GitHub username throughout all examples.**

---

## 3. Fetch Data

### Get all works from an era

```javascript
const year = 1998;
let chunk = '1980-1999';
if (year >= 1980 && year <= 1999) chunk = '1980-1999';
else if (year >= 2000 && year <= 2019) chunk = '2000-2019';
else if (year >= 2020) chunk = '2020-2033';
else if (year >= 1965) chunk = '1965-1979';

fetch(`https://nandovejer.github.io/ares-api/data/chunk-${chunk}.json`)
  .then(r => r.json())
  .then(works => console.log(works));
```

### Search for works

```javascript
fetch('https://nandovejer.github.io/ares-api/data/search-index.json')
  .then(r => r.json())
  .then(index => {
    const results = index.filter(item => 
      item.tokens.includes('piratas')
    );
    console.log(results);
  });
```

---

## 4. Understand the Data Structure

Each work contains:

```javascript
{
  "id": "1998-los-piratas",          // Unique identifier
  "year": 1998,                       // Year created
  "name": "Los Piratas",              // Work title
  "type": "comparsa",                 // Genre
  "director": "Ángel Subiela",        // Director
  "coac": true,                       // Competed in COAC?
  "awards": {
    "coac_rank": 1,                   // COAC ranking
    "other": ["Aguja de Oro"]         // Other awards
  },
  "lyrics": { /* credits */ },        // Lyricist names
  "music": { /* credits */ },         // Composer names
  "sources": [ /* references */ ]     // Documentation links
}
```

---

## 5. Next Steps

- **Read the full API docs:** See [README.md](README.md)
- **See code examples:** Check [EXAMPLES.md](EXAMPLES.md)
- **Want to contribute?** Read [CONTRIBUTING.md](CONTRIBUTING.md)
- **Need details?** Explore [CLAUDE.md](CLAUDE.md)

---

## Common Tasks

### Load works from year 2015

```javascript
fetch('https://nandovejer.github.io/ares-api/data/chunk-2000-2019.json')
  .then(r => r.json())
  .then(works => works.filter(w => w.year === 2015))
  .then(works => console.log(works));
```

### Load works from year 1975

```javascript
fetch('https://nandovejer.github.io/ares-api/data/chunk-1965-1979.json')
  .then(r => r.json())
  .then(works => works.filter(w => w.year === 1975))
  .then(works => console.log(works));
```

### Check if a work won COAC

```javascript
const work = { /* ... */ };
if (work.coac && work.awards.coac_rank === 1) {
  console.log(`${work.name} won COAC!`);
}
```

### Get all COAC winners from 2000-2019

```javascript
fetch('https://nandovejer.github.io/ares-api/data/chunk-2000-2019.json')
  .then(r => r.json())
  .then(works => works.filter(w => w.coac && w.awards.coac_rank === 1))
  .then(winners => console.log(winners));
```

### Search by director in 1980-1999

```javascript
fetch('https://nandovejer.github.io/ares-api/data/chunk-1980-1999.json')
  .then(r => r.json())
  .then(works => works.filter(w => w.director.includes('Subiela')))
  .then(works => console.log(works));
```

---

## No JavaScript? Use cURL

```bash
# Get all 1998 works
curl 'https://nandovejer.github.io/ares-api/data/chunk-1980-1999.json' | \
  jq '.[] | select(.year == 1998)'

# Get all 1970 works
curl 'https://nandovejer.github.io/ares-api/data/chunk-1965-1979.json' | \
  jq '.[] | select(.year == 1970)'

# Search for 'piratas'
curl 'https://nandovejer.github.io/ares-api/data/search-index.json' | \
  jq '.[] | select(.tokens | contains("piratas"))'
```

---

## Troubleshooting

### Getting CORS errors?
GitHub Pages automatically enables CORS for all static files. If you're getting errors:
- Verify the URL is correct
- Check browser console for the exact error
- Ensure you're using HTTPS, not HTTP

### JSON validation failing?
Run `npm run validate` to check for syntax errors:

```bash
npm install
npm run validate
```

### Want to contribute new works?
1. Open [CONTRIBUTING.md](CONTRIBUTING.md)
2. Add your work to the appropriate `data/chunk-*.json` file
3. Update `data/search-index.json`
4. Run `npm run validate`
5. Submit a PR

---

## Still have questions?

- **Full documentation:** [README.md](README.md)
- **Code examples:** [EXAMPLES.md](EXAMPLES.md)
- **Architecture details:** [CLAUDE.md](CLAUDE.md)
- **Contributing guide:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Project license:** [LICENSE](LICENSE)

---

**Happy coding! 🎉**
