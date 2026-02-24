/* carrosel.js
   Slider estilo Traktion:
   - card ativo central
   - autoplay a cada 7s, reseta ao interagir
*/

(() => {
  const services = [
    {
      title: "Panfletagem Estratégica e Distribuição Inteligente",
      desc: "entrega de panfletos com precisão e foco no seu público-alvo",
      img: "midia/servico-planfletagem.png",
      cta: "panfletagem.html"
    },
    {
      title: "Ações Promocionais e Eventos no Ponto de Venda",
      desc: "promoções e eventos no ponto de compra para aumentar engajamento",
      img: "midia/servico-acoes-promocionais.png",
      cta: "acoes-promocionais.html"
    },
    {
      title: "Marketing de Presença e Ativação de Marca",
      desc: "estratégias que conectam sua marca com o público de forma memorável",
      img: "midia/servico-marketing-presenca.png",
      cta: "marketing-presenca.html"
    }
  ];

  const track = document.getElementById("tcTrack");
  const viewport = document.getElementById("tcViewport");
  const nameEl = document.getElementById("tcName");
  const descEl = document.getElementById("tcDesc");
  const ctaEl = document.getElementById("tcCta");
  const dotsEl = document.getElementById("tcDots");

  const prevBtn = document.getElementById("tcPrev");
  const nextBtn = document.getElementById("tcNext");
  const section = document.getElementById("services"); // aqui

  if (!track || !viewport || !nameEl || !descEl || !ctaEl || !dotsEl || !prevBtn || !nextBtn || !section) {
    console.warn("[carrosel.js] Elementos não encontrados. Verifique IDs/classes do HTML.");
    return;
  }

  let active = 0;
  let cards = [];
  let dots = [];

  let autoTimer = null;
  const AUTO_DELAY = 7000;

  let isAnimating = false;
  const ANIM_MS = 520;

  // Guarda o X atual do track de forma estável
  let currentX = 0;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function build() {
    track.innerHTML = "";
    dotsEl.innerHTML = "";
    cards = [];
    dots = [];

    const imgs = [];

    services.forEach((s, idx) => {
      const card = document.createElement("div");
      card.className = "tc-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", s.title);

      card.innerHTML = `
        <img src="${s.img}" alt="${s.title}">
        <div class="tc-card-meta">
          <div class="tc-card-title">${s.title}</div>
          <div class="tc-card-sub"><a href="${s.cta}">ver detalhes</a></div>
        </div>
      `;

      const imgEl = card.querySelector("img");
      imgs.push(imgEl);

      card.addEventListener("click", () => {
        setActive(idx);
        resetAuto();
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActive(idx);
          resetAuto();
        }
      });

      track.appendChild(card);
      cards.push(card);

      const dot = document.createElement("button");
      dot.className = "tc-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir para item ${idx + 1}`);
      dot.addEventListener("click", () => {
        setActive(idx);
        resetAuto();
      });

      dotsEl.appendChild(dot);
      dots.push(dot);
    });

    apply();

    // Centraliza imediatamente após inserir no DOM
    requestAnimationFrame(() => {
      center(true);
    });

    // Recentraliza quando as imagens carregarem (evita pulo/sumiço por layout)
    waitImages(imgs).then(() => {
      center(true);
    });

    startAuto();
  }

  function waitImages(imgs) {
    return new Promise((resolve) => {
      if (!imgs.length) return resolve();

      let done = 0;
      const finish = () => {
        done += 1;
        if (done >= imgs.length) resolve();
      };

      imgs.forEach((img) => {
        if (img.complete) return finish();
        img.addEventListener("load", finish, { once: true });
        img.addEventListener("error", finish, { once: true });
      });
    });
  }

  function apply() {
    const s = services[active];
    nameEl.textContent = s.title;
    descEl.textContent = s.desc;
    ctaEl.href = s.cta;

    cards.forEach((c, idx) => {
      c.classList.toggle("is-active", idx === active);
      c.classList.toggle("is-near", Math.abs(idx - active) === 1);
    });

    dots.forEach((d, idx) => {
      d.classList.toggle("is-active", idx === active);
    });
  }

  function setActive(idx) {
    if (isAnimating) return;

    isAnimating = true;
    active = (idx + services.length) % services.length;

    apply();
    center(false);

    window.setTimeout(() => {
      isAnimating = false;
    }, ANIM_MS);
  }

  function center(isInstant) {
    const card = cards[active];
    if (!card) return;

    // Medidas estáveis
    const viewportWidth = viewport.clientWidth;
    const trackWidth = track.scrollWidth;

    // Centro do viewport (em coordenadas do track)
    const viewportCenter = viewportWidth / 2;

    // Centro do card dentro do track (offsetLeft não depende do transform)
    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);

    // X desejado: colocar o centro do card no centro do viewport
    let targetX = viewportCenter - cardCenter;

    // Clamp para não "passar" do começo/fim e sumir cards
    // maxX = 0 (track alinhado à esquerda do viewport)
    // minX = viewportWidth - trackWidth (track alinhado à direita do viewport)
    const maxX = 0;
    const minX = viewportWidth - trackWidth;

    targetX = clamp(targetX, minX, maxX);

    currentX = targetX;

    if (isInstant) {
      const prevTransition = track.style.transition;
      track.style.transition = "none";
      track.style.transform = `translate3d(${currentX}px, -50%, 0)`;
      track.getBoundingClientRect(); // força reflow
      track.style.transition = prevTransition || "";
      return;
    }

    track.style.transform = `translate3d(${currentX}px, -50%, 0)`;
  }

  // Controles manuais
  prevBtn.addEventListener("click", () => {
    setActive(active - 1);
    resetAuto();
  });

  nextBtn.addEventListener("click", () => {
    setActive(active + 1);
    resetAuto();
  });

  // Autoplay seguro
  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      setActive(active + 1);
    }, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // Responsivo
  window.addEventListener("resize", () => {
    center(true);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();

