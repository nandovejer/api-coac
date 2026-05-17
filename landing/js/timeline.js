const CHUNKS = [
  "chunk-1965-1979.json",
  "chunk-1980-1999.json",
  "chunk-2000-2019.json",
  "chunk-2020-2033.json",
];

class CarnivalTimeline extends HTMLElement {
  #data = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["data-api"];
  }

  connectedCallback() {
    const api = this.getAttribute("data-api");
    if (api) {
      this.#fetchAndRender(api);
    } else {
      this.#render(this.#getFallbackData());
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "data-api" && newValue) {
      this.#fetchAndRender(newValue);
    }
  }

  async #fetchAndRender(baseUrl) {
    this.#renderLoading();
    try {
      const results = await Promise.all(
        CHUNKS.map((chunk) =>
          fetch(`${baseUrl}${chunk}`).then((r) => {
            if (!r.ok) throw new Error(`${chunk}: ${r.status}`);
            return r.json();
          }),
        ),
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
    return [...new Set(Object.values(section))].join(", ");
  }

  #youtubeUrl(name, type) {
    const q = encodeURIComponent(`'${type}' ${name}`).replace(/%20/g, "+");
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

    const linkIcon = `<svg class="link-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

    const groupsHtml = years
      .map((year) => {
        const cardsHtml = grouped[year]
          .map((item) => {
            const rank = item.awards?.coac_rank;
            const sources = (item.sources ?? []).slice(0, 3);
            const letra = this.#uniqueAuthors(item.lyrics ?? {});
            const musica = this.#uniqueAuthors(item.music ?? {});
            const ytUrl = this.#youtubeUrl(item.name, item.type);
            const letrasUrl = item.lyrics_source?.[0]?.url ?? null;

            return `
          <div class="timeline-card">
            <div class="card-header">
              <h3>${item.name}</h3>
              <span class="tag ${item.type}">${item.type}</span>
            </div>
            ${rank != null ? `<div class="award-badge">🏅 ${typeof rank === "number" ? `${rank}º Premio COAC` : rank}</div>` : ""}
            <div class="meta-info">
              <div>Dirección: <span>${item.director || "No consta"}</span></div>
            </div>
            ${
              letra || musica
                ? `
              <div class="authors-details">
                ${letra ? `<div><strong>Letra:</strong> ${letra}</div>` : ""}
                ${musica ? `<div><strong>Música:</strong> ${musica}</div>` : ""}
              </div>`
                : ""
            }
            ${
              sources.length
                ? `
              <div class="sources-section">
                <p class="sources-label">Fuentes</p>
                ${sources
                  .map(
                    (s) => `
                <a class="source-link" href="${s.url}" target="_blank" rel="noopener" title="${s.name}">
                  ${linkIcon}<span>${s.name}</span>
                </a>`,
                  )
                  .join("")}
              </div>`
                : ""
            }
            <div class="card-actions">
              ${
                letrasUrl
                  ? `<a class="letras-link" href="${letrasUrl}" target="_blank" rel="noopener" aria-label="Ver letra de ${item.name}" title="${item.lyrics_source[0].name}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                
              </a>`
                  : ""
              }
              <a class="yt-link" href="${ytUrl}" target="_blank" rel="noopener" aria-label="Buscar ${item.name} en YouTube" title="Buscar en YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.6 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z"/>
                </svg>
                
              </a>
            </div>
          </div>
        `;
          })
          .join("");

        return `
        <section class="timeline-group">
          <div class="timeline-badge"></div>
          <div class="timeline-year">${year}</div>
          <div class="cards-wrapper">${cardsHtml}</div>
        </section>
      `;
      })
      .join("");

    this.shadowRoot.innerHTML = `
      <style>${this.#getStyles()}</style>
      <div class="timeline-container">${groupsHtml}</div>
    `;
    requestAnimationFrame(() => this.#clipLine());
  }

  #getFallbackData() {
    return [
      {
        id: "1985-zombies",
        year: 1985,
        name: "Zombies",
        type: "comparsa",
        director: "Ángel Subiela",
        coac: true,
        awards: { coac_rank: null, other: [] },
        lyrics: { pasodoble: "Antonio Martínez Ares" },
        music: { pasodoble: "Antonio Martínez Ares" },
        sources: [
          {
            name: "Código Carnaval",
            url: "https://www.codigocarnaval.com/autores/martinez-ares/",
          },
        ],
      },
      {
        id: "1986-de-locura",
        year: 1986,
        name: "De Locura",
        type: "comparsa",
        director: "Ángel Subiela",
        coac: true,
        awards: { coac_rank: null, other: [] },
        lyrics: { pasodoble: "Antonio Martínez Ares" },
        music: { pasodoble: "Antonio Martínez Ares" },
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
        background-color: transparent;
        color: var(--text-primary);
        font-family: var(--font-stack);
        line-height: 1.5;
        padding: 3rem 1rem;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      a { color: inherit; text-decoration: none; }

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
        top: 20px; bottom: var(--line-bottom, 0); left: 50%;
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
      .timeline-group:last-child {
        margin-bottom: 0;
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

      .sources-section {
        border-top: 1px dashed var(--border-color);
        margin-top: 0.75rem;
        padding-top: 0.6rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .sources-label {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        margin-bottom: 0.1rem;
      }
      .source-link {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.78rem;
        color: var(--text-muted);
        overflow: hidden;
        white-space: nowrap;
      }
      .source-link .link-icon { flex-shrink: 0; }
      .source-link span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
        max-width: 240px;     }
      .source-link:hover { color: var(--accent-color); }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.85rem;
        gap: 0.5rem;
      }
      .letras-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.28rem 0.6rem;
        border-radius: 5px;
        background-color: #dcfce7;
        color: #15803d;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        white-space: nowrap;
        transition: background-color 0.15s, color 0.15s;
        width: 3em;
        height: 3em;
        justify-content: center;
      }
      .letras-link:hover { background-color: #16a34a; color: #fff; }
      .letras-link:focus-visible { outline: 2px solid #16a34a; outline-offset: 2px; }

      .yt-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.28rem 0.6rem;
        border-radius: 5px;
        background-color: #fee2e2;
        color: #b91c1c;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        white-space: nowrap;
        transition: background-color 0.15s, color 0.15s;
        width: 3em;
        height: 3em;
        justify-content: center;
      }
      .yt-link:hover { background-color: #ef4444; color: #fff; }
      .yt-link:focus-visible { outline: 2px solid #ef4444; outline-offset: 2px; }

      .timeline-group:nth-child(odd) .cards-wrapper  { grid-column: 1; }
      .timeline-group:nth-child(odd) .timeline-year  { grid-column: 2; justify-content: flex-start; padding-left: 2rem; }
      .timeline-group:nth-child(even) .cards-wrapper { grid-column: 2; }
      .timeline-group:nth-child(even) .timeline-year { grid-column: 1; grid-row: 1; justify-content: flex-end; padding-right: 2rem; }

      @media (max-width: 768px) {
        .timeline-container::before { left: 20px; top: 16px; }
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

  #clipLine() {
    const container = this.shadowRoot.querySelector(".timeline-container");
    const badges = this.shadowRoot.querySelectorAll(".timeline-badge");
    if (!container || !badges.length) return;
    const containerRect = container.getBoundingClientRect();
    const lastBadge = badges[badges.length - 1];
    const lastBadgeRect = lastBadge.getBoundingClientRect();
    const lastBadgeCenterY =
      lastBadgeRect.top + lastBadgeRect.height / 2 - containerRect.top;
    container.style.setProperty(
      "--line-bottom",
      `${containerRect.height - lastBadgeCenterY}px`,
    );
  }
}

customElements.define("carnival-timeline", CarnivalTimeline);
