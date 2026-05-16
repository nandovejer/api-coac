# Quick Reference — dev-webcomponent

## JavaScript Skeleton

```javascript
export class MyComponent extends HTMLElement {
  #state = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['attr-name'];
  }

  connectedCallback() {
    this.#render();
    this.#attachListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.#update(name, newValue);
  }

  disconnectedCallback() {
    this.#removeListeners();
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>${this.constructor.CSS}</style>
      ${this.constructor.HTML}
    `;
  }

  #attachListeners() {}
  #removeListeners() {}
  #update(name, value) {}

  static get HTML() { return `<!-- template -->`; }
  static get CSS()  { return `/* styles */`; }
}

customElements.define('my-component', MyComponent);
```

---

## CSS Checklist

```css
:host {
  --var: value;
  display: block;
}

.element:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

::slotted(p) { color: var(--text-color); }

@media (prefers-color-scheme: dark) {
  :host { --bg-color: #1e293b; }
}

@media (max-width: 640px) { /* mobile */ }
```

---

## Lifecycle Hooks

| Hook | When | Use For |
|------|------|---------|
| `constructor()` | Before insertion | Init state, attach Shadow DOM |
| `connectedCallback()` | After insertion | Render, attach listeners, fetch |
| `attributeChangedCallback()` | Attribute change | Update specific elements |
| `disconnectedCallback()` | After removal | Clean up listeners, observers |

---

## Custom Events

```javascript
this.dispatchEvent(new CustomEvent('event-name', {
  detail: { data: 'value' },
  bubbles: true,
  composed: true,
}));
```

---

## Attribute Reactivity

```javascript
static get observedAttributes() {
  return ['title', 'open', 'theme'];
}

attributeChangedCallback(name, oldValue, newValue) {
  switch(name) {
    case 'title': this.#updateTitle(newValue); break;
  }
}
```

---

## Performance Patterns

```javascript
// ❌ DON'T
this.shadowRoot.innerHTML = `...`; // full re-render on every change

// ✅ DO — cache elements once
#cacheElements() {
  this.#title = this.shadowRoot.querySelector('.title');
}

// ✅ DO — update only what changed
#updateTitle(value) {
  this.#title.textContent = value;
}

// ✅ DO — batch with RAF
#scheduleUpdate() {
  requestAnimationFrame(() => this.#updateDOM());
}
```

---

## Accessibility Checklist

- [ ] Semantic HTML (`<button>`, `<nav>`, `<article>`, etc.)
- [ ] ARIA roles where needed (`role="dialog"`, `role="tab"`)
- [ ] ARIA states (`aria-expanded`, `aria-selected`)
- [ ] ARIA labels (`aria-label`, `aria-labelledby`)
- [ ] Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- [ ] Focus visible (`:focus-visible` styling)
- [ ] Focus trap for modals
- [ ] WCAG AA color contrast

---

## Dark Mode Template

```css
:host {
  --bg: #ffffff;
  --text: #0f172a;
  background-color: var(--bg);
  color: var(--text);
}

@media (prefers-color-scheme: dark) {
  :host {
    --bg: #1e293b;
    --text: #f1f5f9;
  }
}
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No Shadow DOM | `attachShadow({ mode: 'open' })` |
| Full re-renders | Update only changed nodes |
| Listeners not cleaned up | `removeEventListener` in `disconnectedCallback()` |
| No `observedAttributes` | List all reactive attrs |
| Global CSS injection | Keep all styles in Shadow DOM |
| Missing ARIA | Add `role`, `aria-*` attrs |
| No keyboard support | Handle Tab, Arrow, Enter, Escape |

---

## Browser Support

Chrome 67+, Firefox 63+, Safari 13.1+, Edge 79+

---

## Related Files

- [agent.md](agent.md) — full role definition and constraints
- [template.md](template.md) — complete annotated example
- [examples/data-card/](examples/data-card/) — runnable code
