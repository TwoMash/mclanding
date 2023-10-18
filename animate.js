/*-------------------------------------------------  Anti FOUC  ------------------------------------------------------------------------ */

window.addEventListener("DOMContentLoaded", function () {
  document.body.style.opacity = 1;
});

/*-------------------------------------------------  Header Control  ------------------------------------------------------------------------ */
function handleScroll() {
  const header = document.querySelector('[data-scroll="header"]');
  const logo = document.querySelector('[data-scroll="logo"]');

  gsap.set(logo, { y: "-200px" });

  ScrollTrigger.create({
    trigger: "document.body",
    start: "top top-=300",
    end: "top top-=300",
    onEnter: () => {
      gsap.to(header, { y: "-200px", duration: 0.5 });
      gsap.to(logo, { y: "0px", duration: 0.5 });
    },
    onLeaveBack: () => {
      gsap.to(header, { y: "0px", duration: 0.5 });
      gsap.to(logo, { y: "-200px", duration: 0.5 });
    },
  });
}

window.addEventListener("load", handleScroll);

/*-------------------------------------------------  Text Animation library  ------------------------------------------------------------------------ */

function handleAnimation() {
  function animateElement(element, selector, animationOptions) {
    try {
      if (selector) {
        gsap.from(element.querySelectorAll(selector), animationOptions);
      } else {
        gsap.from(element, animationOptions);
      }
    } catch (error) {}
  }

  //Object Initialization
  document.querySelectorAll("[animate]").forEach((element) => {
    let wordsSplit = new SplitType(element, {
      types: "lines, words, chars",
      tagName: "span",
    });

    // Choose selector
    let selector;
    if (element.hasAttribute("lines")) {
      selector = " .line";
    } else if (element.hasAttribute("words")) {
      selector = " .word";
    } else if (element.hasAttribute("chars")) {
      selector = " .char";
    } else if (element.hasAttribute("paragraphs")) {
      selector = "";
    } else {
      selector = " .word";
    }

    let animationType = element.getAttribute("animate") || "slide";

    let animationOptions = {
      duration: parseFloat(element.getAttribute("duration") || 0.8),
      stagger: parseFloat(element.getAttribute("stagger") || 0.01),
      opacity: parseFloat(element.getAttribute("opacity") || 1),
      rotationZ: parseFloat(element.getAttribute("rotation") || 0),
      x: parseFloat(element.getAttribute("dx") || 0),
      y: parseFloat(element.getAttribute("dy") || 0),
      ease: "power4.inOut",
    };

    switch (animationType) {
      case "slide":
        animationOptions.opacity = element.getAttribute("opacity") || "1";
        animationOptions.y = element.getAttribute("y") || "300%";
        break;
      case "rotate":
        animationOptions.opacity = element.getAttribute("opacity") || "0.3";
        animationOptions.rotationZ = element.getAttribute("rotation") || "10";
        animationOptions.y = element.getAttribute("y") || "300%";
        break;
      case "scrub":
        animationOptions.opacity = element.getAttribute("opacity") || "0.2";
        animationOptions.stagger = element.getAttribute("stagger") || "0.2";
        break;
      default:
        return;
    }

    function transformAttributeValue(value) {
      return value
        .split(",")
        .map((val) => `${val.trim()}%`)
        .join(" ");
    }

    if (element.hasAttribute("scroll")) {
      const startValue = element.getAttribute("starts");
      const endValue = element.getAttribute("end");

      animationOptions.scrollTrigger = {
        trigger: element,
        start: startValue ? transformAttributeValue(startValue) : "top 90%",
        end: endValue ? transformAttributeValue(endValue) : "100% 50%",
      };

      if (element.hasAttribute("marker")) {
        animationOptions.scrollTrigger.markers = true;
      }

      if (element.hasAttribute("pin")) {
        animationOptions.scrollTrigger.pin = true;
      }
    }

    if (element.hasAttribute("scrub")) {
      if (!animationOptions.scrollTrigger) {
        animationOptions.scrollTrigger = {};
      }
      animationOptions.scrollTrigger.scrub = true;
      animationOptions.ease = "none";
    }

    animateElement(element, selector, animationOptions);

    // Replay animation by hover
    if (element.hasAttribute("hover")) {
      element.addEventListener("mouseenter", () => {
        animateElement(element, selector, animationOptions);
      });
    }
  });

  // For hide letter
  let style = document.createElement("style");
  style.innerHTML = `
          .line {
            overflow: hidden !important;
            padding-bottom: 0.2em;
            margin-bottom: -0.2em;
            transform-origin: bottom;
          }
        `;

  document.head.appendChild(style);

  /*-------------------------------------------------  Fade in animation by scroll ------------------------------------------------------------------------ */

  document.querySelectorAll("[fade-in]").forEach((el) => {
    gsap.fromTo(
      el,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 2,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      }
    );
  });
}

