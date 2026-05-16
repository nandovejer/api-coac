# ares-api Integration Examples

Complete code examples for consuming the **ares-api** from various frameworks and environments.

---

## Vanilla JavaScript

### Basic Fetch

```javascript
const BASE_API = 'https://nandovejer.github.io/ares-api/data/';

// Fetch works from a specific decade
async function getChunk(year) {
  let chunk = '1965-1979';
  if (year >= 1980 && year <= 1999) chunk = '1980-1999';
  else if (year >= 2000 && year <= 2019) chunk = '2000-2019';
  else if (year >= 2020) chunk = '2020-2033';

  const response = await fetch(`${BASE_API}chunk-${chunk}.json`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// Usage
getChunk(1998).then(works => {
  works.forEach(work => {
    console.log(`${work.year}: ${work.name} (${work.type})`);
  });
});
```

### Search Implementation

```javascript
class AresAPI {
  constructor(baseUrl = 'https://nandovejer.github.io/ares-api/data/') {
    this.baseUrl = baseUrl;
    this.searchIndex = null;
  }

  async init() {
    const response = await fetch(`${this.baseUrl}search-index.json`);
    this.searchIndex = await response.json();
  }

  search(query) {
    if (!this.searchIndex) throw new Error('API not initialized');
    
    const q = query.toLowerCase();
    return this.searchIndex
      .filter(item => item.tokens.toLowerCase().includes(q))
      .slice(0, 10); // Top 10 results
  }

  async getWork(id) {
    const year = parseInt(id.split('-')[0]);
    const chunk = await this.getChunk(year);
    return chunk.find(work => work.id === id);
  }

  async getChunk(year) {
    let decade = '1980-1999';
    if (year >= 2000 && year <= 2019) decade = '2000-2019';
    else if (year >= 2020) decade = '2020-2029';

    const response = await fetch(`${this.baseUrl}chunk-${decade}.json`);
    return response.json();
  }
}

// Usage
const ares = new AresAPI();
await ares.init();

const results = ares.search('piratas');
console.log(results); // [{id: '1998-los-piratas', tokens: '...'}]

const work = await ares.getWork('1998-los-piratas');
console.log(work); // Full work object
```

---

## React

### Hook-Based Component

```jsx
import { useState, useEffect } from 'react';

function useAresAPI(baseUrl = 'https://nandovejer.github.io/ares-api/data/') {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getChunk = async (year) => {
    setLoading(true);
    setError(null);
    
    try {
      let chunk = '1965-1979';
      if (year >= 1980 && year <= 1999) chunk = '1980-1999';
      else if (year >= 2000 && year <= 2019) chunk = '2000-2019';
      else if (year >= 2020) chunk = '2020-2033';

      const response = await fetch(`${baseUrl}chunk-${chunk}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setWorks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { works, loading, error, getChunk };
}

// Component using the hook
function WorksList() {
  const { works, loading, error, getChunk } = useAresAPI();

  useEffect(() => {
    getChunk(2000); // Load year 2000 on mount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {works.map(work => (
        <li key={work.id}>
          <h3>{work.name} ({work.year})</h3>
          <p>Type: {work.type}</p>
          <p>Director: {work.director}</p>
          {work.coac && <span className="badge">COAC #{work.awards.coac_rank}</span>}
        </li>
      ))}
    </ul>
  );
}

export default WorksList;
```

### Search Component

```jsx
import { useState, useEffect } from 'react';

