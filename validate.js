#!/usr/bin/env node

/**
 * JSON Validation Script for ares-api
 *
 * Usage: node validate.js
 *
 * Validates all JSON files in the data/ directory for:
 * - Valid JSON syntax
 * - Required schema properties
 * - Data consistency
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const CHUNKS = [
  'chunk-1965-1979.json',
  'chunk-1980-1999.json',
  'chunk-2000-2019.json',
  'chunk-2020-2033.json',
  'search-index.json'
];

const REQUIRED_WORK_FIELDS = [
  'id', 'year', 'name', 'type', 'director', 'coac', 'awards', 'lyrics', 'music'
];

const REQUIRED_SEARCH_FIELDS = ['id', 'tokens'];

let validationPassed = true;

function validate() {
  console.log('🔍 Starting JSON validation for ares-api...\n');

  for (const chunk of CHUNKS) {
    const filePath = path.join(DATA_DIR, chunk);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${chunk}`);
      validationPassed = false;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      if (chunk === 'search-index.json') {
        validateSearchIndex(data, chunk);
      } else {
        validateChunk(data, chunk);
      }

      console.log(`✅ ${chunk} is valid\n`);
    } catch (error) {
      console.error(`❌ Error validating ${chunk}:`);
      console.error(`   ${error.message}\n`);
      validationPassed = false;
    }
  }

  if (validationPassed) {
    console.log('✨ All validations passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some validations failed.');
    process.exit(1);
  }
}

function validateChunk(data, filename) {
  if (!Array.isArray(data)) {
    throw new Error('Root must be an array');
  }

  data.forEach((work, index) => {
    REQUIRED_WORK_FIELDS.forEach(field => {
      if (!(field in work)) {
        throw new Error(`Work at index ${index} missing required field: ${field}`);
      }
    });

    if (typeof work.year !== 'number' || work.year < 1965 || work.year > 2033) {
      throw new Error(`Work at index ${index} has invalid year: ${work.year}`);
    }

    if (typeof work.coac !== 'boolean') {
      throw new Error(`Work at index ${index} coac field must be boolean`);
    }

    if (!Array.isArray(work.sources)) {
      throw new Error(`Work at index ${index} sources must be an array`);
    }
  });
}

function validateSearchIndex(data, filename) {
  if (!Array.isArray(data)) {
    throw new Error('Root must be an array');
  }

  data.forEach((entry, index) => {
    REQUIRED_SEARCH_FIELDS.forEach(field => {
      if (!(field in entry)) {
        throw new Error(`Entry at index ${index} missing required field: ${field}`);
      }
    });

    if (typeof entry.tokens !== 'string' || entry.tokens.trim() === '') {
      throw new Error(`Entry at index ${index} has invalid tokens`);
    }
  });
}

validate();
