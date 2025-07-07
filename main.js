console.log("hello motherfucker");

///////////////////////////////
/// REGISTER GSAP PLUGINS
///////////////////////////////

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(CustomEase);
    gsap.registerPlugin(DrawSVGPlugin);
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);
    gsap.registerPlugin(SplitText);
    gsap.registerPlugin(MotionPathPlugin);
    // gsap code here!
  });

///////////////////////////////
/// GSAP DEFAULTS
///////////////////////////////

gsap.defaults({
    ease: "power1.out",
    duration: 0.2,
  });
  
  CustomEase.create(
    "customBack",
    "M0,0 C0.126,0.382 0.139,1.139 0.352,1.197 0.668,1.282 0.862,1.11 1,1"
  );

  CustomEase.create("customElastic", "M0,0 C0.449,-0.806 0.033,1 1,1 ");  

  ScrollTrigger.config({ ignoreMobileResize: true });



//////////////////////////////
/// SETUP LENIS
///////////////////////////////

const lerpValue = 0.1; // Set your custom lerp value here
window.lenis = new Lenis({ lerp: lerpValue });

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

$("[data-lenis-start]").on("click", function () {
  lenis.start();
});
$("[data-lenis-stop]").on("click", function () {
  lenis.stop();
});
$("[data-lenis-toggle]").on("click", function () {
  $(this).toggleClass("stop-scroll");
  if ($(this).hasClass("stop-scroll")) {
    lenis.stop();
  } else {
    lenis.start();
  }
});

///////////////////////////////
/// MAKE SURE FONTS ARE READY
///////////////////////////////

function runSplitTextWhenFontsReady(callback) {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(callback);
  } else {
    // fallback for older browsers
    window.addEventListener('load', callback);
  }
}
// runSplitTextWhenFontsReady(() => {
//   const split = new SplitText(".my-title", {
//     type: "words,chars",
//     wordsClass: "split-word",
//     charsClass: "split-char"
//   });

//   // your animation here
// });


///////////////////////////////
/// SUBMIT BTN
///////////////////////////////
// window.addEventListener('DOMContentLoaded', () => {
//   gsap.set('[data-prevent-flicker="true"]', {
//     visibility: "visible",
//   });
// });

///////////////////////////////
/// PREVENT FLLICKER
///////////////////////////////

Promise.all([
  new Promise(resolve => window.addEventListener("DOMContentLoaded", resolve)),
  document.fonts.ready
]).then(() => {
  gsap.set('[data-prevent-flicker="true"]', {
    visibility: "visible"
  });
});


///////////////////////////////
/// SUBMIT BTN
///////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  const newSubmitButtons = document.querySelectorAll('[ms-code-submit-new]');

  newSubmitButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const submitId = this.getAttribute('ms-code-submit-new');

      // ✅ Skip if the attribute is empty or null
      if (!submitId) return;
      
      e.preventDefault();


      const oldSubmitButton = document.querySelector(`[ms-code-submit-old="${submitId}"]`);

      if (oldSubmitButton) {
        oldSubmitButton.click();
      } else {
        console.error(`No matching old submit button found for ID: ${submitId}`);
      }
    });
  });
});



///////////////////////////////
/// NAV LINk HOVER 
///////////////////////////////


  const navLinkWrap = document.querySelectorAll(".nav_link_item_wrap[data-wf--nav-nav-link-item--variant='nav']");

  navLinkWrap.forEach(function (el) {
    let arrow = el.querySelector(".nav_link_arrow_wrap");
    let title = el.querySelector(".nav_link_title_wrap p");
    let innerWrap = el.querySelector(".nav_link_title_wrap");

    let tlNavLink = gsap.timeline({ paused: true });

    tlNavLink
      .from(arrow, {
        x: "-1rem",
        opacity: 0,
        duration: 0.4
      })
      .from(title, {
        x: "-1.5rem",
        duration: 0.2
      }, "<");
  
      if (window.matchMedia("(min-width: 992px)").matches) {
    el.addEventListener("mouseenter", function () {
      tlNavLink.play();
    });

    el.addEventListener("mouseleave", function () {
      tlNavLink.reverse();
    });
  }
});




///////////////////////////////
/// NAV TOGGLE OPEN CLOSE
///////////////////////////////

// DOM elements
const navToggleBtn = document.querySelector('.nav_toggle_wrap');
const navToggleSvg = document.querySelector('#nav-toggle-open');
const navBackground = document.querySelector('.nav_background');

let isOpen = false;

// Utility: Animate morphing icon
const morphToggleIcon = (open) => {
  gsap.to(navToggleSvg, {
    duration: 0.15,
    morphSVG: open ? '#nav-toggle-close' : '#nav-toggle-open',
    ease: 'power2.inOut'
  });
};

// Utility: Build Desktop Timeline
const createDesktopTimeline = () => {
  const splitTextNavLink = new SplitText(".nav_link_item_wrap[data-wf--nav-nav-link-item--variant=nav] .nav_link_title_wrap p", {
    type: "words,chars",  
  });

  const tl = gsap.timeline({ paused: true });

  tl.to(".nav_clickable_wrap", {
    x: 0,
    duration: 0.4,
  });

  tl.add("startWords", 0);

  splitTextNavLink.words.forEach((word, i) => {
    const chars = word.querySelectorAll("div");
    tl.from(chars, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.01,
      ease: "power2.out"
    }, `startWords+=${i * 0.1}`);
  });

  tl.from(".nav_link_item_wrap[data-wf--nav-nav-link-item--variant=nav] .nav_link_desc_wrap", {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: "power2.inOut"
  }, "startWords+=0.2");

  tl.from(".nav_background", {
    autoAlpha: 0,
    duration: 0.4,
    ease: "power2.out"
  }, "startWords");

  return tl;
};

// Placeholder: Create Mobile Timeline
const createMobileTimeline = () => {
  const splitTextNavLink = new SplitText(".nav_link_item_wrap[data-wf--nav-nav-link-item--variant='nav'] .nav_link_title_wrap p", {
    type: "words,chars",
  });
  

  const tl = gsap.timeline({ paused: true });

  tl.to(".nav_clickable_open_wrap", {
    height: "auto",    
    duration: .6,
  });

  tl.add("startWords", 0);

  splitTextNavLink.words.forEach((word, i) => {
    const chars = word.querySelectorAll("div");
    tl.from(chars, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.01,
      ease: "power2.out"
    }, `startWords+=${i * 0.1}`);
  });

  tl.from(".nav_link_item_wrap[data-wf--nav-nav-link-item--variant='nav'] .nav_link_desc_wrap", {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: "power2.inOut"
  }, "startWords+=0.2");

  tl.from(".nav_background", {
    autoAlpha: 0,
    duration: 0.4,
    ease: "power2.out"
  }, "startWords");  

  return tl;
};

// Responsive: Create the right timeline
let tlOpenNav;
const isMobile = window.innerWidth <= 767;
tlOpenNav = isMobile ? createMobileTimeline() : createDesktopTimeline();

// Toggle open/close
const toggleNav = () => {
  isOpen = !isOpen;
  morphToggleIcon(isOpen);

  if (isOpen) {
    tlOpenNav.timeScale(1).play();
  } else {
    tlOpenNav.timeScale(2).reverse();
  }
};

// Event listeners
navToggleBtn.addEventListener("click", toggleNav);
navBackground.addEventListener("click", () => {
  if (isOpen) {
    isOpen = false;
    morphToggleIcon(false);
    tlOpenNav.timeScale(2).reverse();
  }
});


///////////////////////////////
/// ANIMATE BETWEEN SUN AND MOON
///////////////////////////////
const themeToggleBtn = document.querySelector('[data-theme-toggle-button]');
const themeIconPath = document.querySelector('#theme-icon-path');

// Get the sun and moon shapes
const sunPath = document.querySelector('#sun').getAttribute('d');
const moonPath = document.querySelector('#moon').getAttribute('d');

// Detect theme based on class on <html>
let currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';

// Set the initial icon shape based on the class
themeIconPath.setAttribute('d', currentTheme === 'dark' ? moonPath : sunPath);

// On toggle
themeToggleBtn.addEventListener('click', () => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  // Morph the SVG icon
  gsap.to(themeIconPath, {
    duration: 0.6,
    morphSVG: newTheme === 'dark' ? moonPath : sunPath,
    ease: 'power2.out'
  });

  currentTheme = newTheme;
});
document.addEventListener('DOMContentLoaded', () => {});
  
  



///////////////////////////////
/// ANIMATE LETTER FORM
///////////////////////////////
function initAnimatedLetterForm({
  formRootSelector = 'body', // 👈 ajouter ça
  stepSelector = '[data-form="step"]',
  progressBarSelector = '.form_progress_bar',
  progressPointSelector = '.form_progress_point',
  letterLineSelector = '.contact_letter_wrap [data-step]',
  bindings = [],
  checkboxGroup = null,
  radioBindings = []
}) {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector(formRootSelector); // 👈 travailler à l'intérieur du form
    if (!root) return;

    const steps = root.querySelectorAll(stepSelector);
    const progressBar = root.querySelector(progressBarSelector);
    const progressPoints = root.querySelectorAll(progressPointSelector);
    const totalSteps = steps.length;

    function updateStepDisplay() {
      const currentIndex = Array.from(steps).findIndex(step => step.style.display !== 'none');
      if (currentIndex === -1) return;

      let percent = totalSteps > 1 ? (currentIndex / (totalSteps - 1)) * 100 : 0;
      if (progressBar) progressBar.style.width = `${percent}%`;

      progressPoints.forEach((pt, idx) => {
        pt.classList.remove('current', 'passed');
        if (idx < currentIndex) pt.classList.add('passed');
        else if (idx === currentIndex) pt.classList.add('current');
      });

      const letterLines = root.querySelectorAll(letterLineSelector);
      letterLines.forEach(line => {
        const step = parseInt(line.getAttribute('data-step'), 10);
        if (step <= currentIndex + 1) line.classList.add('visible'); 
      });
    }

    updateStepDisplay();

    const observer = new MutationObserver(updateStepDisplay);
    steps.forEach(step => {
      observer.observe(step, { attributes: true, attributeFilter: ['style'] });
    });

    bindings.forEach(({ inputId, outputIds }) => {
      const input = root.querySelector(`#${inputId}`);
      if (!input) return;

      const update = () => {
        outputIds.forEach(outputId => {
          const output = root.querySelector(`#${outputId}`);
          if (output) output.textContent = input.value;
        });
      };

      input.addEventListener('input', update);
      update();
    });

    if (checkboxGroup) {
      const { labelSelector, outputId } = checkboxGroup;
      const labels = root.querySelectorAll(labelSelector);
      const output = root.querySelector(`#${outputId}`);

      const update = () => {
        const names = Array.from(labels)
          .filter(label => label.classList.contains('checked'))
          .map(label => {
            const input = label.querySelector('input[type="checkbox"]');
            return input ? input.getAttribute('name') : null;
          })
          .filter(Boolean);

        if (output) output.textContent = names.join(', ');
      };

      root.addEventListener('click', () => setTimeout(update, 50));
      update();
    }

    radioBindings.forEach(({ name, valueToOutputIdMap }) => {
      const radios = root.querySelectorAll(`input[type="radio"][name="${name}"]`);

      radios.forEach(r => {
        r.checked = false;
      });

      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          radios.forEach(r => {
            const label = r.closest('.form_main_checkbox_label');
            if (label) label.classList.remove('checked');
          });

          const selectedLabel = radio.closest('.form_main_checkbox_label');
          if (selectedLabel) selectedLabel.classList.add('checked');

          Object.values(valueToOutputIdMap).flat().forEach(id => {
            const el = root.querySelector(`#${id}`);
            if (el) el.style.display = 'none';
          });

          const selectedIds = valueToOutputIdMap[radio.value] || [];
          selectedIds.forEach(id => {
            const el = root.querySelector(`#${id}`);
            if (el) el.style.display = 'inline';
          });
        });
      });
    });

    // ✅ Checkbox label click only inside the form
    root.querySelectorAll('.form_main_checkbox_label').forEach(label => {
      label.addEventListener('click', () => {
        label.classList.toggle('checked');
      });
    });
  });
}


initAnimatedLetterForm({
  formRootSelector: '#form-contact-wrap',
  bindings: [
    { inputId: 'data-prenom', outputIds: ['output-prenom', 'output-prenom-signature'] },
    { inputId: 'data-nom', outputIds: ['output-nom', 'output-nom-signature'] },
    { inputId: 'data-poste', outputIds: ['output-poste'] },
    { inputId: 'data-entreprise', outputIds: ['output-entreprise'] },
    { inputId: 'data-ps', outputIds: ['output-ps'] },
  ],
  checkboxGroup: {
    labelSelector: '.form_main_checkbox_label',
    outputId: 'output-interets'
  },
  radioBindings: [
    {
      name: 'color',
      valueToOutputIdMap: {
        text_1: ['output-text-1'],
        text_2: ['output-text-2', 'output-text-2-2'], // 👈 plusieurs ids ici
        text_3: ['output-text-3']
      }
    }
  ]
});

initAnimatedLetterForm({
  formRootSelector: '#form-anniversaire-wrap',
  bindings: [
    { inputId: 'data-prenom', outputIds: ['output-prenom', 'output-prenom-signature'] },
    { inputId: 'data-nom', outputIds: ['output-nom', 'output-nom-signature'] },    
    { inputId: 'data-entreprise', outputIds: ['output-entreprise'] },
  ],  
  radioBindings: [
    {
      name: 'presence',
      valueToOutputIdMap: {
        oui: ['output-presence-oui', 'output-presence-oui-2'],
        non: ['output-presence-non', 'output-presence-non-2'],        
      }
    },
    {
      name: 'conclusion',
      valueToOutputIdMap: {
        salutation: ['output-conclusion-salutation'],
        amitie: ['output-conclusion-amitie'],
        bisous: ['output-conclusion-bisous']
      }
    }
  ]
});


document.addEventListener('DOMContentLoaded', () => {
  const successMessage = document.querySelector('.w-form-done');

  if (successMessage) {
    const observer = new MutationObserver(mutations => {
      const isVisible = window.getComputedStyle(successMessage).display !== 'none';
      if (isVisible) {
        const tlFormSent = gsap.timeline();
        tlFormSent.to(".contact_letter_contain", {
          scale: .5,
          rotate: -10,
          duration: 1,
          ease: "power3.out",
        })
        .to(".contact_letter_contain", {
          y: "-100vw",
          opacity: 0,
          duration: 1,
        });
      }
    });

    observer.observe(successMessage, {
      attributes: true,
      attributeFilter: ['style']
    });
  }
});


// const tlFormSent = gsap.timeline();
// tlFormSent.to(".contact_letter_contain", {
//   scale: .5,
//   rotate: -10,          
//   duration: 2,
//   ease: "power3.out",
// })

// .to(".contact_letter_contain", {
//   y: "-100vw",
//   opacity: 0,
//   duration: .4,
// })

///////////////////////////////
/// UNIVERSAL DRAGGABLE FUNCTION
///////////////////////////////

