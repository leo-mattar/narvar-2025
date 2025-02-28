// --- GSAP
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

let mm = gsap.matchMedia();

// --------------- CUSTOM EASE ---------------
CustomEase.create("ease-out-1", "0.25, 1, 0.5, 1");
CustomEase.create("ease-in-out-1", "0.87, 0, 0.13, 1");

// --------------- GLOBAL - RELOAD AT THE TOP ---------------
window.addEventListener("beforeunload", function () {
  history.scrollRestoration = "manual";
});

// --------------- LENIS ---------------
window.lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --------------- PAPER TIGET SIGNATURE ---------------
const pprtgr = [
  'color: #F2F3F3',
  'background: #080808',
  'font-size: 12px',
  'padding-left: 10px',
  'line-height: 2',
  'border-left: 5px solid #ff3c31',
].join(';');
console.info(`

%cWebsite by Paper Tiger${' '}
www.papertiger.com${'     '}

`, pprtgr);

// --------------- CURRENT YEAR ---------------
const currentYear = document.querySelector('[current-year]');
if (currentYear) {
  currentYear.innerHTML = new Date().getFullYear();
}

// --------------- GLOBAL FADE ---------------
function fade() {
  const fadeElements = document.querySelectorAll("[fade]");

  gsap.set(fadeElements, { opacity: 0, y: "5em" });

  ScrollTrigger.batch("[fade]", {
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "ease-out-1",
        stagger: 0.15,
      }),
  });
}

// --------------- PRESS COVERAGE SLIDER ---------------
function pressCoverageSlider() {
  const thumbs = document.querySelectorAll(".c-press-card");
  const slides = document.querySelectorAll(".c-press-main-item");

  if (thumbs.length === 0 || slides.length === 0) return;

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", function () {

      // Thumb
      thumbs.forEach(otherThumbs => otherThumbs.classList.remove("is-active"));
      thumb.classList.add("is-active");

      // Slide
      slides.forEach(otherSlides => otherSlides.classList.remove("is-active"));
      slides[index].classList.add("is-active");

    });
  });
}

// --------------- VIMEO MODAL ---------------
function videoModal() {
  const modal = document.querySelector("[data-modal='vimeo']");
  const iframe = document.querySelector("[data-modal='vimeo'] iframe");
  const trigger = document.querySelector("[data-modal='vimeo-trigger']");
  const modalCloseBtn = document.querySelector("[data-modal='vimeo'] .c-modal-close-btn");
  const body = document.querySelector("body");

  if (!modal || !iframe) return;

  // Initialize the Vimeo Player instance
  const player = new Vimeo.Player(iframe);

  function openModal() {
    lenis.stop();
    modal.classList.add("is-open");
    player.play();
  }

  function closeModal() {
    lenis.start();
    modal.classList.remove("is-open");
    player.pause();
    body.classList.remove("no-scroll");
  }

  trigger.addEventListener("click", openModal);
  modalCloseBtn.addEventListener("click", closeModal);

  // Close the modal when clicking outside the iframe or modal content
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

// --------------- TICKER/LOGO BAR ---------------
function ticker() {
  const tickerSection = document.querySelector(
    "[data-wf--section-logo-bar--section-settings-style='ticker']");
  if (!tickerSection) return;

  const ticker = tickerSection.querySelector(".c-ticker");
  const logoList = tickerSection.querySelector(".c-ticker-list");
  if (!logoList || !ticker) return;

  const duplicatedList = logoList.cloneNode(true);
  ticker.appendChild(duplicatedList);

  const logoItems = tickerSection.querySelectorAll(".c-ticker-item").length;
  const marqueeDuration = window.innerWidth <= 479 ? logoItems * 1.8 : logoItems * 3;

  const tl = gsap.timeline();
  tl.to([logoList, duplicatedList], {
    xPercent: -100,
    duration: marqueeDuration,
    ease: "linear",
    repeat: -1
  });
}

// --------------- DUPLEX ACCORDIONS ---------------
function duplexAccordions() {
  const accordions = document.querySelectorAll(".c-ac-item");
  const images = document.querySelectorAll(".c-img-contain.ac-photo");
  const accordionsWrap = document.querySelector(".c-duplex_lt-ac");
  let active;

  if (accordions.length === 0) return;

  accordions.forEach((accordion, index) => {
    const txtWrap = accordion.querySelector(".c-ac-item-txt-wrap");
    const activeBar = accordion.querySelector(".c-ac-bar");

    // Animation
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power4.inOut",
        duration: 0.8,
      }
    });

    tl.to(txtWrap, { height: "auto" });
    tl.to(activeBar, { height: "100%" }, 0);

    accordion.tl = tl;

    // Event
    accordion.addEventListener("click", function () {

      accordions.forEach(otherAccordions => otherAccordions.classList.remove("is-active"));
      accordion.classList.add("is-active");

      images.forEach(otherAccordions => otherAccordions.classList.remove("is-active"));
      images[index].classList.add("is-active");

      if (active) active.tl.reverse();

      tl.play();
      active = accordion;

    });
  });

  // Open first accordion when in view
  ScrollTrigger.create({
    trigger: accordionsWrap,
    start: "top bottom",
    once: true,
    onEnter: () => {
      accordions[0].click();
    }
  });
}

