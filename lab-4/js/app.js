// ====== Prosty Kanban bez bibliotek ======
(() => {
  const LS_KEY = "kanbanStateV1";

  /** @type {{todo: Card[]; doing: Card[]; done: Card[]}} */
  let state = loadState() ?? { todo: [], doing: [], done: [] };

  /** @typedef {{id:string, title:string, color:string}} Card */

  // --- Elementy DOM ---
  const board = document.getElementById("board");
  const containers = {
    todo: document.querySelector('.cards[data-col="todo"]'),
    doing: document.querySelector('.cards[data-col="doing"]'),
    done: document.querySelector('.cards[data-col="done"]'),
  };
  const counts = {
    todo: document.querySelector('[data-count="todo"]'),
    doing: document.querySelector('[data-count="doing"]'),
    done: document.querySelector('[data-count="done"]'),
  };

  // --- Inicjalizacja ---
  renderAll();

  // --- Nasłuchiwanie przycisków kolumnowych (delegacja) ---
  board.addEventListener("click", (e) => {
    const btn = /** @type {HTMLElement} */ (e.target.closest("button"));
    if (!btn) return;

    const action = btn.dataset.action;
    const col = btn.dataset.col;

    if (action === "add" && col) {
      const card = makeCard("Nowa karta");
      state[col].push(card);
      persistAndRerender();
    }

    if (action === "colorize-column" && col) {
      state[col] = state[col].map((c) => ({ ...c, color: randomColor() }));
      persistAndRerender();
    }

    if (action === "sort" && col) {
      state[col].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
      persistAndRerender();
    }
  });

  // --- Delegacja na kontenery kart: ruchy, kolor, usuwanie ---
  for (const colKey of ["todo", "doing", "done"]) {
    const cont = containers[colKey];
    cont.addEventListener("click", (e) => {
      const t = /** @type {HTMLElement} */ (e.target);
      const btn = t.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (!action || !id) return;

      const from = colKey;

      if (action === "right") moveCard(from, +1, id);
      if (action === "left") moveCard(from, -1, id);
      if (action === "remove") removeCard(from, id);
      if (action === "recolor") recolorCard(from, id);
    });

    // Zapis zmian tytułu (contentEditable)
    cont.addEventListener("input", (e) => {
      const el = /** @type {HTMLElement} */ (e.target);
      if (!el.classList.contains("card__title")) return;
      const id = el.dataset.id;
      if (!id) return;
      const card = state[colKey].find((c) => c.id === id);
      if (!card) return;
      card.title = sanitize(el.innerText.trim());
      saveState(state);
      updateCounters();
    });

    // Dodatkowo zapisz na "blur", by domknąć ewentualne zmiany
    cont.addEventListener("blur", (e) => {
      const el = /** @type {HTMLElement} */ (e.target);
      if (!el.classList.contains("card__title")) return;
      saveState(state);
    }, true);
  }

  // --- Funkcje akcji ---
  function moveCard(from, dir, id) {
    const order = ["todo", "doing", "done"];
    const fromIdx = order.indexOf(from);
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= order.length) return;

    const idx = state[from].findIndex((c) => c.id === id);
    if (idx === -1) return;
    const [card] = state[from].splice(idx, 1);
    state[order[toIdx]].push(card);
    persistAndRerender();
  }

  function removeCard(from, id) {
    state[from] = state[from].filter((c) => c.id !== id);
    persistAndRerender();
  }

  function recolorCard(from, id) {
    const card = state[from].find((c) => c.id === id);
    if (!card) return;
    card.color = randomColor();
    persistAndRerender();
  }

  // --- Render ---
  function renderAll() {
    for (const key of /** @type {Array<keyof typeof state>} */ (["todo", "doing", "done"])) {
      renderColumn(key);
    }
    updateCounters();
  }

  function renderColumn(colKey) {
    const cont = containers[colKey];
    cont.innerHTML = "";
    for (const card of state[colKey]) {
      cont.appendChild(renderCard(card, colKey));
    }
  }

  function renderCard(card, colKey) {
    const el = document.createElement("article");
    el.className = "card";
    el.style.background = card.color;

    // TOP: tytuł + narzędzia
    const top = document.createElement("div");
    top.className = "card__top";

    const title = document.createElement("div");
    title.className = "card__title";
    title.contentEditable = "true";
    title.spellcheck = true;
    title.textContent = card.title;
    title.dataset.id = card.id;
    title.setAttribute("role", "textbox");
    title.setAttribute("aria-label", "Tytuł karty");

    const tools = document.createElement("div");
    tools.className = "card__tools";

    // Przyciski: ←, →, 🎨, ✕
    tools.appendChild(iconBtn("←", "left", card.id));
    tools.appendChild(iconBtn("→", "right", card.id));
    tools.appendChild(iconBtn("🎨", "recolor", card.id));
    tools.appendChild(iconBtn("✕", "remove", card.id));

    top.appendChild(title);
    top.appendChild(tools);

    // META: ID + kolumna
    const meta = document.createElement("div");
    meta.className = "card__meta";
    const idBadge = document.createElement("span");
    idBadge.className = "badge";
    idBadge.textContent = `ID: ${short(card.id)}`;
    const colBadge = document.createElement("span");
    colBadge.className = "badge";
    colBadge.textContent = labelFor(colKey);
    meta.appendChild(idBadge);
    meta.appendChild(colBadge);

    el.appendChild(top);
    el.appendChild(meta);
    return el;
  }

  function iconBtn(text, action, id) {
    const b = document.createElement("button");
    b.className = "iconbtn";
    b.textContent = text;
    b.dataset.action = action;
    b.dataset.id = id;
    b.title = actionTitle(action);
    return b;
  }

  function actionTitle(a){
    return {
      left: "Przenieś do lewej kolumny",
      right: "Przenieś do prawej kolumny",
      remove: "Usuń kartę",
      recolor: "Losuj kolor karty"
    }[a] || "";
  }

  function labelFor(colKey){
    return { todo: "Do zrobienia", doing: "W trakcie", done: "Zrobione" }[colKey];
  }

  function updateCounters(){
    counts.todo.textContent = String(state.todo.length);
    counts.doing.textContent = String(state.doing.length);
    counts.done.textContent  = String(state.done.length);
  }

  function persistAndRerender(){
    saveState(state);
    renderAll();
  }

  // --- Utilsy ---
  function makeCard(title){
    return {
      id: cryptoRandomId(),
      title: title || "Nowa karta",
      color: randomColor()
    };
  }

  function cryptoRandomId(){
    // Preferuj crypto, fallback do Math.random
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function randomColor(){
    // Pastelowa losowość w HSL, konwersja do RGB aby dobrze wyglądało w Safari na gradientach itp.
    const h = Math.floor(Math.random() * 360);
    const s = 75; // %
    const l = 80; // %
    return `hsl(${h}deg ${s}% ${l}%)`;
  }

  function short(id){ return id.slice(0, 8); }

  function sanitize(text){
    // Minimalne czyszczenie (tu tylko przycinanie)
    return text.replace(/\s+/g, " ").trim();
  }

  // --- LocalStorage ---
  function saveState(s){
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } catch(err){
      console.warn("Nie udało się zapisać stanu:", err);
    }
  }

  function loadState(){
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Prosta walidacja
      if (!parsed || typeof parsed !== "object") return null;
      for (const k of ["todo","doing","done"]) {
        if (!Array.isArray(parsed[k])) parsed[k] = [];
        parsed[k] = parsed[k].map((c) => ({
          id: String(c.id ?? cryptoRandomId()),
          title: String(c.title ?? "Karta"),
          color: String(c.color ?? randomColor()),
        }));
      }
      return parsed;
    } catch(err){
      console.warn("Nie udało się odczytać stanu, reset:", err);
      return null;
    }
  }
})();