const initializeDraggableForElements = (wrapClass, listClass, itemClass, minBreakpoint, maxBreakpoint) => {
  const wraps = document.querySelectorAll(wrapClass);

  const initializeDraggable = (wrap) => {
    const listElement = wrap.querySelector(listClass);
    const items = wrap.querySelectorAll(itemClass);

    if (wrap && items.length) {
      const updateBoundsProcess = () => {
        const containerPWidth = wrap.clientWidth;
        const listPWidth = listElement.scrollWidth;

        // Calculate the padding from the container
        const containerStyles = window.getComputedStyle(wrap);
        const paddingLeft = parseFloat(containerStyles.paddingLeft);
        const paddingRight = parseFloat(containerStyles.paddingRight);

        // Adjust minX and maxX to consider the padding
        const minX = containerPWidth - listPWidth - paddingRight - paddingLeft; // Ensures we respect the right padding
        const maxX = 0; // Ensures we respect the left padding

        // Calculate snap points relative to the container, considering its padding
        const snapPoints = Array.from(items).map(item => paddingLeft - item.offsetLeft);
        // console.log("Snap Points:", snapPoints);
        // console.log("minX:", minX, "maxX:", maxX);

        // Make sure the draggable instance is recreated on resize
        Draggable.get(listElement)?.kill(); // Kill previous Draggable instance

        Draggable.create(listElement, {
          type: "x",
          edgeResistance: 0.5,
          bounds: { minX: minX, maxX: maxX }, // Correct the bounds for full drag range
          inertia: true,
          snap: {
            x: (value) => {
              let closest = snapPoints[0];
              snapPoints.forEach(point => {
                if (Math.abs(value - point) < Math.abs(value - closest)) {
                  closest = point;
                }
              });
              return closest;
            }
          }
        });
      };

      // Initialize draggable on page load
      updateBoundsProcess();


      // Update draggable bounds on window resize
      window.addEventListener('resize', updateBoundsProcess);
    }
  };

  const handleScreenResize = () => {
    wraps.forEach((wrap) => {
      const listElement = wrap.querySelector(listClass);
      const windowWidth = window.innerWidth;

      if (windowWidth >= minBreakpoint && windowWidth <= maxBreakpoint) {
        initializeDraggable(wrap);
      } else {
        // Kill the draggable instance when screen size is outside the range
        Draggable.get(listElement)?.kill();
      }
    });
  };

  // Initialize draggable on page load
  handleScreenResize();

  // Update draggable initialization on window resize
  window.addEventListener('resize', handleScreenResize);
};


initializeDraggableForElements(".hero_contain", ".hero_draggable_collection_list", ".hero_draggable_collection_item", 0, 767); // Draggable active between 0 and Infinity


///////////////////////////////
/// HERO SECTION ITEM CARD
///////////////////////////////

document.querySelectorAll('.hero_draggable_item_wrap').forEach((itemWrap) => {
  const ctaWrap = itemWrap.querySelector('.hero_card_cta_wrap');
  const fakeTextWrap = itemWrap.querySelector('.hero_card_fake_text_wrap');
  const realTextWrap = itemWrap.querySelector('.hero_card_real_text_wrap');
  const button = itemWrap.querySelector('.btn_outer_wrap');
  const realParagraphs = realTextWrap.querySelectorAll('p');

  // Set initial styles
  // gsap.set(ctaWrap, { opacity: 0, visibility: 'visible' });
  // gsap.set(realTextWrap, { visibility: 'hidden' });

  // Hover: show CTA
  itemWrap.addEventListener('mouseenter', () => {
    if (ctaWrap.style.visibility !== 'hidden') {
      gsap.to(ctaWrap, { opacity: 1, duration: 0.3 });
    }
  });

  itemWrap.addEventListener('mouseleave', () => {
    if (ctaWrap.style.visibility !== 'hidden') {
      gsap.to(ctaWrap, { opacity: 0, duration: 0.3 });
    }
  });

  // Button click: hide fake text and reveal real text
  button.addEventListener('click', () => {
    // Instantly hide fake text
    gsap.set(fakeTextWrap, { display: 'none' });

    // Show real text block (hidden via visibility before)
    gsap.set(realTextWrap, { visibility: 'visible' });

    // Animate each <p> in the real text
    realParagraphs.forEach((p, index) => {
      const split = new SplitText(p, { type: 'words' });
      gsap.from(split.words, {
        opacity: 0,
        y: 5,
        stagger: 0.02,
        delay: index * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    // After animation, permanently hide the CTA wrap
    const totalDuration = realParagraphs.length * 0.3 + 0.4;
    gsap.to(ctaWrap, {
      opacity: 0,
      delay: 0,
      onComplete: () => {
        gsap.set(ctaWrap, { display: 'none' });
      },
    });
  });
});

///////////////////////////////
/// HERO SECTION ITEM CARD
///////////////////////////////

// window.addEventListener('DOMContentLoaded', () => {
//   const wrap = document.querySelector('.hero_draggable_wrap');
//   const list = wrap?.querySelector('.hero_draggable_collection_list');
//   // const readMoreOriginal = document.querySelector('.hero_draggable_read_more_wrap.hero_draggable_collection_item');

//   if (!wrap || !list) return;

//   // Clone the pre-built Read More item
//   // const readMoreClone = readMoreOriginal.cloneNode(true);  

//   // Append the clone to the end of the list
//   // list.appendChild(readMoreClone);

//   // Remove the original from wherever it was
//   // readMoreOriginal.remove();

//   // Ensure draggable is initialized after injection
//   requestAnimationFrame(() => {
//     initializeDraggableForElements(
//       ".hero_draggable_wrap",
//       ".hero_draggable_collection_list",
//       ".hero_draggable_collection_item",
//       0,
//       767
//     );
//   });
// });




///////////////////////////////
/// IMAGES OVERLAP
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const layout = document.querySelector('.metier_img_list_contain');
  if (!layout) return;

  const textBox = layout.querySelector('.metier_img_list_test_text');
  const images = Array.from(layout.querySelectorAll('.metier_img_item'));
  const minRotation = -15;
  const maxRotation = 15;

  function getRandomRotation(min, max) {
    return Math.random() * (max - min) + min;
  }

  function isOverlapping(r1, r2) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  }

  function generateNonOverlappingPosition(imgEl, layoutRect, textRect, placedRects, maxAttempts = 200) {
    const imgRect = imgEl.getBoundingClientRect();
    const width = imgRect.width;
    const height = imgRect.height;

    let attempt = 0;
    let valid = false;
    let top = 0, left = 0;

    while (attempt < maxAttempts && !valid) {
      left = Math.random() * (layoutRect.width - width);
      top = Math.random() * (layoutRect.height - height);

      const candidateRect = {
        top: layoutRect.top + top,
        left: layoutRect.left + left,
        right: layoutRect.left + left + width,
        bottom: layoutRect.top + top + height
      };

      const overlapsText = isOverlapping(candidateRect, textRect);
      const overlapsOthers = placedRects.some(r => isOverlapping(candidateRect, r));

      if (!overlapsText && !overlapsOthers) {
        valid = true;
        placedRects.push(candidateRect);
      }

      attempt++;
    }

    return valid ? { top, left } : null;
  }

  function placeImages() {
    // Reset styles and positions first
    images.forEach(img => {
      img.style.top = '';
      img.style.left = '';
      img.style.transform = '';
      img.style.visibility = 'visible';
    });

    const layoutRect = layout.getBoundingClientRect();
    const textRect = textBox.getBoundingClientRect();
    const placedRects = [];

    images.forEach(img => {
      const position = generateNonOverlappingPosition(img, layoutRect, textRect, placedRects);
      if (position) {
        img.style.top = `${position.top}px`;
        img.style.left = `${position.left}px`;
        const rotation = getRandomRotation(minRotation, maxRotation);
        img.style.transform = `rotate(${rotation}deg)`;
      } else {
        console.warn("Could not place image without overlap.");
        img.style.visibility = 'hidden';
      }
    });
  }

  // Initial call
  placeImages();

  // only react when width really changes
  let prevW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== prevW) {
      prevW = window.innerWidth;
      placeImages();
    }
  }, {passive: true});
});




///////////////////////////////
/// METIER IMG WRAPPER
///////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
const metierImgWrap = document.querySelectorAll(".metier_img_item");

// FOR EACH ODD ETAPE WRAPPER
metierImgWrap.forEach(function (el) {
    let visulWrap = el.querySelector(".g_visual_wrap");
    let tlMetierImg = gsap.timeline({ paused: true });
  
    tlMetierImg
      .from(visulWrap, {
        opacity: 0,
        scale: 0,
        duration: .6,
        })
      
        ;
  
    ScrollTrigger.create({
      trigger: el, // Element that triggers the animation
      // toggleActions: "play complete play reverse",
      start: "top 75%", // When to start the animation
      // end: 'bottom center', // When to end the animation
      // markers: true,
      animation: tlMetierImg, // Animation to play
      // scrub: true, // Smooth scrolling effect
    });
  });
});


///////////////////////////////
/// TEXT METIER SCROLL TRIGGER
///////////////////////////////

let tlTextMetier = gsap.timeline({ paused: true });

let textMetier1_1 = document.querySelector(".metier_item_wrap:nth-of-type(1) .metier_text_contain .metier_text_1");
let textMetier1_2 = document.querySelector(".metier_item_wrap:nth-of-type(1) .metier_text_contain .metier_text_2");
let textMetier2_1 = document.querySelector(".metier_item_wrap:nth-of-type(2) .metier_text_contain .metier_text_1");
let textMetier2_2 = document.querySelector(".metier_item_wrap:nth-of-type(2) .metier_text_contain .metier_text_2");

let durAnim = .4;

tlTextMetier
  .to(textMetier1_1, {
    // scale: .5,
    opacity: 0,
    duration: durAnim,
    y: -50,
    })
  .to(textMetier1_2, {
    // scale: 0,
    opacity: 0,
    y: -50,
    duration: durAnim,
    }, "<")
  .from(textMetier2_1, {
    opacity: 0,
    y: 50,
    duration: durAnim,
    })
  .from(textMetier2_2, {    
    opacity: 0,
    y: 50,
    duration: durAnim,
    }, "<")
;

ScrollTrigger.create({
  trigger: ".metier_img_list_section", // Element that triggers the animation
  start: "25% top",
  // markers: true,
  animation: tlTextMetier, // Animation to play
   // scrub: true, // Smooth scrolling effect
  toggleActions: "play complete play reverse",
});


///////////////////////////////
/// VIDEO VESTIBULE PLAYING
///////////////////////////////

// document.addEventListener("DOMContentLoaded", () => {
//   const videoWraps = document.querySelectorAll('.avis_video_wrap');

//   videoWraps.forEach(wrap => {
//     const thumb = wrap.querySelector('.avis_video_thumb_wrap');
//     const iframe = wrap.querySelector('.embedly-embed');

//     if (thumb && iframe) {
//       thumb.addEventListener('click', () => {
//         // Hide the thumbnail
//         thumb.style.display = 'none';

//         // Reload the iframe with autoplay enabled
//         const originalSrc = iframe.getAttribute('src');

//         // Check if autoplay is already in the URL
//         const hasAutoplay = originalSrc.includes('autoplay=1');

//         if (!hasAutoplay) {
//           // Add or append autoplay=1
//           const separator = originalSrc.includes('?') ? '&' : '?';
//           const newSrc = originalSrc + separator + 'autoplay=1';
//           iframe.setAttribute('src', newSrc);
//         }
//       });
//     }
//   });
// });
// function initAvisVideos(scope = document) {
//   const videoWraps = scope.querySelectorAll('.avis_video_wrap');

//   videoWraps.forEach(wrap => {
//     // éviter de l'initialiser deux fois
//     // if (wrap.dataset.videoInit) return;
//     // wrap.dataset.videoInit = '1';

//     const thumb       = wrap.querySelector('.avis_video_thumb_wrap');
//     const iframe      = wrap.querySelector('.embedly-embed');
//     const btnWrap     = wrap.querySelector('.avis_video_btn_wrap');
//     const loadingWrap = wrap.querySelector('.avis_video_loading_wrap');

//     if (thumb && iframe && btnWrap && loadingWrap) {
//       loadingWrap.style.opacity = '0';
//       iframe.style.opacity = '0';

//       thumb.addEventListener('click', () => {
//         btnWrap.style.display     = 'none';
//         loadingWrap.style.opacity = '1';

//         const originalSrc = iframe.getAttribute('src');
//         const hasAutoplay = originalSrc.includes('autoplay=1');

//         if (!hasAutoplay) {
//           const separator = originalSrc.includes('?') ? '&' : '?';
//           const newSrc = originalSrc + separator + 'autoplay=1';
//           iframe.setAttribute('src', newSrc);
//         }

//         setTimeout(() => {
//           iframe.style.zIndex  = '3';
//           iframe.style.opacity = '1';
//         }, 1500);
//       });
//     }
//   });
// }

// // ✅ Initialisation au chargement de la page
// document.addEventListener("DOMContentLoaded", () => {
//   initAvisVideos();
// });


function initAvisVideos(scope = document) {
  const videoWraps = scope.querySelectorAll('.avis_video_wrap');

  videoWraps.forEach(wrap => {
    const thumb       = wrap.querySelector('.avis_video_thumb_wrap');
    const iframeOld   = wrap.querySelector('.embedly-embed');
    const btnWrap     = wrap.querySelector('.avis_video_btn_wrap');
    const loadingWrap = wrap.querySelector('.avis_video_loading_wrap');

    if (!thumb || !iframeOld || !btnWrap || !loadingWrap) return;

    loadingWrap.style.opacity = '0';
    iframeOld.style.opacity   = '0';

    thumb.addEventListener('click', () => {
      // UI
      btnWrap.style.display     = 'none';
      loadingWrap.style.opacity = '1';

      // Construire le nouveau src (autoplay uniquement)
      const originalSrc = iframeOld.getAttribute('src') || '';
      const hasAutoplay = originalSrc.includes('autoplay=1');
      const separator   = originalSrc.includes('?') ? '&' : '?';
      const newSrc      = hasAutoplay ? originalSrc : originalSrc + separator + 'autoplay=1';

      // Cloner l’iframe
      const iframeClone = iframeOld.cloneNode(true);
      iframeClone.setAttribute('src', newSrc);
      iframeClone.style.opacity = '0';

      // Remplacer l’ancienne iframe
      iframeOld.replaceWith(iframeClone);

      // Faire apparaître la nouvelle iframe
      setTimeout(() => {
        iframeClone.style.zIndex  = '3';
        iframeClone.style.opacity = '1';
      }, 1500);
    });
  });
}

// ✅ Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  initAvisVideos();
});








///////////////////////////////
/// VESTIBULE AVIS
///////////////////////////////


// document.addEventListener("DOMContentLoaded", () => {
//   const avisEcritBlocks = document.querySelectorAll('.avis_ecrit_wrap');

//   avisEcritBlocks.forEach(wrap => {
//     const textWrap = wrap.querySelector('.avis_ecrit_rich_text_wrap');
//     const nom = wrap.querySelector('.avis_nom_p');
//     const poste = wrap.querySelector('.avis_poste_p');

//     if (!textWrap) return;

//     const paragraphs = textWrap.querySelectorAll('p');
//     const allWords = [];
//     const allSVGs = [];

//     const splitPromises = [];