// --------------- HERO SECTION ---------------
function heroAnimation() {
  const shape = document.querySelector(".c-img.hero-comp-circle");
  const image = document.querySelector(".c-img.hero-comp-visual");

  if (!shape) return;

  gsap.to(shape, {
    rotation: 360,
    duration: 90,
    ease: "linear",
    repeat: -1,
  });

  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 1 },
  });

  tl.to(shape, { opacity: 1 }, "<0.2");
  tl.to(image, { opacity: 1 }, "<0.2");
}

// --------------- HEADER SCROLLED ---------------
function headerScrolled() {
  const header = document.querySelector(".c-header-main");

  if (!header) return;

  ScrollTrigger.create({
    trigger: "body",
    start: "100 top",
    onToggle: (self) => {
      if (self.isActive) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });
}

// --------------- HEADER DESKTOP ---------------
function headerDesktop() {
  if (!document.querySelector(".c-header-main")) return;

  let cleanupListeners = []; // Array to store cleanup functions

  // --- HEADER DROPDOWN LINKS
  const overlay = document.querySelector(".c-header-overlay");
  const ddItems = document.querySelectorAll(".c-header-main-dd-item");
  const listItems = document.querySelectorAll(".c-header-main-dd-group");

  ddItems.forEach(item => {
    const list = item.querySelector(".c-header-main-dd-group");
    const toggle = item.querySelector(".c-header-main-dd-toggle");

    const toggleHandler = function (event) {
      event.stopPropagation();

      // Close all other items and remove .is-active from them
      ddItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("is-active");
          const otherList = otherItem.querySelector(".c-header-main-dd-group");
          if (otherList) {
            otherList.classList.remove("is-open");
          }
        }
      });

      // Toggle the current item
      list.classList.toggle("is-open");
      item.classList.toggle("is-active");

      // Check if any dropdown is open and toggle overlay accordingly
      const isAnyDropdownOpen = [...ddItems].some(item =>
        item.classList.contains("is-active")
      );
      overlay.classList.toggle("is-active", isAnyDropdownOpen);
    };

    toggle.addEventListener("click", toggleHandler);
    cleanupListeners.push(() =>
      toggle.removeEventListener("click", toggleHandler)
    );
  });

  // --- LANGUAGE SWITCHER
  const langSwitcher = document.querySelector(".c-lang-switcher");
  const langSwitcherHandler = function (event) {
    event.stopPropagation();
    langSwitcher.classList.toggle("is-open");
  };
  langSwitcher.addEventListener("click", langSwitcherHandler);
  cleanupListeners.push(() =>
    langSwitcher.removeEventListener("click", langSwitcherHandler)
  );

  // --- CLOSE ITEMS WHEN CLICKING OUTSIDE
  const documentClickHandler = function (event) {
    // Check if the click target is inside any dropdown or the language switcher
    const isClickInsideDropdown = [...ddItems].some(item =>
      item.contains(event.target)
    );
    const isClickInsideLangSwitcher = langSwitcher.contains(event.target);

    // If the click is outside both, close the dropdowns and language switcher
    if (!isClickInsideDropdown && !isClickInsideLangSwitcher) {
      ddItems.forEach(item => item.classList.remove("is-active"));
      listItems.forEach(item => item.classList.remove("is-open"));
      langSwitcher.classList.remove("is-open");
      overlay.classList.remove("is-active");
    }
  };
  document.addEventListener("click", documentClickHandler);
  cleanupListeners.push(() =>
    document.removeEventListener("click", documentClickHandler)
  );

  // --- CLOSE ITEMS ON ESC KEY PRESS
  const escKeyHandler = function (event) {
    if (event.key === "Escape") {
      ddItems.forEach(item => item.classList.remove("is-active"));
      listItems.forEach(item => item.classList.remove("is-open"));
      langSwitcher.classList.remove("is-open");
      overlay.classList.remove("is-active");
    }
  };
  document.addEventListener("keydown", escKeyHandler);
  cleanupListeners.push(() =>
    document.removeEventListener("keydown", escKeyHandler)
  );

  // Return cleanup function
  return () => cleanupListeners.forEach(cleanup => cleanup());
}

