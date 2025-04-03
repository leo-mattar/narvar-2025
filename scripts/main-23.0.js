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
// function pressCoverageSlider() {
//   const thumbs = document.querySelectorAll(".c-press-card");
//   const slides = document.querySelectorAll(".c-press-main-item");
//   let bullets = document.querySelectorAll(".c-press-progress-bullet");
//   const bulletsContainer = document.querySelector(".c-press-progress");
//   const prevButton = document.querySelector(".swiper-prev.press");
//   const nextButton = document.querySelector(".swiper-next.press");

//   if (thumbs.length === 0 || slides.length === 0) return;

//   // Ensure the number of bullets matches the number of slides
//   if (bullets.length !== slides.length) {
//     bullets.forEach(bullet => bullet.remove());
//     for (let i = 0; i < slides.length; i++) {
//       const bullet = document.createElement("div");
//       bullet.classList.add("c-press-progress-bullet");
//       const bulletBar = document.createElement("div");
//       bulletBar.classList.add("c-press-progress-bullet-bar");
//       bullet.appendChild(bulletBar);
//       bulletsContainer.appendChild(bullet);
//     }
//     bullets = document.querySelectorAll(".c-press-progress-bullet");
//   }

//   let currentIndex = 0;
//   let interval;

//   function updateSlider(index) {
//     thumbs.forEach(thumb => thumb.classList.remove("is-active"));
//     slides.forEach(slide => slide.classList.remove("is-active"));
//     bullets.forEach(bullet => bullet.classList.remove("is-active"));

//     thumbs[index].classList.add("is-active");
//     slides[index].classList.add("is-active");
//     bullets[index].classList.add("is-active");

//     document.querySelectorAll(".c-press-progress-bullet-bar").forEach(bar => {
//       bar.style.transition = "none";
//       bar.style.width = "0%";
//     });

//     const activeBar = bullets[index].querySelector(".c-press-progress-bullet-bar");
//     if (activeBar) {
//       setTimeout(() => {
//         activeBar.style.transition = "width 6s linear";
//         activeBar.style.width = "100%";
//       }, 10);
//     }
//   }

//   function nextSlide() {
//     currentIndex = (currentIndex + 1) % thumbs.length;
//     updateSlider(currentIndex);
//   }

//   function prevSlide() {
//     currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
//     updateSlider(currentIndex);
//   }

//   function startAutoplay() {
//     clearInterval(interval);
//     interval = setInterval(nextSlide, 7000);
//   }

//   function handleClick(index) {
//     currentIndex = index;
//     updateSlider(currentIndex);
//     startAutoplay();
//   }

//   thumbs.forEach((thumb, index) => {
//     thumb.addEventListener("click", () => handleClick(index));
//   });

//   bullets.forEach((bullet, index) => {
//     bullet.addEventListener("click", () => handleClick(index));
//   });

//   if (prevButton) {
//     prevButton.addEventListener("click", () => {
//       prevSlide();
//       startAutoplay();
//     });
//   }

//   if (nextButton) {
//     nextButton.addEventListener("click", () => {
//       nextSlide();
//       startAutoplay();
//     });
//   }

//   updateSlider(0);
//   startAutoplay();
// }

function pressCoverageSlider() {
  const thumbs = document.querySelectorAll(".c-press-card");
  const slides = document.querySelectorAll(".c-press-main-item");
  let bullets = document.querySelectorAll(".c-press-progress-bullet");
  const bulletsContainer = document.querySelector(".c-press-progress");
  const prevButton = document.querySelector(".swiper-prev.press");
  const nextButton = document.querySelector(".swiper-next.press");
  // Get the parent container with overflow scroll
  const thumbsContainer = thumbs.length > 0 ? thumbs[0].parentElement : null;

  if (thumbs.length === 0 || slides.length === 0) return;

  // Ensure the number of bullets matches the number of slides
  if (bullets.length !== slides.length) {
    bullets.forEach(bullet => bullet.remove());
    for (let i = 0; i < slides.length; i++) {
      const bullet = document.createElement("div");
      bullet.classList.add("c-press-progress-bullet");
      const bulletBar = document.createElement("div");
      bulletBar.classList.add("c-press-progress-bullet-bar");
      bullet.appendChild(bulletBar);
      bulletsContainer.appendChild(bullet);
    }
    bullets = document.querySelectorAll(".c-press-progress-bullet");
  }

  let currentIndex = 0;
  let interval;

  // Function to scroll the selected thumb into view
  function scrollThumbIntoView(index) {
    if (!thumbsContainer) return;

    const selectedThumb = thumbs[index];
    const containerRect = thumbsContainer.getBoundingClientRect();
    const thumbRect = selectedThumb.getBoundingClientRect();

    // Check if the thumb is outside the visible area
    const isVisible =
      thumbRect.left >= containerRect.left &&
      thumbRect.right <= containerRect.right;

    if (!isVisible) {
      // Calculate the scroll position to center the thumb in the container
      const scrollLeft = selectedThumb.offsetLeft -
        (thumbsContainer.clientWidth / 2) +
        (selectedThumb.offsetWidth / 2);

      // Smooth scroll to the thumb
      thumbsContainer.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }

  function updateSlider(index) {
    thumbs.forEach(thumb => thumb.classList.remove("is-active"));
    slides.forEach(slide => slide.classList.remove("is-active"));
    bullets.forEach(bullet => bullet.classList.remove("is-active"));

    thumbs[index].classList.add("is-active");
    slides[index].classList.add("is-active");
    bullets[index].classList.add("is-active");

    // Scroll the selected thumb into view
    scrollThumbIntoView(index);

    document.querySelectorAll(".c-press-progress-bullet-bar").forEach(bar => {
      bar.style.transition = "none";
      bar.style.width = "0%";
    });

    const activeBar = bullets[index].querySelector(
      ".c-press-progress-bullet-bar"
    );
    if (activeBar) {
      setTimeout(() => {
        activeBar.style.transition = "width 6s linear";
        activeBar.style.width = "100%";
      }, 10);
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % thumbs.length;
    updateSlider(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
    updateSlider(currentIndex);
  }

  function startAutoplay() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 7000);
  }

  function handleClick(index) {
    currentIndex = index;
    updateSlider(currentIndex);
    startAutoplay();
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => handleClick(index));
  });

  bullets.forEach((bullet, index) => {
    bullet.addEventListener("click", () => handleClick(index));
  });

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      prevSlide();
      startAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
  }

  updateSlider(0);
  startAutoplay();
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

