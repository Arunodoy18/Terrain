# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## ITADMS Mission Intel Setup (Optional Groq)

`ThreatIntel` now calls a local Vite dev endpoint (`/api/mission-intel`) so your API key stays server-side and is not exposed in browser code.

1. Create a local env file: `.env.local`
2. Add your key:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

3. Restart dev server:

```bash
npm run dev
```

If `GROQ_API_KEY` is missing or Groq is unavailable, the app automatically falls back to rotating hardcoded tactical assessments so demos remain fully reliable.
