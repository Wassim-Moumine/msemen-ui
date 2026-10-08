const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

const track = (category, action, name) => window._paq?.push(["trackEvent", category, action, name]);

const preloader = $(".preloader");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

function fitHeroTitle() {
  const title = $(".hero__title");
  const line = $(".hero__title .line");
  if (!title || !line) return;
  title.style.fontSize = "";                                    // repart de la valeur CSS
  line.style.display = "inline-block";
  const ratio = line.getBoundingClientRect().width / parseFloat(getComputedStyle(title).fontSize);
  line.style.display = "";
  const available = title.clientWidth * 0.96;                   // petite marge de sécurité
  title.style.fontSize = Math.min(available / ratio, 448) + "px";
}
fitHeroTitle();
document.fonts?.ready.then(fitHeroTitle);

let heroWidth = 0;
new ResizeObserver(([entry]) => {
  const w = Math.round(entry.contentRect.width);
  if (w !== heroWidth) { heroWidth = w; fitHeroTitle(); }
}).observe($(".hero"));

if (typeof gsap === "undefined" || reduceMotion) {
  preloader?.remove();
  $$(".manifesto__text").forEach((el) => (el.style.opacity = 1));
  setupFiltersWithoutAnimation();
} else {
  init();
}

function init() {
  document.documentElement.classList.add("js");
  gsap.registerPlugin(ScrollTrigger, Flip);

    let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(target, { duration: 1.6 }) : target.scrollIntoView({ behavior: "smooth" });
    })
  );

    $$(".js-words").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="word">${w}</span>`).join(" ");
  });
  const giant = $(".footer__giant");
  giant.innerHTML = `<span class="line">${[...giant.textContent].map((c) => `<span class="char">${c}</span>`).join("")}</span>`;

    gsap.set(".hero__title .char", { yPercent: 115 });
  gsap.set(".hero__msemen", { scale: 0, rotation: -140, transformOrigin: "50% 50%" });
  gsap.set([".hero__tag", ".hero__lead", ".hero__bottom .btn", ".nav"], { y: 30, autoAlpha: 0 });

  const counter = { v: 0 };
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    .to(counter, {
      v: 100, duration: 1.6, ease: "power2.inOut",
      onUpdate: () => ($(".js-count").textContent = Math.round(counter.v)),
    })
    .to(".preloader__bar span", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
    .to(".preloader__inner", { yPercent: -60, autoAlpha: 0, duration: 0.6, ease: "power3.in" })
    .to(preloader, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2")
    .set(preloader, { display: "none" })
    .to(".hero__title .char", { yPercent: 0, duration: 1.4, stagger: 0.06 }, "-=0.55")
    .to(".hero__msemen", { scale: 1, rotation: -8, duration: 1.8, ease: "elastic.out(1, 0.6)" }, "-=1.1")
    .to([".nav", ".hero__tag", ".hero__lead", ".hero__bottom .btn"], { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, "-=1.4")
    .set(".nav", { clearProps: "transform" })
    .add(() => lenis?.start());

  gsap.set(".hero__visual", { xPercent: -50, yPercent: -50, x: 0, y: 0 });

  gsap.to(".hero__visual", { y: "+=14", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

    gsap.to(".hero__msemen", {
    yPercent: 120, rotation: 160, scale: 0.55, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__title", {
    yPercent: -25, autoAlpha: 0.2, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  if (finePointer) {
    gsap.set(".hero__visual", { transformPerspective: 800 });
    const rx = gsap.quickTo(".hero__visual", "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(".hero__visual", "rotationY", { duration: 0.8, ease: "power3" });
    $(".hero").addEventListener("mousemove", (e) => {
      ry((e.clientX / innerWidth - 0.5) * 40);
      rx(-(e.clientY / innerHeight - 0.5) * 40);
    });
  }

    const marquee = gsap.to(".marquee__track", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  ScrollTrigger.create({
    onUpdate: (self) => {
      const speed = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
      gsap.to(marquee, { timeScale: speed || self.direction, duration: 0.2, overwrite: true });
      gsap.to(marquee, { timeScale: self.direction, duration: 1.2, delay: 0.2 });
    },
  });

    const nav = $(".nav");
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      nav.classList.toggle("is-scrolled", self.scroll() > 40);
      nav.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 300);
    },
  });

    gsap.to(".manifesto__text .word", {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: ".manifesto__text", start: "top 80%", end: "bottom 45%", scrub: true },
  });

  $$("[data-count]").forEach((el) => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: +el.dataset.count, duration: 1.6, ease: "power3.out",
      onUpdate: () => (el.textContent = Math.round(obj.v)),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

    $$(".h2").forEach((h) =>
    gsap.from(h, {
      y: 80, autoAlpha: 0, duration: 1.3, ease: "expo.out",
      scrollTrigger: { trigger: h, start: "top 85%" },
    })
  );

    const mm = gsap.matchMedia();
  mm.add("(min-width: 821px)", () => {
    const track = $(".recipe__track");
    const distance = () => track.scrollWidth - innerWidth;

    const horizontal = gsap.to(track, {
      x: () => -distance(), ease: "none",
      scrollTrigger: {
        trigger: ".recipe", start: "top top", end: () => "+=" + distance(),
        pin: true, scrub: 1, invalidateOnRefresh: true,
      },
    });

    $$(".step").forEach((step) =>
      gsap.from(step, {
        rotation: 6, yPercent: 12, autoAlpha: 0.3, ease: "none",
        scrollTrigger: {
          trigger: step, containerAnimation: horizontal,
          start: "left 100%", end: "left 60%", scrub: true,
        },
      })
    );
  });

    const cards = $$(".card");
  gsap.set(cards, { autoAlpha: 0, y: 70 });
  ScrollTrigger.batch(cards, {
    start: "top 90%", once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }),
  });

  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      track("Déclinaisons", "Filtre", f);

      gsap.set(cards, { autoAlpha: 1, y: 0 });
      const state = Flip.getState(cards);
      cards.forEach((c) => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
      Flip.from(state, {
        duration: 0.8, ease: "power3.inOut", absolute: true, scale: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.4 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    })
  );

  if (finePointer) {
    cards.forEach((card) => {
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        gsap.to(card, {
          rotationY: ((e.clientX - r.left) / r.width - 0.5) * 10,
          rotationX: -((e.clientY - r.top) / r.height - 0.5) * 10,
          duration: 0.6, ease: "power3.out",
        });
      });
      card.addEventListener("mouseleave", () =>
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 1, ease: "elastic.out(1, 0.5)" })
      );
    });
  }

    gsap.fromTo(".n48__img-wrap",
    { clipPath: "inset(18% 14% 18% 14% round 22px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 22px)", ease: "none",
      scrollTrigger: { trigger: ".n48__figure", start: "top 90%", end: "center 55%", scrub: true },
    }
  );
  gsap.fromTo(".n48__img-wrap img", { yPercent: -12, scale: 1.15 }, {
    yPercent: 0, scale: 1, ease: "none",
    scrollTrigger: { trigger: ".n48", start: "top bottom", end: "bottom top", scrub: true },
  });
  gsap.fromTo(".n48__big", { xPercent: 20 }, {
    xPercent: -15, ease: "none",
    scrollTrigger: { trigger: ".n48", start: "top bottom", end: "bottom top", scrub: true },
  });
  gsap.from(".n48__text p", {
    y: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: ".n48__text p", start: "top 85%" },
  });

    gsap.from(".pairings__list li", {
    x: -80, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: "expo.out",
    scrollTrigger: { trigger: ".pairings__list", start: "top 80%" },
  });
  gsap.from(".footer__giant .char", {
    yPercent: 110, duration: 1.2, stagger: 0.05, ease: "expo.out",
    scrollTrigger: { trigger: ".footer__giant", start: "top 95%" },
  });

    if (finePointer) {
    const cursor = $(".cursor");
    const label = $(".cursor__label");
    const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener("mousemove", (e) => { cx(e.clientX); cy(e.clientY); });

    $$("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => { label.textContent = el.dataset.cursor; cursor.classList.add("is-big"); });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-big"));
    });

    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.35,
          y: (e.clientY - r.top - r.height / 2) * 0.35,
          duration: 0.5, ease: "power3.out",
        });
      });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" }));
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}

function setupFiltersWithoutAnimation() {
  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      $$(".card").forEach((c) => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
    })
  );
}