// --------------- TICKER COMPONENT/LOGO BAR ---------------
function tickerComp() {
  const tickerSection = document.querySelector(".c-section.ticker-comp");
  if (!tickerSection) return;

  const ticker = tickerSection.querySelector(".c-ticker-comp");
  const logoList = tickerSection.querySelector(".c-ticker-list-comp");
  if (!logoList || !ticker) return;

  const duplicatedList = logoList.cloneNode(true);
  ticker.appendChild(duplicatedList);

  const logoItems = tickerSection.querySelectorAll(".c-ticker-item-comp").length;
  const marqueeDuration = window.innerWidth <= 479 ? logoItems * 1.8 : logoItems * 3;

  const tl = gsap.timeline();
  tl.to([logoList, duplicatedList], {
    xPercent: -100,
    duration: marqueeDuration,
    ease: "linear",
    repeat: -1
  });
}

// --------------- DUPLEX ACCORDIONS MOBILE ---------------
function duplexAccordionsMobile() {
  const accordions = document.querySelectorAll(".c-ac-item");
  const images = document.querySelectorAll(".c-img-contain.ac-photo");
  const accordionsWrap = document.querySelector(".c-duplex_lt-ac");
  const section = document.querySelector(".c-section.duplex");
  let active;

  if (accordions.length === 0) return;

  accordions.forEach((accordion, index) => {
    const txtWrap = accordion.querySelector(".c-ac-item-txt-wrap");
    const activeBar = accordion.querySelector(".c-ac-bar");
    const question = accordion.querySelector(".t-display-5");

    // Animation
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power4.inOut",
        duration: 0.8,
      }
    });

    tl.to(question, { color: "#eef4ff" });
    tl.to(txtWrap, { height: "auto" }, 0);
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

// --------------- DUPLEX ACCORDIONS DESKTOP ---------------
// function duplexAccordionsDesktop() {
//   const accordions = document.querySelectorAll(".c-ac-item");
//   const images = document.querySelectorAll(".c-img-contain.ac-photo");
//   const section = document.querySelector(".c-section.duplex");

//   if (accordions.length === 0) return;

//   // Create ScrollTrigger
//   const st = ScrollTrigger.create({
//     trigger: section,
//     start: "top top",
//     end: "bottom bottom",
//     scrub: true,
//     onUpdate: (self) => {
//       const totalAccordions = accordions.length;
//       const progress = self.progress;
//       const activeIndex = Math.min(
//         Math.floor(progress * totalAccordions),
//         totalAccordions - 1
//       );

//       accordions.forEach((accordion, index) => {
//         const txtWrap = accordion.querySelector(".c-ac-item-txt-wrap");
//         const activeBar = accordion.querySelector(".c-ac-bar");
//         const question = accordion.querySelector(".t-display-5");

//         if (index === activeIndex) {
//           accordion.classList.add("is-active");
//           images[index].classList.add("is-active");
//         } else {
//           accordion.classList.remove("is-active");
//           images[index].classList.remove("is-active");
//         }
//       });
//     }
//   });

//   // Add click functionality to accordions
//   accordions.forEach((accordion, index) => {
//     accordion.addEventListener('click', () => {
//       // Remove active class from all accordions and images
//       accordions.forEach((acc, i) => {
//         acc.classList.remove("is-active");
//         images[i].classList.remove("is-active");
//       });

