import "./product-card.js";
import "./product-list.js";
import "./shopping-cart.js";

import productsData from "../data.json" with { type: "json" };

const list = document.querySelector("product-list");
if (list) {
  list.products = productsData;
}