//     paragraphs.forEach(paragraph => {
//       // Inject SVG at the start
//       const svgDiv = document.createElement('div');
//       svgDiv.classList.add('vestibule_quote_svg_wrap');
//       svgDiv.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 30 22" fill="none" vector-effect="non-scaling-stroke" class="g_svg"><path d="M16.2998 21.5C15.9973 21.5 15.7115 21.3765 15.5264 21.1025C15.3649 20.8635 15.3203 20.568 15.3203 20.291L15.3203 20.2734L15.3223 20.2559L15.8291 13.0479L15.8301 13.0342L15.832 13.0205C15.8891 12.5619 15.9468 12.176 16.0059 11.8662C16.043 11.5805 16.0895 11.3103 16.1445 11.0557L16.1436 11.0547C16.1833 10.8045 16.2433 10.5554 16.3203 10.3076L16.4229 9.9082C16.4616 9.76594 16.5049 9.61451 16.5527 9.4541L16.5605 9.43066L16.5693 9.40723C16.6949 9.10019 16.896 8.71304 17.1631 8.25293L17.168 8.24414C17.4348 7.80454 17.7393 7.32673 18.0801 6.81055C18.4213 6.29385 18.7816 5.76723 19.1602 5.23144C19.5151 4.72219 19.8507 4.23233 20.168 3.76269L20.1738 3.75488C20.4942 3.30043 20.7773 2.90395 21.0234 2.56641C21.2691 2.22957 21.4192 2.01559 21.4844 1.91309L21.4922 1.90234L21.5 1.89062C21.5531 1.8164 21.6257 1.71172 21.7188 1.57519L21.7197 1.57617C21.8062 1.44157 21.9082 1.30081 22.0264 1.15625L22.0391 1.1416L22.0518 1.12793C22.1177 1.05881 22.1865 0.992013 22.2578 0.92871L22.4805 0.74707C22.6765 0.600288 22.9109 0.5 23.1748 0.5C23.373 0.500023 23.5568 0.56163 23.7168 0.645507L23.7246 0.65039L23.7324 0.654296C23.9263 0.765174 24.0579 0.822382 24.1357 0.845703L24.1816 0.859375L24.2236 0.881836C24.3363 0.940922 24.506 1.03027 24.7314 1.14844L24.7393 1.15234L24.7471 1.15723C24.9413 1.2683 25.2505 1.43075 25.6807 1.64648L25.6934 1.65234L25.7051 1.65918C26.1205 1.89678 26.733 2.25177 27.541 2.72461L27.541 2.72559C27.8516 2.89914 28.1127 3.07171 28.3027 3.24609C28.4523 3.38332 28.6369 3.59182 28.6807 3.86328L28.6904 3.9834L28.6758 4.125C28.6491 4.26157 28.589 4.38152 28.5391 4.46875L28.5352 4.47559L28.5313 4.48145C27.9873 5.36638 27.4244 6.291 26.8428 7.25488L26.8418 7.25781L26.3994 7.99219C26.1047 8.48912 25.8185 8.98933 25.5381 9.49121L27.0977 9.51074L27.5986 9.51074C27.7351 9.51075 27.8626 9.51318 27.9805 9.51855L28.3047 9.54297L28.332 9.54687L28.3604 9.55273C28.5017 9.58573 28.6669 9.6527 28.7988 9.79102C28.9409 9.94018 29 10.1259 29 10.3057L29 10.3867L28.998 10.4092C28.923 11.2554 28.8665 11.9134 28.8291 12.3838L28.8291 12.3926L28.8281 12.4014C28.772 12.8915 28.7348 13.2573 28.7168 13.5029C28.6981 13.777 28.6904 13.9583 28.6904 14.0576L28.6904 14.0967L28.6836 14.1357C28.6681 14.2333 28.6621 14.3155 28.6621 14.3828L28.6621 14.4297L28.6533 14.4766L28.6396 14.585C28.6362 14.6281 28.6338 14.6788 28.6338 14.7373L28.6338 14.7705L28.6289 14.8047C28.6131 14.9208 28.5949 15.1392 28.5762 15.4736L28.4922 16.8379L28.4912 16.8447L28.4902 16.8525C28.4343 17.4393 28.369 18.2141 28.2939 19.1777C28.2564 19.822 28.1989 20.3235 28.1064 20.6387L28.1016 20.6543L28.0957 20.6699C27.9195 21.1501 27.5061 21.3828 27.0361 21.4375L27.0078 21.4404L24.3408 21.4404C23.4205 21.4601 22.5092 21.4696 21.6074 21.4697L21.6074 21.4707C20.6836 21.4905 19.7781 21.5 18.8916 21.5L16.2998 21.5ZM1.47852 21.5C1.1762 21.4999 0.890096 21.3764 0.705078 21.1025C0.543708 20.8635 0.500003 20.5679 0.5 20.291L0.5 20.2734L0.500977 20.2559L1.00879 13.0478L1.01074 13.0205C1.0678 12.5619 1.12645 12.176 1.18555 11.8662C1.22266 11.5805 1.26915 11.3104 1.32422 11.0557L1.32324 11.0547C1.36302 10.8044 1.42296 10.5555 1.5 10.3076L1.60254 9.9082C1.64131 9.76593 1.68461 9.61451 1.73242 9.4541L1.73926 9.43066L1.74902 9.40722C1.87457 9.10017 2.07566 8.71305 2.34277 8.25293L2.34766 8.24414C2.48108 8.02432 2.62343 7.79466 2.77539 7.55566L3.25977 6.81054C3.60092 6.29388 3.96037 5.76719 4.33887 5.23144C4.69386 4.72209 5.03033 4.23241 5.34766 3.76269L5.35352 3.75488C5.67389 3.30043 5.95694 2.90394 6.20313 2.5664C6.44876 2.22962 6.59889 2.01558 6.66406 1.91308L6.67188 1.90234L6.67969 1.89062C6.73279 1.81639 6.80548 1.71164 6.89844 1.57519L6.89942 1.57617C6.9859 1.44156 7.08788 1.30081 7.20606 1.15625L7.21778 1.1416L7.23145 1.12793C7.29743 1.05874 7.36608 0.992069 7.4375 0.928709L7.66016 0.747068C7.85605 0.600476 8.08987 0.50012 8.35352 0.499998C8.55185 0.499998 8.7364 0.561586 8.89649 0.645506L8.9043 0.650389L8.91211 0.654295C9.10582 0.765076 9.23658 0.822342 9.31445 0.845701L9.36035 0.859373L9.40332 0.881834C9.45964 0.911359 9.5298 0.948884 9.61426 0.993162C9.69878 1.03747 9.79747 1.08936 9.91016 1.14844L9.91895 1.15234L9.92676 1.15722C10.121 1.26831 10.4303 1.43081 10.8604 1.64648L10.873 1.65234L10.8848 1.65918C11.3002 1.89679 11.9128 2.25184 12.7207 2.72461L12.7207 2.72558C13.0312 2.89908 13.2924 3.07176 13.4824 3.24609C13.6319 3.3833 13.8156 3.59199 13.8594 3.86328L13.8691 3.9834L13.8555 4.125C13.8287 4.2616 13.7687 4.3815 13.7188 4.46875L13.7148 4.47558L13.7109 4.48144C13.167 5.36633 12.604 6.29106 12.0225 7.25488L12.0215 7.25781L11.5791 7.99219C11.2843 8.48926 10.9973 8.98918 10.7168 9.49121L12.2764 9.51074L12.7773 9.51074C13.0504 9.51074 13.2878 9.52019 13.4834 9.54297L13.5117 9.54687L13.5391 9.55273C13.6805 9.5857 13.8455 9.65256 13.9775 9.79101C14.1198 9.94023 14.1797 10.1258 14.1797 10.3057L14.1797 10.3867L14.1777 10.4092C14.1027 11.2555 14.0462 11.9134 14.0088 12.3838L14.0068 12.4014C13.9507 12.8915 13.9145 13.2573 13.8965 13.5029C13.8778 13.777 13.8691 13.9583 13.8691 14.0576L13.8691 14.0967L13.8633 14.1357C13.8478 14.2333 13.8408 14.3155 13.8408 14.3828L13.8408 14.4297L13.832 14.4766C13.8209 14.5351 13.8135 14.6203 13.8135 14.7373L13.8135 14.7705L13.8086 14.8047C13.7928 14.9208 13.7746 15.1392 13.7559 15.4736L13.6709 16.8379L13.6709 16.8447L13.6699 16.8525C13.6419 17.146 13.6119 17.4864 13.5791 17.874L13.4736 19.1777C13.4361 19.822 13.3777 20.3235 13.2852 20.6387L13.2813 20.6543L13.2754 20.6699C13.0992 21.1501 12.6857 21.3827 12.2158 21.4375L12.1865 21.4404L9.51953 21.4404C8.59948 21.4601 7.68868 21.4696 6.78711 21.4697L6.78711 21.4707C5.8633 21.4905 4.95783 21.5 4.07129 21.5L1.47852 21.5Z" stroke="currentColor"></path></svg>`; // Keep your SVG content here
//       paragraph.insertBefore(svgDiv, paragraph.firstChild);
//       allSVGs.push(svgDiv);

//       // Defer SplitText until fonts are ready
//       const promise = document.fonts.ready.then(() => {
//         const split = new SplitText(paragraph, {
//           type: "lines, words",
//         });
//         allWords.push(...split.words);
//       });

//       splitPromises.push(promise);
//     });

//     // Once all SplitText instances are ready, build the timeline
//     Promise.all(splitPromises).then(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: wrap,
//           start: "top 90%",
//           // markers: true,
//         }
//       });

//       tl
//         .from(allSVGs, {
//           scale: 0,
//           opacity: 0,
//           duration: 0.5,
//           ease: "back.out(1.7)",
//           stagger: 0.1
//         })
//         .from(allWords, {
//           yPercent: 100,
//           opacity: 0,
//           duration: 1,
//           ease: "power2.out",
//           stagger: 0.01
//         }, "<+=0.2")
//         .from(nom, {
//           opacity: 0,
//           duration: 0.6,
//           ease: "power2.out"
//         }, ">")
//         .from(poste, {
//           opacity: 0,
//           duration: 0.6,
//           ease: "power2.out"
//         }, "<0.2");
//     });
//   });
// });




///////////////////////////////
/// INIT TESTIMONIAL V1
///////////////////////////////




// function initTestimonials() {
//   const avisEcritBlocks = document.querySelectorAll('.avis_ecrit_wrap');

//   avisEcritBlocks.forEach(wrap => {
//     if (wrap.dataset.gsapInitialized) return;

//     const textWrap = wrap.querySelector('.avis_ecrit_rich_text_wrap');
//     const nom = wrap.querySelector('.avis_nom_p');
//     const poste = wrap.querySelector('.avis_poste_p');
//     if (!textWrap || !nom || !poste) return;

//     const paragraphs = textWrap.querySelectorAll('p');
//     const svgArray = [];
//     const wordArray = [];

//     const splitPromises = Array.from(paragraphs).map(paragraph => {
//       let svgDiv = paragraph.querySelector('.vestibule_quote_svg_wrap');
//       if (!svgDiv) {
//         svgDiv = document.createElement('div');
//         svgDiv.classList.add('vestibule_quote_svg_wrap');
//         svgDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 30 22" fill="none" vector-effect="non-scaling-stroke" class="g_svg"><path d="M16.2998 21.5C15.9973 21.5 15.7115 21.3765 15.5264 21.1025C15.3649 20.8635 15.3203 20.568 15.3203 20.291L15.3203 20.2734L15.3223 20.2559L15.8291 13.0479L15.8301 13.0342L15.832 13.0205C15.8891 12.5619 15.9468 12.176 16.0059 11.8662C16.043 11.5805 16.0895 11.3103 16.1445 11.0557L16.1436 11.0547C16.1833 10.8045 16.2433 10.5554 16.3203 10.3076L16.4229 9.9082C16.4616 9.76594 16.5049 9.61451 16.5527 9.4541L16.5605 9.43066L16.5693 9.40723C16.6949 9.10019 16.896 8.71304 17.1631 8.25293L17.168 8.24414C17.4348 7.80454 17.7393 7.32673 18.0801 6.81055C18.4213 6.29385 18.7816 5.76723 19.1602 5.23144C19.5151 4.72219 19.8507 4.23233 20.168 3.76269L20.1738 3.75488C20.4942 3.30043 20.7773 2.90395 21.0234 2.56641C21.2691 2.22957 21.4192 2.01559 21.4844 1.91309L21.4922 1.90234L21.5 1.89062C21.5531 1.8164 21.6257 1.71172 21.7188 1.57519L21.7197 1.57617C21.8062 1.44157 21.9082 1.30081 22.0264 1.15625L22.0391 1.1416L22.0518 1.12793C22.1177 1.05881 22.1865 0.992013 22.2578 0.92871L22.4805 0.74707C22.6765 0.600288 22.9109 0.5 23.1748 0.5C23.373 0.500023 23.5568 0.56163 23.7168 0.645507L23.7246 0.65039L23.7324 0.654296C23.9263 0.765174 24.0579 0.822382 24.1357 0.845703L24.1816 0.859375L24.2236 0.881836C24.3363 0.940922 24.506 1.03027 24.7314 1.14844L24.7393 1.15234L24.7471 1.15723C24.9413 1.2683 25.2505 1.43075 25.6807 1.64648L25.6934 1.65234L25.7051 1.65918C26.1205 1.89678 26.733 2.25177 27.541 2.72461L27.541 2.72559C27.8516 2.89914 28.1127 3.07171 28.3027 3.24609C28.4523 3.38332 28.6369 3.59182 28.6807 3.86328L28.6904 3.9834L28.6758 4.125C28.6491 4.26157 28.589 4.38152 28.5391 4.46875L28.5352 4.47559L28.5313 4.48145C27.9873 5.36638 27.4244 6.291 26.8428 7.25488L26.8418 7.25781L26.3994 7.99219C26.1047 8.48912 25.8185 8.98933 25.5381 9.49121L27.0977 9.51074L27.5986 9.51074C27.7351 9.51075 27.8626 9.51318 27.9805 9.51855L28.3047 9.54297L28.332 9.54687L28.3604 9.55273C28.5017 9.58573 28.6669 9.6527 28.7988 9.79102C28.9409 9.94018 29 10.1259 29 10.3057L29 10.3867L28.998 10.4092C28.923 11.2554 28.8665 11.9134 28.8291 12.3838L28.8291 12.3926L28.8281 12.4014C28.772 12.8915 28.7348 13.2573 28.7168 13.5029C28.6981 13.777 28.6904 13.9583 28.6904 14.0576L28.6904 14.0967L28.6836 14.1357C28.6681 14.2333 28.6621 14.3155 28.6621 14.3828L28.6621 14.4297L28.6533 14.4766L28.6396 14.585C28.6362 14.6281 28.6338 14.6788 28.6338 14.7373L28.6338 14.7705L28.6289 14.8047C28.6131 14.9208 28.5949 15.1392 28.5762 15.4736L28.4922 16.8379L28.4912 16.8447L28.4902 16.8525C28.4343 17.4393 28.369 18.2141 28.2939 19.1777C28.2564 19.822 28.1989 20.3235 28.1064 20.6387L28.1016 20.6543L28.0957 20.6699C27.9195 21.1501 27.5061 21.3828 27.0361 21.4375L27.0078 21.4404L24.3408 21.4404C23.4205 21.4601 22.5092 21.4696 21.6074 21.4697L21.6074 21.4707C20.6836 21.4905 19.7781 21.5 18.8916 21.5L16.2998 21.5ZM1.47852 21.5C1.1762 21.4999 0.890096 21.3764 0.705078 21.1025C0.543708 20.8635 0.500003 20.5679 0.5 20.291L0.5 20.2734L0.500977 20.2559L1.00879 13.0478L1.01074 13.0205C1.0678 12.5619 1.12645 12.176 1.18555 11.8662C1.22266 11.5805 1.26915 11.3104 1.32422 11.0557L1.32324 11.0547C1.36302 10.8044 1.42296 10.5555 1.5 10.3076L1.60254 9.9082C1.64131 9.76593 1.68461 9.61451 1.73242 9.4541L1.73926 9.43066L1.74902 9.40722C1.87457 9.10017 2.07566 8.71305 2.34277 8.25293L2.34766 8.24414C2.48108 8.02432 2.62343 7.79466 2.77539 7.55566L3.25977 6.81054C3.60092 6.29388 3.96037 5.76719 4.33887 5.23144C4.69386 4.72209 5.03033 4.23241 5.34766 3.76269L5.35352 3.75488C5.67389 3.30043 5.95694 2.90394 6.20313 2.5664C6.44876 2.22962 6.59889 2.01558 6.66406 1.91308L6.67188 1.90234L6.67969 1.89062C6.73279 1.81639 6.80548 1.71164 6.89844 1.57519L6.89942 1.57617C6.9859 1.44156 7.08788 1.30081 7.20606 1.15625L7.21778 1.1416L7.23145 1.12793C7.29743 1.05874 7.36608 0.992069 7.4375 0.928709L7.66016 0.747068C7.85605 0.600476 8.08987 0.50012 8.35352 0.499998C8.55185 0.499998 8.7364 0.561586 8.89649 0.645506L8.9043 0.650389L8.91211 0.654295C9.10582 0.765076 9.23658 0.822342 9.31445 0.845701L9.36035 0.859373L9.40332 0.881834C9.45964 0.911359 9.5298 0.948884 9.61426 0.993162C9.69878 1.03747 9.79747 1.08936 9.91016 1.14844L9.91895 1.15234L9.92676 1.15722C10.121 1.26831 10.4303 1.43081 10.8604 1.64648L10.873 1.65234L10.8848 1.65918C11.3002 1.89679 11.9128 2.25184 12.7207 2.72461L12.7207 2.72558C13.0312 2.89908 13.2924 3.07176 13.4824 3.24609C13.6319 3.3833 13.8156 3.59199 13.8594 3.86328L13.8691 3.9834L13.8555 4.125C13.8287 4.2616 13.7687 4.3815 13.7188 4.46875L13.7148 4.47558L13.7109 4.48144C13.167 5.36633 12.604 6.29106 12.0225 7.25488L12.0215 7.25781L11.5791 7.99219C11.2843 8.48926 10.9973 8.98918 10.7168 9.49121L12.2764 9.51074L12.7773 9.51074C13.0504 9.51074 13.2878 9.52019 13.4834 9.54297L13.5117 9.54687L13.5391 9.55273C13.6805 9.5857 13.8455 9.65256 13.9775 9.79101C14.1198 9.94023 14.1797 10.1258 14.1797 10.3057L14.1797 10.3867L14.1777 10.4092C14.1027 11.2555 14.0462 11.9134 14.0088 12.3838L14.0068 12.4014C13.9507 12.8915 13.9145 13.2573 13.8965 13.5029C13.8778 13.777 13.8691 13.9583 13.8691 14.0576L13.8691 14.0967L13.8633 14.1357C13.8478 14.2333 13.8408 14.3155 13.8408 14.3828L13.8408 14.4297L13.832 14.4766C13.8209 14.5351 13.8135 14.6203 13.8135 14.7373L13.8135 14.7705L13.8086 14.8047C13.7928 14.9208 13.7746 15.1392 13.7559 15.4736L13.6709 16.8379L13.6709 16.8447L13.6699 16.8525C13.6419 17.146 13.6119 17.4864 13.5791 17.874L13.4736 19.1777C13.4361 19.822 13.3777 20.3235 13.2852 20.6387L13.2813 20.6543L13.2754 20.6699C13.0992 21.1501 12.6857 21.3827 12.2158 21.4375L12.1865 21.4404L9.51953 21.4404C8.59948 21.4601 7.68868 21.4696 6.78711 21.4697L6.78711 21.4707C5.8633 21.4905 4.95783 21.5 4.07129 21.5L1.47852 21.5Z" stroke="currentColor"></path></svg>`;
//         paragraph.insertBefore(svgDiv, paragraph.firstChild);
//       }

