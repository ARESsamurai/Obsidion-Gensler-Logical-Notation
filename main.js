const { Plugin, Notice } = require("obsidian");
const { EditorView } = require("@codemirror/view");

// Gensler notation (Introduction to Logic)
const SYMBOLS = {
  ifthen: "⊃",
  iff: "≡",
  and: "•",
  or: "v",
};

// Finds *word* or _word_ anywhere in a line.
// The lookbehind and lookahead stop bold (**and**) from matching.
const ITALIC_WORD = /(?<![*_])([*_])(ifthen|iff|and|or)\1(?![*_])/gi;

module.exports = class LogicSymbolsPlugin extends Plugin {
  async onload() {
    new Notice("Logic Symbols: loaded");

    this.registerEditorExtension(
      EditorView.updateListener.of((update) => {
        if (!update.docChanged && !update.selectionSet) return;

        // Do not change text when you only click with the mouse.
        if (update.transactions.some((tr) => tr.isUserEvent("select.pointer"))) return;

        const sel = update.state.selection.main;
        const line = update.state.doc.lineAt(sel.head);

        const found = [];
        for (const m of line.text.matchAll(ITALIC_WORD)) {
          const from = line.from + m.index;
          const to = from + m[0].length;
          // The cursor is inside the word (for example, between the
          // auto-paired asterisks). The word is not complete yet. Skip it.
          // A selected word (you wrap it in asterisks) is complete.
          if (sel.empty && sel.head > from && sel.head < to) continue;
          found.push({
            from,
            to,
            old: m[0],
            insert: SYMBOLS[m[2].toLowerCase()],
          });
        }
        if (found.length === 0) return;

        const view = update.view;
        const oldHead = sel.head;

        // CodeMirror does not allow a change inside an update.
        // Wait until the update is done.
        setTimeout(() => {
          const valid = found.filter(
            (c) => view.state.doc.sliceString(c.from, c.to) === c.old
          );
          if (valid.length === 0) return;

          const spec = {
            changes: valid.map((c) => ({ from: c.from, to: c.to, insert: c.insert })),
          };

          // Put the cursor after the symbol, if you did not move it.
          if (view.state.selection.main.head === oldHead) {
            let shift = 0;
            let newHead = null;
            for (const c of valid) {
              if (oldHead >= c.to) {
                shift += c.insert.length - (c.to - c.from);
              } else if (oldHead > c.from) {
                newHead = c.from + shift + c.insert.length;
                break;
              }
            }
            if (newHead === null) newHead = oldHead + shift;
            spec.selection = { anchor: newHead };
          }

          view.dispatch(spec);
        }, 0);
      })
    );

    // Reading view: change italic words that are already in a note.
    this.registerMarkdownPostProcessor((el) => {
      el.querySelectorAll("em").forEach((em) => {
        const symbol = SYMBOLS[em.textContent.trim().toLowerCase()];
        if (symbol) em.replaceWith(document.createTextNode(symbol));
      });
    });
  }
};