//       // Add active class to clicked accordion and corresponding image
//       accordion.classList.add("is-active");
//       images[index].classList.add("is-active");

//       // Update ScrollTrigger progress to match clicked accordion
//       const totalAccordions = accordions.length;
//       const newProgress = index / (totalAccordions - 1);
//       st.scroll(st.start + (st.end - st.start) * newProgress);
//     });
//   });

//   // Initialize with first accordion active
//   accordions[0].classList.add("is-active");
//   images[0].classList.add("is-active");
// }

function duplexAccordionsDesktop() {
  const accordions = document.querySelectorAll(".c-ac-item");
  const images = document.querySelectorAll(".c-img-contain.ac-photo");
  const section = document.querySelector(".c-section.duplex");

  if (accordions.length === 0) return;

  // Create ScrollTrigger
  const st = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const totalAccordions = accordions.length;
      const progress = self.progress;
      const activeIndex = Math.min(
        Math.floor(progress * totalAccordions),
        totalAccordions - 1
      );

      accordions.forEach((accordion, index) => {
        const txtWrap = accordion.querySelector(".c-ac-item-txt-wrap");
        const activeBar = accordion.querySelector(".c-ac-bar");
        const question = accordion.querySelector(".t-display-5");

        if (index === activeIndex) {
          accordion.classList.add("is-active");
          images[index].classList.add("is-active");
        } else {
          accordion.classList.remove("is-active");
          images[index].classList.remove("is-active");
        }
      });
    }
  });

  accordions.forEach((accordion, index) => {
    accordion.addEventListener('click', () => {
      accordions.forEach((acc, i) => {
        acc.classList.remove("is-active");
        images[i].classList.remove("is-active");
      });

      accordion.classList.add("is-active");
      images[index].classList.add("is-active");

      const totalAccordions = accordions.length;
      const newProgress = index / (totalAccordions - 1);
      const scrollPosition = st.start + (st.end - st.start) * newProgress;

      if (window.lenis) {
        window.lenis.scrollTo(scrollPosition, {
          duration: 1.5,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 *
            t))
        });
      }
    });
  });

  // Initialize with first accordion active
  accordions[0].classList.add("is-active");
  images[0].classList.add("is-active");
}

// --------------- HERO SECTION ---------------
function heroAnimation() {
  const shape = document.querySelector(".c-img.hero-comp-circle");
  const image = document.querySelector(".c-img.hero-comp-visual");

  if (!shape && !image) return;

  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 1 },
  });

  if (shape) {
    gsap.to(shape, {
      rotation: 360,
      duration: 90,
      ease: "linear",
      repeat: -1,
    });

    tl.to(shape, { opacity: 1 }, "<0.2");
  }

  if (image) {
    tl.to(image, { opacity: 1 }, "<0.2");
  }
}

// --------------- HOME HERO SLIDER ---------------
// function homeHeroSlider() {
//   const bullets = document.querySelectorAll(".c-hm-hero-progress-bullet");

//   if (!bullets.length) return;

//   const slider = new Swiper(".swiper.hm-hero", {
//     slidesPerView: 1,
//     speed: 600,
//     // autoHeight: true,
//     loop: true,
//     simulateTouch: false,
//     effect: "fade",
//     fadeEffect: {
//       crossFade: true,
//     },
//     autoplay: {
//       delay: 5000,
//       disableOnInteraction: false,
//     },
//     navigation: {
//       nextEl: ".swiper-next.hm-hero",
//       prevEl: ".swiper-prev.hm-hero",
//     },
//     on: {
//       slideChange: function () {
//         updateBullets(this.realIndex);
//       },
//     },
//   });

//   function updateBullets(index) {
//     // Find all bullet instances across all slides
//     const allBullets = document.querySelectorAll(".c-hm-hero-progress-bullet");

//     // Remove active class from all bullets and reset progress bars
//     allBullets.forEach(bullet => {
//       bullet.classList.remove("is-active");
//       const progressBar = bullet.querySelector(".c-hm-hero-progress-bullet-bar");
//       if (progressBar) {
//         progressBar.style.transition = "none";
//         progressBar.style.width = "0%";
//       }
//     });

//     // Add active class to the current bullet
//     const activeBullets = document.querySelectorAll(
//       `[data-slide-index="${index}"]`
//     );

//     activeBullets.forEach(activeBullet => {
//       activeBullet.classList.add("is-active");

//       // Animate the active bullet's progress bar
//       const activeBar = activeBullet.querySelector(".c-hm-hero-progress-bullet-bar");
//       if (activeBar) {
//         setTimeout(() => {
//           activeBar.style.transition = "width 5s linear";
//           activeBar.style.width = "100%";
//         }, 10);
//       }
//     });
//   }

//   // Click event to manually switch slides and restart autoplay
//   bullets.forEach((bullet, index) => {
//     bullet.setAttribute("data-slide-index", index % slider.slides.length);