//       svgArray.push(svgDiv);

//       return document.fonts.ready.then(() => {
//         const split = new SplitText(paragraph, {
//           type: "lines, words",
//         });
//         wordArray.push(...split.words);
//       });
//     });

//     Promise.all(splitPromises).then(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: wrap,
//           start: "top 90%",
//           toggleActions: "play none none none"
//         }
//       });
   

//       tl.set(svgArray, {
//         scale: 0,
//         autoAlpha: 0
//       })      
      
//       .set(nom, {        
//         autoAlpha: 0
//       })      
      
//       .set(poste, {        
//         autoAlpha: 0
//       })      
       
//       .to(svgArray, {
//         scale: 1,
//         autoAlpha: 1,
//         duration: 0.5,
//         ease: "back.out(1.7)",
//         stagger: 0.1
//       })

//       .from(wordArray, {
//         yPercent: 100,
//         autoAlpha: 0,
//         duration: 1,
//         ease: "power2.out",
//         stagger: 0.01
//       }, "<+=0.2")

//       .to(nom, {
//         autoAlpha: 1,
//         duration: 0.6,
//         ease: "power2.out"
//       }, ">")

//       .to(poste, {
//         autoAlpha: 1,
//         duration: 0.6,
//         ease: "power2.out"
//       }, "<0.2")
      
//       ;

      
//       wrap.dataset.gsapInitialized = "true";
//       ScrollTrigger.refresh();
//     });
//   });
// }


// document.addEventListener("DOMContentLoaded", () => {
//   initTestimonials();

//   // Set visibility for flicker-prevention elements
//   gsap.set('[data-prevent-flicker="true"]', {
//     visibility: "visible"
//   });

//   // Watch for testimonial items being added
//   const container = document.querySelector('.vestibule_collection_list');
//   if (container) {
//     const observer = new MutationObserver(() => {
//       gsap.set('[data-prevent-flicker="true"]', {
//         visibility: "visible"
//       });
//       initTestimonials();
//     });

//     observer.observe(container, {
//       childList: true,
//       subtree: true
//     });
//   }

//   // Handle "load more" for new button
//   const loadMoreBtn = document.querySelector('[ms-code-submit-new="load-more"]');
//   if (loadMoreBtn) {
//     loadMoreBtn.addEventListener('click', () => {
//       setTimeout(() => {
//         gsap.set('[data-prevent-flicker="true"]', {
//           visibility: "visible"
//         });
//         initTestimonials();
//       }, 1000);
//     });
//   }

//   // ✅ Hide newBtn when oldBtn is hidden
//   const oldBtn = document.querySelector('[ms-code-submit-old="load-more"]');
//   const newBtn = document.querySelector('[ms-code-submit-new="load-more"]');
  
//   if (oldBtn && newBtn) {
//     const checkVisibilityAndUpdate = () => {
//       const oldDisplay = window.getComputedStyle(oldBtn).display;
  
//       // Only hide newBtn if oldBtn is hidden
//       if (oldDisplay === 'none') {
//         newBtn.style.display = 'none';
//       } else {
//         newBtn.style.display = ''; // Let CSS handle it
//       }
//     };
  
//     const buttonObserver = new MutationObserver(checkVisibilityAndUpdate);
  
//     buttonObserver.observe(oldBtn, {
//       attributes: true,
//       attributeFilter: ['style', 'class'],
//     });
  
//     // Run once initially
//     checkVisibilityAndUpdate();
  
  

//     // Initial check in case the old button is already hidden on page load
//     if (window.getComputedStyle(oldBtn).display === 'none') {
//       newBtn.style.display = 'none';
//     }
//   }
// });
function reinitLotties(scope = document) {
  const lottieElements = scope.querySelectorAll('[data-animation-type="lottie"]');

  lottieElements.forEach(el => {
    // Si déjà initialisé (par présence d'un <svg> ou d'un flag), on ne fait rien
    const alreadyInitialized = el.querySelector('svg') || el.dataset.lottieInit === 'true';
    if (alreadyInitialized) return;

    el.dataset.lottieInit = 'true';

    const src = el.getAttribute('data-src');
    if (!src) return;

    lottie.loadAnimation({
      container: el,
      renderer: el.getAttribute('data-renderer') || 'svg',
      loop: el.getAttribute('data-loop') === '1',
      autoplay: el.getAttribute('data-autoplay') === '1',
      path: src,
      name: el.getAttribute('data-w-id') || undefined,
    });
  });
}







///////////////////////////////
/// SCROLLBAR
///////////////////////////////

function createCustomScrollbar({ sectionSelector, maskSelector }) {
  const section = document.querySelector(sectionSelector);
  const mask = document.querySelector(maskSelector);

  if (!section || !mask) return;


  gsap.to(mask, {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom bottom",
      // markers: true,
      scrub: true
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createCustomScrollbar({
    sectionSelector: ".vestibule_layout",
    maskSelector: ".scrollbar_mask"
  });
});
document.addEventListener("DOMContentLoaded", () => {
  createCustomScrollbar({
    sectionSelector: ".portrait_associes_layout",
    maskSelector: ".scrollbar_mask"
  });
});



///////////////////////////////
/// CHAMBRE HORIZONTAL
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  ScrollTrigger.matchMedia({
    // Only for screens wider than 767px
    "(min-width: 768px)": function () {
      const list = document.querySelector('.chambre_collection_list[horizontal-scroll="true"]');
      const container = document.querySelector('.homepage_chambre_contain');
      if (!list) return;

      let listWidth = list.scrollWidth;
      let containerWidth = container.offsetWidth;
      let scrollDistance = -(listWidth - containerWidth);
      console.log("List Width:", listWidth);
      console.log("Screen Width:", containerWidth);
      console.log("Scroll Distance:", scrollDistance);

      const tlTableauxHorizontal = gsap.to(list, {
        x: scrollDistance,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: ".homepage_chambre_section",
        start: "top top",
        end: "bottom bottom",
        animation: tlTableauxHorizontal,
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true,
        // markers: true
      });
    }
  });
});


///////////////////////////////
/// PAGE CHAMBRE HORIZONTAL SCROLL
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  ScrollTrigger.matchMedia({
    // Only for screens wider than 767px
    "(min-width: 768px)": function () {
      const list = document.querySelector('.chambre_collection_list');
      const container = document.querySelector('.chambre_contain');
      if (!list || !container) return;


      let listWidth = list.scrollWidth;
      let containerWidth = container.offsetWidth;
      let scrollDistance = -(listWidth - containerWidth);
      console.log("Chambre List Width:", listWidth);
      console.log("Chambre Screen Width:", containerWidth);
      console.log("Chambre Scroll Distance:", scrollDistance);

      const tlTableaux = gsap.to(list, {
        x: scrollDistance,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: ".chambre_section",
        start: "top top",
        end: "bottom bottom",
        animation: tlTableaux,
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true
      });
    }
  });
});



///////////////////////////////
/// HERO HORIZONTAL SCROLL
///////////////////////////////

function initHeroHorizontalScroll() {
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
      const list = document.querySelector('.hero_draggable_collection_list');
      const container = document.querySelector('.hero_contain');
      if (!list || !container) return;

      let listWidth = list.scrollWidth;
      let containerWidth = container.offsetWidth;
      let scrollDistance = -(listWidth - containerWidth);

      console.log("Hero List Width:", listWidth);
      console.log("Hero Screen Width:", containerWidth);
      console.log("Hero Scroll Distance:", scrollDistance);

      const tlHeroHorizontal = gsap.to(list, {
        x: scrollDistance,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: ".hero_track_container",
        start: "top top",
        end: "bottom bottom",
        animation: tlHeroHorizontal,
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true
      });
    }
  });
}




///////////////////////////////
/// FOOTER TOOLTIP (on hover)
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector('.interligne_tooltip_wrap');
  const trigger = wrapper.querySelector('.interligne_tooltip_trigger');
  const tooltip = wrapper.querySelector('.interligne_tooltip_box');

  // Show on mouse enter
  trigger.addEventListener('mouseenter', () => {
    tooltip.classList.remove('top', 'bottom', 'visible');

    // Temporarily show tooltip to measure height
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;
    const spaceAbove = triggerRect.top;
    const spaceBelow = window.innerHeight - triggerRect.bottom;

    tooltip.style.display = '';
    tooltip.style.visibility = '';

    if (spaceBelow >= tooltipHeight + 20) {
      tooltip.classList.add('bottom');
    } else {
      tooltip.classList.add('top');
    }

    tooltip.classList.add('visible');
  });

  // Hide on mouse leave (either from trigger or tooltip)
  wrapper.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible', 'top', 'bottom');
  });
});



///////////////////////////////
/// NAV LINK FOOTER
///////////////////////////////

if (window.matchMedia("(min-width: 992px)").matches) {
  const navLinkFooterWrap = document.querySelectorAll(".nav_link_item_wrap[data-wf--nav-nav-link-item--variant='footer']");

  navLinkFooterWrap.forEach(function (el) {
    let tlNavLinkFooter = gsap.timeline({ paused: true });

    tlNavLinkFooter.to(el, {
      x: 0,
      duration: 0.6,
      ease: "expo.out"
    });

    el.addEventListener("mouseenter", function () {
      tlNavLinkFooter.play();
    });

    el.addEventListener("mouseleave", function () {
      tlNavLinkFooter.reverse();
    });
  });
}


///////////////////////////////
/// FOOTER LETTER
///////////////////////////////