let lastWidth = window.innerWidth;

window.addEventListener("resize", function (event) {
  const currentWidth = window.innerWidth;

  if (lastWidth !== currentWidth) {
    handleAnimation();
    lastWidth = currentWidth;
  }
});
window.addEventListener("DOMContentLoaded", handleAnimation);

/*-------------------------------------------------  Counter animation ------------------------------------------------------------------------ */

gsap.utils.toArray("[data-counterup]").forEach(function (el) {
  var matches = el.textContent.match(/(\d+)/);
  var dataNumber = matches ? parseFloat(matches[0]) : 0;

  var prefix = el.textContent.substr(0, matches.index);
  var suffix = el.textContent.substr(matches.index + matches[0].length);

  el.textContent = prefix + "0" + suffix;

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play pause resume pause",
    },
  });

  var target = { val: 0 };
  var duration = parseFloat(el.getAttribute("data-duration")) || 2;

  tl.to(target, {
    val: dataNumber,
    duration: duration,
    onUpdate: function () {
      el.innerHTML = prefix + Math.round(target.val) + suffix;
    },
  });
});

/*-------------------------------------------------  Sticky block to bottom ------------------------------------------------------------------------ */

let stickyBlocks = document.querySelectorAll('[data-block*="sticky"]');

stickyBlocks.forEach((stickyBlock) => {
  ScrollTrigger.create({
    trigger: stickyBlock,
    start: "bottom bottom",
    end: "+=1080",
    pin: true,
    pinSpacing: false,
    onUpdate: (self) => {
      const scale = 1 - 0.1 * self.progress;
      const opacity = 1 - self.progress;

      stickyBlock.style.transform = `scale(${scale})`;
      stickyBlock.style.opacity = opacity;
    },
  });
});

/*-------------------------------------------------  Card shine effect ------------------------------------------------------------------------ */

gsap.to(".shine-effect", {
  backgroundPosition: "100% 0",
  duration: 3,
  repeat: -1, // бесконечное повторение
  yoyo: true, // возврат назад
  ease: "power2.inOut",
});

/*-------------------------------------------------  Recolor block ------------------------------------------------------------------------ */

const whiteBlock = document.querySelector('[data-block="light"]');
const whiteBgElement = document.querySelectorAll(".bg-recolor");

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: whiteBlock,
    start: "center top",
    end: "bottom bottom",
    scrub: 1,
  },
});

tl.fromTo(
  whiteBgElement,
  {
    opacity: 0,
  },
  {
    opacity: 1,
  }
);

/*-------------------------------------------------  Opportunity cards sticky ------------------------------------------------------------------------ */

let opportunityCards = document.querySelectorAll("[opportunity-card]");
opportunityCards.forEach((opportunityCard) => {
  let style = window.getComputedStyle(opportunityCard);
  let marginTop = parseInt(style.marginTop);

  if (window.matchMedia("(min-height: 450px)").matches) {
    ScrollTrigger.create({
      trigger: opportunityCard,
      start: `top-=${marginTop} 10%`,
      endTrigger: whiteBlock,
      end: `bottom bottom`,
      pin: true,
      pinSpacing: false,
    });
  } else {
    ScrollTrigger.create({
      trigger: opportunityCard,
      start: `top-=${marginTop} -90%`,
      endTrigger: whiteBlock,
      end: `bottom bottom`,
      pin: true,
      pinSpacing: false,
    });
  }
});

