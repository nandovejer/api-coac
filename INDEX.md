# Project File Index

Complete structure and purpose of all files in the **ares-api** repository.

---

## 📋 Documentation Files

| File | Purpose |
|------|---------|
| **[README.md](README.md)** | Main API documentation with endpoints, usage examples, and features |
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute getting started guide for new users |
| **[EXAMPLES.md](EXAMPLES.md)** | Code examples for JavaScript, React, Vue, TypeScript, Python, and cURL |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Guidelines for contributing new works and improvements |
| **[CLAUDE.md](CLAUDE.md)** | Detailed project architecture and development context |
| **[LICENSE](LICENSE)** | MIT Open Source License |
| **[INDEX.md](INDEX.md)** | This file — directory of all project files |

---

## 📦 Data Files

All JSON files are located in the `data/` directory:

### Data Chunks (By Decade)

| File | Purpose | Years | Max Size |
|------|---------|-------|----------|
| **[data/chunk-1980-1999.json](data/chunk-1980-1999.json)** | Works from decade 1 | 1980–1999 | 500 KB |
| **[data/chunk-2000-2019.json](data/chunk-2000-2019.json)** | Works from decade 2 | 2000–2019 | 500 KB |
| **[data/chunk-2020-2029.json](data/chunk-2020-2029.json)** | Works from decade 3 | 2020–2029 | 500 KB |

### Global Search Index

| File | Purpose |
|------|---------|
| **[data/search-index.json](data/search-index.json)** | Lightweight tokenized index for typeahead/search functionality |

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| **[package.json](package.json)** | Node.js project metadata and scripts (`pnpm validate`) |
| **[.gitignore](.gitignore)** | Files to exclude from Git version control |
| **[.gitattributes](.gitattributes)** | Line ending normalization across platforms |
| **[_config.yml](_config.yml)** | GitHub Pages configuration (optional Jekyll settings) |

---

## 🔧 Utilities & Scripts

| File | Purpose |
|------|---------|
| **[validate.js](validate.js)** | Node.js script to validate all JSON files for syntax and schema compliance |

---

## 🤖 CI/CD Configuration

| File | Purpose |
|------|---------|
| **[.github/workflows/validate.yml](.github/workflows/validate.yml)** | GitHub Actions workflow for automated JSON validation on push/PR |

---

## Directory Tree

```
ares-api/
│
├── 📄 README.md              ← Start here for API docs
├── 📄 QUICKSTART.md          ← 5-min getting started guide
├── 📄 EXAMPLES.md            ← Code examples (JS, React, Python, etc.)
├── 📄 CONTRIBUTING.md        ← Contribution guidelines
├── 📄 CLAUDE.md              ← Architecture & project context
├── 📄 INDEX.md               ← This file
├── 📄 LICENSE                ← MIT License
│
├── 📄 package.json           ← Node.js config
├── 📄 validate.js            ← JSON validation script
├── 📄 .gitignore             ← Git ignore rules
├── 📄 .gitattributes         ← Line ending config
├── 📄 _config.yml            ← GitHub Pages config
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 validate.yml   ← CI/CD pipeline
│
└── 📁 data/                  ← All data files
    ├── 📄 search-index.json
    ├── 📄 chunk-1980-1999.json
    ├── 📄 chunk-2000-2019.json
    └── 📄 chunk-2020-2029.json
```

---

## 📚 How to Use This Index

### I want to...

**...understand what this project is**
→ Read [README.md](README.md)

**...get started quickly**
→ Read [QUICKSTART.md](QUICKSTART.md)

**...see code examples**
→ Read [EXAMPLES.md](EXAMPLES.md)

**...contribute new data**
→ Read [CONTRIBUTING.md](CONTRIBUTING.md)

**...understand the architecture**
→ Read [CLAUDE.md](CLAUDE.md)

**...validate my changes**
→ Run `node validate.js` or `npm run validate`

**...check the license**
→ Read [LICENSE](LICENSE)

**...understand file organization**
→ You're already here! (This file)

---

## File Size Guide

| Category | Typical Size | Purpose |
|----------|--------------|---------|
| Data chunks | 50–400 KB | Works database by decade |
| Search index | 5–50 KB | Fast typeahead lookups |
| Documentation | 10–50 KB per file | Guides and references |
| Configuration | <5 KB | Project metadata |
| Validation script | <10 KB | Development tool |

---

## File Modification Frequency

| Frequency | File(s) |
|-----------|---------|
| **Often** (user contributions) | `data/chunk-*.json`, `data/search-index.json` |
| **Rarely** (structure changes) | `README.md`, `CONTRIBUTING.md`, schema definitions |
| **Never** (immutable) | `LICENSE` |
| **On release** | `package.json` (version bump) |

---

## For Consumers

**If you're just using the API, you only need:**
- [README.md](README.md) — How to call the endpoints
- [EXAMPLES.md](EXAMPLES.md) — Code snippets for your framework

**If you're contributing data, also read:**
- [CONTRIBUTING.md](CONTRIBUTING.md) — Guidelines for new works
- [CLAUDE.md](CLAUDE.md) — Data schema and structure

---

## For Maintainers

**Regular tasks:**
1. Validate new PRs with `npm run validate`
2. Ensure JSON schema compliance
3. Update version in `package.json` on releases
4. Monitor GitHub Actions CI/CD logs

**Common edits:**
- Add works → Edit `data/chunk-*.json` files
- Update search → Edit `data/search-index.json`
- Fix docs → Edit `README.md`, `EXAMPLES.md`, etc.
- Change API structure → Update `CLAUDE.md` first, then all data schemas

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0.0** | 2026-05-16 | Initial release with three data chunks and complete documentation |

---

**Last Updated:** 2026-05-16  
**Maintainer:** Antonio Martínez Ares Archive Contributors
