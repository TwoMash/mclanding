/*-------------------------------------------------  Anti FOUC  ------------------------------------------------------------------------ */

window.addEventListener("DOMContentLoaded", function () {
  document.body.style.opacity = 1;
});

/*-------------------------------------------------  Header Color Control  ------------------------------------------------------------------------ */

const header = document.querySelector('[data-scroll="header"]');
let colorHistory = [];

document.querySelectorAll("[data-block]").forEach((block) => {
  const blockType = block.getAttribute("data-block");
  let backgroundColor, textColor;
  if (blockType.includes("light")) {
    backgroundColor = "#E5E5E8";
    textColor = "#000000";
  } else if (blockType.includes("dark")) {
    backgroundColor = "#000000";
    textColor = "#ffffff";
  } else if (blockType.includes("white")) {
    backgroundColor = "#ffffff";
    textColor = "#000000";
  }

  //Trgger for header color
  const triggerConfig = {
    trigger: block,
    start: blockType.includes("hero-banner") ? "top -30%" : "top 20%",
    end: "bottom 20%",
    onEnter: () => {
      colorHistory.push({
        backgroundColor: header.style.backgroundColor,
        textColor: header.style.color,
      });

      header.style.backgroundColor = backgroundColor;
      header.style.color = textColor;
    },
    onLeaveBack: () => {
      if (colorHistory.length > 0) {
        const lastColor = colorHistory.pop();
        header.style.backgroundColor = lastColor.backgroundColor;
        header.style.color = lastColor.textColor;
      }
    },
  };

  ScrollTrigger.create(triggerConfig);
});

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
  ScrollTrigger.create({
    trigger: opportunityCard,
    start: "center center",
    endTrigger: whiteBlock,
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
  });
});

/*-------------------------------------------------  Ecosystem table ------------------------------------------------------------------------ */

let elements = document.querySelectorAll("[data-line]");
let elementsState = new Map();

let sortedElements = Array.from(elements).sort((a, b) => {
  return (
    parseInt(a.getAttribute("data-line")) -
    parseInt(b.getAttribute("data-line"))
  );
});

let activeElement = null;

sortedElements.forEach((element) => {
  let tapCount = 0;
  let initialTouchX, initialTouchY;

  if (element.getAttribute("data-line") === "0") {
    return;
  }

  let x = gsap.utils.random(-100, 100);
  let y = gsap.utils.random(200, 300);

  gsap.from(element, {
    y: y,
    x: x,
    opacity: 0,
    scale: 1.25,
    rotateX: x / 3,
    rotateY: y / 3,
    ease: "power2.Out",
    duration: 0.8,
    onComplete: function () {
      elementsState.set(element, "visible");
    },
    scrollTrigger: {
      trigger: element,
      start: window.matchMedia("(max-width: 480px)").matches
        ? "top 150%"
        : "top bottom",
      immediateRender: true,
    },
  });

  function resetElement() {
    gsap.to(element, {
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 1,
      opacity: 1,
      duration: 0.3,
      ease: "power2.Out",
    });
    let ecosystemElement = element.querySelector(".ecosystem-content");
    if (ecosystemElement) {
      ecosystemElement.style.display = "none";
    }
    tapCount = 0;
  }

  element.addEventListener("touchstart", (e) => {
    e.preventDefault();

    if (window.matchMedia("(max-width: 480px)").matches) {
      let ecosystemElement = element.querySelector(".ecosystem-content");

      if (activeElement === element) {
        ecosystemElement.style.display = "none";
        activeElement = null;
      } else {
        ecosystemElement.style.display = "block";
        activeElement = element;
      }
    } else {
      let rect = element.getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left - rect.width / 2;
      let y = e.touches[0].clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.2,
        y: y * 0.2,
        scale: 1.4,
        zIndex: 500,
        duration: 0.3,
        opacity: 1,
        ease: "power2.Out",
      });
    }

    if (!window.matchMedia("(max-width: 480px)").matches) {
      sortedElements.forEach((otherElement) => {
        if (
          otherElement !== element &&
          elementsState.get(otherElement) === "visible"
        ) {
          gsap.to(otherElement, {
            opacity: 0,
            duration: 0.4,
          });
        }
      });
    }
  });

  element.addEventListener("touchmove", (e) => {
    if (!window.matchMedia("(max-width: 480px)").matches) {
      let rect = element.getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left - rect.width / 2;
      let y = e.touches[0].clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.6,
        y: y * 0.6,
        scale: 2,
        zIndex: 500,
        duration: 0.8,
        opacity: 1,
        ease: "power2.Out",
      });
    }
  });

  element.addEventListener("touchend", (e) => {
    if (!window.matchMedia("(max-width: 480px)").matches) {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.Out",
      });

      sortedElements.forEach((otherElement) => {
        if (elementsState.get(otherElement) === "visible") {
          gsap.to(otherElement, {
            opacity: 1,
            duration: 0.4,
          });
        }
      });
    }
  });

  element.addEventListener("mousemove", (e) => {
    if (window.matchMedia("(max-width: 480px)").matches) {
      let ecosystemElement = element.querySelector(".ecosystem-content");
      if (ecosystemElement) {
        ecosystemElement.style.display = "block";
      }
    }
    let rect = element.getBoundingClientRect();
    let x = e.clientX - rect.left - rect.width / 2;
    let y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * 0.2,
      y: y * 0.2,
      scale: 1.4,
      zIndex: 500,
      duration: 0.3,
      opacity: 1,
      ease: "power2.Out",
    });

    sortedElements.forEach((otherElement) => {
      if (
        otherElement !== element &&
        elementsState.get(otherElement) === "visible"
      ) {
        gsap.to(otherElement, {
          opacity: 0,
          duration: 0.4,
        });
      }
    });
  });

  element.addEventListener("mouseleave", () => {
    if (window.matchMedia("(max-width: 480px)").matches) {
      let ecosystemElement = element.querySelector(".ecosystem-content");
      if (ecosystemElement) {
        ecosystemElement.style.display = "none";
      }
    }
    gsap.to(element, {
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 1,
      opacity: 1,
      duration: 0.3,
      ease: "power2.Out",
    });

    sortedElements.forEach((otherElement) => {
      if (elementsState.get(otherElement) === "visible") {
        gsap.to(otherElement, {
          opacity: 1,
          duration: 0.4,
        });
      }
    });
  });
});