document.fonts.ready.then(() => {
  const wrap = document.querySelector(".footer_animation_wrap");
  if (!wrap) return;

  const paragraphs = wrap.querySelectorAll("p");

  // Split all paragraphs into characters
  let allLetters = [];
  paragraphs.forEach(p => {
    const split = new SplitText(p, { type: "chars" });
    allLetters.push(...split.chars);
  });

  // Make each letter individually transformable
  allLetters.forEach(letter => {
    letter.style.display = "inline-block";
  });

  // Scatter letters on load
  const scatterTl = gsap.timeline({ paused: true });

  scatterTl.from(allLetters, {
    x: () => gsap.utils.random(-150, 150),
    y: () => gsap.utils.random(-100, 100),
    rotation: () => gsap.utils.random(-180, 180),
    // ease: "customElastic",
    ease: "power4.out",
    duration: 1,
  });

let floatTweens = [];

function createFloatTl() {
  // Kill all previous tweens
  floatTweens.forEach(tween => tween.kill());
  floatTweens = [];

  allLetters.forEach(letter => {
    const tween = gsap.to(letter, {
      x: `+=${gsap.utils.random(-50, 50)}`,
      y: `+=${gsap.utils.random(-40, 40)}`,
      rotation: `+=${gsap.utils.random(-5, 5)}`,
      duration: gsap.utils.random(1, 4),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    floatTweens.push(tween);
  });
}

  createFloatTl();

// Desktop: Hover interactions
if (window.innerWidth > 991) {
  wrap.addEventListener("mouseenter", () => {
    floatTweens.forEach(tween => tween.pause());
    scatterTl.play();
  });

  wrap.addEventListener("mouseleave", () => {
    scatterTl.reverse().eventCallback("onReverseComplete", () => {
      createFloatTl();
    });
  });
}

// Tablet/mobile: ScrollTrigger interaction
else {
  ScrollTrigger.create({
    trigger: wrap,
    start: "bottom bottom",
    // markers: true,
    onEnter: () => {
      floatTweens.forEach(tween => tween.pause());
      scatterTl.play();
    },
    onLeave: () => {
      scatterTl.reverse().eventCallback("onReverseComplete", () => {
        createFloatTl();
      });
    },
    onEnterBack: () => {
      floatTweens.forEach(tween => tween.pause());
      scatterTl.play();
    },
    onLeaveBack: () => {
      scatterTl.reverse().eventCallback("onReverseComplete", () => {
        createFloatTl();
      });
    }
  });
}
});


///////////////////////////////
/// HOMEPAGE INTRO ANIM
///////////////////////////////



document.addEventListener("DOMContentLoaded", () => {  
  const homepageIntro = document.querySelector('.homepage_intro_wrap');
  if (!homepageIntro) {
    document.body.classList.remove('preload');
    return;
  }

  // // 1. Vérifie si l’utilisateur vient de l’extérieur
  // const isExternalVisit =
  //   !document.referrer ||
  //   !document.referrer.includes(window.location.hostname);

  // if (!isExternalVisit) {
  //   // Cas navigation interne : pas d’intro
  //   if (window.lenis) window.lenis.start();
  //   console.log("Navigation interne : intro ignorée.");
  //   initHeroHorizontalScroll();
  //   document.body.classList.remove('preload'); // On affiche le contenu
  //   return;
  // }

  // Cas visite externe : on montre l’intro (déjà présente dans le DOM)
  // homepageIntro.style.display = 'block'; // ou ajouter une classe `.visible` si tu utilises opacity + transition

  // Affiche le reste du contenu
  document.body.classList.remove('preload');


  /* ------------------------------------------------------------------
     2. On joue l’intro (arrivée externe)
  ------------------------------------------------------------------ */  

  // Bloque le scroll
  document.body.classList.add('no-scroll');
  if (window.lenis) window.lenis.stop();
  window.scrollTo(0, 0);

  /* ---- Lottie ------------------------------------------------------ */
  const animation = lottie.loadAnimation({
    container: document.querySelector('.lottie_intro_player'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'https://cdn.prod.website-files.com/685ce9a82af9891039eaf5bd/6863b914a5983c601bf98e60_homepage_v33.json'
  });



  /* ---- Transition vers le site ------------------------------------- */  

  // On détermine la couleur selon la taille d'écran
let navBgColor;

if (window.innerWidth <= 768) {  // seuil mobile, adapte à tes besoins
  navBgColor = "#1d1d1d";        // couleur mobile
} else {
  navBgColor = "#f8f8f6";        // couleur desktop
}

  const transitionTimeline = gsap.timeline({
    paused: true,
    onStart: () => {
      window.scrollTo(0, 0);
      document.body.classList.remove('no-scroll');
      if (window.lenis) window.lenis.start();
      // window.lenis.scrollTo(0, { immediate: true });

    }
  });

  transitionTimeline

    .to(".lottie_intro_wrap",  { 
      duration: 1,
      y: "-100vh", 
      ease: "power3.out",
          onComplete: () => { 
            homepageIntro.style.display = "none";
            initHeroHorizontalScroll();
           } 
          }, "<")
          
      .from(".hero_section",{ 
        y: "100vh",
        duration: 1,
        ease: "power3.out", 
      }, "<")
      
      .from(".nav_top_logo_wrap",{ 
        color: "#f8f8f6", 
        duration: .3 
      }, "<.5")          
      
      .to(".nav_clickable_wrap",{ opacity: 1, duration: 1 }, "<")
      
      .set(".nav_top_wrap",{ 
        background: navBgColor,         
      }, ">") 
      
      

      ;

    
  /* Lance la transition quand l’animation Lottie est terminée */
  animation.addEventListener('complete', () => {
    transitionTimeline.play();
  });
});



///////////////////////////////
/// ENTREE ANIM
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector('.entree_anim_wrap');
  if (!wrapper) return;

  const paragraphs = wrapper.querySelectorAll('.entree_paragraph_scatter');
  const allChars = [];

  

  // Get bounding boxes of fixed elements relative to wrapper
  const wrapperRect = wrapper.getBoundingClientRect();
  const fixedBoxes = Array.from(document.querySelectorAll('.entree_paragraph_fixed')).map(el => {
    const rect = el.getBoundingClientRect();
    const margin = 20; // optional buffer around each fixed area
    return {
      left: rect.left - wrapperRect.left - margin,
      top: rect.top - wrapperRect.top - margin,
      right: rect.right - wrapperRect.left + margin,
      bottom: rect.bottom - wrapperRect.top + margin
    };
  });

  paragraphs.forEach(paragraph => {
    const split = new SplitText(paragraph, { type: "chars" });
    const chars = split.chars;  
    allChars.push(...chars);

    const totalChars = chars.length;
    const cols = Math.ceil(Math.sqrt(totalChars));
    const rows = Math.ceil(totalChars / cols);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const centerX = vw / 2;
    const centerY = vh / 2;

    const xSpacing = (vw * 0.5) / cols;
    const ySpacing = (vh * 0.5) / rows;

    const gridOffsetX = centerX - (cols * xSpacing) / 2;
    const gridOffsetY = centerY - (rows * ySpacing) / 2;

    let charIndex = 0;

    chars.forEach((char) => {
      let positionOK = false;
      let attempt = 0;
      let x, y;
   

      while (!positionOK && attempt < 1000) {
        const col = charIndex % cols;
        const row = Math.floor(charIndex / cols);

        x = gridOffsetX + col * xSpacing + xSpacing / 2;
        y = gridOffsetY + row * ySpacing + ySpacing / 2;

        // Convert to wrapper-relative coordinates
        const relativeX = x - wrapperRect.left;
        const relativeY = y - wrapperRect.top;

        // Check if inside any fixed box
        const insideFixed = fixedBoxes.some(box => {
          return (
            relativeX > box.left &&
            relativeX < box.right &&
            relativeY > box.top &&
            relativeY < box.bottom
          );
        });

        if (!insideFixed) {
          positionOK = true;
        } else {
          charIndex++; // Try next grid cell
        }

        attempt++;
      }

      const xOffset = x - centerX;
      const yOffset = y - centerY;
      const rot = gsap.utils.random(-45, 45);

      gsap.from(char, {
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "90% bottom",
          scrub: true,
          // markers: true,
          ease: "linear",
        },
        x: xOffset,
        y: yOffset,
        rotation: rot,
        ease: "power2.out"
      });

      charIndex++;
    });
  });

  // Fade-in + scale-up effect on page load
  gsap.set(paragraphs, {
    opacity: 1,
  });

  gsap.from(allChars, {
    opacity: 0,
    scale: 0.4,
    duration: 0.3,
    stagger: 0.02,
    ease: "power2.out",
    delay: 0.5
  });  


});

///////////////////////////////
/// BASIC SCROLL TRIGGER
///////////////////////////////

let tlEnntreeReduce = gsap.timeline({ paused: true });

tlEnntreeReduce
  .to(".entree_section_wrap[data-animate-margin-top='true']", {
    marginTop: "-33svh",    
    })  
;

ScrollTrigger.create({
  trigger: ".entree_anim_wrap", // Element that triggers the animation
  start: "top top",
  end: "bottom bottom",
  // markers: true,
  ease: "linear",
  animation: tlEnntreeReduce, // Animation to play
   scrub: true, // Smooth scrolling effect  
});





///////////////////////////////
/// RICH TEXT BLOCK QUOTE
///////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const quoteTemplate = document.querySelector(".quote_component_template");
  if (!quoteTemplate) return;

  const richTexts = document.querySelectorAll(".u-rich-text");

  const newQuotes = []; // Keep track of new quotes added

  richTexts.forEach(richText => {
    const blockquotes = richText.querySelectorAll("blockquote");

    blockquotes.forEach(originalBlockquote => {
      const quoteText = originalBlockquote.innerHTML;

      // Clone the template
      const newQuote = quoteTemplate.cloneNode(true);
      newQuote.style.display = ""; // Ensure it's visible

      const quoteTextEl = newQuote.querySelector(".u-rich-text p");
      if (quoteTextEl) {
        quoteTextEl.innerHTML = quoteText;
      }

      // Replace the original blockquote with the new component
      originalBlockquote.replaceWith(newQuote);
      newQuotes.push(newQuote); // Save it for animation
    });
  });

  // Init GSAP ScrollTrigger after all quotes are added
  newQuotes.forEach(function (el) {
    let lineMask = el.querySelector(".quote_component_line_bar_mask");
    if (!lineMask) return;

    let tlComponentWrap = gsap.timeline({ paused: true });

    tlComponentWrap.from(lineMask, {
      height: 0,
      duration: .6,
    });

    ScrollTrigger.create({
      trigger: el,
      // toggleActions: "play complete play reverse",
      start: "top 95%",
      // markers: true,
      animation: tlComponentWrap,
    });
  });

  ScrollTrigger.refresh(); // Ensure ScrollTrigger recalculates positions
});


///////////////////////////////
/// SCROLL TRIGGER BLOCK QUOTE WRAP
///////////////////////////////

const quoteWrap = document.querySelectorAll(".quote_person_wrap");

// FOR EACH ODD ETAPE WRAPPER
quoteWrap.forEach(function (el) {
    let element = el.querySelector(".class");
    let tlQuoteWrap = gsap.timeline({ paused: true });
  
    tlQuoteWrap
      .to(el, {
        rotate: -5,
        ease: "customBack",
        duration: .4,
        })
      
        ;
  
    ScrollTrigger.create({
      trigger: el, // Element that triggers the animation
      // toggleActions: "play complete play reverse",
      start: "top 66%", // When to start the animation
      // end: 'bottom center', // When to end the animation
      // markers: true,
      once:true,
      animation: tlQuoteWrap, // Animation to play
      // scrub: true, // Smooth scrolling effect
    });
  });



///////////////////////////////
/// ENTRÉE SERVICE ITEM
///////////////////////////////


document.querySelectorAll('.service_item_wrap').forEach((wrap) => {
  const listItems = wrap.querySelectorAll('.service_exemple_list li');
  const title = wrap.querySelector('.service_link_text h2');
  const chiffre = wrap.querySelector('.service_link_chiffre_wrap');
  const serviceTitle = wrap.querySelector('.service_maison_trafalgar p');
  const serviceSubtitle = wrap.querySelector('.service_subtitle_wrap h3');
  const paragraphs = wrap.querySelectorAll('.service_body_text_wrap p');
  
  const split = new SplitText(listItems, { type: 'lines,words' });
  const splitTitle = new SplitText(title, { type: 'lines,words' });
  const splitServiceTitle = new SplitText(serviceTitle, { type: 'lines,words', mask: "lines",linesClass: "line-mask"});
  const splitServiceSubtitle = new SplitText(serviceSubtitle, { type: 'lines,words', mask: "lines",linesClass: "line-mask"});
  const splitParagraphs = new SplitText(paragraphs, { type: 'lines,words', mask: "lines",linesClass: ""});

  // Create a single timeline for this wrap
  const tlService = gsap.timeline({});

  tlService

  .from(chiffre, {
    // opacity: 0,
    x: -200, 
    opacity: 0,            
    })

  .from(splitTitle.words, {
    // opacity: 0,
    y: "2em",
    stagger: 0.02,
    duration: .6,
    })

  .from(split.words, {
    // opacity: 0,
    y: "2em",
    duration: .6,
    stagger: 0.02,
    }, "<")

  .from(splitServiceTitle.words, {
    opacity: 0,
    // y: "2em",
    duration: .6,
    stagger: 0.02,
    }, "<")

  .from(splitServiceSubtitle.words, {
    opacity: 0,
    // y: "2em",
    duration: .6,
    stagger: 0.02,
    }, "<")
  .from(splitParagraphs.words, {
    opacity: 0,
    // y: "2em",
    duration: .6,    
    }, "<")


  
    ;

  ScrollTrigger.create({
    trigger: wrap, // Element that triggers the animation
    // toggleActions: "play complete play reverse",
    once: true,
    start: "top 75%", // When to start the animation
    // end: 'bottom center', // When to end the animation
    // markers: true,
    animation: tlService, // Animation to play
    // scrub: true, // Smooth scrolling effect
  });
});


///////////////////////////////
/// DRAGGABLE CHAMBRE
///////////////////////////////

// initializeDraggableForElements(".chambre_contain", ".chambre_collection_list[draggable='true']", ".chambre_collection_item", 767, Infinity); // Draggable active between 0 and Infinity


///////////////////////////////
/// VU METER
///////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  const lines = document.querySelectorAll('.ambiance_musicale_vu_meter_line');
  const toggleButton = document.querySelector('.ambiance_musicale_wrap');

  if (!lines.length || !toggleButton) return;

  let isPulsing = false;
  let pulseTweens = [];

  // Set initial random static height
  lines.forEach(line => {
    line.style.height = `${gsap.utils.random(10, 80)}%`;
  });

  function startPulse() {
    lines.forEach(line => {
      function pulse() {
        const tween = gsap.to(line, {
          height: `${gsap.utils.random(10, 80)}%`,
          duration: gsap.utils.random(0.1, 0.5),
          ease: "power1.inOut",
          onComplete: pulse
        });
        pulseTweens.push(tween);
      }
      pulse(); // start recursive pulsing
    });
  }

  function stopPulse() {
    pulseTweens.forEach(tween => tween.kill());
    pulseTweens = [];

    // Optional: set a random static height when stopping
    lines.forEach(line => {
      gsap.set(line, {
        height: `${gsap.utils.random(10, 80)}%`
      });
    });
  }

  toggleButton.addEventListener('click', () => {
    if (isPulsing) {
      stopPulse();
    } else {
      startPulse();
    }
    isPulsing = !isPulsing;
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const layout = document.querySelector('.ambiance_musicale_layout');
  const audio = document.getElementById('ambiance-audio');
  if (!layout || !audio) return;

  layout.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      layout.classList.add('active');
    } else {
      audio.pause();
      layout.classList.remove('active');
    }
  });
});

///////////////////////////////
/// PARAGRAPH ACCENT
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-paragraph-accent='true']").forEach((text) => {

    const split = SplitText.create(text.children, {
      type: "words, chars",
      mask: "words",
      wordsClass: "word",
      charsClass: "char",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: text,
        start: "top 95%",
        // end: "top 25%",        
        // markers: true,
        // scrub: true,
      },
    });
    tl.from(split.words, {
      yPercent: 110,      
      delay: 0.2,
      duration: .4,
      stagger: { amount: .5 },
    })
    .from(split.words, {
      color: "#83817c",
      delay: 0.2,
      duration: 0.4,
      stagger: { amount: 0.5 },
      onComplete: () => {
        // Supprime le style inline `color` de chaque mot
        split.words.forEach((word) => {
          word.style.removeProperty("color");
        });
      },
    }, "<0.2");

    gsap.set(text, { autoAlpha: 1 });
  });
});

///////////////////////////////
/// VESTIBULE TEXT INTRO
///////////////////////////////

Promise.all([
  new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve)),
  document.fonts.ready
]).then(() => {
  const vestibule = document.querySelector('.vestibule_intro_layout');
  if (!vestibule) return;

  const accentFirstEl = document.querySelector('.vestibule_intro_text_wrap.first .vestibule_intro_accent');
  const accentSecondEl = document.querySelector('.vestibule_intro_text_wrap.second .vestibule_intro_accent');
  const paragraphFirst = document.querySelector('.vestibule_intro_text_wrap.first p');
  const paragraphSecond = document.querySelector('.vestibule_intro_text_wrap.second p');

  if (!accentFirstEl || !accentSecondEl) return;

  const accentFirst = new SplitText(accentFirstEl, {
    type: "lines, chars",
    mask: "lines",
    linesClass: "line-mask",
  });

  const accentSecond = new SplitText(accentSecondEl, {
    type: "lines, chars",
    mask: "lines",
    linesClass: "line-mask",
  });


  const tl = gsap.timeline();

  tl
  .set(".vestibule_intro_text_wrap", {
    // visibility: "hidden",
  })

  .from(paragraphFirst, {     
    opacity: 0,
    duration: 1,
    delay: 2,
    force3D: true    
  }, )
  .from(accentFirst.chars, {
    yPercent: -100,  
    duration: 0.6,
    stagger: 0.03,
    ease: "power2.out",
    force3D: true 
  }, '<.2')
  .from(paragraphSecond, {     
    opacity: 0,
    duration: 1,    
  }, '>.2')
  .from(accentSecond.chars, {
    yPercent: 100,    
    duration: 0.6,
    stagger: 0.03,
    ease: "power2.out",
    force3D: true // 👈

  }, '<.2'); // small delay between first and second accent

  
  tl.play();
});



///////////////////////////////
/// ROUGH NOTATION
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('[data-rough-notation="true"]');
  if (elements.length === 0) return;

  elements.forEach((el) => {
    const target = el.querySelector("sub");
    if (!target) return;

    const annotation = RoughNotation.annotate(target, {
      type: "box",
      strokeWidth: 1,
      padding: 4,
      animationDuration: 800,
      iterations: 2,
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      // markers: true,
      onEnter: () => {
        annotation.show();

        const noteValue = el.getAttribute("data-rough-notation-value");
        if (noteValue) {
          const noteDiv = document.createElement("div");
          noteDiv.className = "handwritten_note";
          noteDiv.innerHTML = noteValue;

          const container = el.closest(".paragraph_item_layout");
          if (container) {
            container.appendChild(noteDiv);
          }

          // Split and animate the characters inside noteDiv
          const split = new SplitText(noteDiv, {
            type: "chars",
            charsClass: "char"
          });

          gsap.from(split.chars, {
            opacity: 0,
            y: "0.5em",
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.04,
            delay: 0.4 // optional delay to match annotation timing
          });
        }
      },
      once: true,
      // markers: true,
    });
  });
});


///////////////////////////////
/// SCROLL TRIGGER REFRESH
///////////////////////////////

document.querySelectorAll(".u-scroll-trigger-refresh").forEach(trigger => {
  ScrollTrigger.create({
    trigger: trigger,
    start: "top bottom",
    onEnter: () => {
      console.log("ScrollTrigger refresh triggered by:", trigger);
      ScrollTrigger.refresh();
    },
    once: true,
    // markers: true
  });
});