//     bullet.addEventListener("click", () => {
//       slider.slideTo(index % slider.slides.length);
//       slider.autoplay.start();
//     });
//   });

//   // Initialize
//   updateBullets(0);
// }

function homeHeroSlider() {
  const bullets = document.querySelectorAll(".c-hm-hero-progress-bullet");

  if (!bullets.length) return;

  const slider = new Swiper(".swiper.hm-hero", {
    slidesPerView: 1,
    speed: 600,
    // autoHeight: true,
    loop: true,
    simulateTouch: false,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-next.hm-hero",
      prevEl: ".swiper-prev.hm-hero",
    },
    // on: {
    //   slideChange: function () {
    //     updateBullets(this.realIndex);
    //   },
    // },
    on: {
      slideChangeTransitionStart: function () {
        updateBullets(this.realIndex);
      },
    },
  });

  function updateBullets(index) {
    // Find all bullet instances across all slides
    const allBullets = document.querySelectorAll(".c-hm-hero-progress-bullet");

    // Remove active class from all bullets and reset progress bars
    allBullets.forEach(bullet => {
      bullet.classList.remove("is-active");
      const progressBar = bullet.querySelector(".c-hm-hero-progress-bullet-bar");
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
      }
    });

    // Add active class to the current bullet
    const activeBullets = document.querySelectorAll(
      `[data-slide-index="${index}"]`
    );

    activeBullets.forEach(activeBullet => {
      activeBullet.classList.add("is-active");

      // Animate the active bullet's progress bar
      const activeBar = activeBullet.querySelector(".c-hm-hero-progress-bullet-bar");
      if (activeBar) {
        setTimeout(() => {
          activeBar.style.transition = "width 5s linear";
          activeBar.style.width = "100%";
        }, 10);
      }
    });
  }

  // Click event to manually switch slides and restart autoplay
  bullets.forEach((bullet, index) => {
    bullet.setAttribute("data-slide-index", index % slider.slides.length);

    bullet.addEventListener("click", () => {
      slider.slideTo(index % slider.slides.length);
      slider.autoplay.start();
    });
  });

  // Initialize
  updateBullets(0);
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

  const header = document.querySelector(".c-header-main");
  const headerNav = document.querySelector(".c-header-main-nav")

  if (!header || !headerNav) return;

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
// function headerMobile() {
//   if (!document.querySelector(".c-header-main")) return;
//   let cleanupListeners = []; // Array to store cleanup functions

//   const trigger = document.querySelector(".c-header-main-btn");
//   const nav = document.querySelector(".c-header-main-nav");
//   const navInnerWrap = document.querySelector(".c-header-main-inner");
//   const headerRight = document.querySelector(".c-header-main_rt");
//   const menuLine1 = document.querySelectorAll(".c-nav-bar.is-1");
//   const menuLine2 = document.querySelectorAll(".c-nav-bar.is-2");
//   const menuLine3 = document.querySelectorAll(".c-nav-bar.is-3");
//   const newsBar = document.querySelector(".c-news-bar");
//   const menuIconWrap = document.querySelector(".c-header-main-btn");
//   let navStatus = "closed";

//   const tl = gsap.timeline({
//     paused: true,
//     defaults: {
//       ease: "ease-in-out-1",
//       duration: 0.8,
//     },
//   });

//   gsap.set(menuLine1, { transformOrigin: "center center" });
//   gsap.set(menuLine2, { transformOrigin: "center center" });
//   gsap.set(menuLine3, { transformOrigin: "center center" });

//   tl.fromTo(
//     nav, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }
//   );
//   tl.to(menuLine1, { rotation: 45, y: 6 }, 0);
//   tl.to(menuLine2, { width: 0 }, 0);
//   tl.to(menuLine3, { rotation: -45, y: -6 }, 0);
//   tl.to(newsBar, { height: 0 }, 0);
//   tl.to(menuIconWrap, { rotation: 180 }, 0);

//   const triggerHandler = function () {
//     if (navStatus === "closed") {
//       tl.restart();
//       lenis.stop();
//       navStatus = "open";
//     } else {
//       tl.reverse();
//       lenis.start();
//       navStatus = "closed";
//     }
//   };
//   trigger.addEventListener("click", triggerHandler);
//   cleanupListeners.push(() =>
//     trigger.removeEventListener("click", triggerHandler)
//   );

//   // Accordions
//   let accordions = document.querySelectorAll(".c-header-main-dd-item");
//   let active = null;

//   accordions.forEach(accordion => {
//     const list = accordion.querySelector(".c-header-main-dd-group");
//     let tl = gsap.timeline({
//       paused: true,
//       defaults: {
//         duration: 0.8,
//         ease: "ease-in-out-1",
//       },
//     });

//     tl.to(list, { height: "auto", opacity: 1 });

//     accordion.tl = tl;

//     const accordionHandler = function (e) {
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
//     };
//     accordion.addEventListener("click", accordionHandler);
//     cleanupListeners.push(() =>
//       accordion.removeEventListener("click", accordionHandler)
//     );
//   });