// --------------- HEADER MOBILE ---------------
function headerMobile() {
  if (!document.querySelector(".c-header-main")) return;
  let cleanupListeners = []; // Array to store cleanup functions

  const trigger = document.querySelector(".c-header-main-btn");
  const nav = document.querySelector(".c-header-main-nav");
  const navInnerWrap = document.querySelector(".c-header-main-inner");
  const headerRight = document.querySelector(".c-header-main_rt");
  const menuLine1 = document.querySelectorAll(".c-nav-bar.is-1");
  const menuLine2 = document.querySelectorAll(".c-nav-bar.is-2");
  const menuLine3 = document.querySelectorAll(".c-nav-bar.is-3");
  const newsBar = document.querySelector(".c-news-bar");
  let navStatus = "closed";

  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "ease-in-out-1",
      duration: 0.8,
    },
  });

  gsap.set(menuLine1, { transformOrigin: "center center" });
  gsap.set(menuLine2, { transformOrigin: "center center" });
  gsap.set(menuLine3, { transformOrigin: "center center" });

  tl.fromTo(
    nav, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }
  );
  tl.to(menuLine1, { rotation: 45, y: 6 }, 0);
  tl.to(menuLine2, { width: 0 }, 0);
  tl.to(menuLine3, { rotation: -45, y: -6 }, 0);
  tl.to(newsBar, { height: 0 }, 0);

  const triggerHandler = function () {
    if (navStatus === "closed") {
      tl.restart();
      lenis.stop();
      navStatus = "open";
    } else {
      tl.reverse();
      lenis.start();
      navStatus = "closed";
    }
  };
  trigger.addEventListener("click", triggerHandler);
  cleanupListeners.push(() =>
    trigger.removeEventListener("click", triggerHandler)
  );

  // Accordions
  let accordions = document.querySelectorAll(".c-header-main-dd-item");
  let active = null;

  accordions.forEach(accordion => {
    const list = accordion.querySelector(".c-header-main-dd-group");
    let tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.8,
        ease: "ease-in-out-1",
      },
    });

    tl.to(list, { height: "auto", opacity: 1 });

    accordion.tl = tl;

    const accordionHandler = function (e) {
      e.stopPropagation();

      if (active && active === accordion) {
        // If clicking the already active accordion, close it
        accordion.tl.reverse();
        active = null; // Reset active since it's closed
      } else {
        if (active) active.tl.reverse(); // Close the previously active accordion
        accordion.tl.play(); // Open the clicked accordion
        active = accordion; // Set the new active accordion
      }
    };
    accordion.addEventListener("click", accordionHandler);
    cleanupListeners.push(() =>
      accordion.removeEventListener("click", accordionHandler)
    );
  });

  // Header right
  nav.appendChild(headerRight);
  gsap.set(headerRight, { display: "flex" });

  // Language Switcher
  const langSwitcher = document.querySelector(".c-lang-switcher");
  const langSwitcherHandler = function (event) {
    event.stopPropagation();
    langSwitcher.classList.toggle("is-open");
  };
  langSwitcher.addEventListener("click", langSwitcherHandler);
  cleanupListeners.push(() =>
    langSwitcher.removeEventListener("click", langSwitcherHandler)
  );

  const documentClickHandler = function (event) {
    const isClickInsideLangSwitcher = langSwitcher.contains(event.target);

    if (!isClickInsideLangSwitcher) {
      langSwitcher.classList.remove("is-open");
    }
  };
  document.addEventListener("click", documentClickHandler);
  cleanupListeners.push(() =>
    document.removeEventListener("click", documentClickHandler)
  );

  // Return cleanup function
  return () => cleanupListeners.forEach(cleanup => cleanup());
}