///////////////////////////////
/// ROUGH NOTATION
///////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll('.portrait_associes_img_item_inner_wrap');
  if (items.length === 0) return;

  const randomRotation = gsap.utils.random(-8, 8, 1, true); // adjust range and precision if needed

  items.forEach((item) => {
    gsap.set(item, {
      rotate: randomRotation() // call it for each element to get a new value
    });
  });
});



///////////////////////////////
/// BREADCRUMB
///////////////////////////////

// document.addEventListener('DOMContentLoaded', function () {
//   const navWithSub = document.querySelector('nav[data-wf--nav-nav-wrap--variant="show-sub-navbar"]');
//   if (!navWithSub) return;

//   const pathParts = window.location.pathname.split('/').filter(Boolean); // e.g., ['chambre', 'tribunes', 'leconomie-de-lattention']
//   const pageTitle = document.title.split('–')[0].trim();

//   const formatText = str =>
//     str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

//   // References
//   const folderWrap = document.querySelector('[data-link="folder"]');
//   const pageWrap = document.querySelector('[data-link="page"]');
//   const middleWrap = document.querySelector('[data-link="middle"]');

//   // First level (folder)
//   const folder = pathParts[0] || null;
//   if (folder && folderWrap) {
//     const folderP = folderWrap.querySelector('p');
//     const folderA = folderWrap.querySelector('.g_clickable_link');
//     if (folderP) folderP.textContent = formatText(folder);
//     if (folderA) folderA.href = `/${folder}`;
//   }

  

//   // Final page (last segment)
//   const pageSlug = pathParts[pathParts.length - 1];
//   if (pageWrap) {
//     const pageP = pageWrap.querySelector('p');
//     const pageA = pageWrap.querySelector('.g_clickable_link');
//     if (pageP) pageP.textContent = pageTitle;
//     if (pageA) pageA.href = window.location.pathname;
//   }
// });


///////////////////////////////
/// SHOW NAVBAR
///////////////////////////////
// document.addEventListener('DOMContentLoaded', function() {
//   const navWithSub = document.querySelector('nav[data-wf--nav-nav-wrap--variant="show-sub-navbar"]');
//   if (!navWithSub) return;

//   const subNav = document.querySelector('.sub_nav_contain');
//   let lastScroll = window.scrollY;
//   let isHidden = false;
  
//   window.addEventListener('scroll', () => {
//     const currentScroll = window.scrollY;
  
//     if (currentScroll > lastScroll && !isHidden && currentScroll > 50) {
//       // Scroll down → hide
//       gsap.to(subNav, {
//         height: 0,
//         opacity: 0,
//         duration: 0.4,
//         // ease: 'power2.out',
//         onComplete: () => subNav.style.display = 'none'
//       });
//       isHidden = true;
//     } else if (currentScroll < lastScroll && isHidden) {
//       // Scroll up → show
//       subNav.style.display = 'block'; // Show first so we can animate it
//       gsap.fromTo(subNav,
//         { height: 0, opacity: 0 },
//         {
//           height: 'auto',
//           opacity: 1,
//           duration: 0.4,
//           // ease: 'power2.out'
//         }
//       );
//       isHidden = false;
//     }
  
//     lastScroll = currentScroll;
//   });
// });

///////////////////////////////
/// SHOW NAVBAR
///////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  const musicButton = document.querySelector('.ambiance_musicale_wrap');
  const footer = document.querySelector('footer');
  
  if (musicButton && footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: 'top bottom', // when top of footer hits bottom of viewport
      onEnter: () => {
        gsap.to(musicButton, {
          y: "10vh",
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        gsap.to(musicButton, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }
  
});



///////////////////////////////
/// PORTRAIT MAISON TEXTE
///////////////////////////////
document.addEventListener('DOMContentLoaded', function() {


  const scatterSections = document.querySelectorAll("[data-letter-scatter='true']");
  if (!scatterSections) return;
  
  const maxTransform = 40;
  const minTransform = maxTransform * -1;

  scatterSections.forEach(section => {
    const paragraphs = section.querySelectorAll('p');

    
  
    paragraphs.forEach(p => {
      const split = new SplitText(p, {
        type: 'words, chars',
        charsClass: 'scatter-char'
      });
  
      const chars = split.chars;
  
      // =============== SCROLLTRIGGER DISPERSION ANIMATION ===============
      gsap.from(chars, {
        scrollTrigger: {
          trigger: p,
          start: "top 80%",
          // markers: true,
        },
        // x: () => gsap.utils.random(minTransform,maxTransform),
        // y: () => gsap.utils.random(minTransform, maxTransform),
        opacity: 0,
        // rotation: () => gsap.utils.random(-15, 15),
        duration: 1,
        ease: "power3.out",        
        stagger: {
          each: 0.0025,
          from: "random"
        }
      });
  
      // =============== MOUSE REPELLER INTERACTION ===============
      chars.forEach(char => {
        char._timeline = null;
      });
  
      section.addEventListener('mousemove', e => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
  
        chars.forEach(char => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          const distance = Math.hypot(mouseX - charX, mouseY - charY);
  
          if (distance < 30) {
            const randomX = gsap.utils.random(minTransform,maxTransform);
            const randomY = gsap.utils.random(minTransform,maxTransform);
  
            if (char._timeline) char._timeline.kill();
  
            const tl = gsap.timeline();
            tl.to(char, {
              x: randomX,
              y: randomY,
              duration: 1.5,
              ease: 'power2.out'
            }).to(char, {
              x: 0,
              y: 0,
              duration: .6,
              ease: 'power3.out'
            }, '>');
  
            char._timeline = tl;
          }
        });
      });
    });
  });
});

///////////////////////////////
/// TRIBUNES SUBMENU
///////////////////////////////

document.addEventListener('DOMContentLoaded', function () {  
  const links = document.querySelectorAll('.tribune_link_collection_item');
  const viewers = document.querySelectorAll('.tribune_viewer_collection_item');

  links.forEach(link => {
    const value = link.getAttribute('data-value');
    const viewer = [...viewers].find(v => v.getAttribute('data-value') === value);
    if (!viewer) return;

    // Mark active link
    if (value && window.location.pathname.includes(value)) {
      link.classList.add('current');
    }

    const textEl = viewer.querySelector('p');
    const imgWrap = viewer.querySelector('.tribune_viewer_img_wrap');

    // Create timelines
    const tlIn = gsap.timeline({ paused: true,}); // <- Add delay here
    tlIn.set(viewer, { autoAlpha: 1, delay: .2 })
        .fromTo(textEl,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(imgWrap,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: 'power2.out' },
          '<'
        );

    const tlOut = gsap.timeline({ paused: true });
    tlOut.fromTo(textEl,
          { y: 0, opacity: 1 },
          { y: 20, opacity: 0, duration: 0.3, ease: 'power1.in' }
        )
        .fromTo(imgWrap,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(100% 0% 0% 0%)", duration: 0.3, ease: 'power1.in' },
          0.05
        )
        .set(viewer, { autoAlpha: 0 });

    link.addEventListener('mouseenter', () => {      
      tlIn.restart(); // will wait 0.2s before playing
    });

    link.addEventListener('mouseleave', () => {    
      tlOut.restart(); // play out immediately
    });
  });
});

///////////////////////////////
/// ODE À NOS CLIENTS
///////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.ode_contain');
  const tracks = document.querySelectorAll('.ode_image_slide_wrap');

  if (!container) return;

  // Mobile case: ≤ 991px
  if (window.innerWidth <= 991) {
    const firstTrack = tracks[0];
    const firstList = firstTrack.querySelector('.ode_image_collection_list');

    if (!firstList) return;

    const containerWidth = firstTrack.offsetWidth;
// console.log("📏 Container width (firstTrack.offsetWidth):", containerWidth);

const listWidth = firstList.scrollWidth;
// console.log("📏 List scrollable width (firstList.scrollWidth):", listWidth);

const deltaX = - (listWidth - containerWidth) - 16; // will be negative
// console.log("🧮 Calculated scroll distance (deltaX):", deltaX);

    console.log("")

    gsap.to(firstList, {
      x: deltaX,
      ease: 'none',
      scrollTrigger: {
        trigger: ".page_main",
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        // markers: true
      }
    });

        // Build the timeline (initially paused)
        // const hideTl = gsap.timeline({ paused: true })
        //   .to(firstTrack, {
        //     y: '10rem',
        //     // opacity: 0,
        //     duration: 0.6,
        //     ease: 'power2.out'
        //   })
        //   .set(firstTrack, { display: 'none' });

        // // ScrollTrigger controls the direction of the timeline
        // ScrollTrigger.create({
        //   trigger: container,
        //   start: 'bottom 50%',
        //   end: 'bottom 50%',
        //   // toggleActions: 'play none none reverse',
        //   // markers: true,
        //   // onEnterBack: () => {
        //   //   // Reset display so animation can run
        //   //   firstTrack.style.display = 'flex';
        //   // },
        //   animation: hideTl
        // });


    return; // exit early — no need to run desktop version
  }

  // Desktop case: ≥ 992px
  if (tracks.length >= 2) {
    const firstTrack = tracks[0];
    const secondTrack = tracks[1];
    const firstList = firstTrack.querySelector('.ode_image_collection_list');
    const secondList = secondTrack.querySelector('.ode_image_collection_list');

    if (!firstList || !secondList) return;

    const parentHeight = firstTrack.offsetHeight;
    const firstListHeight = firstList.offsetHeight;
    const secondListHeight = secondList.offsetHeight;

    const firstDelta = parentHeight - firstListHeight;
    const secondDelta = parentHeight - secondListHeight;

    // Animate first list vertically up
    gsap.to(firstList, {
      y: firstDelta,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        // markers: true,
      }
    });

    // Animate second list vertically down
    gsap.to(secondList, {
      y: secondDelta,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        // markers: true,
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {
  gsap.registerPlugin(ScrollTrigger);

  if (window.innerWidth <= 991) {
    const stickyWrap = document.querySelector('.ode_image_slide_track');
    const layout = document.querySelector('.ode_contain');

    if (!stickyWrap || !layout) return;
    

    ScrollTrigger.create({
      trigger: layout,
      start: "bottom bottom",
      end: "50% bottom",
      // markers: true,
      onUpdate: (self) => {
        if (self.progress === 1) {
          // Reached the end
          stickyWrap.style.position = 'absolute';                    
        } else {
          // Scrolling inside the layout
          stickyWrap.style.position = 'fixed';          
          // console.log("fixed");
        }
      }
    });
  }
});




///////////////////////////////
/// PRESSE ARTCILES
///////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  document.fonts.ready.then(() => {
    const buttons = document.querySelectorAll('.presse_link_collection_item');
    const allArticles = document.querySelectorAll('.presse_article_collection_item');
    const splitMap = new Map(); // Store SplitText instances
    let currentArticle = null;
    

    // Step 1: Prepare all SplitText instances
    allArticles.forEach(article => {
      gsap.set(article, { autoAlpha: 0 })
      const paragraphWrap = article.querySelector('.quote_component_paragraph_wrap');
      const paragraphs = paragraphWrap ? paragraphWrap.querySelectorAll('p') : [];
      
      const allWords = [];
      const allSplits = [];

      paragraphs.forEach(p => {
        const split = new SplitText(p, {
          type: "words, lines",
          mask: "lines"
        });
        allWords.push(...split.words);
        allSplits.push(split); // In case you need to revert later
      });

      splitMap.set(article, {
        words: allWords,
        splits: allSplits
      });
    });


    // Step 1.5: Set to display none
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-article");
        const nextArticle = document.querySelector(`.presse_article_collection_item[data-article="${targetId}"]`);
    
        if (!nextArticle || nextArticle === currentArticle) return;
    
        const masterTl = gsap.timeline();
    
        // Hide all articles first (ensures clean state)
        allArticles.forEach(article => {
          if (article !== nextArticle) {
            gsap.set(article, { autoAlpha: 0, display: "none" });
          }
        });
    
        if (currentArticle) {
          masterTl.add(animateArticleOut(currentArticle));
        }
    
        masterTl.add(animateArticleIn(nextArticle));
    
        currentArticle = nextArticle;
    
        // Manage current class
        buttons.forEach(btn => btn.classList.remove('current'));
        button.classList.add('current');
        
        ScrollTrigger.refresh();
        console.log("refresh");
      });
    });
    

    // Step 2: Animate in
    function animateArticleIn(article) {
      const tl = gsap.timeline();
      const mask = article.querySelector('.quote_component_line_bar_mask');
      const paragraphWrap = article.querySelector('.quote_component_paragraph_wrap');
      const { words } = splitMap.get(article);

      if (mask && words.length) {
        tl.set(article, { autoAlpha: 1, display : "block" })
          .set(paragraphWrap, { opacity: 1 })
          .fromTo(mask, { height: 0 }, { height: "100%", duration: 0.6 })
          .fromTo(words, {
            y: "2em",
          }, {
            y: 0,
            duration: 0.6,
            stagger: 0.01,
          }, '<');
      }

      return tl;
      
    }

    // Step 3: Animate out
    function animateArticleOut(article) {
      const tl = gsap.timeline();
      const mask = article.querySelector('.quote_component_line_bar_mask');
      const textWrap = article.querySelector('.quote_component_paragraph_wrap');

      if (mask && textWrap) {
        tl.to(mask, {
          height: 0,
          duration: 0.4,
        }).to(textWrap, {
          opacity: 0,
          duration: 0.4,
        }, "<")
        .set(article, { autoAlpha: 0, display: "none" })        
        ;
      }

      return tl;
    }

      // Step 4: On load, show the first article
      const firstBtn = buttons[0];
      const firstArticleId = firstBtn?.getAttribute("data-article");
      const firstArticle = document.querySelector(`.presse_article_collection_item[data-article="${firstArticleId}"]`);

      if (firstArticle) {
        currentArticle = firstArticle;
        animateArticleIn(firstArticle);
        firstBtn.classList.add('current'); // Add 'current' class to first button
      }

      // Step 5: On button click, switch articles
      buttons.forEach(button => {
        button.addEventListener("click", () => {
          const targetId = button.getAttribute("data-article");
          const nextArticle = document.querySelector(`.presse_article_collection_item[data-article="${targetId}"]`);

          if (!nextArticle || nextArticle === currentArticle) return;

          const masterTl = gsap.timeline();

          if (currentArticle) {
            masterTl.add(animateArticleOut(currentArticle));
          }

          masterTl.add(animateArticleIn(nextArticle));

          currentArticle = nextArticle;

          // Manage current class
          buttons.forEach(btn => btn.classList.remove('current'));
          button.classList.add('current');
          
          ScrollTrigger.refresh();
          console.log("refresh");
        });
      });

      // Step 6: Draggable on mobile
      initializeDraggableForElements(".presse_link_list_wrap", ".presse_link_collection_list", ".presse_link_collection_item", 0, 991); // Draggable active between 0 and Infinity
  });
});


// document.addEventListener("DOMContentLoaded", () => {
//   const wrap = document.querySelector(".presse_link_list_wrap");
//   const section = document.querySelector(".presse_section");

//   if (!wrap || !section) return;

//   // Only apply below 991px
//   if (window.innerWidth < 991) {
//     console.log("hey");
//     ScrollTrigger.create({
//       trigger: section,
//       start: "top top",
//       markers: true,
//       end: `50% bottom`,
//       onUpdate: (self) => {
//         if (self.progress >= 1) {
//           wrap.style.position = "absolute";
//           console.log("absolute");          
//         } else {
//           wrap.style.position = "fixed";
//           console.log("fixed");
//           // wrap.style.top = "0";
//         }
//       },
//       invalidateOnRefresh: true,
//       scrub: true,
//     });
//   }
// });



  ///////////////////////////////
  // CARD ANIMATION
  ///////////////////////////////


  ///////////////////////////////