//   // Header right
//   nav.appendChild(headerRight);
//   gsap.set(headerRight, { display: "flex" });

//   // Language Switcher
//   const langSwitcher = document.querySelector(".c-lang-switcher");
//   const langSwitcherHandler = function (event) {
//     event.stopPropagation();
//     langSwitcher.classList.toggle("is-open");
//   };
//   langSwitcher.addEventListener("click", langSwitcherHandler);
//   cleanupListeners.push(() =>
//     langSwitcher.removeEventListener("click", langSwitcherHandler)
//   );

//   const documentClickHandler = function (event) {
//     const isClickInsideLangSwitcher = langSwitcher.contains(event.target);

//     if (!isClickInsideLangSwitcher) {
//       langSwitcher.classList.remove("is-open");
//     }
//   };
//   document.addEventListener("click", documentClickHandler);
//   cleanupListeners.push(() =>
//     document.removeEventListener("click", documentClickHandler)
//   );

//   // Return cleanup function
//   return () => cleanupListeners.forEach(cleanup => cleanup());
// }

// --------------- HEADER MOBILE ---------------
// --------------- HEADER MOBILE ---------------
function headerMobile() {
  if (!document.querySelector(".c-header-main")) return;
  let cleanupListeners = [];

  const trigger = document.querySelector(".c-header-main-btn");
  const nav = document.querySelector(".c-header-main-nav");
  const navInnerWrap = document.querySelector(".c-header-main-inner");
  const headerRight = document.querySelector(".c-header-main_rt");
  const menuLine1 = document.querySelectorAll(".c-nav-bar.is-1");
  const menuLine2 = document.querySelectorAll(".c-nav-bar.is-2");
  const menuLine3 = document.querySelectorAll(".c-nav-bar.is-3");
  const newsBar = document.querySelector(".c-news-bar");
  const menuIconWrap = document.querySelector(".c-header-main-btn");
  let navStatus = "closed";
  let isAnimating = false; // Prevents animation conflicts

  // Prevent iPhone pinch-to-zoom when interacting with the menu
  nav.addEventListener("touchmove", (e) => {
    if (navStatus === "open") {
      e.preventDefault();
    }
  }, { passive: false });

  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "ease-in-out-1",
      duration: 0.8,
    },
    onStart: () => {
      isAnimating = true;
      gsap.set(nav, { display: "flex" });
    },
    onComplete: () => {
      isAnimating = false;
    },
    onReverseComplete: () => {
      gsap.set(nav, { display: "none" });
    }
  });

  gsap.set(menuLine1, { transformOrigin: "center center" });
  gsap.set(menuLine2, { transformOrigin: "center center" });
  gsap.set(menuLine3, { transformOrigin: "center center" });
  gsap.set(nav, { opacity: 0, height: 0, display: "none" });

  tl.fromTo(
    nav,
    {
      clipPath: "inset(0% 0% 100% 0%)"
    },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      opacity: 1,
      height: "calc(100vh - 80px)"
    }
  );
  tl.to(menuLine1, { rotation: 45, y: 6 }, 0);
  tl.to(menuLine2, { width: 0 }, 0);
  tl.to(menuLine3, { rotation: -45, y: -6 }, 0);
  tl.to(newsBar, { height: 0 }, 0);
  tl.to(menuIconWrap, { rotation: 180 }, 0);

  const triggerHandler = function (event) {
    if (event.touches && event.touches.length > 1) return; // Ignore multi-touch (pinch-to-zoom)
    if (isAnimating) return; // Prevent multiple clicks during animation

    event.preventDefault(); // Prevent accidental double triggers

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
  cleanupListeners.push(() => trigger.removeEventListener("click", triggerHandler));

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
      if (e.touches && e.touches.length > 1) return; // Ignore pinch zoom
      e.stopPropagation();

      if (active && active === accordion) {
        accordion.tl.reverse();
        active = null;
      } else {
        if (active) active.tl.reverse();
        accordion.tl.play();
        active = accordion;
      }
    };

    accordion.addEventListener("click", accordionHandler);
    cleanupListeners.push(() => accordion.removeEventListener("click", accordionHandler));
  });

  // Header right
  nav.appendChild(headerRight);
  gsap.set(headerRight, { display: "flex" });

  // Language Switcher
  const langSwitcher = document.querySelector(".c-lang-switcher");
  const langSwitcherHandler = function (event) {
    if (event.touches && event.touches.length > 1) return; // Ignore multi-touch
    event.stopPropagation();
    langSwitcher.classList.toggle("is-open");
  };

  langSwitcher.addEventListener("click", langSwitcherHandler);
  cleanupListeners.push(() => langSwitcher.removeEventListener("click", langSwitcherHandler));

  const documentClickHandler = function (event) {
    if (event.touches && event.touches.length > 1) return; // Ignore multi-touch
    const isClickInsideLangSwitcher = langSwitcher.contains(event.target);
    if (!isClickInsideLangSwitcher) {
      langSwitcher.classList.remove("is-open");
    }
  };

  document.addEventListener("click", documentClickHandler);
  cleanupListeners.push(() => document.removeEventListener("click", documentClickHandler));

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
  const shapes = document.querySelectorAll("[data-rotate]");

  if (shapes.length === 0) return;

  shapes.forEach(shape => {
    gsap.to(shape, {
      rotation: 360,
      duration: 90,
      ease: "linear",
      repeat: -1,
    });
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

  const logoItems = gallerySection.querySelectorAll(".c-img").length;
  const marqueeDuration = window.innerWidth <= 479 ? logoItems * 1.8 : logoItems * 3;

  const tl = gsap.timeline();
  tl.to([galleryList, duplicatedList], {
    xPercent: -100,
    duration: marqueeDuration,
    ease: "linear",
    repeat: -1
  });

  // Reverse logo marquee
  const reverseSection = document.querySelector(
    "[data-wf--section-marquee-gallery--variant='reverse']");
  if (!reverseSection) return;

  const reverseTicker = reverseSection.querySelector(".c-ticker-gallery");
  const reverseGalleryList = reverseSection.querySelector(".c-ticker-list.gallery");
  if (!reverseGalleryList || !reverseTicker) return;

  const reverseDuplicatedList = reverseGalleryList.cloneNode(true);
  reverseTicker.appendChild(reverseDuplicatedList);

  const reverseLogoItems = reverseSection.querySelectorAll(".c-img").length;
  const reverseMarqueeDuration = window.innerWidth <= 479 ? reverseLogoItems * 1.8 :
    reverseLogoItems * 3;

  const reverseTl = gsap.timeline();
  reverseTl.to([reverseGalleryList, reverseDuplicatedList], {
    xPercent: 100,
    duration: reverseMarqueeDuration,
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

// --------------- FAQ ACCORDIONS ---------------
function faqAccordions() {
  const accordions = document.querySelectorAll(".c-faq-item");
  let active = null;

  if (accordions.length === 0) return;

  accordions.forEach((accordion, index) => {
    const question = accordion.querySelector(".c-faq-question");
    const response = accordion.querySelector(".c-faq-response");
    const arrow = accordion.querySelector(".c-icon.faq-arrow");

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "ease-in-out-1",
        duration: 0.8
      }
    });

    tl.to(question, { color: "#eef4ff" });
    tl.to(response, { height: "auto" }, 0);
    tl.to(arrow, { rotation: 180 }, 0);

    accordion.tl = tl;

    accordion.addEventListener("click", function () {
      if (active === accordion) {
        tl.reverse();
        active = null;
      } else {
        if (active) active.tl.reverse();
        tl.play();
        active = accordion;
      }
    });

    if (index === 0) {
      accordion.click();
    }
  });
}

// --------------- HOME IRIS LAYERS ANIMATION ---------------
function homeIrisLayersAnimation() {
  const wrapper = document.querySelector(".c-img-contain.hm-infographic");
  const images = document.querySelectorAll(".c-img-contain.hm-infographic img");

  if (wrapper && images.length) {
    gsap.from(images, {
      duration: 1.6,
      ease: "ease-out-1",
      y: "6em",
      opacity: 0,
      stagger: 0.3,
      scrollTrigger: {
        trigger: wrapper,
        start: "top 80%",
        once: true,
      },
    });
  }

  const circle = document.querySelector(".c-img.iris-layer-2");

  if (circle) {
    gsap.to(circle, {
      duration: 120,
      rotation: 360,
      ease: "linear",
      repeat: -1,
    });
  }
}

// --------------- DUPLEX VERTICAL MARQUEE ---------------
function duplexVerticalMarquee() {
  const marquees = document.querySelectorAll(".c-v-marquee");
  if (marquees.length === 0) return;

  marquees.forEach(marquee => {
    const listWrap = marquee.querySelector(".c-v-marquee-list-wrap");
    const list = marquee.querySelector(".c-v-marquee-list");
    const reverseListWrap = marquee.querySelector(".c-v-marquee-list-reverse-wrap");
    const reverseList = marquee.querySelector(".c-v-marquee-list-reverse");

    const duplicatedList = list.cloneNode(true);
    listWrap.appendChild(duplicatedList);

    const duplicatedReverseList = reverseList.cloneNode(true);
    reverseListWrap.appendChild(duplicatedReverseList);

    const listLogoItems = listWrap.querySelectorAll(".c-v-marquee-item").length;
    const listMarqueeDuration = window.innerWidth <= 479 ? listLogoItems * 1.8 : listLogoItems *
      3;

    const listReverseLogoItems = reverseListWrap.querySelectorAll(".c-v-marquee-item").length;
    const listReverseMarqueeDuration = window.innerWidth <= 479 ? listReverseLogoItems * 1.8 :
      listReverseLogoItems * 3;

    const listTl = gsap.timeline();
    listTl.to([list, duplicatedList], {
      yPercent: -100,
      duration: listMarqueeDuration,
      ease: "linear",
      repeat: -1
    });

    const reverseListTl = gsap.timeline();
    reverseListTl.to([reverseList, duplicatedReverseList], {
      yPercent: 100,
      duration: listReverseMarqueeDuration,
      ease: "linear",
      repeat: -1
    });
  });
}

// --------------- PRESS PAGINATION ---------------
function pressPagination() {
  const pressSection = document.querySelector(".c-section.press");
  if (!pressSection) return;

  const buttons = [
    ...document.querySelectorAll(".c-pagination-btn"),
    ...document.querySelectorAll(".c-pagination-page-btn"),
  ];

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
        lenis.scrollTo(pressSection, { offset: -80 });
      }, 200);
    });
  });
}

