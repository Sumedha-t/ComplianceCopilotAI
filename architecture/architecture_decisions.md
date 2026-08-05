# Architecture Decision Records (ADR)

---

## ADR-001

### Decision
Use FastAPI as the backend framework.

### Reason
FastAPI provides excellent support for AI services, asynchronous APIs, automatic documentation, and high performance.

---

## ADR-002

### Decision
Use React for the frontend.

### Reason
React enables reusable UI components and provides a responsive user experience.

---

## ADR-003

### Decision
Use SQLite for the prototype.

### Reason
SQLite is lightweight, easy to configure, and sufficient for hackathon-scale development.

---

## ADR-004

### Decision
Adopt an Agentic AI architecture.

### Reason
Multiple specialized AI agents perform focused tasks, improving modularity, scalability, and explainability.

---

## ADR-005

### Decision
Implement Human-in-the-Loop (HITL).

### Reason
Legal recommendations require expert validation before reaching clients, ensuring trust and compliance.

---

## ADR-006

### Decision
Use a Rule Engine alongside AI.

### Reason
Deterministic compliance rules improve consistency and reduce AI hallucinations.

---

## ADR-007

### Decision
Plan for Hybrid RAG and Knowledge Graph integration.

### Reason
Future versions will require real-time regulation retrieval and relationship mapping for enterprise scalability.