/* =========================
   Pedrosa Polimento - Script
========================= */

document.addEventListener("DOMContentLoaded", () => {
  setupButtons();
  setupCardGlow();
  setupScrollReveal();
  setupMobileMenu();
});

/* =========================
   1) Botões (CTA)
========================= */
function setupButtons() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Entre em contato conosco para solicitar um orçamento!");
    });
  });
}

/* =========================
   2) Glow / Brilho nos Cards
   - aplica em .card e .video
   - usa variáveis CSS --mx/--my
========================= */
function setupCardGlow() {
  const elements = document.querySelectorAll(".card, .video");
  if (!elements.length) return;

  elements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    });

    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    });
  });
}

/* =========================
   3) Scroll Reveal
   - elementos com .reveal ganham .is-visible
========================= */
function setupScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* =========================
   4) Menu Hambúrguer (Mobile)
   Requisitos no HTML:
   - botão: .menu-toggle
   - nav: .nav (com id="menu")
========================= */
function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (!toggle || !nav) return;

  const openMenu = () => {
    nav.classList.add("is-open");
    toggle.classList.add("is-active");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
  };

  const isMenuOpen = () => nav.classList.contains("is-open");

  toggle.addEventListener("click", () => {
    isMenuOpen() ? closeMenu() : openMenu();
  });

  // Fecha ao clicar em qualquer link do menu
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  // Fecha ao apertar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Fecha se clicar fora do menu (opcional, mas fica profissional)
  document.addEventListener("click", (e) => {
    if (!isMenuOpen()) return;

    const clickedInsideMenu = nav.contains(e.target);
    const clickedToggle = toggle.contains(e.target);

    if (!clickedInsideMenu && !clickedToggle) closeMenu();
  });

  // Se voltar pro desktop, fecha pra não ficar “aberto” preso
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });
}