// --------------- NETWORK ANIMATION ---------------
function networkSection() {
  const networkSection = document.querySelector(".c-section.network");
  if (!networkSection) return;

  function networkAnimation() {
    const glow = document.querySelector(".c-img.assist-logo-glow");

    const tl = gsap.timeline({
      defaults: { ease: "linear", duration: 2.4 },
      repeat: -1,
      repeatDelay: 3,
    });

    tl.to(glow, { opacity: 0.65 });
    tl.to(glow, { opacity: 1 });
  }

  function assistBallOne() {
    const assistPath = document.querySelector("#assist-path-1");
    const assistBall = document.querySelectorAll(".c-assist-ball-1");

    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: "#network-section",
        start: "top 70%",
      },
    });

    tl.to(assistBall, {
      duration: 7,
      repeatDelay: 0,
      ease: "power1.inOut",
      motionPath: {
        path: assistPath,
        align: assistPath,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
      opacity: 0,
      stagger: 2.4,
    });
  }

  function assistBallTwo() {
    const assistPath = document.querySelector("#assist-path-2");
    const assistBall = document.querySelectorAll(".c-assist-ball-2");

    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: "#network-section",
        start: "top 70%",
      },
    });

    tl.to(assistBall, {
      duration: 8,
      repeatDelay: 0,
      ease: "power1.inOut",
      motionPath: {
        path: assistPath,
        align: assistPath,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
      opacity: 0,
      stagger: 2.6,
    });
  }

  function assistBallThree() {
    const assistPath = document.querySelector("#assist-path-3");
    const assistBall = document.querySelectorAll(".c-assist-ball-3");

    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: "#network-section",
        start: "top 70%",
      },
    });

    tl.to(assistBall, {
      duration: 9,
      repeatDelay: 0,
      ease: "power1.inOut",
      motionPath: {
        path: assistPath,
        align: assistPath,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
      opacity: 0,
      stagger: 2.8,
    });
  }

  function assistBallFour() {
    const assistPath = document.querySelector("#assist-path-4");
    const assistBall = document.querySelectorAll(".c-assist-ball-4");

    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: "#network-section",
        start: "top 70%",
      },
    });

    tl.to(assistBall, {
      duration: 10,
      repeatDelay: 0,
      ease: "power1.inOut",
      motionPath: {
        path: assistPath,
        align: assistPath,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
      opacity: 0,
      stagger: 3,
    });
  }

  function assistBallFive() {
    const assistPath = document.querySelector("#assist-path-5");
    const assistBall = document.querySelectorAll(".c-assist-ball-5");

    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: "#network-section",
        start: "top 70%",
      },
    });

    tl.to(assistBall, {
      duration: 11,
      repeatDelay: 0,
      ease: "power1.inOut",
      motionPath: {
        path: assistPath,
        align: assistPath,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
      opacity: 0,
      stagger: 3.2,
    });
  }

  networkAnimation();
  assistBallOne();
  assistBallTwo();
  assistBallThree();
  assistBallFour();
  assistBallFive();
}

// --------------- BOXES ANIMATION ---------------
function boxesAnimation() {
  const boxes = document.querySelectorAll(".c-box");

  if (boxes.length === 0) return;

  boxes.forEach(box => {
    const circles = box.querySelectorAll(".c-box-circle");

    gsap.to(circles, {
      duration: 7,
      ease: "linear",
      y: 300,
      stagger: 2,
      repeat: -1,
    });
  });
}

// --------------- INFINITE ROTATION ---------------
function infiniteRotation() {
  const shape = document.querySelector("[data-rotate]");

  if (!shape) return;

  gsap.to(shape, {
    rotation: 360,
    duration: 90,
    ease: "linear",
    repeat: -1,
  });
}

