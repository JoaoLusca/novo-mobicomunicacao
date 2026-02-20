(function(){
    const section = document.querySelector("#quotes");
    if (!section) return;

    const cards = Array.from(section.querySelectorAll(".quote-track .card"));
    const btnPrev = section.querySelector(".quote-nav.prev");
    const btnNext = section.querySelector(".quote-nav.next");

    if (cards.length === 0) return;

    let index = Math.max(0, cards.findIndex(c => c.classList.contains("active")));
    if (index === -1) index = 0;

    function mod(n, m){ return ((n % m) + m) % m; }

    function render(){
      const prev = mod(index - 1, cards.length);
      const next = mod(index + 1, cards.length);

      cards.forEach((card, i) => {
        card.classList.remove("is-prev", "is-active", "is-next", "active");
        if (i === prev) card.classList.add("is-prev");
        if (i === index) card.classList.add("is-active", "active");
        if (i === next) card.classList.add("is-next");
      });
    }

    function goPrev(){
      index = mod(index - 1, cards.length);
      render();
    }

    function goNext(){
      index = mod(index + 1, cards.length);
      render();
    }

    btnPrev && btnPrev.addEventListener("click", goPrev);
    btnNext && btnNext.addEventListener("click", goNext);

    // Teclado
    section.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    });
    section.tabIndex = 0;

    // Swipe simples
    let startX = null;
    section.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    section.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX;
      startX = null;

      if (Math.abs(delta) > 40){
        if (delta > 0) goPrev();
        else goNext();
      }
    }, { passive: true });

    render();
  })();