window.pressPagination = pressPagination;

function pressAPIChecker() {
  const pressSection = document.querySelector(".c-section.press");
  if (!pressSection) return;

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    filterInstances => {
      const [filterInstance] = filterInstances;

      filterInstance.listInstance.on("renderitems", renderedItems => {
        pressPagination();
      });
    },
  ]);
}

// --------------- OLS SITE GLOBAL CODE ---------------
function oldSiteGlobalCode() {
  const m = {
    open: function (el) {
      const src = el.dataset.videosrc;
      if (!src) {
        console.error("Video source not provided");
        return;
      }
      const videoSrc = `${src}?autoplay=1`;
      const modal = document.createElement("div");
      modal.className = "modal__bg";
      modal.innerHTML = `
        <div class="modal__video">
          <iframe src="${videoSrc}" allowfullscreen></iframe>
          <a href="#" class="modal__close">
            <span></span><span></span>
          </a>
        </div>
      `;
      document.body.appendChild(modal);
      document.documentElement.classList.add("modal--active");

      modal.addEventListener("click", (event) => {
        if (
          event.target.classList.contains("modal__bg") ||
          event.target.closest(".modal__close")
        ) {
          m.close();
        }
      });
    },
    close: function () {
      const modalBg = document.querySelector(".modal__bg");
      if (modalBg) {
        modalBg.style.opacity = "0";
        setTimeout(() => {
          document.documentElement.classList.remove("modal--active");
          modalBg.remove();
        }, 400);
      }
    },
  };

  document.querySelectorAll(".modal-vid-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      m.open(this);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      m.close();
    }
  });
}

