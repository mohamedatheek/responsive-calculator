# Responsive Calculator — PPTX Assignment

A responsive HTML + Tailwind CSS + JavaScript calculator matching the black/orange design on page 5 of `04.06.2026(WEEK 03 day 05)(1).pptx`.

## Run in VS Code

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local Vite URL displayed in the terminal (usually `http://localhost:5173/`).

## Features

- Addition, subtraction, multiplication, division
- Percentage (`50%` returns `0.5`), decimal numbers
- AC clear, DEL backspace, equals
- Keyboard support: `0–9`, `.`, `+`, `-`, `*`, `/`, `%`, `Enter`, `Backspace`, `Escape`
- Division-by-zero and invalid result protection
- Tailwind CSS v4 through the official Vite plugin

## Files

- `index.html`: visual structure and buttons
- `src/style.css`: Tailwind import and orange/black button appearance
- `src/main.js`: button event handling and calculator logic
- `vite.config.js`: Tailwind-Vite integration
- `package.json`: npm dependencies and scripts
