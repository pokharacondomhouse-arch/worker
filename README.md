# PCH Background Worker Workspace (`worker`)

The asynchronous background processing daemon for **Pokhara Condom House & Toy Shop (`PCH`)**, running on **Render** with **BullMQ**, **Redis**, and **WebAssembly (WASM)**.

---

## 🏛 Tech Stack & Architecture

* **Framework:** BullMQ + ioredis
* **Runtime:** Bun 1.x / TypeScript
* **Compute:** WebAssembly embedded bytecode for high-throughput batch compute
* **Lifecycle:** Native `SIGTERM` and `SIGINT` signal trapping for zero-downtime rolling deploys
* **Target Cloud:** Render Background Worker (`worker/render.yaml`)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Local Development
```bash
bun dev
```
> **Note:** If `REDIS_URL` is not set in `worker/.env.local`, the worker automatically activates an internal 30-second heartbeat fallback mode with sample WASM compute execution.

### 3. Production Build
```bash
bun run build
bun run start
```

---

## 📂 Directory Structure

```
worker/
├── render.yaml                 # Infrastructure-as-code for Render deployment
├── src/
│   ├── index.ts                # Daemon entry point & graceful shutdown
│   ├── queue.ts                # BullMQ worker initialization & event listeners
│   ├── processors/
│   │   └── task.processor.ts   # Order confirmation, PDF receipts, SMS, WASM tasks
│   └── wasm/
│       └── index.ts            # Worker-side WebAssembly bytecode execution
└── package.json
```

---

## 📖 Related Documentation

* ⚙️ [Background Worker Specification](../docs/background-worker.md)
* ☁️ [Deployment Guide](../docs/deployment-guide.md)
* 🔐 [Security & Privacy Guidelines](../docs/security-guidelines.md)
* 📄 [PRD.md](../PRD.md)
