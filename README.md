# Generative Animated Art algorithms

- [Cyclic Cellular Automaton](https://en.wikipedia.org/wiki/Cyclic_cellular_automaton)
  - In 1 dimension
  - In 2 dimensions
  - In 3 dimensions
- Conway's game of Life
- Immigration game ([Conway's game of life with 3 colors](https://conwaylife.com/ref/mniemiec/color.htm#c-imm))
- Quad-Life ([Conway's game of life with 5 colors](https://conwaylife.com/ref/mniemiec/color.htm#c-quad))
- Langton's ant
- Various algorithms

## Dependencies

- [Chroma.js](https://github.com/gka/chroma.js/)
- [Tweakpane](https://github.com/cocopon/tweakpane)

## Install the dependencies

```bash
bun install
```

## Run locally

```bash
bun run dev
```

## Build for production

Build for production with:
```bash
bun run build
```
...it will create a production build in `./dist` folder.

You can then preview the production build with:
```bash
bun run preview
```

## Format and lint code with Biome

Lint AND format with:
```bash
biome check --write .
```
