const root = document.documentElement;
const toggle = document.querySelector("#theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function syncThemeControl() {
  const dark = root.dataset.theme === "dark";
  toggle.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}" aria-hidden="true"></i>`;
  toggle.setAttribute("aria-label", dark ? "切换到浅色主题" : "切换到深色主题");
  toggle.setAttribute("title", dark ? "切换到浅色主题" : "切换到深色主题");
  themeColor.content = dark ? "#24213f" : "#f3efec";
  renderIcons();
}

toggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  syncThemeControl();
});

const hero = document.querySelector(".hero");

if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    hero.style.setProperty("--shift-x", `${x * 10}px`);
    hero.style.setProperty("--shift-y", `${y * 8}px`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--shift-x", "0px");
    hero.style.setProperty("--shift-y", "0px");
  });
}

window.addEventListener("DOMContentLoaded", syncThemeControl);
