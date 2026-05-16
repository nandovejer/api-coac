const CHUNKS = [
  'chunk-1965-1979.json',
  'chunk-1980-1999.json',
  'chunk-2000-2019.json',
  'chunk-2020-2033.json',
];

class CarnivalTimeline extends HTMLElement {
  #data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['data-api'];
  }

  connectedCallback() {
    const api = this.getAttribute('data-api');
    if (api) {
      this.#fetchAndRender(api);
    } else {
      this.#render(this.#getFallbackData());
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'data-api' && newValue) {
      this.#fetchAndRender(newValue);
    }
  }

  async #fetchAndRender(baseUrl) {
    this.#renderLoading();
    try {
      const results = await Promise.all(
        CHUNKS.map(chunk =>
          fetch(`${baseUrl}${chunk}`).then(r => {
            if (!r.ok) throw new Error(`${chunk}: ${r.status}`);
            return r.json();
          })
        )
      );
      this.#data = results.flat().sort((a, b) => a.year - b.year);
      this.#render(this.#data);
    } catch (err) {
      this.#renderError(err.message);
    }
  }

  #groupByYear(data) {
    return data.reduce((acc, item) => {
      (acc[item.year] ??= []).push(item);
      return acc;
    }, {});
  }

  #uniqueAuthors(section) {
    return [...new Set(Object.values(section))].join(', ');
  }

  #youtubeUrl(name) {
    const q = encodeURIComponent(`'carnaval de cadiz'  + ${name}`).replace(/%20/g, '+');
    return `https://www.youtube.com/results?search_query=${q}`;
  }

  #renderLoading() {
    this.shadowRoot.innerHTML = `
      <style>${this.#getStyles()}</style>
      <div class="state-msg">Cargando discografía…</div>
    `;
  }

  #renderError(msg) {
    this.shadowRoot.innerHTML = `
      <style>${this.#getStyles()}</style>
      <div class="state-msg state-error">Error al cargar los datos: ${msg}</div>
    `;
  }

  #render(data) {
    if (!data.length) {
      this.shadowRoot.innerHTML = `
        <style>${this.#getStyles()}</style>
        <div class="state-msg">Sin obras que mostrar.</div>
      `;
      return;
    }

    const grouped = this.#groupByYear(data);
    const years = Object.keys(grouped).sort((a, b) => a - b);

    const groupsHtml = years.map(year => {
      const cardsHtml = grouped[year].map(item => {
        const rank = item.awards?.coac_rank;
        const source = item.sources?.[0];
        const letra = this.#uniqueAuthors(item.lyrics ?? {});
        const musica = this.#uniqueAuthors(item.music ?? {});
        const ytUrl = this.#youtubeUrl(item.name);

        return `
          <div class="timeline-card">
            <div class="card-header">
              <h3>${item.name}</h3>
              <span class="tag ${item.type}">${item.type}</span>
            </div>
            ${rank != null ? `<div class="award-badge">🏅 ${typeof rank === 'number' ? `${rank}º Premio COAC` : rank}</div>` : ''}
            <div class="meta-info">
              <div>Dirección: <span>${item.director || 'No consta'}</span></div>
            </div>
            ${letra || musica ? `
              <div class="authors-details">
                ${letra  ? `<div><strong>Letra:</strong> ${letra}</div>`  : ''}
                ${musica ? `<div><strong>Música:</strong> ${musica}</div>` : ''}
              </div>` : ''}
            <div class="card-actions">
              ${source ? `<a class="source-link" href="${source.url}" target="_blank" rel="noopener">${source.name}</a>` : ''}
              <a class="yt-link" href="${ytUrl}" target="_blank" rel="noopener" aria-label="Buscar ${item.name} en YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.6 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z"/>
                </svg>
                YouTube
              </a>
            </div>
          </div>
        `;
      }).join('');

      return `
        <section class="timeline-group">
          <div class="timeline-badge"></div>
          <div class="timeline-year">${year}</div>
          <div class="cards-wrapper">${cardsHtml}</div>
        </section>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>${this.#getStyles()}</style>
      <div class="timeline-container">${groupsHtml}</div>
    `;
  }

  #getFallbackData() {
    return [
      {
        id: '1985-zombies', year: 1985, name: 'Zombies', type: 'comparsa',
        director: 'Ángel Subiela', coac: true,
        awards: { coac_rank: null, other: [] },
        lyrics: { pasodoble: 'Antonio Martínez Ares' },
        music:  { pasodoble: 'Antonio Martínez Ares' },
        sources: [{ name: 'Código Carnaval', url: 'https://www.codigocarnaval.com/autores/martinez-ares/' }],
      },
      {
        id: '1986-de-locura', year: 1986, name: 'De Locura', type: 'comparsa',
        director: 'Ángel Subiela', coac: true,
        awards: { coac_rank: null, other: [] },
        lyrics: { pasodoble: 'Antonio Martínez Ares' },
        music:  { pasodoble: 'Antonio Martínez Ares' },
        sources: [],
      },
    ];
  }

  #getStyles() {
    return `
      :host {
        --bg-color: #f8fafc;
        --card-bg: #ffffff;
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-muted: #64748b;
        --accent-color: #2563eb;
        --award-color: #d97706;
        --border-color: #e2e8f0;
        --line-color: #1e293b;
        --font-stack: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: block;
        background-color: var(--bg-color);
        color: var(--text-primary);
        font-family: var(--font-stack);
        line-height: 1.5;
        padding: 3rem 1rem;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      .state-msg {
        text-align: center;
        padding: 4rem 1rem;
        color: var(--text-muted);
        font-size: 1rem;
      }
      .state-error { color: #dc2626; }

      .timeline-container {
        max-width: 1000px;
        margin: 0 auto;
        position: relative;
      }
      .timeline-container::before {
        content: '';
        position: absolute;
        top: 0; bottom: 0; left: 50%;
        width: 4px;
        background-color: var(--line-color);
        transform: translateX(-50%);
        z-index: 1;
      }

      .timeline-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        margin-bottom: 4rem;
        position: relative;
        align-items: start;
      }
      .timeline-badge {
        width: 16px; height: 16px;
        background-color: var(--accent-color);
        border-radius: 50%;
        position: absolute;
        left: 50%; top: 12px;
        transform: translateX(-50%);
        z-index: 2;
        box-shadow: 0 0 0 6px var(--bg-color);
      }
      .timeline-year {
        font-size: 2rem; font-weight: 800;
        color: var(--line-color);
        margin-top: -0.25rem;
        display: flex;
      }
      .cards-wrapper { display: flex; flex-direction: column; gap: 1.5rem; }

      .timeline-card {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .card-header h3 { font-size: 1.35rem; color: var(--text-primary); font-weight: 700; }

      .tag {
        font-size: 0.75rem; text-transform: uppercase; font-weight: 700;
        padding: 0.25rem 0.5rem; border-radius: 6px;
        background-color: #f1f5f9; color: var(--text-secondary);
        white-space: nowrap;
      }
      .tag.comparsa { background-color: #dbeafe; color: #1e40af; }
      .tag.chirigota { background-color: #fef08a; color: #854d0e; }
      .tag.cuarteto  { background-color: #dcfce7; color: #166534; }
      .tag.coro      { background-color: #f3e8ff; color: #6b21a8; }

      .meta-info { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
      .meta-info span { font-weight: 600; color: var(--text-primary); }

      .award-badge {
        display: inline-block; font-size: 0.85rem; font-weight: 600;
        color: var(--award-color); background-color: #fef3c7;
        padding: 0.25rem 0.5rem; border-radius: 6px; margin-bottom: 0.75rem;
      }

      .authors-details {
        border-top: 1px dashed var(--border-color);
        padding-top: 0.75rem; margin-top: 0.75rem;
        font-size: 0.85rem; color: var(--text-muted);
        display: flex; flex-direction: column; gap: 0.25rem;
      }

      .card-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.85rem;
        flex-wrap: wrap;
      }
      .source-link {
        font-size: 0.78rem;
        color: var(--text-muted);
        text-decoration: none;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .source-link:hover { color: var(--accent-color); text-decoration: underline; }
      .yt-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.28rem 0.6rem;
        border-radius: 5px;
        background-color: #fee2e2;
        color: #b91c1c;
        text-decoration: none;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        white-space: nowrap;
        transition: background-color 0.15s, color 0.15s;
        margin-left: auto;
      }
      .yt-link:hover { background-color: #ef4444; color: #fff; }
      .yt-link:focus-visible { outline: 2px solid #ef4444; outline-offset: 2px; }

      .timeline-group:nth-child(odd) .cards-wrapper  { grid-column: 1; }
      .timeline-group:nth-child(odd) .timeline-year  { grid-column: 2; justify-content: flex-start; padding-left: 2rem; }
      .timeline-group:nth-child(even) .cards-wrapper { grid-column: 2; }
      .timeline-group:nth-child(even) .timeline-year { grid-column: 1; grid-row: 1; justify-content: flex-end; padding-right: 2rem; }

      @media (max-width: 768px) {
        .timeline-container::before { left: 20px; }
        .timeline-group {
          grid-template-columns: 1fr;
          gap: 0.5rem; padding-left: 45px; margin-bottom: 3rem;
        }
        .timeline-badge { left: 20px; top: 8px; }
        .timeline-group:nth-child(odd) .cards-wrapper,
        .timeline-group:nth-child(even) .cards-wrapper { grid-column: 1; }
        .timeline-group:nth-child(odd) .timeline-year,
        .timeline-group:nth-child(even) .timeline-year {
          grid-column: 1; grid-row: 1;
          justify-content: flex-start; padding: 0;
          font-size: 1.5rem; margin-bottom: 0.5rem;
        }
      }
    `;
  }
}

customElements.define('carnival-timeline', CarnivalTimeline);