// --------------- TICKER/LOGO BAR ---------------
function galleryMarquee() {
  const gallerySection = document.querySelector(".c-section.gallery-marquee");
  if (!gallerySection) return;

  const ticker = gallerySection.querySelector(".c-ticker-gallery");
  const galleryList = gallerySection.querySelector(".c-ticker-list.gallery");
  if (!galleryList || !ticker) return;

  const duplicatedList = galleryList.cloneNode(true);
  ticker.appendChild(duplicatedList);

  const logoItems = gallerySection.querySelectorAll(".c-ticker-item").length;
  const marqueeDuration = window.innerWidth <= 479 ? logoItems * 1.8 : logoItems * 3;

  const tl = gsap.timeline();
  tl.to([galleryList, duplicatedList], {
    xPercent: -100,
    duration: marqueeDuration,
    ease: "linear",
    repeat: -1
  });
}

// --------------- HOME HERO STICKY ---------------
function homeHeroSticky() {
  const section = document.querySelector(".c-section.hm-custom-hero");

  if (!section) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onLeave: () => {
      section.classList.add("unpin");
    },
    onEnterBack: () => {
      section.classList.remove("unpin");
    },
  });
}

// --------------- RESOURCES FILTERS ---------------
function resourcesFilter() {
  const filterSection = document.querySelector(".c-section.re-filter");
  if (!filterSection) return;

  const buttons = [
    ...document.querySelectorAll(".c-pagination-btn"),
    ...document.querySelectorAll(".c-pagination-page-btn"),
  ];

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("checking")
        lenis.scrollTo(filterSection, { offset: -80 });
      }, 200);
    });
  });

}
window.resourcesFilter = resourcesFilter;

function resourceAPIChecker() {
  const filterSection = document.querySelector(".c-section.re-filter");
  if (!filterSection) return;

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    filterInstances => {
      const [filterInstance] = filterInstances;

      filterInstance.listInstance.on("renderitems", renderedItems => {
        resourcesFilter();
      });
    },
  ]);
}

// --------------- HEADER SKIP LINK ---------------
function skipLink() {
  const link = document.querySelector(".c-skip-link");
  const wrapper = document.querySelector(".o-wrapper");

  if (!link || !wrapper) return;

  link.addEventListener("click", function (e) {
    e.preventDefault();
    wrapper.setAttribute("tabindex", "-1");
    wrapper.focus();
    lenis.scrollTo(80);
  });

  link.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
    wrapper.setAttribute("tabindex", "-1");
    wrapper.focus();
    lenis.scrollTo(80);
  });
}

// function resourcesFeaturedSlider() {
//   const slider = new Swiper(".swiper.re-featured", {
//     slidesPerView: 1,
//     speed: 600,
//     pagination: {
//       el: ".swiper-pagination.re-featured",
//       clickable: true,
//     },
//     effect: 'fade',
//     fadeEffect: {
//       crossFade: true
//     },
//   });

//   let swiperPagination = document.querySelector(".swiper-pagination.re-featured");
//   let slides = document.querySelectorAll(".swiper-slide.re-featured");

//   if (swiperPagination && slides.length) {
//     slides.forEach(slide => {
//       let placeholder = slide.querySelector(".holder-slide-pagination-placeholder");
//       if (placeholder) {
//         let clonedPagination = swiperPagination.cloneNode(true);
//         placeholder.appendChild(clonedPagination);
//       }
//     });
//   }

// }

// function resourcesFeaturedSlider() {
//   const slider = new Swiper(".swiper.re-featured", {
//     slidesPerView: 1,
//     speed: 600,
//     pagination: {
//       el: ".swiper-pagination.re-featured",
//       clickable: true,
//     },
//     effect: "fade",
//     fadeEffect: {
//       crossFade: true,
//     },
//     on: {
//       init: function () {
//         const original = document.querySelector(".swiper-pagination.re-featured");
//         if (original) original.style.display = "none";
//         clonePaginationAndAttachEvents(this);
//         updateClonedActiveBullet(this.realIndex);
//       },
//     },
//   });

//   slider.on("slideChange", function () {
//     updateClonedActiveBullet(slider.realIndex);
//   });
// }