// --------------- NEWS BAR TICKER MOBILE ---------------
// function newsTickerMobile() {
//   const list = document.querySelector(".c-news-bar-list");
//   if (!list) return;

//   const wrap = document.querySelector(".c-news-bar-wrap");

//   const duplicatedList = list.cloneNode(true);
//   wrap.appendChild(duplicatedList);

//   const tl = gsap.timeline();
//   tl.to([list, duplicatedList], {
//     xPercent: -100,
//     duration: 20,
//     ease: "linear",
//     repeat: -1
//   });
// }
function newsTickerMobile() {
  const list = document.querySelector(".c-news-bar-list");
  if (!list) return;

  const wrap = document.querySelector(".c-news-bar-wrap");
  let duplicatedList = null;
  let tl = null;

  function startTicker() {
    if (window.innerWidth < 992) {
      if (!duplicatedList) {
        duplicatedList = list.cloneNode(true);
        wrap.appendChild(duplicatedList);
      }

      if (!tl) {
        tl = gsap.timeline();
        tl.to([list, duplicatedList], {
          xPercent: -100,
          duration: 20,
          ease: "linear",
          repeat: -1
        });
      }
    } else {
      stopTicker();
    }
  }

  function stopTicker() {
    if (tl) {
      tl.kill();
      tl = null;
    }

    if (duplicatedList) {
      duplicatedList.remove();
      duplicatedList = null;
    }

    gsap.set(list, { clearProps: "all" });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth < 992) {
      startTicker();
    } else {
      stopTicker();
    }
  });

  startTicker();
}

// --------------- PRODUCT CARDS MOBILE ---------------
// function productCardsMobile() {
//   const section = document.querySelector("[data-products-mobile]");
//   if (!section) return;

//   // Thumbs
//   const sliderThumbs = new Swiper('.swiper.products-nav', {
//     spaceBetween: 10,
//     slidesPerView: "auto",
//     loop: true,
//   });

//   // Slider
//   const slider = new Swiper(".swiper.products", {
//     slidesPerView: "auto",
//     spaceBetween: 16,
//     loop: true,
//     simulateTouch: false,
//     navigation: {
//       nextEl: '.swiper-next.products',
//       prevEl: '.swiper-prev.products',
//     },
//     breakpoints: {
//       320: {
//         simulateTouch: true,
//         autoplay: {
//           delay: 5000,
//           disableOnInteraction: false,
//         },
//       },
//       768: {
//         //
//       }
//     },
//     thumbs: {
//       swiper: sliderThumbs,
//     },
//   });
// }

