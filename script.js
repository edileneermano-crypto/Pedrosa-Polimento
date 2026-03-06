/* =====================================================
   Pedrosa Polimento - Script
===================================================== */

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupScrollReveal();
  setupCardGlow();
  setupForm();
});


/* =====================================================
   UI / INTERAÇÕES
===================================================== */

/* ===== Scroll para contato ===== */
function irParaContato() {
  const contato = document.getElementById("contato");
  if (contato) {
    contato.scrollIntoView({
      behavior: "smooth"
    });
  }
}


/* =====================================================
   EFEITOS VISUAIS
===================================================== */

/* ===== Glow nos cards ===== */
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


/* ===== Scroll Reveal ===== */
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


/* =====================================================
   MENU MOBILE
===================================================== */

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

  /* fechar ao clicar nos links */
  nav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", closeMenu);

  });

  /* fechar com ESC */
  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") closeMenu();

  });

  /* fechar clicando fora */
  document.addEventListener("click", (e) => {

    if (!isMenuOpen()) return;

    const insideMenu = nav.contains(e.target);
    const toggleClick = toggle.contains(e.target);

    if (!insideMenu && !toggleClick) closeMenu();

  });

  /* reset ao voltar para desktop */
  window.addEventListener("resize", () => {

    if (window.innerWidth > 980) closeMenu();

  });

}


/* =====================================================
   FORMULÁRIO DE ORÇAMENTO
===================================================== */

function setupForm(){

  const form = document.getElementById("form-orcamento");
  const statusMsg = document.getElementById("form-status");
  const btnEnviar = document.getElementById("btn-enviar");

  if(!form) return;

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const mensagem = document.getElementById("servico").value.trim();

    statusMsg.textContent = "Enviando sua solicitação...";
    statusMsg.className = "form-status enviando";

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    try{

      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("mensagem", mensagem);

      formData.append("_subject", "Novo orçamento - Pedrosa Polimento");
      formData.append("_captcha", "false");
      formData.append("_template", "table");

      const resposta = await fetch(
        "https://formsubmit.co/ajax/pedrosapolimento@gmail.com",
        {
          method:"POST",
          body:formData,
          headers:{
            "Accept":"application/json"
          }
        }
      );

      if(resposta.ok){

        statusMsg.textContent =
        "Solicitação enviada com sucesso! Abrindo WhatsApp...";
        statusMsg.className = "form-status sucesso";

        const textoWhatsapp = `Olá, gostaria de solicitar um orçamento.

Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}

Produtos / Serviços:
${mensagem}`;

        const numeroWhatsapp = "5511911230474";

        const url =
        `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(textoWhatsapp)}`;

        form.reset();

        setTimeout(()=>{
          window.open(url,"_blank");
        },1200);

      } else {

        throw new Error("Erro no envio");

      }

    } catch(error){

      statusMsg.textContent =
      "Não foi possível enviar agora. Tente novamente.";

      statusMsg.className = "form-status erro";

    }

    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar Orçamento ✈";

  });

}