/*-------------------------------------------------  Chart JS ------------------------------------------------------------------------ */

var currentSegmentIndex = 0;

function initChart() {
  var ctx = document.getElementById("myPieChart").getContext("2d");
  var dataValues = [61, 22, 4, 3, 6, 4];
  var total = dataValues.reduce((acc, val) => acc + val, 0);

  myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Fintech", "SaaS", "E-commerce", "HRTech", "EdTech", "Other"],
      datasets: [
        {
          data: dataValues,
          backgroundColor: [
            "#050505",
            "#0A0A0A",
            "#0F0F0F",
            "#121212",
            "#1A1A1A",
            "#1F1F1F",
          ],
          borderColor: "#535353",
          borderWidth: 0.5,
          hoverBackgroundColor: [
            "#EC0A24",
            "#cc444b",
            "#da5552",
            "#df7373",
            "#e39695",
            "#e4b1ab",
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            padding: 32,
            generateLabels: function (chart) {
              const original =
                Chart.overrides.pie.plugins.legend.labels.generateLabels;
              const labels = original.call(this, chart);
              labels.forEach((label, i) => {
                const value = dataValues[i];
                const percentage = ((value / total) * 100).toFixed(2);
                label.text = `${label.text} (${percentage}%)`;
              });
              return labels;
            },
            onClick: null,
          },
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: function (context) {
              var value = context.parsed;
              return value + "%";
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 1500,
        easing: "easeInOutCubic",
      },
    },
  });

  activateSegment(currentSegmentIndex);
  setInterval(changeActiveSegment, 3000);
}

function activateSegment(idx) {
  myPieChart.setActiveElements([]);
  myPieChart.tooltip.setActiveElements([]);

  myPieChart.setActiveElements([
    {
      datasetIndex: 0,
      index: idx,
    },
  ]);
  myPieChart.tooltip.setActiveElements(
    [
      {
        datasetIndex: 0,
        index: idx,
      },
    ],
    false
  );

  myPieChart.update();
}

function changeActiveSegment() {
  currentSegmentIndex = (currentSegmentIndex + 1) % 6;
  activateSegment(currentSegmentIndex);
}

ScrollTrigger.create({
  trigger: "#myPieChart",
  start: "top 85%",
  onEnter: function () {
    initChart();
  },
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
