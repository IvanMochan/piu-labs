import { randomPastelColor, generateId } from "./helpers.js";

const STORAGE_KEY = "shapes-store-v1";

/**
 * @typedef {"square" | "circle"} ShapeType
 */

/**
 * @typedef {{id:string, type:ShapeType, color:string}} Shape
 */

/** @type {{shapes: Shape[]}} */
let state = loadInitialState();

/** @type {Array<(state:{shapes: Shape[]}) => void>} */
let listeners = [];

function cloneState(s) {
  return { shapes: s.shapes.map((sh) => ({ ...sh })) };
}

function setState(producer) {
  const next = producer(cloneState(state));
  state = next;
  saveState(next);
  notify();
}

function notify() {
  const snapshot = cloneState(state);
  listeners.forEach((fn) => fn(snapshot));
}

export function getState() {
  return cloneState(state);
}

export function subscribe(listener) {
  listeners.push(listener);
  listener(cloneState(state));
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function addShape(type) {
  setState((prev) => {
    prev.shapes.push({
      id: generateId(),
      type,
      color: randomPastelColor(),
    });
    return prev;
  });
}

export function removeShape(id) {
  setState((prev) => {
    prev.shapes = prev.shapes.filter((sh) => sh.id !== id);
    return prev;
  });
}

export function recolorByType(type) {
  setState((prev) => {
    prev.shapes = prev.shapes.map((sh) =>
      sh.type === type ? { ...sh, color: randomPastelColor() } : sh
    );
    return prev;
  });
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { shapes: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.shapes)) return { shapes: [] };
    return {
      shapes: parsed.shapes.map((sh) => ({
        id: String(sh.id ?? generateId()),
        type: sh.type === "circle" ? "circle" : "square",
        color: String(sh.color ?? randomPastelColor()),
      })),
    };
  } catch {
    return { shapes: [] };
  }
}

function saveState(current) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {

  }
}