function SearchWorks() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allWorks, setAllWorks] = useState([]);

  useEffect(() => {
    // Load all works on mount
    Promise.all([
      fetch('https://nandovejer.github.io/ares-api/data/chunk-1965-1979.json').then(r => r.json()),
      fetch('https://nandovejer.github.io/ares-api/data/chunk-1980-1999.json').then(r => r.json()),
      fetch('https://nandovejer.github.io/ares-api/data/chunk-2000-2019.json').then(r => r.json()),
      fetch('https://nandovejer.github.io/ares-api/data/chunk-2020-2033.json').then(r => r.json())
    ]).then(chunks => {
      const combined = chunks.flat();
      setAllWorks(combined);
    });
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allWorks.filter(work =>
      work.name.toLowerCase().includes(q) ||
      work.director.toLowerCase().includes(q) ||
      work.type.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [query, allWorks]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search works..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      
      <ul>
        {results.map(work => (
          <li key={work.id}>
            {work.name} ({work.year})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchWorks;
```

---

## Vue 3

### Composition API

```vue
<template>
  <div class="works-container">
    <input
      v-model="selectedYear"
      type="number"
      min="1980"
      max="2029"
      @change="loadWorks"
      placeholder="Enter year"
    />
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <ul v-else>
      <li v-for="work in works" :key="work.id">
        <h3>{{ work.name }} ({{ work.year }})</h3>
        <p>Type: {{ work.type }} | Director: {{ work.director }}</p>
        <span v-if="work.coac" class="badge">
          COAC Rank #{{ work.awards.coac_rank }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const BASE_API = 'https://nandovejer.github.io/ares-api/data/';
const selectedYear = ref(1998);
const works = ref([]);
const loading = ref(false);
const error = ref(null);

async function loadWorks() {
  loading.value = true;
  error.value = null;

  try {
    const year = selectedYear.value;
    let decade = '1980-1999';
    if (year >= 2000 && year <= 2019) decade = '2000-2019';
    else if (year >= 2020) decade = '2020-2029';

    const response = await fetch(`${BASE_API}chunk-${decade}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    works.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Load initial works
loadWorks();
</script>

<style scoped>
.works-container {
  max-width: 800px;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  background: #333;
  color: #fff;
  border-radius: 4px;
  font-size: 0.85rem;
}

.error {
  color: #d32f2f;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
}
</style>
```

---

## TypeScript

### Type-Safe Client

```typescript
interface Work {
  id: string;
  year: number;
  name: string;
  type: 'comparsa' | 'chirigota' | 'murga' | 'coro';
  director: string;
  coac: boolean;
  awards: {
    coac_rank: number | null;
    other: string[];
  };
  lyrics: Record<string, string>;
  music: Record<string, string>;
  sources: Array<{ name: string; url: string }>;
}

interface SearchEntry {
  id: string;
  tokens: string;
}

class AresAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://nandovejer.github.io/ares-api/data/') {
    this.baseUrl = baseUrl;
  }

  private getChunk(year: number): string {
    if (year >= 1965 && year <= 1979) return '1965-1979';
    if (year >= 1980 && year <= 1999) return '1980-1999';
    if (year >= 2000 && year <= 2019) return '2000-2019';
    if (year >= 2020 && year <= 2033) return '2020-2033';
    throw new Error('Year out of range');
  }

  async getChunk(year: number): Promise<Work[]> {
    const chunk = this.getChunk(year);
    const response = await fetch(`${this.baseUrl}chunk-${chunk}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async getWork(id: string): Promise<Work | null> {
    const year = parseInt(id.split('-')[0]);
    const works = await this.getChunk(year);
    return works.find(w => w.id === id) || null;
  }

  async search(query: string): Promise<SearchEntry[]> {
    const response = await fetch(`${this.baseUrl}search-index.json`);
    const index: SearchEntry[] = await response.json();
    
    const q = query.toLowerCase();
    return index.filter(entry => entry.tokens.toLowerCase().includes(q));
  }
}

// Usage
const client = new AresAPIClient();
const work = await client.getWork('1998-los-piratas');
const results = await client.search('piratas');
```

---

## Python

### Requests-Based Client

```python
import requests
from typing import List, Optional
from dataclasses import dataclass

BASE_API = 'https://nandovejer.github.io/ares-api/data/'

@dataclass
class Work:
    id: str
    year: int
    name: str
    type: str
    director: str
    coac: bool
    awards: dict
    lyrics: dict
    music: dict
    sources: list

class AresAPIClient:
    def __init__(self, base_url: str = BASE_API):
        self.base_url = base_url

    def _get_chunk(self, year: int) -> str:
        if 1965 <= year <= 1979:
            return '1965-1979'
        elif 1980 <= year <= 1999:
            return '1980-1999'
        elif 2000 <= year <= 2019:
            return '2000-2019'
        elif 2020 <= year <= 2033:
            return '2020-2033'
        raise ValueError('Year out of range')

    def get_chunk(self, year: int) -> List[Work]:
        chunk = self._get_chunk(year)
        url = f'{self.base_url}chunk-{chunk}.json'
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        return [Work(**item) for item in data]

    def get_work(self, work_id: str) -> Optional[Work]:
        year = int(work_id.split('-')[0])
        works = self.get_chunk(year)
        for work in works:
            if work.id == work_id:
                return work
        return None

    def search(self, query: str) -> List[dict]:
        url = f'{self.base_url}search-index.json'
        response = requests.get(url)
        response.raise_for_status()
        
        index = response.json()
        q = query.lower()
        return [item for item in index if q in item['tokens'].lower()]

# Usage
client = AresAPIClient()
work = client.get_work('1998-los-piratas')
results = client.search('piratas')
print(f"Found {len(results)} results for 'piratas'")
```

---

## cURL

### Command-Line Queries

```bash
# Get all works from 1998
curl https://nandovejer.github.io/ares-api/data/chunk-1980-1999.json | jq '.[] | select(.year == 1998)'

# Get all works from 1970
curl https://nandovejer.github.io/ares-api/data/chunk-1965-1979.json | jq '.[] | select(.year == 1970)'

# Search the index
curl https://nandovejer.github.io/ares-api/data/search-index.json | jq '.[] | select(.tokens | contains("piratas"))'

# Count works by decade
curl https://nandovejer.github.io/ares-api/data/chunk-2000-2019.json | jq 'length'

# Get COAC winners
curl https://nandovejer.github.io/ares-api/data/chunk-1980-1999.json | jq '.[] | select(.coac == true and .awards.coac_rank == 1)'
```

---

**All examples use `nandovejer` as a placeholder. Replace with your actual GitHub username.**