// function clonePaginationAndAttachEvents(sliderInstance) {
//   const swiperPagination = document.querySelector(".swiper-pagination.re-featured");
//   const slides = document.querySelectorAll(".swiper-slide.re-featured");

//   if (swiperPagination && slides.length) {
//     slides.forEach(slide => {
//       const placeholder = slide.querySelector(".holder-slide-pagination-placeholder");
//       if (placeholder) {
//         const clonedPagination = swiperPagination.cloneNode(true);
//         clonedPagination.style.display = "flex";
//         placeholder.appendChild(clonedPagination);
//         const bullets = clonedPagination.querySelectorAll(".swiper-pagination-bullet");
//         bullets.forEach((bullet, index) => {
//           bullet.addEventListener("click", e => {
//             e.preventDefault();
//             sliderInstance.slideToLoop(index);
//           });
//         });
//       }
//     });
//   }
// }

// function updateClonedActiveBullet(activeIndex) {
//   document
//     .querySelectorAll(
//       ".swiper-slide.re-featured .holder-slide-pagination-placeholder .swiper-pagination.re-featured"
//     )
//     .forEach(clonedPagination => {
//       const bullets = clonedPagination.querySelectorAll(".swiper-pagination-bullet");
//       bullets.forEach((bullet, index) => {
//         bullet.classList.toggle("swiper-pagination-bullet-active", index === activeIndex);
//       });
//     });
// }

// --------------- RESOURCES FEATURED SLIDER ---------------
function resourcesFeaturedSlider() {
  const slider = new Swiper(".swiper.re-featured", {
    slidesPerView: 1,
    speed: 600,
    pagination: {
      el: ".swiper-pagination.re-featured",
      clickable: true,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    on: {
      init: function () {
        const original = document.querySelector(".swiper-pagination.re-featured");
        if (original) original.style.display = "none";
        clonePaginationAndAttachEvents(this);
        updateClonedActiveBullet(this.realIndex);
      },
    },
  });

  slider.on("slideChange", function () {
    updateClonedActiveBullet(slider.realIndex);
  });
}

function clonePaginationAndAttachEvents(sliderInstance) {
  const swiperPagination = document.querySelector(".swiper-pagination.re-featured");
  const slides = document.querySelectorAll(".swiper-slide.re-featured");

  if (swiperPagination && slides.length) {
    slides.forEach(slide => {
      const placeholders = slide.querySelectorAll(".holder-slide-pagination-placeholder");
      placeholders.forEach(placeholder => {
        const clonedPagination = swiperPagination.cloneNode(true);
        clonedPagination.style.display = "flex";
        placeholder.appendChild(clonedPagination);
        const bullets = clonedPagination.querySelectorAll(".swiper-pagination-bullet");
        bullets.forEach((bullet, index) => {
          bullet.addEventListener("click", e => {
            e.preventDefault();
            sliderInstance.slideToLoop(index);
          });
        });
      });
    });
  }
}

function updateClonedActiveBullet(activeIndex) {
  document
    .querySelectorAll(
      ".swiper-slide.re-featured .holder-slide-pagination-placeholder .swiper-pagination.re-featured"
    )
    .forEach(clonedPagination => {
      const bullets = clonedPagination.querySelectorAll(".swiper-pagination-bullet");
      bullets.forEach((bullet, index) => {
        bullet.classList.toggle("swiper-pagination-bullet-active", index === activeIndex);
      });
    });
}

// --------------- CUSTOMER STATS CARDS ---------------
function customerStatCards() {
  const cards = document.querySelectorAll('[data-customer-stats]');
  if (cards.length === 0) return;

  cards.forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/%/g, '<span class="t-stats-symbol">%</span>');
  });
}