/*-------------------------------------------------  Ecosystem table ------------------------------------------------------------------------ */

let ecosystemCategory = document.querySelectorAll(".ecosystem_category");
let ecosystemCategoryState = new Map();

var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
var elements = document.querySelectorAll(".ecosystem_category");

//Accordeon image
if (window.innerWidth < 520) {
  var elements = document.querySelectorAll(".ecosystem_category");

  elements.forEach(function (element) {
    element.addEventListener("click", handleAccordionToggle);
  });
}

function handleAccordionToggle(event) {
  var element = event.currentTarget;

  if (element.classList.contains("expanded")) {
    element.classList.remove("expanded");
  } else {
    element.classList.add("expanded");
  }
}

//Scale image
elements.forEach(function (element) {
  if (window.innerWidth >= 521) {
    // проверка ширины экрана
    if (isTouchDevice) {
      element.addEventListener("click", handleClick);
    } else {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    }
  }
});

function handleClick(event) {
  var element = event.currentTarget;
  toggleFade(element);
}

function handleMouseEnter(event) {
  var element = event.currentTarget;
  toggleFade(element);
}

function handleMouseLeave(event) {
  resetFade();
}

function toggleFade(element) {
  var isAlreadyHighlighted = element.classList.contains("highlight");
  resetFade();
  if (isAlreadyHighlighted) {
  } else {
    setTransformOrigin(element);
    element.classList.add("highlight");
    var otherElements = document.querySelectorAll(
      ".ecosystem_category:not(.highlight)"
    );
    otherElements.forEach(function (el) {
      el.classList.add("fade");
    });
  }
}

function resetFade() {
  var fadedElements = document.querySelectorAll(".fade");
  var highlightedElements = document.querySelectorAll(".highlight");
  fadedElements.forEach(function (el) {
    el.classList.remove("fade");
  });
  highlightedElements.forEach(function (el) {
    el.classList.remove("highlight");
    el.style.transformOrigin = "";
  });
}

function setTransformOrigin(element) {
  var rect = element.getBoundingClientRect();
  var transformOrigin = "";

  if (rect.top + rect.height / 2 < window.innerHeight / 2) {
    transformOrigin += "top ";
  } else {
    transformOrigin += "bottom ";
  }

  if (rect.left + rect.width / 2 < window.innerWidth / 2) {
    transformOrigin += "left";
  } else {
    transformOrigin += "right";
  }

  element.style.transformOrigin = transformOrigin;
}

// Animation for each element as it comes into view
ecosystemCategory.forEach((element) => {
  if (element.getAttribute("data-line") === "0") {
    return;
  }

  let x = gsap.utils.random(-100, 100);
  let y = gsap.utils.random(200, 300);

  gsap.from(element, {
    y: y,
    x: x,
    opacity: 0,
    scale: 1.5,
    rotateX: x / 4,
    rotateY: y / 4,
    ease: "power2.Out",
    duration: 0.8,
    onComplete: function () {
      ecosystemCategoryState.set(element, "visible");
      element.style.transform = "";
      element.style.opacity = "";
      element.style.transitionProperty = "all";
      element.style.transitionDuration = "400ms";
      element.style.transitionTimingFunction =
        "cubic-bezier(.645, .045, .355, 1)";
    },
    scrollTrigger: {
      trigger: element,
      start: window.matchMedia("(max-height: 800px)").matches
        ? "top bottom+=30"
        : "top bottom-=150",
      immediateRender: true,
    },
  });
});

/*-------------------------------------------------  Footer sticky ------------------------------------------------------------------------ */

gsap.set(".section_footer", { opacity: 0 });

ScrollTrigger.create({
  trigger: "[footer-release]",
  start: "top top",
  onEnter: function () {
    gsap.to(".section_footer", { opacity: 1, duration: 0.5 });
  },
  onLeaveBack: function () {
    gsap.to(".section_footer", { opacity: 0, duration: 0.5 });
  },
});
