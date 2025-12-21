const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

      /* Light theme */
      --card: #ffffff;
      --cardBorder: rgba(17, 24, 39, 0.10);
      --ink: #111827;
      --muted: #374151;

      --shadow: 0 14px 40px rgba(17, 24, 39, 0.12);
      --shadowHover: 0 18px 55px rgba(17, 24, 39, 0.16);

      --pillBg: rgba(76, 29, 149, 0.06);
      --pillBorder: rgba(76, 29, 149, 0.22);

      --promoBg: rgba(246, 65, 125, 0.92);
      --promoBorder: rgba(255,255,255,0.35);
      --promoText: #ffffff;

      --cta1: rgba(0, 0, 0, 0.95);
      --cta2: rgba(0, 0, 0, 0.95);

      color: var(--ink);
    }

    .card {
      height: 560px;
      background: var(--card);
      border: 1px solid var(--cardBorder);
      border-radius: 18px;
      box-shadow: var(--shadow);
      overflow: hidden;
      display: grid;
      grid-template-rows: 260px 1fr 64px;
      transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadowHover);
      border-color: rgba(17,24,39,0.16);
    }

    .image-wrapper {
      position: relative;
      overflow: hidden;
      padding: 12px;
      display: grid;
      place-items: center;
      background: radial-gradient(900px 360px at 20% 0%, rgba(76,29,149,0.08), transparent 55%),
                  radial-gradient(900px 360px at 90% 10%, rgba(37,99,235,0.08), transparent 55%);
    }

    .image-box {
      width: 100%;
      height: 100%;
      border-radius: 14px;
      overflow: hidden;
      background: #fff;
      display: grid;
      place-items: center;
      box-shadow: 0 12px 30px rgba(17,24,39,0.12);
    }

    .image {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      object-position: center;
      display: block;
    }

    .promo {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 2;
      padding: 7px 12px;
      border-radius: 999px;
      background: var(--promoBg);
      border: 1px solid var(--promoBorder);
      color: var(--promoText);
      font-weight: 900;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .promo[hidden] { display: none; }

    .content {
      padding: 16px 18px 14px;
      display: grid;
      gap: 10px;
      align-content: start;
      overflow: hidden;
    }

    .name {
      margin: 0;
      font-size: 1.1rem;
      line-height: 1.35;
      font-weight: 900;
      letter-spacing: -0.02em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .price {
      margin: 0;
      font-size: 1.45rem;
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .divider {
      height: 1px;
      background: rgba(17,24,39,0.10);
      margin-top: 2px;
    }

    .meta {
      display: grid;
      gap: 6px;
    }
    .meta[hidden] { display: none; }

    .meta-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0.12em;
      margin: 0;
      font-weight: 900;
    }

    .pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      border: 1px solid var(--pillBorder);
      background: var(--pillBg);
      color: var(--ink);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 0.9rem;
      font-weight: 800;
      line-height: 1;
    }

    .cta-wrap {
      padding: 12px 18px 18px;
      display: grid;
      align-items: end;
      background: linear-gradient(to top, rgba(76,29,149,0.06), transparent 70%);
    }

    .cta {
      width: 100%;
      height: 46px;
      border: 1px solid rgba(17,24,39,0.10);
      background: linear-gradient(180deg, var(--cta1), var(--cta2));
      color: white;
      font-weight: 900;
      font-size: 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 150ms ease, filter 150ms ease;
    }
    .cta:hover { filter: brightness(1.05); transform: translateY(-1px); }
    .cta:active { transform: translateY(0); }
  </style>

  <article class="card">
    <div class="image-wrapper">
      <div class="promo" id="promo" hidden></div>
      <div class="image-box">
        <img class="image" id="img" alt="" />
      </div>
    </div>

    <div class="content">
      <h2 class="name" id="name">Nazwa towaru</h2>
      <p class="price" id="price">0,00 zł</p>

      <div class="divider" aria-hidden="true"></div>

      <div class="meta" id="sizesSection" hidden>
        <p class="meta-title">Rozmiary</p>
        <div class="pill-group" id="sizes"></div>
      </div>
    </div>

    <div class="cta-wrap">
      <button class="cta" id="cta" type="button">Do koszyka</button>
    </div>
  </article>
`;

export default class ProductCard extends HTMLElement {
  static get observedAttributes() {
    return ["product-id", "name", "price", "currency", "image", "promotion"];
  }

  #product = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#cta").addEventListener("click", () => {
      const p = this.product;
      this.dispatchEvent(
        new CustomEvent("add-to-cart", {
          detail: {
            id: p.id,
            name: p.name,
            price: p.price,
            currency: p.currency ?? "zł"
          },
          bubbles: true,
          composed: true
        })
      );
    });

    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  set product(value) {
    this.#product = value;
    this.#render();
  }

  get product() {
    if (this.#product) return this.#product;

    const priceStr = this.getAttribute("price") ?? "0";
    const price = Number(priceStr);

    return {
      id: this.getAttribute("product-id") ?? crypto.randomUUID(),
      name: this.getAttribute("name") ?? "Nazwa towaru",
      price: Number.isFinite(price) ? price : 0,
      currency: this.getAttribute("currency") ?? "zł",
      image: this.getAttribute("image") ?? "",
      promotion: this.getAttribute("promotion") ?? "",
      sizes: []
    };
  }

  #render() {
    const p = this.product;

    const img = this.shadowRoot.querySelector("#img");
    img.src = p.image || "";
    img.alt = p.name || "";

    this.shadowRoot.querySelector("#name").textContent = p.name ?? "Nazwa towaru";
    this.shadowRoot.querySelector("#price").textContent = `${(p.price ?? 0).toFixed(2)} ${p.currency ?? "zł"}`;

    const promoEl = this.shadowRoot.querySelector("#promo");
    const promoText = (p.promotion ?? "").trim();
    promoEl.textContent = promoText;
    promoEl.hidden = promoText.length === 0;

    const sizesSection = this.shadowRoot.querySelector("#sizesSection");
    const sizesWrap = this.shadowRoot.querySelector("#sizes");
    sizesWrap.innerHTML = "";

    const sizes = Array.isArray(p.sizes) ? p.sizes : [];
    if (sizes.length > 0) {
      sizes.forEach((s) => {
        const span = document.createElement("span");
        span.className = "pill";
        span.textContent = String(s);
        sizesWrap.appendChild(span);
      });
      sizesSection.hidden = false;
    } else {
      sizesSection.hidden = true;
    }
  }
}

customElements.define("product-card", ProductCard);
