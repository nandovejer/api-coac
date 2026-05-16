#!/usr/bin/env node

/**
 * JSON Validation Script for api-coac
 *
 * Usage: node validate.js
 *
 * Validates all JSON files in data/ for:
 * - Valid JSON syntax
 * - Required schema properties per author
 * - Data consistency
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

const REQUIRED_WORK_FIELDS   = ['id', 'year', 'name', 'type', 'director', 'coac', 'awards', 'lyrics', 'music'];
const REQUIRED_AUTHOR_FIELDS = ['id', 'name', 'role', 'active_since', 'page', 'data_path', 'chunks'];
const REQUIRED_SEARCH_FIELDS = ['id', 'tokens'];

let passed = true;

function fail(msg) {
  console.error(`  ❌ ${msg}`);
  passed = false;
}

function validateAuthorsRegistry(authors) {
  if (!Array.isArray(authors)) { fail('authors.json root must be an array'); return; }

  authors.forEach((author, i) => {
    REQUIRED_AUTHOR_FIELDS.forEach(field => {
      if (!(field in author)) fail(`authors[${i}] missing field: "${field}"`);
    });
  });
}

function validateChunk(data, label) {
  if (!Array.isArray(data)) { fail(`${label}: root must be an array`); return; }

  data.forEach((work, i) => {
    REQUIRED_WORK_FIELDS.forEach(field => {
      if (!(field in work)) fail(`${label}[${i}] missing field: "${field}"`);
    });

    if (typeof work.year !== 'number' || work.year < 1900 || work.year > 2099)
      fail(`${label}[${i}] invalid year: ${work.year}`);

    if (typeof work.coac !== 'boolean')
      fail(`${label}[${i}] "coac" must be boolean`);

    if (!Array.isArray(work.sources))
      fail(`${label}[${i}] "sources" must be an array`);
  });
}

function validateSearchIndex(data) {
  if (!Array.isArray(data)) { fail('search-index.json root must be an array'); return; }

  data.forEach((entry, i) => {
    REQUIRED_SEARCH_FIELDS.forEach(field => {
      if (!(field in entry)) fail(`search-index[${i}] missing field: "${field}"`);
    });

    if (typeof entry.tokens !== 'string' || entry.tokens.trim() === '')
      fail(`search-index[${i}] invalid tokens`);
  });
}

function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function validate() {
  console.log('🔍 api-coac — JSON validation\n');

  // 1. authors.json
  const authorsPath = path.join(DATA_DIR, 'authors.json');
  process.stdout.write('  authors.json … ');
  try {
    const authors = readJson(authorsPath);
    validateAuthorsRegistry(authors);
    console.log('✅');

    // 2. Each author's chunks
    for (const author of authors) {
      console.log(`\n  [${author.id}]`);

      for (const chunk of author.chunks) {
        const filePath = path.join(DATA_DIR, author.id, chunk);
        process.stdout.write(`    ${chunk} … `);

        if (!fs.existsSync(filePath)) {
          fail(`file not found: data/${author.id}/${chunk}`);
          continue;
        }

        try {
          const data = readJson(filePath);
          validateChunk(data, `${author.id}/${chunk}`);
          console.log('✅');
        } catch (err) {
          fail(err.message);
        }
      }
    }
  } catch (err) {
    fail(err.message);
  }

  // 3. Global search index
  console.log('\n  [global]');
  const searchPath = path.join(DATA_DIR, 'search-index.json');
  process.stdout.write('    search-index.json … ');
  if (!fs.existsSync(searchPath)) {
    fail('search-index.json not found');
  } else {
    try {
      const data = readJson(searchPath);
      validateSearchIndex(data);
      console.log('✅');
    } catch (err) {
      fail(err.message);
    }
  }

  console.log('');
  if (passed) {
    console.log('✨ All validations passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some validations failed.');
    process.exit(1);
  }
}

validate();
