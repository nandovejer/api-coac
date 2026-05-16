# Agents Registry

Agent definitions for the api-ares project. Each agent is a self-contained folder with a consistent entry point (`agent.md`) and optional supporting assets.

---

## Structure

```
agents/
├── README.md                  ← this file (human registry + machine index)
└── <agent-id>/
    ├── agent.md               ← entry point: role, instructions, constraints
    ├── template.md            ← annotated reference example
    ├── quick-reference.md     ← cheat sheet for active use
    └── examples/              ← working code samples
```

---

## Registry

| id | name | version | tags |
|----|------|---------|------|
| [dev-webcomponent](dev-webcomponent/agent.md) | Web Component Engineer | 1.0.0 | frontend, web-components, vanilla-js |

---

## Programmatic Usage

Agents follow a consistent convention for scripted discovery:

```js
// Scan all agents
const agents = glob('agents/*/agent.md');

// Parse frontmatter for metadata
// Each agent.md starts with YAML frontmatter:
// ---
// id: dev-webcomponent
// name: Web Component Engineer
// version: 1.0.0
// model: claude-opus-4-7
// tags: [frontend, web-components, vanilla-js]
// ---
```

---

## Adding a New Agent

1. Create a folder: `agents/<agent-id>/`
2. Create `agent.md` with YAML frontmatter (see schema above)
3. Add the agent to the registry table above
4. Optionally add `template.md`, `quick-reference.md`, `examples/`

---

**Last Updated:** 2026-05-16
