(() => {
  const header = document.querySelector(".header");
  const toggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav-bar");
  const links = nav ? nav.querySelectorAll("a") : [];

  if (!header || !toggle || !nav) return;

  // Acessibilidade
  if (!nav.id) nav.id = "mainNav";
  toggle.setAttribute("aria-controls", nav.id);
  toggle.setAttribute("aria-expanded", "false");

  const openMenu = () => {
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const isOpen = () => header.classList.contains("nav-open");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // Fecha ao clicar em qualquer link do menu
  links.forEach((a) => a.addEventListener("click", closeMenu));

  // Fecha ao clicar fora do menu
  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    const clickInside = nav.contains(e.target) || toggle.contains(e.target);
    if (!clickInside) closeMenu();
  });

  // Fecha no ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  // Se redimensionar para desktop, garante que o menu não fica travado aberto
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && isOpen()) closeMenu();
  });
})();