// 1. Hover animation on .card_item_wrap
///////////////////////////////
function setupCardAnimation(el) {
  // ❌ Skip if viewport is less than or equal to 991px
  if (window.innerWidth <= 991) return;

  if (el.dataset.animated === "true") return;
  el.dataset.animated = "true";

  const img = el.querySelector("img");
  const title = el.querySelector(".card_title_wrap p");
  if (!img || !title) return;

  document.fonts.ready.then(() => {
    const split = new SplitText(title, {
      type: "lines",
      linesClass: "line"
    });

    split.lines.forEach((line) => {
      const underline = document.createElement("span");
      underline.classList.add("underline");
      line.appendChild(underline);
    });

    const underlines = el.querySelectorAll(".card_title_wrap .underline");

    const tlCardItem = gsap.timeline({ paused: true });

    tlCardItem
      .to(img, {
        scale: 1.05,
        duration: 0.6,
        ease: "power3.out"
      })
      .to(underlines, {
        width: "100%",
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.05
      }, "<");

    el.addEventListener("mouseenter", () => tlCardItem.play());
    el.addEventListener("mouseleave", () => tlCardItem.reverse());
  });
}

function initCardHoverAnimations(scope = document) {
  scope.querySelectorAll('.card_item_wrap:not([data-type="Image"])').forEach(setupCardAnimation);
}


///////////////////////////////
// 2. Isotope setup with custom data attributes
///////////////////////////////

let iso;

function initIsotopeLayout() {
  const grid = document.querySelector('[data-isotope-role="grid"]');
  const oldBtn = document.querySelector('[ms-code-submit-old="load-more"]');
  const newBtn = document.querySelector('[ms-code-submit-new="load-more"]');

  if (!grid) return;

  iso = new Isotope(grid, {
    itemSelector: '[data-isotope-role="item"]',
    layoutMode: 'masonry',
    percentPosition: true,
    stagger: 0,
    transitionDuration: 80,
    masonry: {
      columnWidth: '[data-isotope-role="item"]',
      // horizontalOrder: true,
      gutter: 56
    }
  });

  imagesLoaded(grid).on('progress', () => {
    iso.layout();
    ScrollTrigger.refresh(); // ✅ Refresh after image load
  });

  // Filtering by data-category
  const filterButtons = document.querySelectorAll(".cuisine_filter_item");

  if (filterButtons.length) {
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");

        filterButtons.forEach(btn => btn.classList.remove("is-active"));
        button.classList.add("is-active");

        iso.arrange({
          filter: (itemElem) => {
            if (category === "tous") return true;
            return itemElem.getAttribute("data-category") === category;
          }
        });

        ScrollTrigger.refresh(); // ✅ Refresh after filter changes
      });
    });
  }

  const defaultFilter = document.querySelector('.cuisine_filter_item[data-category="tous"]');
  if (defaultFilter) defaultFilter.click();

  // Observe new items
  const itemObserver = new MutationObserver((mutationsList) => {
    let itemsToAppend = [];

    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches('[data-isotope-role="item"]')) {
          itemsToAppend.push(node);
        }
      });
    });

    if (itemsToAppend.length) {
      Promise.all([
        document.fonts.ready,
        new Promise(resolve => imagesLoaded(itemsToAppend, resolve))
      ]).then(() => {
        requestAnimationFrame(() => {
          itemsToAppend.forEach(node => {
            const card = node.querySelector(".card_item_wrap");
            if (card) setupCardAnimation(card);
          });

          itemsToAppend.forEach(item => item.offsetHeight); // force reflow

          setTimeout(() => {
            iso.appended(itemsToAppend);
            iso.layout();
            ScrollTrigger.refresh(); // ✅ Refresh after dynamic appending
          }, 0);
        });
      });
    }
  });

  itemObserver.observe(grid, {
    childList: true,
    subtree: false
  });

  if (newBtn) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        newBtn.style.display = 'block';
      }, 100);
    });
  }

  if (oldBtn && newBtn) {
    const buttonObserver = new MutationObserver(() => {
      if (window.getComputedStyle(oldBtn).display === 'none') {
        newBtn.style.display = 'none';
      }
    });

    buttonObserver.observe(oldBtn, {
      attributes: true,
      attributeFilter: ['style']
    });
  }
}


///////////////////////////////
// 3. Run either or both when needed
///////////////////////////////
window.addEventListener("load", () => {
  if (window.innerWidth > 991) {
    initCardHoverAnimations();
  }
  initIsotopeLayout(); // This runs regardless of screen size
});

  



///////////////////////////////
/// SCROLL TRIGGER FOR QUOTE COMPONENT TEMPLATE
///////////////////////////////

// const quoteComponentWrap = document.querySelectorAll(".quote_component_template");

// // FOR EACH ODD ETAPE WRAPPER
// quoteComponentWrap.forEach(function (el) {
//     let lineMask = el.querySelector(".quote_component_line_bar_mask");
//     let tlComponentWrap = gsap.timeline({ paused: true });
  
//     tlComponentWrap
//       .from(lineMask, {
//         height: 0,
//         })      
//         ;
  
//     ScrollTrigger.create({
//       trigger: el, // Element that triggers the animation
//       // toggleActions: "play complete play reverse",
//       start: "top 66%", // When to start the animation
//       // end: 'bottom center', // When to end the animation
//       // markers: true,
//       animation: tlComponentWrap, // Animation to play
//       // scrub: true, // Smooth scrolling effect
//     });
//   });


///////////////////////////////
/// MOTION PATH
///////////////////////////////


document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const layouts = document.querySelectorAll(".article_curved_text_wrap");

  layouts.forEach((layout) => {
    const textPaths = layout.querySelectorAll(".curveText");

    textPaths.forEach((textPath) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: layout,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          // markers: true
        }
      });
    
      tl.to(textPath, {
        attr: { startOffset: "0%" },
        ease: "none"
      });
    });


  });
});

///////////////////////////////
/// LINK FOR BIBLIOTHEQUE
///////////////////////////////

// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.bibliotheque_item_wrap').forEach(item => {
//     const sectionName = item.getAttribute('data-link-value');
//     const link = item.querySelector('a.g_clickable_link');
  
//     if (link && sectionName) {
//       const currentHref = link.getAttribute('href') || '';
//       // Avoid double-appending the hash
//       if (!currentHref.includes(`#${sectionName}`)) {
//         link.setAttribute('href', `${currentHref}#${sectionName}`);
//       }
//     }
//   });
//   document.querySelectorAll('.card_item_wrap').forEach(item => {
//     const sectionName = item.getAttribute('data-link-value');
//     const link = item.querySelector('a.g_clickable_link');
  
//     if (link && sectionName) {
//       const currentHref = link.getAttribute('href') || '';
//       // Avoid double-appending the hash
//       if (!currentHref.includes(`#${sectionName}`)) {
//         link.setAttribute('href', `${currentHref}#${sectionName}`);
//       }
//     }
//   });
  
// });


// ① Force eager loading on images inside rich text
document.addEventListener('DOMContentLoaded', () => {
  const richTextImages = document.querySelectorAll('.template_article_wrap .u-rich-text img[loading="lazy"]');
  richTextImages.forEach(img => {
    img.setAttribute('loading', 'eager');
  });
});

// ② Update href of links when clicked
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded');

  document.querySelectorAll('.bibliotheque_item_wrap').forEach(item => {
    console.log('🔍 Traitement d’un .bibliotheque_item_wrap');

    const sectionName = item.getAttribute('data-link-value');
    const link = item.querySelector('a.g_clickable_link');

    console.log('👉 sectionName :', sectionName);
    console.log('👉 link trouvé :', link);

    if (link && sectionName) {
      link.addEventListener('click', () => {
        const currentHref = link.getAttribute('href') || '';
        console.log('🖱️ Lien cliqué');
        console.log('➡️ href actuel :', currentHref);

        if (!currentHref.includes(`#${sectionName}`)) {
          const newHref = `${currentHref}#${sectionName}`;
          link.setAttribute('href', newHref);
          console.log('🔁 href mis à jour vers :', newHref);
        } else {
          console.log('✅ href contient déjà la section, pas de changement.');
        }
      });
    } else {
      console.warn('⛔ Données manquantes : link ou sectionName', { item });
    }
  });
});



function initClientCardRedirects() {
  document.querySelectorAll('.card_item_wrap[data-replace-href="true"]').forEach(item => {
    if (item.getAttribute('data-init') === 'true') return;

    const clientName = item.getAttribute('data-link-client');
    const sectionName = item.getAttribute('data-link-value');
    const links = item.querySelectorAll('a.g_clickable_link');

    if (!clientName || !sectionName || links.length === 0) {
      console.warn('⛔ Données manquantes pour cet item :', item);
      return;
    }

    const newHref = `/clients/${clientName}#${sectionName}`;

    links.forEach(link => {
      link.setAttribute('href', newHref);
      console.log(`✅ href mis à jour pour un lien : ${newHref}`);
    });

    item.setAttribute('data-init', 'true');
  });
}

document.addEventListener('DOMContentLoaded', initClientCardRedirects);



// document.addEventListener('DOMContentLoaded', initClientCardRedirects);

// function initClientCardRedirects() {
//   document.querySelectorAll('.card_item_wrap[data-replace-href="true"]').forEach(item => {
//     // Évite de doubler les listeners
//     if (item.getAttribute('data-init') === 'true') return;

//     const clientName = item.getAttribute('data-link-client');
//     const sectionName = item.getAttribute('data-link-value');
//     const link = item.querySelector('a.g_clickable_link');

//     if (!clientName || !sectionName || !link) {
//       console.warn('⛔ Données manquantes pour cet item :', item);
//       return;
//     }

//     const newHref = `/clients/${clientName}#${sectionName}`;
//     link.setAttribute('href', newHref); // 🧠 Met à jour le lien pour les clics natifs

//     item.addEventListener('click', (e) => {
//       // Ignore Ctrl / Cmd / molette / clic droit
//       if (e.ctrlKey || e.metaKey || e.button !== 0) return;

//       e.preventDefault(); // Bloque le clic gauche simple
//       console.log(`✅ Redirecting to: ${newHref}`);
//       window.location.href = newHref;
//     });

//     item.setAttribute('data-init', 'true');
//   });
// }



// Au chargement initial
// document.addEventListener('DOMContentLoaded', initClientCardRedirects);
















///////////////////////////////
/// SALON LOGO ANIMATION
///////////////////////////////

// function setupSalonLogoAnimation(el) {
//   const textWrap = el.querySelector(".salon_commande_text_wrap");
//   const spacer = el.querySelector(".salon_logo_img_spacer");
//   const img = el.querySelector(".salon_logo_img");

//   if (!textWrap || !img || el.dataset.animated === "true") return;
//   el.dataset.animated = "true";

//   // 🧠 Force GPU compositing layer
//   textWrap.style.willChange = "transform, opacity";
//   spacer.style.willChange = "height";
//   img.style.willChange = "width";
//   textWrap.style.transform = "translateZ(0)";
//   img.style.transform = "translateZ(0)";
//   spacer.style.transform = "translateZ(0)";

//   // 🧘‍♂️ Wait for browser to fully render the element
//   requestAnimationFrame(() => {
//     const tl = gsap.timeline({
//       paused: true,
//       scrollTrigger: {
//         trigger: el,
//         start: "top 66%",
//         once: true,
//         // markers: true,
//         onEnter: () => tl.play()
//       }
//     });

//     tl.to(textWrap, {
//       y: "100%",
//       opacity: 0.99, // ✨ trick to force Safari to repaint
//       duration: .66,
//       ease: "power2.inOut",
//     })
//       .to(spacer, {
//         height: "0%",
//         duration: .66,
//         ease: "power2.inOut",
//       }, "<")
//       .to(img, {
//         width: "75%",
//         maxHeight: "7rem",
//         duration: .66,
//         ease: "power2.inOut",
//       }, "<");

//     const isMobile = window.innerWidth < 991;

//     if (isMobile) {
//       let reversed = false;

//       el.addEventListener("click", () => {
//         reversed ? tl.play() : tl.reverse();
//         reversed = !reversed;
//       });
//     } else {
//       el.addEventListener("mouseenter", () => tl.reverse());
//       el.addEventListener("mouseleave", () => tl.play());
//     }
//   });
// }

// function initSalonLogoAnimations(scope = document) {
//   scope.querySelectorAll('.salon_logo_wrap').forEach(setupSalonLogoAnimation);
// }

// // 🕰 Optional slight delay to allow layout to settle on Safari
// window.addEventListener("load", () => {
//   setTimeout(() => {
//     initSalonLogoAnimations();
//   }, 100);
// });

function setupSalonLogoAnimation(el) {
  /* ─────────── Sélecteurs ─────────── */
  const textWrap = el.querySelector(".salon_commande_text_wrap");
  const spacer   = el.querySelector(".salon_logo_img_spacer");
  const img      = el.querySelector(".salon_logo_img");
  if (!textWrap || !img || el.dataset.animated === "true") return;
  el.dataset.animated = "true";

  /* ─────────── Hint GPU ─────────── */
  [textWrap, spacer, img].forEach(n => {
    n.style.willChange = "transform, opacity, height, width";
    n.style.transform  = "translateZ(0)";
  });

  /* ─────────── 1. Timeline (commune) ─────────── */
  const tl = gsap.timeline({ paused: true });

  tl.to(textWrap, { y: "100%", opacity: 0.99, duration: .66, ease: "power2.inOut" })
    .to(spacer  , { height: "0%",  duration: .66, ease: "power2.inOut" }, "<")
    .to(img     , { width: "75%", maxHeight: "7rem", duration: .66, ease: "power2.inOut" }, "<");

  /* ─────────── 2. Breakpoint ─────────── */
  const isMobile = window.matchMedia("(max-width: 990px)").matches;

  /*  ➜ état initial :
        – desktop : fermé (tl à 0)
        – mobile  : ouvert (tl à 1)                                  */
  if (isMobile) tl.progress(1).pause();

  /*  ➜ ScrollTrigger : même instance, callbacks différents          */
  ScrollTrigger.create({
    trigger: el,
    start  : "top 66%",
    once   : true,
    onEnter: () => (isMobile ? tl.reverse() : tl.play())
    // markers: true
  });

  /*  ➜ interactions                                                  */
  if (isMobile) {
    // toggle inversé : on clique pour fermer, puis rouvrir, etc.
    el.addEventListener("click", () => tl.reversed() ? tl.play() : tl.reverse());
  } else {
    // comportement classique desktop
    el.addEventListener("mouseenter", () => tl.reverse());
    el.addEventListener("mouseleave", () => tl.play());
  }
}

/* ─────────── 3. Init ─────────── */
function initSalonLogoAnimations(scope = document) {
  scope.querySelectorAll(".salon_logo_wrap").forEach(setupSalonLogoAnimation);
}

window.addEventListener("load", () => {
  setTimeout(initSalonLogoAnimations, 100); // petit délai Safari
});



///////////////////////////////
/// HOMEPAGE DÉCOUVRIR EXPÉRIENCE
///////////////////////////////



const wrappers = document.querySelectorAll('.decouvrir_experience_row_collection_list_wrapper');


wrappers.forEach((wrapper, index) => {
  const list = wrapper.querySelector('.decouvrir_experience_row_collection_list');

  if (!list) {
    return;
  }

  const listHeight = list.offsetHeight;
  const wrapperHeight = wrapper.offsetHeight;
  const offset = -listHeight + wrapperHeight;
  // const offset = -listHeight;

  console.log("listHeight :", listHeight);
  console.log("wrapperHeight :", wrapperHeight);
  console.log("offset :", offset);



  const animationConfig = {
    y: offset,
    ease: 'none',
    scrollTrigger: {
      trigger: '.nos_clients_decouvrir_experience',
      start: 'top bottom',
      end: 'top top',
      scrub: .3,
      // markers: true,
    }
  };

  if (index % 2 === 0) {    
    gsap.from(list, animationConfig);
  } else {    
    gsap.to(list, animationConfig);
  }
});



///////////////////////////////
/// EQUIPE
///////////////////////////////


