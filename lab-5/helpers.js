export function randomPastelColor() {
  const h = Math.floor(Math.random() * 360); 
  const s = 75;
  const l = 75;
  return `hsl(${h}deg ${s}% ${l}%)`;
}

export function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return (
    "id-" +
    Math.random().toString(36).slice(2, 8) +
    "-" +
    Date.now().toString(36)
  );
}
