window.addEventListener('DOMContentLoaded', function() {
  document.body.style.opacity = 1;
  }); 
  
  const header = document.querySelector('[data-scroll="header"]');
  // Массив для хранения истории цветов
  let colorHistory = [];
  
  document.querySelectorAll('[data-block]').forEach(block => {
    const blockType = block.getAttribute('data-block');
  
    let backgroundColor, textColor;
    if (blockType.includes('light')) {
      backgroundColor = '#E5E5E8'; // HEX код бекграунда для светлой темы
      textColor = '#000000'; // HEX код содержимого для светлой темы
    } else if (blockType.includes('dark')) {
      backgroundColor = '#000000'; // HEX код бекграунда для темной темы
      textColor = '#ffffff'; // HEX код содержимого для темной темы
    } else if (blockType.includes('white')) { // добавленное условие для 'white'
      backgroundColor = '#ffffff';
      // Если текстовый цвет для "white" не определен, используем, например, черный. Можно адаптировать по вашим нуждам.
      textColor = '#000000';
    }
  
    const triggerConfig = {
      trigger: block,
      start: blockType.includes('hero-banner') ? "top -30%" : "top 20%",
      end: "bottom 20%",
      onEnter: () => {
        colorHistory.push({
          backgroundColor: header.style.backgroundColor,
          textColor: header.style.color
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
      }
    };
  
    ScrollTrigger.create(triggerConfig);
  });
  
  
  
  window.addEventListener('load', function() {
    const marquees = document.querySelectorAll("[marquee]");
      
      if (marquees.length > 0) {
            marquees.forEach(initCarousel);
      } else {
          console.warn("No elements with [marquee] attribute found.");
      }
      
      let currentScroll = 0;
      
      function initCarousel(wrapper) {
          let speedAttribute = parseFloat(wrapper.getAttribute("marquee-speed"));
          let speed = isNaN(speedAttribute) ? 1 : speedAttribute; // Если атрибут не установлен или не число, используйте 1 как значение по умолчанию.
      
          const boxes = gsap.utils.toArray(wrapper.querySelectorAll("[marquee-element]"));
          const loop = horizontalLoop(boxes, { paused: false, repeat: -1, speed: speed });
      
          window.addEventListener("scroll", function () {
              const isScrollingDown = window.scrollY > currentScroll;
              const marqueeAttribute = wrapper.getAttribute("marquee");
      
              if (marqueeAttribute === "scroll") {
                  gsap.to(loop, {
                      timeScale: isScrollingDown ? 1 : -1,
                  });
              }
      
              currentScroll = window.scrollY;
          });
      }
  
      
      function horizontalLoop(items, config) {
        items = gsap.utils.toArray(items);
        config = config || {};
        let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
            length = items.length,
            startX = items[0].offsetLeft,
            times = [],
            widths = [],
            xPercents = [],
            curIndex = 0,
            pixelsPerSecond = (config.speed || 1) * 100, // теперь используется config.speed
            snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
            totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    
        gsap.set(items, {
            xPercent: (i, el) => {
                let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
                return xPercents[i];
            }
        });
  
    
        gsap.set(items, {x: 0});
        totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    
        for (i = 0; i < length; i++) {
            item = items[i];
            curX = xPercents[i] / 100 * widths[i];
            distanceToStart = item.offsetLeft + curX - startX;
            distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
                .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
                .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
        }
    
        tl.next = vars => toIndex(curIndex+1, vars);
        tl.previous = vars => toIndex(curIndex-1, vars);
        tl.current = () => curIndex;
        tl.toIndex = (index, vars) => toIndex(index, vars);
        tl.times = times;
        tl.progress(1, true).progress(0, true); 
    
        if (config.reversed) {
            tl.vars.onReverseComplete();
            tl.reverse();
        }
        return tl;
        }
  
      });
  
  
  
  
  function handleAnimation() {  
      function animateElement(element, selector, animationOptions) {
          try {
            if (selector) {
              gsap.from(element.querySelectorAll(selector), animationOptions);
            } else {
              gsap.from(element, animationOptions);
            }
          } catch (error) {
            // Если что-то пошло не так
          }
        }
        
        document.querySelectorAll('[animate]').forEach((element) => {
          // Разделение текста
          let wordsSplit = new SplitType(element, {
            types: 'lines, words, chars',
            tagName: 'span',
          });
        
          // Определяем селектор для разделения
          let selector;
          if (element.hasAttribute('lines')) {
            selector = ' .line';
          } else if (element.hasAttribute('words')) {
            selector = ' .word';
          } else if (element.hasAttribute('chars')) {
            selector = ' .char';
          } else if (element.hasAttribute('paragraphs')) {
            selector = '';  // для paragraphs
          } else {
            selector = ' .word';  // слово по умолчанию
          }
        
          // Определяем тип анимации. Если атрибут 'animate' отсутствует, используем 'slide' по умолчанию.
          let animationType = element.getAttribute('animate') || 'slide';
        
          let animationOptions = {
            duration: parseFloat(element.getAttribute('duration') || 0.8),
            stagger: parseFloat(element.getAttribute('stagger') || 0.01),
            opacity: parseFloat(element.getAttribute('opacity') || 1),
            rotationZ: parseFloat(element.getAttribute('rotation') || 0),
            x: parseFloat(element.getAttribute('dx') || 0),
            y: parseFloat(element.getAttribute('dy') || 0),
            ease: 'power4.inOut'
          };
        
          switch (animationType) {
            case 'slide':
              animationOptions.opacity = element.getAttribute('opacity') || '1';
              animationOptions.y = element.getAttribute('y') || '300%';
              break;
            case 'rotate':
              animationOptions.opacity = element.getAttribute('opacity') || '0.3';
              animationOptions.rotationZ = element.getAttribute('rotation') || '10';
              animationOptions.y = element.getAttribute('y') || '300%';
              break;
            case 'scrub':
              animationOptions.opacity = element.getAttribute('opacity') || '0.2';
              animationOptions.stagger = element.getAttribute('stagger') || '0.2';
              break;
            default:
              return;
          }
        
          function transformAttributeValue(value) {
            return value.split(',').map(val => `${val.trim()}%`).join(' ');
          }
        
          if (element.hasAttribute('scroll')) {
            const startValue = element.getAttribute('starts');
            const endValue = element.getAttribute('end');
        
            animationOptions.scrollTrigger = {
              trigger: element,
              start: startValue ? transformAttributeValue(startValue) : 'top 90%',
              end: endValue ? transformAttributeValue(endValue) : '100% 50%',
            };
        
            if (element.hasAttribute('marker')) {
              animationOptions.scrollTrigger.markers = true;
            }
        
            if (element.hasAttribute('pin')) {
              animationOptions.scrollTrigger.pin = true;
            }
          }
        
          if (element.hasAttribute('scrub')) {
            if (!animationOptions.scrollTrigger) {
              animationOptions.scrollTrigger = {};
            }
            animationOptions.scrollTrigger.scrub = true;
            animationOptions.ease = 'none';
          }
        
          // Применить анимацию сразу
          animateElement(element, selector, animationOptions);
        
          // Если есть атрибут 'hover', то проигрывать анимацию при наведении
          if (element.hasAttribute('hover')) {
            element.addEventListener('mouseenter', () => {
              animateElement(element, selector, animationOptions);
            });
          }
        });
        
        // Добавление стилей для .line
        let style = document.createElement('style');
        style.innerHTML = `
          .line {
            overflow: hidden !important;
            padding-bottom: 0.2em;
            margin-bottom: -0.2em;
            transform-origin: bottom;
          }
        `;
        
  
       document.head.appendChild(style);
  
    
    
       
      //Проявления элементов при скролле
      document.querySelectorAll('[fade-in]').forEach(el => {
          gsap.fromTo(
              el,
              {
                  opacity: 0
              },
              {
                  opacity: 1,
                  duration: 2,
                  scrollTrigger: {
                      trigger: el,
                      start: 'top 90%', 
                                    }
              }
          );
          });
          
      };
  
      window.addEventListener('resize', handleAnimation);
      window.addEventListener('DOMContentLoaded', handleAnimation);
    
    
   
  
  
  gsap.utils.toArray('[data-counterup]').forEach(function (el) {
    // Извлекаем только числовую часть из текстового содержимого элемента
    var matches = el.textContent.match(/(\d+)/);
    var dataNumber = matches ? parseFloat(matches[0]) : 0;
  
    // Запоминаем нечисловые части содержимого для дальнейшего использования
    var prefix = el.textContent.substr(0, matches.index);
    var suffix = el.textContent.substr(matches.index + matches[0].length);
  
    // Устанавливаем начальное значение числовой части содержимого как 0
    el.textContent = prefix + '0' + suffix;
  
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play pause resume pause',
      },
    });
  
    var target = { val: 0 };
    var duration = parseFloat(el.getAttribute('data-duration')) || 2;
  
    tl.to(target, {
      val: dataNumber,
      duration: duration,
      onUpdate: function () {
        el.innerHTML = prefix + Math.round(target.val) + suffix;
      },
    });
  });
  
  
  let stickyBlocks = document.querySelectorAll('[data-block*="sticky"]');
  
  stickyBlocks.forEach(stickyBlock => {
    ScrollTrigger.create({
      trigger: stickyBlock,
      start: "bottom bottom",
      end: "+=1080", // Может потребоваться настройка
      pin: true,
      pinSpacing: false,
      onUpdate: self => {
        // const scale = 1 - 0.1 * self.progress; // уменьшится до 0.5 при полном прокручивании
        const opacity = 1 - self.progress;     // уменьшится до 0 при полном прокручивании
        
        // stickyBlock.style.transform = `scale(${scale})`;
        stickyBlock.style.opacity = opacity;
      }
    });
  });
  
  
  
  
  
  gsap.to(".shine-effect", {
    backgroundPosition: "100% 0",
    duration: 3,
    repeat: -1, // бесконечное повторение
    yoyo: true, // возврат назад
    ease: "power2.inOut"
  });
  
  
  
  // Находим элементы
  const whiteBlock = document.querySelector('[data-block="light"]');
  const whiteBgElement = document.querySelectorAll('.bg-recolor');
  
  // Создаем GSAP анимацию
  let tl = gsap.timeline({
      scrollTrigger: {
        trigger: whiteBlock,
        start: "center top",
        end: "bottom bottom",
        scrub: 1 // Это делает анимацию "прилипающей" к позиции скролла
      }
    });
    
    // Добавляем анимацию видимости к timeline
    tl.fromTo(whiteBgElement, {
      opacity: 0
    }, {
      opacity: 1
    });
  
    
    
    let opportunityCards = document.querySelectorAll('[opportunity-card]');
    opportunityCards.forEach(opportunityCard => {
      ScrollTrigger.create({
        trigger: opportunityCard,
        start: "center center",
        endTrigger: whiteBlock,  // Указываем, что окончание триггера зависит от whiteBlock
        end: "bottom bottom",      // Завершаем, когда верх whiteBlock достигает центра экрана
        pin: true,
        pinSpacing: false
      });
    });
  


    
    let elements = document.querySelectorAll("[data-line]");
    let elementsState = new Map();  // Для отслеживания состояния каждого элемента
    
    let sortedElements = Array.from(elements).sort((a, b) => {
        return parseInt(a.getAttribute("data-line")) - parseInt(b.getAttribute("data-line"));
    });
    
    let activeElement = null;  // Для отслеживания активного элемента на сенсорных экранах
    
    sortedElements.forEach((element) => {
        let tapCount = 0;
        let initialTouchX, initialTouchY;
    
        // Проверка, что атрибут data-line равен "0"
        if (element.getAttribute('data-line') === '0') {
            return; // Если значение равно "0", пропустите текущий элемент
        }
    
        let x = gsap.utils.random(-100, 100);
        let y = gsap.utils.random(200, 300);
    
        // Анимация при загрузке страницы
        gsap.from(element, {
            y: y,
            x: x,
            opacity: 0,
            scale: 1.25,
            rotateX: x / 3,
            rotateY: y / 3,
            ease: "power2.Out",
            duration: 0.8,
            onComplete: function() {
                elementsState.set(element, 'visible');  // обновляем состояние после завершения анимации
            },
            scrollTrigger: {
                trigger: element,
                start: window.matchMedia("(max-width: 480px)").matches ? "top 150%" : "top bottom", 
                immediateRender: true
            }
        });
    
        // Функция для сброса состояния элемента
        function resetElement() {
            gsap.to(element, {
                x: 0,
                y: 0,
                scale: 1,
                zIndex: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.Out"
            });
            let ecosystemElement = element.querySelector(".ecosystem-content");
            if (ecosystemElement) {
                ecosystemElement.style.display = "none";
            }
            tapCount = 0;
        }
    
        // Обработка событий для сенсорных экранов
      element.addEventListener("touchstart", (e) => {
        e.preventDefault();  // Предотвращение стандартной обработки касания

        if (window.matchMedia("(max-width: 480px)").matches) {
            let ecosystemElement = element.querySelector(".ecosystem-content");

            // Если элемент уже активен, скрываем .ecosystem-content
            if (activeElement === element) {
                ecosystemElement.style.display = "none";
                activeElement = null;
            } else {  // Иначе делаем элемент активным и показываем .ecosystem-content
                ecosystemElement.style.display = "block";
                activeElement = element;
            }
        } else {
            // Логика для экранов с разрешением больше 480px (аналогично mousemove)
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
                ease: "power2.Out"
            });
        }

        // Уменьшение opacity всех видимых элементов (как в mousemove)
        if (!window.matchMedia("(max-width: 480px)").matches) {  // Добавьте эту строку
          sortedElements.forEach((otherElement) => {
              if (otherElement !== element && elementsState.get(otherElement) === 'visible') {
                  gsap.to(otherElement, {
                      opacity: 0,
                      duration: 0.4
                  });
              }
          });
      }  // И эту строку
  });

    element.addEventListener("touchmove", (e) => {
        if (!window.matchMedia("(max-width: 480px)").matches) {
            // Логика для экранов с разрешением больше 480px (аналогично mousemove)
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
                ease: "power2.Out"
            });
        }
    });

    element.addEventListener("touchend", (e) => {
        if (!window.matchMedia("(max-width: 480px)").matches) {
            // Логика для экранов с разрешением больше 480px (аналогично mouseleave)
            gsap.to(element, {
                x: 0,
                y: 0,
                scale: 1,
                zIndex: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.Out"
            });

            // Возвращение opacity всех видимых элементов к 1 (как в mouseleave)
            sortedElements.forEach((otherElement) => {
                if (elementsState.get(otherElement) === 'visible') {
                    gsap.to(otherElement, {
                        opacity: 1,
                        duration: 0.4
                    });
                }
            });
        }
    });



        element.addEventListener("mousemove", (e) => {
          if (window.matchMedia("(max-width: 480px)").matches) {
            // Сделать элемент с классом ecosystem-content видимым, если он находится внутри текущего элемента
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
                ease: "power2.Out"
            });
    
            // Уменьшение opacity всех видимых элементов
            sortedElements.forEach((otherElement) => {
                if (otherElement !== element && elementsState.get(otherElement) === 'visible') {
                    gsap.to(otherElement, {
                        opacity: 0,
                        duration: 0.4
                    });
                }
            });
        });
    
        element.addEventListener("mouseleave", () => {
          if (window.matchMedia("(max-width: 480px)").matches) {
            // Скрыть элемент с классом ecosystem-content, если он находится внутри текущего элемента
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
                ease: "power2.Out"
            });
    
            // Возвращение opacity всех видимых элементов к 1
            sortedElements.forEach((otherElement) => {
                if (elementsState.get(otherElement) === 'visible') {
                    gsap.to(otherElement, {
                        opacity: 1,
                        duration: 0.4
                    });
                }
            });
        });
    });
  
  
    
  
  
   // Сначала скрываем элемент section_footer
   gsap.set(".section_footer", { opacity: 0 });
  
   // Используем ScrollTrigger для отслеживания позиции элемента с атрибутом footer-release
   ScrollTrigger.create({
     trigger: "[footer-release]",
     start: "top top", // Когда верх элемента достигает верха экрана
     onEnter: function() {
       // Показываем section_footer, когда элемент с атрибутом footer-release достигает верха экрана
       gsap.to(".section_footer", { opacity: 1, duration: 0.5 });
     },
     onLeaveBack: function() {
       // Скрываем section_footer, когда прокрутка возвращается обратно
       gsap.to(".section_footer", { opacity: 0, duration: 0.5 });
     }
   });
   
  
   var currentSegmentIndex = 0;  // Индекс текущего активного сегмента
   
   function initChart() {
    var ctx = document.getElementById('myPieChart').getContext('2d');
    var dataValues = [61, 22, 4, 3, 6, 4];
    var total = dataValues.reduce((acc, val) => acc + val, 0);

    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Fintech', 'SaaS', 'E-commerce', 'HRTech', 'EdTech', 'Other'],
            datasets: [{
                data: dataValues,
                backgroundColor: ['#050505', '#0A0A0A', '#0F0F0F', '#121212', '#1A1A1A', '#1F1F1F'],
                borderColor: '#535353',
                borderWidth: 0.5,
                hoverBackgroundColor: ['#EC0A24', '#cc444b', '#da5552', '#df7373', '#e39695', '#e4b1ab']
            }]
        },
     options: {
         plugins: {
             legend: {
                 display: true,
                 position: 'bottom',
                 labels: {
                     padding: 32,
                     generateLabels: function(chart) {
                         const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                         const labels = original.call(this, chart);
                         labels.forEach((label, i) => {
                             const value = dataValues[i];
                             const percentage = ((value / total) * 100).toFixed(2);
                             label.text = `${label.text} (${percentage}%)`;
                         });
                         return labels;
                     },
                     onClick: null // Отключаем стандартное поведение при клике на легенду
                 }
             },
             tooltip: {
                 displayColors: false,
                 callbacks: {
                     label: function(context) {
                         var value = context.parsed;
                         return value + '%';
                     }
                 }
             }
         },
         animation: {
           animateRotate: true,
           animateScale: false,
           duration: 2500,
           easing: 'easeInOutCubic',
       },
     }
 });

 activateSegment(currentSegmentIndex);
 setInterval(changeActiveSegment, 5000);
}

function activateSegment(idx) {
  // Сбрасываем все активные элементы и подсказки
  myPieChart.setActiveElements([]);
  myPieChart.tooltip.setActiveElements([]);

  // Устанавливаем новый активный элемент и подсказку
  myPieChart.setActiveElements([{
      datasetIndex: 0,
      index: idx,
  }]);
  myPieChart.tooltip.setActiveElements([{
      datasetIndex: 0,
      index: idx,
  }], false);
  
  myPieChart.update();
}

function changeActiveSegment() {
  currentSegmentIndex = (currentSegmentIndex + 1) % 6;
  activateSegment(currentSegmentIndex);
}

  
ScrollTrigger.create({
    trigger: '#myPieChart',
    start: 'top 85%',
    onEnter: function() {
        initChart();
    }
});