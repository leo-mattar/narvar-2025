document.addEventListener("DOMContentLoaded", function () {
  function blogToc() {
    const content = document.querySelector(".t-rich-text.re.blog-single");
    const tocContainer = document.querySelector(".c-toc-link")?.parentElement;
    if (!content || !tocContainer) return;

    const placeholderLinks = tocContainer.querySelectorAll(".c-toc-link");
    placeholderLinks.forEach(el => el.remove());

    const headings = content.querySelectorAll("h2, h3, h4");
    if (headings.length === 0) return;

    const tocLinks = [];

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `toc-heading-${index}`;
      }

      const link = document.createElement("a");
      link.className = "c-toc-link";

      const text = document.createElement("div");
      text.className = "t-body-2";
      text.textContent = heading.textContent;

      link.appendChild(text);
      tocContainer.appendChild(link);

      link.addEventListener("click", e => {
        e.preventDefault();
        lenis.scrollTo(heading, { offset: -100 });
      });

      tocLinks.push({ link, heading });
    });

    // Active state logic
    function setActiveLink() {
      let closest = null;
      let closestOffset = Number.POSITIVE_INFINITY;

      tocLinks.forEach(({ heading, link }) => {
        const rect = heading.getBoundingClientRect();
        const offset = Math.abs(rect.top - 100); // match offset used in scrollTo
        if (rect.top <= 150 && offset < closestOffset) {
          closest = link;
          closestOffset = offset;
        }
      });

      tocLinks.forEach(({ link }) => {
        link.classList.toggle("is-toc-active", link === closest);
      });
    }

    window.addEventListener("scroll", setActiveLink);
    window.addEventListener("load", setActiveLink);
    setActiveLink(); // initial state
  }

  blogToc();

  function tocMobile() {
    const triggers = document.querySelectorAll(".c-toc-toggle");
    const defaults = { duration: 0.6, ease: "power4.inOut" };
    const timelines = [];

    triggers.forEach(trigger => {
      const arrow = trigger.querySelector(".c-icon.toc-arrow");
      const content = trigger.nextElementSibling;

      content.style.height = "auto";
      const autoHeight = content.offsetHeight;
      content.style.height = "0px";
      content.style.overflow = "hidden";

      const tl = gsap.timeline({ defaults, paused: true, reversed: true });

      tl.to(arrow, { rotate: 180 }, 0).to(
        content,
        { height: autoHeight, marginTop: "1.5em" },
        0
      );

      const onClick = () => {
        if (tl.reversed()) {
          tl.restart();
        } else {
          tl.reverse();
        }
      };

      trigger.addEventListener("click", onClick);
      timelines.push({ tl, trigger, content, arrow, onClick });
    });

    return timelines;
  }

  let timelines = [];

  function initOrDestroyAccordion() {
    if (window.innerWidth <= 991) {
      if (timelines.length === 0) {
        timelines = tocMobile();
      }
    } else {
      timelines.forEach(({ tl, trigger, content, arrow, onClick }) => {
        tl.kill();
        trigger.removeEventListener("click", onClick);
        content.style.height = "";
        content.style.overflow = "";
        content.style.marginTop = "";
        arrow.style.transform = "";
      });
      timelines = [];
    }
  }

  window.addEventListener("load", initOrDestroyAccordion);
  window.addEventListener("resize", initOrDestroyAccordion);
});
