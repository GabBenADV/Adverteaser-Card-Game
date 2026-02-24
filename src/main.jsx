import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const ROOT_IDS = ["mini3d-root", "root"]; // CMS usa mini3d-root, Vite index.html usa root

function findHost() {
  for (const id of ROOT_IDS) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

function unmount(el) {
  if (el?.__reactRoot) {
    el.__reactRoot.unmount();
    delete el.__reactRoot;
  }
}

function mount() {
  const el = findHost();
  if (!el) return;

  // evita doppio mount
  if (el.__reactRoot) return;

  const root = createRoot(el);
  el.__reactRoot = root;

  root.render(
    // <React.StrictMode>
      <App />
    // </React.StrictMode>
  );
}

// Primo load classico
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}

// Supporto Barba: su navigazione AJAX DOMContentLoaded non scatta
if (window.barba?.hooks) {
  window.barba.hooks.beforeLeave(() => {
    const el = findHost();
    if (el) unmount(el);
  });
  window.barba.hooks.afterEnter(() => {
    mount();
  });
}
