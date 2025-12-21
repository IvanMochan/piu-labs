const tpl = document.createElement("template");

tpl.innerHTML = `
  <style>
    :host { display: block; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 18px;
      align-items: stretch;
    }
  </style>

  <section class="grid" aria-label="Lista produktów" id="grid"></section>
`;

export default class ProductList extends HTMLElement {
  #products = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }

  set products(value) {
    this.#products = Array.isArray(value) ? value : [];
    this.#render();
  }

  get products() {
    return this.#products;
  }

  connectedCallback() {
    this.#render();
  }

  #render() {
    const grid = this.shadowRoot.querySelector("#grid");
    if (!grid) return;

    grid.innerHTML = "";

    this.#products.forEach((p) => {
      const card = document.createElement("product-card");
      card.product = p;
      grid.appendChild(card);
    });
  }
}

customElements.define("product-list", ProductList);
