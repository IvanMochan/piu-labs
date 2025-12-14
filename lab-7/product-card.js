const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

      --card: rgba(255,255,255,0.06);
      --cardBorder: rgba(255,255,255,0.10);
      --ink: #111827;     
      --muted: #374151;   

      --shadow: 0 18px 48px rgba(0,0,0,0.45);
      --shadowHover: 0 26px 70px rgba(0,0,0,0.55);

      --imgBg1: rgba(96,165,250,0.16);
      --imgBg2: rgba(52,211,153,0.12);

      --pillBg: rgba(255,255,255,0.06);
      --pillBorder: rgba(255,255,255,0.12);

      --promoBg: rgba(0, 0, 0, 0.44);
      --promoBorder: rgba(255, 255, 255, 0.4);
      --promoText: #ffffffff;

      color: var(--ink);
    }

    .card {
      height: 560px;
      background: var(--card);
      border: 1px solid var(--cardBorder);
      border-radius: 18px;
      box-shadow: var(--shadow);
      overflow: hidden;
      isolation: isolate;

      display: grid;
      grid-template-rows: 260px 1fr 64px;
      transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadowHover);
      border-color: rgba(255,255,255,0.16);
    }

    .image-wrapper {
      position: relative;
      overflow: hidden;
      min-width: 0;
      min-height: 0;

      background:
        radial-gradient(900px 360px at 20% 0%, var(--imgBg1), transparent 55%),
        radial-gradient(900px 360px at 90% 10%, var(--imgBg2), transparent 55%);
      padding: 12px;
      display: grid;
      place-items: center;
    }

    .image-wrapper::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.30));
      pointer-events: none;
      z-index: 1;
    }

    .image-box {
      width: 100%;
      height: 100%;
      border-radius: 14px;
      overflow: hidden;
      background: #ffffff;
      display: grid;
      place-items: center;
      position: relative;
      z-index: 0;
      box-shadow: 0 18px 45px rgba(0,0,0,0.35);
    }

    .image-box ::slotted(img) {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      object-position: center;
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
      backdrop-filter: blur(8px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.35);
    }
    .promo[hidden] { display: none; }

    .content {
      padding: 16px 18px 14px;
      display: grid;
      gap: 10px;
      align-content: start;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .name {
      margin: 0;
      font-size: 1.05rem;
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
      font-size: 1.35rem;
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .divider {
      height: 1px;
      background: rgba(255,255,255,0.08);
      margin-top: 2px;
    }

    .meta {
      display: grid;
      gap: 6px;
      min-height: 0;
    }
    .meta[hidden] { display: none; }

    .meta-title {
      font-size: 0.78rem;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0.12em;
      margin: 0;
      font-weight: 800;
    }

    .pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill-group ::slotted(span),
    .pill-group ::slotted(button) {
      border: 1px solid var(--pillBorder);
      background: var(--pillBg);
      color: var(--ink);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 0.9rem;
      font-weight: 700;
      line-height: 1;
    }

    .pill-group ::slotted(.color-swatch) {
      width: 30px;
      height: 30px;
      padding: 0;
      border-radius: 10px;
      border: 1px solid var(--pillBorder);
      display: inline-block;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.35);
    }

    .cta-wrap {
      padding: 12px 18px 18px;
      display: grid;
      align-items: end;
      background: linear-gradient(to top, rgba(0,0,0,0.18), transparent 70%);
      min-width: 0;
    }

    .cta {
      width: 100%;
      height: 46px;
      border: 1px solid rgba(255,255,255,0.10);
      background: linear-gradient(180deg, rgba(37,99,235,0.95), rgba(29,78,216,0.95));
      color: white;
      font-weight: 900;
      font-size: 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 150ms ease, filter 150ms ease, border-color 150ms ease;
    }

    .cta:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
      border-color: rgba(255,255,255,0.16);
    }

    .cta:active { transform: translateY(0); }

    .cta:focus-visible {
      outline: 3px solid rgba(96,165,250,0.55);
      outline-offset: 2px;
    }
  </style>

  <article class="card">
    <div class="image-wrapper">
      <div class="promo" data-optional="promotion">
        <slot name="promotion"></slot>
      </div>

      <div class="image-box">
        <slot name="image"></slot>
      </div>
    </div>

    <div class="content">
      <h2 class="name"><slot name="name">Nazwa towaru</slot></h2>
      <p class="price"><slot name="price">0,00 zł</slot></p>

      <div class="divider" aria-hidden="true"></div>

      <div class="meta" data-optional="sizes">
        <p class="meta-title">Rozmiary</p>
        <div class="pill-group">
          <slot name="sizes"></slot>
        </div>
      </div>
    </div>

    <div class="cta-wrap">
      <button class="cta" type="button">Do koszyka</button>
    </div>
  </article>
`;

export default class ProductCard extends HTMLElement {
  #sections = null;
  #slots = null;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    Object.keys(this.#slots).forEach((name) => {
      const slot = this.#slots[name];
      if (!slot) return;
      const handler = () => this.#toggleOptional(name);
      slot.addEventListener("slotchange", handler);
      handler();
    });
  }

  #toggleOptional(name) {
    const slot = this.#slots?.[name];
    const section = this.#sections?.[name];
    if (!slot || !section) return;
    const hasAny = slot.assignedElements({ flatten: true }).length > 0;
    section.hidden = !hasAny;
  }
}

customElements.define("product-card", ProductCard);
