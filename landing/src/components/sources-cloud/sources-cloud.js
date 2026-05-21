const CHUNKS = [
  "chunk-1965-1979.json",
  "chunk-1980-1999.json",
  "chunk-2000-2019.json",
  "chunk-2020-2033.json",
];

const _base = import.meta.env?.BASE_URL ?? '/';
let _tplContent = null;
let _cssText = null;

async function _loadAssets() {
  if (_tplContent !== null) return;
  const [html, css] = await Promise.all([
    fetch(`${_base}sources-cloud.html`).then((r) => r.text()),
    fetch(`${_base}sources-cloud.css`).then((r) => r.text()),
  ]);
  const doc = new DOMParser().parseFromString(html, "text/html");
  _tplContent = doc.getElementById("sources-cloud-tpl").content;
  _cssText = css;
}

class SourcesCloud extends HTMLElement {
  #domainMap = new Map();
  #initialized = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["data-api"];
  }

  async connectedCallback() {
    if (this.#initialized) return;
    this.#initialized = true;

    await _loadAssets();

    const style = document.createElement("style");
    style.textContent = _cssText;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(_tplContent.cloneNode(true));

    const api = this.getAttribute("data-api");
    if (api) this.#fetchAndRender(new URL(api, document.baseURI).href);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.#initialized) return;
    if (name === "data-api" && newValue) this.#fetchAndRender(new URL(newValue, document.baseURI).href);
  }

  async #fetchAndRender(baseUrl) {
    try {
      const results = await Promise.all(
        CHUNKS.map((chunk) =>
          fetch(`${baseUrl}${chunk}`).then((r) => {
            if (!r.ok) throw new Error(`${chunk}: ${r.status}`);
            return r.json();
          }),
        ),
      );
      this.#buildDomainMap(results.flat());
      this.#renderTags();
    } catch (err) {
      const status = this.shadowRoot.querySelector(".status");
      if (status) {
        status.textContent = `Error al cargar los datos: ${err.message}`;
        status.classList.add("status--error");
      }
    }
  }

  #buildDomainMap(items) {
    this.#domainMap.clear();
    for (const item of items) {
      for (const src of [
        ...(item.lyrics_source ?? []),
        ...(item.sources ?? []),
      ]) {
        if (!src?.url) continue;
        try {
          const { hostname, origin } = new URL(src.url);
          const domain = hostname.replace(/^www\./, "");
          if (!this.#domainMap.has(domain)) {
            this.#domainMap.set(domain, { origin, count: 0 });
          }
          this.#domainMap.get(domain).count++;
        } catch {
          /* invalid URL — skip */
        }
      }
    }
  }

  #renderTags() {
    const status = this.shadowRoot.querySelector(".status");
    const list = this.shadowRoot.querySelector(".cloud-list");
    if (!list) return;

    const sorted = [...this.#domainMap.entries()].sort(
      (a, b) => b[1].count - a[1].count,
    );

    list.innerHTML = "";
    for (const [domain, { origin, count }] of sorted) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "cloud-tag";
      a.href = origin;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.title = `${domain} · ${count} referencia${count !== 1 ? "s" : ""}`;
      a.setAttribute(
        "aria-label",
        `${domain}, ${count} referencia${count !== 1 ? "s" : ""}`,
      );
      a.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>${domain}`;
      li.appendChild(a);
      list.appendChild(li);
    }

    if (status) status.remove();
    list.hidden = false;
  }

  disconnectedCallback() {}
}

customElements.define("sources-cloud", SourcesCloud);
