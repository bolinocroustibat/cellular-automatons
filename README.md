# Generative Animated Art algorithms

- Cyclic Cellular Automaton (see https://en.wikipedia.org/wiki/Cyclic_cellular_automaton)
  - In 1 dimension
  - In 2 dimensions
- Conway's game of Life
- Langton's ant
- Various algorithms

## Dependencies

- [Chroma.js](https://github.com/gka/chroma.js/)
- [Tweakpane](https://github.com/cocopon/tweakpane)

## Install the dependencies

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build for production

Build for production without including the dev dependencies with:
```bash
npm run build --omit-dev
```
...it will create a production build in `./dist` folder.

You can then preview the production build with:
```bash
npm run preview
```

## Format and lint code with Biome

Lint AND format with:
```bash
npx @biomejs/biome check --apply .
```
