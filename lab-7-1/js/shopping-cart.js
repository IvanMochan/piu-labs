const tpl = document.createElement("template");

tpl.innerHTML = `
  <style>
    :host { display: block; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
    .box {
      background: #fff;
      border: 1px solid rgba(17,24,39,0.10);
      border-radius: 16px;
      box-shadow: 0 14px 40px rgba(17,24,39,0.10);
      padding: 16px;
      position: sticky;
      top: 18px;
    }
    h2 {
      margin: 0 0 10px;
      font-size: 1.1rem;
      font-weight: 900;
      color: rgba(166, 15, 65, 0.92);
    }
    .list { display: grid; gap: 10px; margin-top: 12px; }
    .row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      align-items: center;
      padding: 10px 10px;
      border: 1px solid rgba(17,24,39,0.08);
      border-radius: 12px;
      background: rgba(76,29,149,0.03);
    }
    .name { font-weight: 800; color: #111827; }
    .price { font-weight: 900; color: #111827; }
    .remove {
      border: 1px solid rgba(17,24,39,0.12);
      background: #fff;
      border-radius: 10px;
      padding: 7px 10px;
      cursor: pointer;
      font-weight: 800;
    }
    .summary {
      margin-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid rgba(17,24,39,0.10);
      font-weight: 900;
    }
    .muted { color: #6b7280; font-weight: 700; }
    .empty {
      margin-top: 10px;
      color: #6b7280;
      font-weight: 700;
    }
  </style>

  <aside class="box" aria-label="Koszyk">
    <h2>Koszyk</h2>
    <div class="empty" id="empty">Brak produktów w koszyku.</div>
    <div class="list" id="list"></div>
    <div class="summary">
      <span class="muted">Suma</span>
      <span id="sum">0.00 zł</span>
    </div>
  </aside>
`;

export default class ShoppingCart extends HTMLElement {
  #items = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }

  connectedCallback() {

    window.addEventListener("add-to-cart", this.#onAdd);
    this.#render();
  }

  disconnectedCallback() {
    window.removeEventListener("add-to-cart", this.#onAdd);
  }

  #onAdd = (e) => {
    const { id, name, price, currency } = e.detail ?? {};
    if (!id || !name) return;

    this.#items.push({
      cartItemId: crypto.randomUUID(),   
      productId: String(id),             
      name: String(name),
      price: Number(price) || 0,
      currency: currency || "zł"
    });


    this.#render();
  };

  #remove(cartItemId) {
    this.#items = this.#items.filter((x) => x.cartItemId !== cartItemId);
    this.#render();
  }


  #render() {
    const list = this.shadowRoot.querySelector("#list");
    const empty = this.shadowRoot.querySelector("#empty");
    const sumEl = this.shadowRoot.querySelector("#sum");

    list.innerHTML = "";

    empty.style.display = this.#items.length ? "none" : "block";

    let sum = 0;
    let currency = "zł";

    this.#items.forEach((item) => {
      sum += item.price;
      currency = item.currency || currency;

      const row = document.createElement("div");
      row.className = "row";

      const left = document.createElement("div");
      left.innerHTML = `<div class="name">${item.name}</div><div class="price">${item.price.toFixed(
        2
      )} ${item.currency}</div>`;

      const btn = document.createElement("button");
      btn.className = "remove";
      btn.type = "button";
      btn.textContent = "Usuń";
      btn.addEventListener("click", () => this.#remove(item.cartItemId));

      row.appendChild(left);
      row.appendChild(btn);
      list.appendChild(row);
    });

    sumEl.textContent = `${sum.toFixed(2)} ${currency}`;
  }
}

customElements.define("shopping-cart", ShoppingCart);
