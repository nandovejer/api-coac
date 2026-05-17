# Contributing to ares-api

Thank you for your interest in contributing to **ares-api**! This document provides guidelines for adding data, fixing issues, and improving the project.

---

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/ares-api.git
   cd ares-api
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Adding New Works

### Step 1: Choose the Correct Era Chunk

- Works from **1965–1979** → `data/chunk-1965-1979.json`
- Works from **1980–1999** → `data/chunk-1980-1999.json`
- Works from **2000–2019** → `data/chunk-2000-2019.json`
- Works from **2020–2033** → `data/chunk-2020-2033.json`

### Step 2: Create a Work Object

Follow this schema:

```json
{
  "id": "YYYY-slug",
  "year": 1998,
  "name": "Work Name",
  "type": "comparsa",
  "director": "Director Name",
  "coac": true,
  "awards": {
    "coac_rank": 1,
    "other": ["Award Name"]
  },
  "lyrics": {
    "presentacion": "Lyricist Name",
    "pasodoble": "Lyricist Name",
    "cuple": "Lyricist Name",
    "estribillo": "Lyricist Name",
    "popurri": "Lyricist Name"
  },
  "music": {
    "presentacion": "Composer Name",
    "pasodoble": "Composer Name",
    "cuple": "Composer Name",
    "estribillo": "Composer Name",
    "popurri": "Composer Name"
  },
  "sources": [
    {
      "name": "Source Title",
      "url": "https://example.com"
    }
  ]
}
```

### Step 3: Add to the Appropriate Chunk

Append your work to the JSON array in the correct era file.

### Step 4: Update the Search Index

Add an entry to `data/search-index.json`:

```json
{
  "id": "YYYY-slug",
  "tokens": "year name genre director awards keywords"
}
```

**Token Tips:**

- Include year, work name, genre, director, any awards
- Use lowercase
- Separate terms with spaces
- Keep tokens under 200 characters

### Step 5: Validate Your Changes

```bash
pnpm install
pnpm validate
```

All JSON files must pass validation before submitting a PR.

---

## Reporting Issues

Found a problem? Please open an issue:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** clearly with examples
3. **Include reproduction steps** if applicable
4. **Provide context** (which file, which work, etc.)

### Issue Templates

**Bug Report:**

```markdown
## Description

Brief description of the issue

## Reproduction Steps

1. Step one
2. Step two

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Files Affected

- `data/chunk-*.json`
- etc.
```

**Data Enhancement:**

```markdown
## Enhancement

Add new works from [year range]

## Works to Add

- Work A (year)
- Work B (year)

## Sources

[Links to documentation]
```

---

## Pull Request Process

1. **Keep commits atomic** — one logical change per commit
2. **Write clear commit messages**:

   ```
   Add 2026 works to chunk-2020-2033.json

   - La Nueva Era (comparsa, COAC winner)
   - El Futuro Es Ahora (chirigota)

   Updates search-index.json with new entries.
   ```

3. **Run validation** before pushing:

   ```bash
   pnpm validate
   ```

4. **Describe your changes** in the PR description:

   ```markdown
   ## Changes

   - Added 5 new works from 2026
   - Updated search index with 5 new entries

   ## Validation

   All JSON files validated with `pnpm validate`

   ## Files Changed

   - `data/chunk-2020-2033.json`
   - `data/search-index.json`
   ```

5. **Wait for review** — maintainers will check for:
   - Valid JSON syntax
   - Correct schema compliance
   - Accurate data
   - Proper formatting

---

## Code Style & Standards

### JSON Formatting

- **Indentation:** 2 spaces
- **Keys:** Double quotes, camelCase (not snake_case)
- **Trailing commas:** None
- **Line endings:** LF (Unix)

**Good:**

```json
{
  "id": "1998-los-piratas",
  "year": 1998
}
```

**Bad:**

```json
{
  "id": "1998_los_piratas",
  "year": 1998
}
```

### Field Requirements

- **id:** Format must be `YYYY-slug` (lowercase, hyphens only)
- **year:** Must be 1965–2033
- **coac:** Must be `true` or `false` (boolean, not string)
- **awards.coac_rank:** Only set if `coac` is `true`
- **sources:** Can be empty `[]` if no references available

---

## Community Guidelines

- Be respectful and inclusive
- Assume good intentions
- Provide constructive feedback
- No spam, advertising, or self-promotion
- Respect intellectual property

---

## Questions?

- **Email:** Open an issue on GitHub
- **Discussions:** Use GitHub Discussions if available
- **Documentation:** Check [README.md](README.md) and [CLAUDE.md](CLAUDE.md)

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Thank you for contributing to ares-api!** 🎉