function lottieInit() {
  const lottieElements = document.querySelectorAll(".c-lottie-item");
  if (lottieElements.length === 0) return;

  lottieElements.forEach(element => {
    const animationPath = element.getAttribute("data-lottie-path");
    const hoverEnabled = element.getAttribute("data-lottie-hover") === "true";
    const autoplayEnabled = element.getAttribute("data-lottie-autoplay") === "true";
    const loopEnabled = element.getAttribute("data-lottie-loop") === "true";
    const loopDelay = parseInt(element.getAttribute("data-lottie-loop-delay")) || 0;

    const animation = bodymovin.loadAnimation({
      container: element,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: animationPath,
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (autoplayEnabled) {
              animation.play();
            }
          } else {
            animation.stop();
          }
        });
      }, { threshold: 0.5 }
    );

    observer.observe(element);

    if (autoplayEnabled) {
      animation.play();
    }

    if (loopEnabled) {
      animation.addEventListener("complete", () => {
        if (!loopDelay) {
          animation.goToAndStop(0, true);
          animation.play();
        } else {
          setTimeout(() => {
            animation.goToAndStop(0, true);
            animation.play();
          }, loopDelay);
        }
      });
    }

    if (hoverEnabled) {
      element.addEventListener("mouseenter", () => {
        if (!animation.isPaused) {
          animation.play();
        }
      });

      element.addEventListener("mouseleave", () => {
        animation.stop();
      });
    }
  });
}

// --------------- PAGES ---------------
let homepage = document.querySelector("[data-page='homepage']");

// --------------- INIT ---------------
function init() {
  pressCoverageSlider();
  videoModal();
  ticker();
  duplexAccordions();
  heroAnimation();
  networkSection();
  infiniteRotation();
  boxesAnimation();
  galleryMarquee();
  homeHeroSticky();
  resourcesFilter();
  resourcesFeaturedSlider();
  customerStatCards();
  resourceAPIChecker();
  lottieInit();
}

init();

// --------------- MATCHMEDIA - DESKTOP ---------------
mm.add("(min-width: 992px)", () => {
  fade();
  const headerCleanup = headerDesktop();
  headerScrolled();
  skipLink();
  return () => {
    headerCleanup();
  };
});

// --------------- MATCHMEDIA - TABLET AND MOBILE ---------------
mm.add("(max-width: 991px)", () => {
  const headerCleanup = headerMobile();
  document
    .querySelector(".c-header-main-nav")
    .setAttribute("data-lenis-prevent", "");
  return () => {
    headerCleanup();
    document
      .querySelector(".c-header-main-nav")
      .removeAttribute("data-lenis-prevent", "");
    document
      .querySelector(".c-header-main-inner")
      .appendChild(document.querySelector(".c-header-main_rt"));
  };
});

// // --------------- HEADER DESKTOP ---------------
// function headerDesktop() {
//   // --- HEADER DROPDOWN LINKS
//   const ddItems = document.querySelectorAll(".c-header-main-dd-item");
//   const listItems = document.querySelectorAll(".c-header-main-dd-group");

//   ddItems.forEach(item => {
//     const list = item.querySelector(".c-header-main-dd-group");
//     const toggle = item.querySelector(".c-header-main-dd-toggle");

//     toggle.addEventListener("click", function (event) {
//       event.stopPropagation();

//       // Close all other items and remove .is-active from them
//       ddItems.forEach(otherItem => {
//         if (otherItem !== item) {
//           otherItem.classList.remove("is-active");
//           const otherList = otherItem.querySelector(".c-header-main-dd-group");
//           if (otherList) {
//             otherList.classList.remove("is-open");
//           }
//         }
//       });

//       // Toggle the current item
//       list.classList.toggle("is-open");
//       item.classList.toggle("is-active");
//     });
//   });

//   // --- LANGUAGE SWITCHER
//   const langSwitcher = document.querySelector(".c-lang-switcher");
//   langSwitcher.addEventListener("click", function (event) {
//     event.stopPropagation();
//     langSwitcher.classList.toggle("is-open");
//   });

//   // --- CLOSE ITEMS WHEN CLICKING OUTSIDE
//   document.addEventListener("click", function (event) {
//     // Check if the click target is inside any dropdown or the language switcher
//     const isClickInsideDropdown = [...ddItems].some(item => item.contains(event.target));
//     const isClickInsideLangSwitcher = langSwitcher.contains(event.target);

//     // If the click is outside both, close the dropdowns and language switcher
//     if (!isClickInsideDropdown && !isClickInsideLangSwitcher) {
//       ddItems.forEach(item => item.classList.remove("is-active"));
//       listItems.forEach(item => item.classList.remove("is-open"));
//       langSwitcher.classList.remove("is-open");
//     }
//   });

