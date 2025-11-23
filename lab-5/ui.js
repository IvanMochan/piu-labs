import {
  subscribe,
  addShape,
  removeShape,
  recolorByType,
} from "./store.js";

const shapeList = document.getElementById("shape-list");

const btnAddSquare = document.getElementById("add-square");
const btnAddCircle = document.getElementById("add-circle");
const btnRecolorSquares = document.getElementById("recolor-squares");
const btnRecolorCircles = document.getElementById("recolor-circles");

const countSquaresEl = document.getElementById("count-squares");
const countCirclesEl = document.getElementById("count-circles");
const countAllEl = document.getElementById("count-all");

/** @type {Map<string, HTMLElement>} */
const shapeElements = new Map();

export function initUI() {
  subscribe(render);

  btnAddSquare.addEventListener("click", () => addShape("square"));
  btnAddCircle.addEventListener("click", () => addShape("circle"));

  btnRecolorSquares.addEventListener("click", () =>
    recolorByType("square")
  );
  btnRecolorCircles.addEventListener("click", () =>
    recolorByType("circle")
  );

  shapeList.addEventListener("click", (event) => {
    const shapeEl = event.target.closest(".shape");
    if (!shapeEl || !shapeList.contains(shapeEl)) return;
    const id = shapeEl.dataset.id;
    if (!id) return;
    removeShape(id);
  });
}

function render(state) {
  const presentIds = new Set();

  state.shapes.forEach((shape) => {
    presentIds.add(shape.id);

    let el = shapeElements.get(shape.id);
    if (!el) {
      el = document.createElement("div");
      el.classList.add("shape");
      shapeList.appendChild(el);
      shapeElements.set(shape.id, el);
    }

    el.dataset.id = shape.id;
    el.dataset.type = shape.type;
    el.dataset.shortId = shape.id.slice(0, 4);

    if (shape.type === "circle") el.classList.add("shape--circle");
    else el.classList.remove("shape--circle");

    el.style.backgroundColor = shape.color;
  });

  for (const [id, el] of shapeElements.entries()) {
    if (!presentIds.has(id)) {
      el.remove();
      shapeElements.delete(id);
    }
  }

  const squares = state.shapes.filter((s) => s.type === "square").length;
  const circles = state.shapes.filter((s) => s.type === "circle").length;
  const all = state.shapes.length;

  countSquaresEl.textContent = String(squares);
  countCirclesEl.textContent = String(circles);
  countAllEl.textContent = String(all);
}