// function productCardsMobile() {
//   const section = document.querySelector("[data-products-mobile]");
//   if (!section) return;

//   // Thumbs
//   const sliderThumbs = new Swiper('.swiper.products-nav', {
//     spaceBetween: 10,
//     slidesPerView: "auto",
//     loop: true,
//   });

//   // Initialize slider
//   const slider = new Swiper(".swiper.products", {
//     slidesPerView: "auto",
//     spaceBetween: 16,
//     loop: true,
//     simulateTouch: false,
//     autoplay: {
//       delay: 5000,
//       disableOnInteraction: false,
//     },
//     navigation: {
//       nextEl: '.swiper-next.products',
//       prevEl: '.swiper-prev.products',
//     },
//     breakpoints: {
//       320: {
//         simulateTouch: true,
//       },
//       768: {
//         // 
//       }
//     },
//     thumbs: {
//       swiper: sliderThumbs,
//     },
//     on: {
//       slideChange: function () {
//         updateProgressBullets(this.realIndex, this.params.autoplay?.delay || 5000);
//       }
//     }
//   });

//   function updateProgressBullets(activeIndex, duration) {
//     const bullets = document.querySelectorAll(".c-products-progress-bullet");

//     bullets.forEach((bullet, index) => {
//       bullet.classList.remove("is-active");

//       const bar = bullet.querySelector(".c-hm-hero-progress-bullet-bar");
//       if (bar) {
//         bar.style.animation = "none"; // Reset animation
//         bar.offsetHeight; // Trigger reflow to restart animation
//       }

//       if (index === activeIndex) {
//         bullet.classList.add("is-active");
//         if (bar) {
//           bar.style.animation = `progressAnimation ${duration}ms linear forwards`;
//         }
//       }
//     });
//   }
// }

function productCardsMobile() {
  const section = document.querySelector("[data-products-mobile]");
  if (!section) return;

  // Thumbs
  const sliderThumbs = new Swiper('.swiper.products-nav', {
    spaceBetween: 10,
    slidesPerView: "auto",
    loop: true,
  });

  // Initialize slider without autoplay
  const slider = new Swiper(".swiper.products", {
    slidesPerView: "auto",
    spaceBetween: 16,
    loop: true,
    simulateTouch: false,
    navigation: {
      nextEl: '.swiper-next.products',
      prevEl: '.swiper-prev.products',
    },
    thumbs: {
      swiper: sliderThumbs,
    },
    on: {
      slideChange: function () {
        updateProgressBullets(this.realIndex, this.params.autoplay?.delay || 5000);
      }
    }
  });

  function updateProgressBullets(activeIndex, duration) {
    const bullets = document.querySelectorAll(".c-products-progress-bullet");

    bullets.forEach((bullet, index) => {
      bullet.classList.remove("is-active");

      const bar = bullet.querySelector(".c-hm-hero-progress-bullet-bar");
      if (bar) {
        bar.style.animation = "none"; // Reset animation
        bar.offsetHeight; // Trigger reflow to restart animation
      }

      if (index === activeIndex) {
        bullet.classList.add("is-active");
        if (bar) {
          bar.style.animation = `progressAnimation ${duration}ms linear forwards`;
        }
      }
    });
  }

  // Function to enable autoplay only on mobile
  function updateAutoplay() {
    if (window.innerWidth < 768) {
      slider.params.autoplay = { delay: 5000, disableOnInteraction: false };
      slider.autoplay.start();
    } else {
      slider.autoplay.stop();
    }
  }

  // Run on load and resize
  updateAutoplay();
  window.addEventListener("resize", updateAutoplay);
}

// --------------- PAGES ---------------
let homepage = document.querySelector("[data-page='homepage']");

// --------------- INIT ---------------
function init() {
  pressCoverageSlider();
  videoModal();
  ticker();
  heroAnimation();
  homeHeroSlider();
  networkSection();
  infiniteRotation();
  boxesAnimation();
  galleryMarquee();
  resourcesFilter();
  resourcesFeaturedSlider();
  customerStatCards();
  resourceAPIChecker();
  lottieInit();
  faqAccordions();
  homeIrisLayersAnimation();
  oldSiteGlobalCode();
  duplexVerticalMarquee();
  pressPagination();
  pressAPIChecker();
  tickerComp();
  fade();
  newsTickerMobile();
  productCardsMobile();
}

init();

// --------------- MATCHMEDIA - DESKTOP ---------------
mm.add("(min-width: 992px)", () => {
  const headerCleanup = headerDesktop();
  headerScrolled();
  skipLink();
  duplexAccordionsDesktop();
  // homeHeroSticky();
  return () => {
    headerCleanup();
  };
});

// --------------- MATCHMEDIA - TABLET AND MOBILE ---------------
mm.add("(max-width: 991px)", () => {
  duplexAccordionsMobile();
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