//   // --- CLOSE ITEMS ON ESC KEY PRESS
//   document.addEventListener("keydown", function (event) {
//     if (event.key === "Escape") {
//       ddItems.forEach(item => item.classList.remove("is-active"));
//       listItems.forEach(item => item.classList.remove("is-open"));
//       langSwitcher.classList.remove("is-open");
//     }
//   });
// }

// // --------------- HEADER MOBILE ---------------
// function headerMobile() {
//   const trigger = document.querySelector(".c-header-main-btn");
//   const nav = document.querySelector(".c-header-main-nav");
//   const navInnerWrap = document.querySelector(".c-header-main-inner");
//   const headerRight = document.querySelector(".c-header-main_rt");
//   const menuLine1 = document.querySelectorAll(".c-nav-bar.is-1");
//   const menuLine2 = document.querySelectorAll(".c-nav-bar.is-2");
//   const menuLine3 = document.querySelectorAll(".c-nav-bar.is-3");
//   const newsBar = document.querySelector(".c-news-bar");
//   let navStatus = "closed";

//   const tl = gsap.timeline({
//     paused: true,
//     defaults: {
//       ease: "ease-in-out-1",
//       duration: 0.8
//     }
//   })

//   gsap.set(menuLine1, { transformOrigin: "center center" });
//   gsap.set(menuLine2, { transformOrigin: "center center" });
//   gsap.set(menuLine3, { transformOrigin: "center center" });

//   tl.fromTo(nav, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" });
//   tl.to(menuLine1, { rotation: 45, y: 6 }, 0);
//   tl.to(menuLine2, { width: 0 }, 0);
//   tl.to(menuLine3, { rotation: -45, y: -6 }, 0);
//   tl.to(newsBar, { height: 0 }, 0);

//   // Event
//   trigger.addEventListener("click", function () {
//     if (navStatus === "closed") {
//       tl.restart();
//       lenis.stop();
//       navStatus = "open";
//     } else {
//       tl.reverse();
//       lenis.start();
//       navStatus = "closed";
//     }
//   });

//   // Accordions
//   let accordions = document.querySelectorAll(".c-header-main-dd-item");
//   let active = null;

//   accordions.forEach((accordion) => {
//     const list = accordion.querySelector(".c-header-main-dd-group");
//     let tl = gsap.timeline({
//       paused: true,
//       defaults: {
//         duration: 0.8,
//         ease: "ease-in-out-1"
//       }
//     });

//     tl.to(list, { height: "auto", opacity: 1 });

//     accordion.tl = tl;

//     accordion.addEventListener("click", function (e) {
//       e.stopPropagation();

//       if (active && active === accordion) {
//         // If clicking the already active accordion, close it
//         accordion.tl.reverse();
//         active = null; // Reset active since it's closed
//       } else {
//         if (active) active.tl.reverse(); // Close the previously active accordion
//         accordion.tl.play(); // Open the clicked accordion
//         active = accordion; // Set the new active accordion
//       }
//     });
//   });

//   // Header right
//   nav.appendChild(headerRight);
//   gsap.set(headerRight, { display: "flex" });

//   // Language Switcher
//   const langSwitcher = document.querySelector(".c-lang-switcher");
//   langSwitcher.addEventListener("click", function (event) {
//     event.stopPropagation();
//     langSwitcher.classList.toggle("is-open");
//   });

//   document.addEventListener("click", function (event) {
//     const isClickInsideLangSwitcher = langSwitcher.contains(event.target);

//     if (!isClickInsideLangSwitcher) {
//       langSwitcher.classList.remove("is-open");
//     }
//   });
// }

// // --------------- MATCHMEDIA - DESKTOP ---------------
// mm.add("(min-width: 992px)", () => {
//   fade();
//   headerDesktop();
//   headerScrolled();
//   return () => {
//     //
//   };
// });

// // --------------- MATCHMEDIA - TABLET AND MOBILE ---------------
// mm.add("(max-width: 991px)", () => {
//   headerMobile();
//   document.querySelector(".c-header-main-nav").setAttribute("data-lenis-prevent", "");
//   return () => {
//     document.querySelector(".c-header-main-nav").removeAttribute("data-lenis-prevent", "");
//     document.querySelector(".c-header-main-inner").appendChild(document.querySelector(
//       ".c-header-main_rt"));
//   };
// });
