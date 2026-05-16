export class DataCard extends HTMLElement {
  #elements = {};
  #closeListener = null;
  #actionListener = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'description', 'theme', 'closeable'];
  }

  connectedCallback() {
    this.#render();
    this.#cacheElements();
    this.#attachListeners();
  }

  disconnectedCallback() {
    this.#removeListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'title':       this.#updateTitle(newValue); break;
      case 'description': this.#updateDescription(newValue); break;
      case 'theme':       this.#applyTheme(newValue); break;
      case 'closeable':   this.#updateCloseButton(); break;
    }
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>${this.constructor.CSS}</style>
      ${this.constructor.HTML}
    `;
  }

  #cacheElements() {
    this.#elements = {
      title:       this.shadowRoot.querySelector('.card-title'),
      description: this.shadowRoot.querySelector('.card-description'),
      closeBtn:    this.shadowRoot.querySelector('.card-close'),
      actionBtn:   this.shadowRoot.querySelector('.card-action'),
    };
  }

  #attachListeners() {
    this.#closeListener = () => this.#handleClose();
    this.#actionListener = () => this.#handleAction();
    this.#elements.closeBtn?.addEventListener('click', this.#closeListener);
    this.#elements.actionBtn?.addEventListener('click', this.#actionListener);
  }

  #removeListeners() {
    this.#elements.closeBtn?.removeEventListener('click', this.#closeListener);
    this.#elements.actionBtn?.removeEventListener('click', this.#actionListener);
  }

  #updateTitle(value) {
    if (this.#elements.title) this.#elements.title.textContent = value || '';
  }

  #updateDescription(value) {
    if (this.#elements.description) this.#elements.description.textContent = value || '';
  }

  #applyTheme(theme) {
    const colors = {
      primary: '#2563eb',
      success: '#10b981',
      warning: '#f59e0b',
      danger:  '#ef4444',
    };
    if (theme) this.style.setProperty('--accent-color', colors[theme] || colors.primary);
  }

  #updateCloseButton() {
    if (this.#elements.closeBtn) {
      this.#elements.closeBtn.style.display = this.hasAttribute('closeable') ? 'flex' : 'none';
    }
  }

  #handleClose() {
    this.dispatchEvent(new CustomEvent('card-closed', {
      detail: { cardId: this.id },
      bubbles: true,
      composed: true,
    }));
    this.remove();
  }

  #handleAction() {
    this.dispatchEvent(new CustomEvent('card-action', {
      detail: { cardId: this.id, action: this.getAttribute('action') },
      bubbles: true,
      composed: true,
    }));
  }

  /** @param {{ title?: string, description?: string, theme?: string }} data */
  setData(data) {
    if (data.title)       this.setAttribute('title', data.title);
    if (data.description) this.setAttribute('description', data.description);
    if (data.theme)       this.setAttribute('theme', data.theme);
  }

  getData() {
    return {
      id:          this.id,
      title:       this.getAttribute('title'),
      description: this.getAttribute('description'),
      theme:       this.getAttribute('theme'),
    };
  }

  static get HTML() {
    return `
      <article class="card">
        <header class="card-header">
          <h2 class="card-title"></h2>
          <button class="card-close" aria-label="Close card" type="button">
            <span aria-hidden="true">&times;</span>
          </button>
        </header>
        <div class="card-body">
          <slot name="content"><p class="card-description"></p></slot>
        </div>
        <footer class="card-footer">
          <slot name="footer"><button class="card-action" type="button">Action</button></slot>
        </footer>
      </article>
    `;
  }

  static get CSS() {
    return `
      :host {
        --card-bg: #ffffff;
        --card-border: #e2e8f0;
        --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        --card-radius: 8px;
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --accent-color: #2563eb;
        --spacing-unit: 1rem;
        display: block;
      }
      .card {
        background-color: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
        overflow: hidden;
        transition: box-shadow 0.2s ease-in-out;
      }
      :host(:hover) .card { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-unit);
        border-bottom: 1px solid var(--card-border);
      }
      .card-title { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin: 0; }
      .card-close {
        appearance: none; background: transparent; border: none;
        color: var(--text-secondary); cursor: pointer; font-size: 1.5rem;
        padding: 0.25rem; width: 2rem; height: 2rem;
        display: flex; align-items: center; justify-content: center;
        border-radius: 4px; transition: background-color 0.2s, color 0.2s;
      }
      .card-close:focus-visible { outline: 2px solid var(--accent-color); outline-offset: 2px; }
      .card-body { padding: var(--spacing-unit); }
      .card-description { margin: 0; color: var(--text-secondary); line-height: 1.6; }
      ::slotted([slot="content"]) { color: var(--text-secondary); }
      .card-footer {
        padding: var(--spacing-unit);
        border-top: 1px solid var(--card-border);
        background-color: rgba(0,0,0,0.02);
      }
      .card-action {
        appearance: none; background-color: var(--accent-color); color: white;
        border: none; border-radius: 4px; padding: 0.5rem 1rem;
        font-size: 0.875rem; font-weight: 500; cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
      }
      .card-action:hover { background-color: #1d4ed8; }
      .card-action:active { transform: scale(0.98); }
      .card-action:focus-visible { outline: 2px solid var(--accent-color); outline-offset: 2px; }
      @media (prefers-color-scheme: dark) {
        :host { --card-bg: #1e293b; --card-border: #334155; --text-primary: #f1f5f9; --text-secondary: #cbd5e1; }
      }
      @media (max-width: 640px) {
        .card-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        .card-close { align-self: flex-end; }
        .card-title { font-size: 1.1rem; }
      }
    `;
  }
}

customElements.define('data-card', DataCard);
