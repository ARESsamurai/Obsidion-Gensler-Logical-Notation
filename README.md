# Logic Symbols

An Obsidian plugin for logical notation. It changes italic words to the symbols of Gensler logic notation (from Harry Gensler, *Introduction to Logic*). Use it to write logic, logical formulas, and logical notation in your notes.

**Keywords:** Gensler, logic, logical, notation, logical notation, symbols, formal logic, philosophy.

## How to use

Write one of these words in italics. The plugin replaces the word with the symbol.

| You write | You get |
|---|---|
| `*ifthen*` | ⊃ |
| `*iff*` | ≡ |
| `*and*` | • |
| `*or*` | v |

You can use underscores instead of asterisks, for example `_and_`. Upper case also works.

## Rules

- The plugin works in Editing view. It changes the text in your note when you type the closing `*` or `_`.
- You can also select a word and type `*` to wrap it. The plugin then changes the word.
- The plugin only changes the whole italic word. `*android*` stays the same.
- Bold text is not changed. `**and**` stays the same.
- In Reading view, the plugin also shows the symbol for italic words that are already in a note. The text in the file stays the same.
- The plugin does not add parentheses. Write them yourself, for example `(A • B)`.

## Install

1. Download `main.js` and `manifest.json` from the latest release.
2. Put them in `<your vault>/.obsidian/plugins/logic-symbols/`.
3. In Obsidian, go to Settings, then Community plugins. Turn on **Logic Symbols**.

## Change the symbols

Open `main.js`. Edit the `SYMBOLS` list at the top of the file. For example, use `∨` instead of `v` for "or".

## Limits

- The plugin does not skip code blocks. It also changes italic words there.
- The plugin does not read your notes in other apps.

## Licence

MIT