document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector('.equipe_collection_list');
  if (!list) return;

  const items = Array.from(list.children);
  const clones = items.map(item => item.cloneNode(true));

  clones.forEach(clone => {
    list.appendChild(clone);
  });
});



///////////////////////////////
/// GALLERY
//////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');

  const wrappers = document.querySelectorAll('.page_client_collection_item');

  console.log(`Found ${wrappers.length} wrappers`);

  wrappers.forEach((wrapper, index) => {
    console.log(`Processing wrapper #${index + 1}`, wrapper);

    const original = wrapper.querySelector('.article_gallery_wrap[data-replace="original"]');
    const destination = wrapper.querySelector('.article_gallery_wrap[data-replace="destination"]');

    console.log(`Wrapper #${index + 1} original:`, original);
    console.log(`Wrapper #${index + 1} destination:`, destination);

    if (original && destination) {
      const clone = original.cloneNode(true);
      clone.style.visibility = 'visible';

      console.log(`Wrapper #${index + 1}: replacing destination with clone and removing original`);
      destination.replaceWith(clone);
      original.remove();
    } else {
      console.log(`Wrapper #${index + 1}: original or destination not found.`);
    }
  });
});



///////////////////////////////
/// INIT GALLERY
//////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  const AUTO_PLAY_DELAY = 3000;            // ⏱ change ici la durée (ms) entre slides
  const SLIDE_SPEED     = 1;               // secondes pour l’animation GSAP
  const EASE            = 'power2.inOut';  // easing de l’animation

  const galleries = document.querySelectorAll('.article_gallery_wrap');

  galleries.forEach(initGallery);

  function initGallery(gallery) {
    const list       = gallery.querySelector('.article_gallery_collection_list');
    const items      = list?.querySelectorAll('.article_gallery_collection_item') || [];
    const arrowWrap  = gallery.querySelector('.article_gallery_arrow_list_wrap');
    const prevBtn    = arrowWrap?.children[0];
    const nextBtn    = arrowWrap?.children[1];

    if (!list || items.length < 2) return; // pas besoin d’un slider

    let index = 0;
    let auto  = startAutoplay();

    /**===============
     *  Helpers
     *===============*/
    function gotoSlide(i) {
      index = (i + items.length) % items.length;              // wrap négatif ou > last
      gsap.to(list, {
        xPercent: -100 * index,
        duration: SLIDE_SPEED,
        ease: EASE,
      });
    }

    function startAutoplay()   { return setInterval(() => gotoSlide(index + 1), AUTO_PLAY_DELAY); }
    function stopAutoplay()    { clearInterval(auto); }
    function restartAutoplay() { stopAutoplay(); auto = startAutoplay(); }

    /**===============
     *  Events
     *===============*/
    nextBtn?.addEventListener('click', () => { gotoSlide(index + 1); restartAutoplay(); });
    prevBtn?.addEventListener('click', () => { gotoSlide(index - 1); restartAutoplay(); });

    // (Facultatif) Pause l’autoplay quand la souris survole la galerie
    gallery.addEventListener('mouseenter', stopAutoplay);
    gallery.addEventListener('mouseleave', restartAutoplay);
  }
});







///////////////////////////////
/// MANIFESTE TOGGLE CLASSES
//////////////////////////////


  ScrollTrigger.create({
    trigger: ".manifeste_layout",
    start: "bottom bottom", // when the top of .manifeste_layout hits the bottom of the viewport
    end: "bottom top",   // until the bottom of .manifeste_layout hits the top of the viewport
    // markers: true,
    toggleClass: {
      targets: ".bottom-nav",
      className: "bottom"
    },
    // optional:
    // markers: true
  });


  // ScrollTrigger.create({
  //   trigger: ".manifeste_layout",
  //   start: "bottom bottom", // when the top of .manifeste_layout hits the bottom of the viewport
  //   end: "bottom top",   // until the bottom of .manifeste_layout hits the top of the viewport
  //   // markers: true,
  //   toggleClass: {
  //     targets: ".bottom-nav",
  //     className: "bottom"
  //   },
  //   // optional:
  //   // markers: true
  // });



///////////////////////////////
/// INIT TESTIMONIAL V2
///////////////////////////////

function initTestimonials() {
  const avisEcritBlocks = document.querySelectorAll('.avis_ecrit_wrap');

  document.fonts.ready.then(() => {
    avisEcritBlocks.forEach(wrap => {
      if (wrap.dataset.gsapInitialized === "true") return;
      wrap.dataset.gsapInitialized = "true";

      const textWrap = wrap.querySelector('.avis_ecrit_rich_text_wrap');
      const nom = wrap.querySelector('.avis_nom_p');
      const poste = wrap.querySelector('.avis_poste_p');
      if (!textWrap || !nom || !poste) return;

      const paragraphs = textWrap.querySelectorAll('p');
      const svgArray = [];
      const wordArray = [];

      paragraphs.forEach(paragraph => {
        let svgDiv = paragraph.querySelector('.vestibule_quote_svg_wrap');
        if (!svgDiv) {
          svgDiv = document.createElement('div');
          svgDiv.classList.add('vestibule_quote_svg_wrap');
          svgDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 30 22" fill="none" vector-effect="non-scaling-stroke" class="g_svg"><path d="M16.2998 21.5C15.9973 21.5 15.7115 21.3765 15.5264 21.1025C15.3649 20.8635 15.3203 20.568 15.3203 20.291L15.3203 20.2734L15.3223 20.2559L15.8291 13.0479L15.8301 13.0342L15.832 13.0205C15.8891 12.5619 15.9468 12.176 16.0059 11.8662C16.043 11.5805 16.0895 11.3103 16.1445 11.0557L16.1436 11.0547C16.1833 10.8045 16.2433 10.5554 16.3203 10.3076L16.4229 9.9082C16.4616 9.76594 16.5049 9.61451 16.5527 9.4541L16.5605 9.43066L16.5693 9.40723C16.6949 9.10019 16.896 8.71304 17.1631 8.25293L17.168 8.24414C17.4348 7.80454 17.7393 7.32673 18.0801 6.81055C18.4213 6.29385 18.7816 5.76723 19.1602 5.23144C19.5151 4.72219 19.8507 4.23233 20.168 3.76269L20.1738 3.75488C20.4942 3.30043 20.7773 2.90395 21.0234 2.56641C21.2691 2.22957 21.4192 2.01559 21.4844 1.91309L21.4922 1.90234L21.5 1.89062C21.5531 1.8164 21.6257 1.71172 21.7188 1.57519L21.7197 1.57617C21.8062 1.44157 21.9082 1.30081 22.0264 1.15625L22.0391 1.1416L22.0518 1.12793C22.1177 1.05881 22.1865 0.992013 22.2578 0.92871L22.4805 0.74707C22.6765 0.600288 22.9109 0.5 23.1748 0.5C23.373 0.500023 23.5568 0.56163 23.7168 0.645507L23.7246 0.65039L23.7324 0.654296C23.9263 0.765174 24.0579 0.822382 24.1357 0.845703L24.1816 0.859375L24.2236 0.881836C24.3363 0.940922 24.506 1.03027 24.7314 1.14844L24.7393 1.15234L24.7471 1.15723C24.9413 1.2683 25.2505 1.43075 25.6807 1.64648L25.6934 1.65234L25.7051 1.65918C26.1205 1.89678 26.733 2.25177 27.541 2.72461L27.541 2.72559C27.8516 2.89914 28.1127 3.07171 28.3027 3.24609C28.4523 3.38332 28.6369 3.59182 28.6807 3.86328L28.6904 3.9834L28.6758 4.125C28.6491 4.26157 28.589 4.38152 28.5391 4.46875L28.5352 4.47559L28.5313 4.48145C27.9873 5.36638 27.4244 6.291 26.8428 7.25488L26.8418 7.25781L26.3994 7.99219C26.1047 8.48912 25.8185 8.98933 25.5381 9.49121L27.0977 9.51074L27.5986 9.51074C27.7351 9.51075 27.8626 9.51318 27.9805 9.51855L28.3047 9.54297L28.332 9.54687L28.3604 9.55273C28.5017 9.58573 28.6669 9.6527 28.7988 9.79102C28.9409 9.94018 29 10.1259 29 10.3057L29 10.3867L28.998 10.4092C28.923 11.2554 28.8665 11.9134 28.8291 12.3838L28.8291 12.3926L28.8281 12.4014C28.772 12.8915 28.7348 13.2573 28.7168 13.5029C28.6981 13.777 28.6904 13.9583 28.6904 14.0576L28.6904 14.0967L28.6836 14.1357C28.6681 14.2333 28.6621 14.3155 28.6621 14.3828L28.6621 14.4297L28.6533 14.4766L28.6396 14.585C28.6362 14.6281 28.6338 14.6788 28.6338 14.7373L28.6338 14.7705L28.6289 14.8047C28.6131 14.9208 28.5949 15.1392 28.5762 15.4736L28.4922 16.8379L28.4912 16.8447L28.4902 16.8525C28.4343 17.4393 28.369 18.2141 28.2939 19.1777C28.2564 19.822 28.1989 20.3235 28.1064 20.6387L28.1016 20.6543L28.0957 20.6699C27.9195 21.1501 27.5061 21.3828 27.0361 21.4375L27.0078 21.4404L24.3408 21.4404C23.4205 21.4601 22.5092 21.4696 21.6074 21.4697L21.6074 21.4707C20.6836 21.4905 19.7781 21.5 18.8916 21.5L16.2998 21.5ZM1.47852 21.5C1.1762 21.4999 0.890096 21.3764 0.705078 21.1025C0.543708 20.8635 0.500003 20.5679 0.5 20.291L0.5 20.2734L0.500977 20.2559L1.00879 13.0478L1.01074 13.0205C1.0678 12.5619 1.12645 12.176 1.18555 11.8662C1.22266 11.5805 1.26915 11.3104 1.32422 11.0557L1.32324 11.0547C1.36302 10.8044 1.42296 10.5555 1.5 10.3076L1.60254 9.9082C1.64131 9.76593 1.68461 9.61451 1.73242 9.4541L1.73926 9.43066L1.74902 9.40722C1.87457 9.10017 2.07566 8.71305 2.34277 8.25293L2.34766 8.24414C2.48108 8.02432 2.62343 7.79466 2.77539 7.55566L3.25977 6.81054C3.60092 6.29388 3.96037 5.76719 4.33887 5.23144C4.69386 4.72209 5.03033 4.23241 5.34766 3.76269L5.35352 3.75488C5.67389 3.30043 5.95694 2.90394 6.20313 2.5664C6.44876 2.22962 6.59889 2.01558 6.66406 1.91308L6.67188 1.90234L6.67969 1.89062C6.73279 1.81639 6.80548 1.71164 6.89844 1.57519L6.89942 1.57617C6.9859 1.44156 7.08788 1.30081 7.20606 1.15625L7.21778 1.1416L7.23145 1.12793C7.29743 1.05874 7.36608 0.992069 7.4375 0.928709L7.66016 0.747068C7.85605 0.600476 8.08987 0.50012 8.35352 0.499998C8.55185 0.499998 8.7364 0.561586 8.89649 0.645506L8.9043 0.650389L8.91211 0.654295C9.10582 0.765076 9.23658 0.822342 9.31445 0.845701L9.36035 0.859373L9.40332 0.881834C9.45964 0.911359 9.5298 0.948884 9.61426 0.993162C9.69878 1.03747 9.79747 1.08936 9.91016 1.14844L9.91895 1.15234L9.92676 1.15722C10.121 1.26831 10.4303 1.43081 10.8604 1.64648L10.873 1.65234L10.8848 1.65918C11.3002 1.89679 11.9128 2.25184 12.7207 2.72461L12.7207 2.72558C13.0312 2.89908 13.2924 3.07176 13.4824 3.24609C13.6319 3.3833 13.8156 3.59199 13.8594 3.86328L13.8691 3.9834L13.8555 4.125C13.8287 4.2616 13.7687 4.3815 13.7188 4.46875L13.7148 4.47558L13.7109 4.48144C13.167 5.36633 12.604 6.29106 12.0225 7.25488L12.0215 7.25781L11.5791 7.99219C11.2843 8.48926 10.9973 8.98918 10.7168 9.49121L12.2764 9.51074L12.7773 9.51074C13.0504 9.51074 13.2878 9.52019 13.4834 9.54297L13.5117 9.54687L13.5391 9.55273C13.6805 9.5857 13.8455 9.65256 13.9775 9.79101C14.1198 9.94023 14.1797 10.1258 14.1797 10.3057L14.1797 10.3867L14.1777 10.4092C14.1027 11.2555 14.0462 11.9134 14.0088 12.3838L14.0068 12.4014C13.9507 12.8915 13.9145 13.2573 13.8965 13.5029C13.8778 13.777 13.8691 13.9583 13.8691 14.0576L13.8691 14.0967L13.8633 14.1357C13.8478 14.2333 13.8408 14.3155 13.8408 14.3828L13.8408 14.4297L13.832 14.4766C13.8209 14.5351 13.8135 14.6203 13.8135 14.7373L13.8135 14.7705L13.8086 14.8047C13.7928 14.9208 13.7746 15.1392 13.7559 15.4736L13.6709 16.8379L13.6709 16.8447L13.6699 16.8525C13.6419 17.146 13.6119 17.4864 13.5791 17.874L13.4736 19.1777C13.4361 19.822 13.3777 20.3235 13.2852 20.6387L13.2813 20.6543L13.2754 20.6699C13.0992 21.1501 12.6857 21.3827 12.2158 21.4375L12.1865 21.4404L9.51953 21.4404C8.59948 21.4601 7.68868 21.4696 6.78711 21.4697L6.78711 21.4707C5.8633 21.4905 4.95783 21.5 4.07129 21.5L1.47852 21.5Z" stroke="currentColor"></path></svg>`;
          paragraph.insertBefore(svgDiv, paragraph.firstChild);
        }

        svgArray.push(svgDiv);

        const split = new SplitText(paragraph, {
          type: "lines, words",
        });
        wordArray.push(...split.words);
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      });

      tl.set(svgArray, { scale: 0, autoAlpha: 0 })
        .set(nom, { autoAlpha: 0 })
        .set(poste, { autoAlpha: 0 })
        .to(svgArray, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.1
        })
        .from(wordArray, {
          yPercent: 100,
          autoAlpha: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.01
        }, "<+=0.2")
        .to(nom, {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out"
        }, ">")
        .to(poste, {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "<0.2");

      ScrollTrigger.refresh();
    });
  });
}

// INIT: wait for fonts to load then execute everything
document.addEventListener("DOMContentLoaded", () => {
  initTestimonials();

  // gsap.set('[data-prevent-flicker="true"]', {
  //   visibility: "visible"
  // });

  const container = document.querySelector('.vestibule_collection_list');
  if (container) {
    const observer = new MutationObserver(() => {
      gsap.set('.avis_ecrit_layout[data-prevent-flicker="true"]', {
        visibility: "visible"
      });
      initTestimonials();
    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });
  }

  const loadMoreBtn = document.querySelector('[ms-code-submit-new="load-more"]');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      setTimeout(() => {
        gsap.set('.avis_ecrit_layout[data-prevent-flicker="true"]', {
          visibility: "visible"
        });
        initTestimonials();
        initAvisVideos();
        reinitLotties();
        initClientCardRedirects();        

      }, 1000);
    });
  }

  const oldBtn = document.querySelector('[ms-code-submit-old="load-more"]');
  const newBtn = document.querySelector('[ms-code-submit-new="load-more"]');

  if (oldBtn && newBtn) {
    const checkVisibilityAndUpdate = () => {
      const oldDisplay = window.getComputedStyle(oldBtn).display;
      newBtn.style.display = oldDisplay === 'none' ? 'none' : '';
    };

    const buttonObserver = new MutationObserver(checkVisibilityAndUpdate);

    buttonObserver.observe(oldBtn, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    checkVisibilityAndUpdate();
  }
});
