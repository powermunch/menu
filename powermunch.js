// Disable browser scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Scroll to top IMMEDIATELY - before anything else
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Also scroll to top on page show (handles back/forward navigation)
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // Page was loaded from cache
    window.scrollTo(0, 0);
  }
});

// Scroll to top on load
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Handle hash navigation - prevent ALL hash scrolling on initial page load
  // Only allow #hero to scroll on initial load, remove all other hashes
  if (window.location.hash) {
    const hash = window.location.hash;
    
    // On initial page load, only allow #hero, remove all other hashes to prevent scrolling
    if (hash === "#hero") {
      // Allow #hero to scroll (it's at the top anyway)
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // Remove hash from URL to prevent any scrolling to non-hero anchors on initial load
      history.replaceState(null, null, window.location.pathname + window.location.search);
      // Ensure we stay at top
      window.scrollTo(0, 0);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Ensure page starts at top
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  const animatedBlocks = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedBlocks.forEach((block) => observer.observe(block));

  const productCards = document.querySelectorAll(".product-card");
  if (!productCards.length) {
    console.warn("[PowerMunch] No product cards found for ball rain.");
  }

  const ballAssets = {
    "choco-green": {
      colors: ["#1f6f78", "#3cb589", "#f4f7f5"],
      // image is provided via data-ball-image on the card
    },
    "golden-spice": {
      colors: ["#f5a623", "#fbd16d", "#fff4d8"],
    },
    "coconut-cloud": {
      colors: ["#a1d9d9", "#f8f0e3", "#ffffff"],
    },
    "muddy-buddy": {
      colors: ["#623b2a", "#ba8761", "#f4d5b5"],
    },
    "power-snickers": {
      colors: ["#8B4513", "#D2691E", "#F4A460"],
    },
    "midnight-brownies": {
      colors: ["#3D2817", "#5C4033", "#8B7355"],
    },
    "mocha-mood": {
      colors: ["#6B4423", "#8B6F47", "#A0826D"],
    },
    "pb-choco-date": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
    "cashew-crush": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
    "tropical-bliss": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
    "choco-strawberry": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
    "pineapple-crunch": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
    "dark-sun": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
    "kiwi-spark": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
    "date-munch": {
      colors: ["#c72a29", "#ff4444", "#fee887"],
    },
  };

  productCards.forEach((card) => {
    const button = card.querySelector(".product-button");
    const details = card.querySelector(".product-details");
    const rainLayer = card.querySelector(".ball-rain");
    const asset = ballAssets[card.dataset.flavor] || {};
    const colors = asset.colors || ["#2590cf", "#fee887", "#ffffff"];
    const imageSrc =
      card.getAttribute("data-ball-image") || asset.image || null;

    if (!button || !details) return;

    console.debug("[PowerMunch] Binding rain toggle for", card.dataset.flavor);

    button.addEventListener("click", () => {
      const isOpen = !details.hasAttribute("hidden");
      console.debug("[PowerMunch] Toggle ingredients", {
        flavor: card.dataset.flavor,
        isOpen,
        haveImage: Boolean(imageSrc),
      });

      if (isOpen) {
        details.classList.remove("open");
        details.classList.add("closing");
        button.setAttribute("aria-expanded", "false");
        button.textContent = "See ingredients";
        button.classList.remove("active");

        const handleTransitionEnd = (event) => {
          if (event.target !== details || event.propertyName !== "max-height") {
            return;
          }
          details.removeEventListener("transitionend", handleTransitionEnd);
          details.classList.remove("closing");
          details.setAttribute("hidden", "");
          // Reset animation by removing inline styles
          const listItems = details.querySelectorAll(".ingredient-list li");
          listItems.forEach((li) => {
            li.style.animation = "none";
          });
        };

        details.addEventListener("transitionend", handleTransitionEnd);
      } else {
        details.removeAttribute("hidden");
        details.classList.remove("closing");
        // Immediately show the container, then animate items
        requestAnimationFrame(() => {
          details.classList.add("open");
          // Trigger ball rain after a brief delay to not interfere
          setTimeout(() => {
            triggerBallRain(rainLayer, colors, imageSrc);
          }, 50);
        });
        button.setAttribute("aria-expanded", "true");
        button.textContent = "Hide ingredients";
        button.classList.add("active");
      }
    });
  });

  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const sections = document.querySelectorAll("[data-section]");
  const sectionTitle = document.getElementById("section-title");
  const powerBitesTitle = document.getElementById("power-bites-title");

  const updateTitle = (activeTab) => {
    if (sectionTitle) {
      sectionTitle.textContent = activeTab === "energy-balls" ? "Energy Balls" : "Power Bites";
    }
    if (powerBitesTitle) {
      powerBitesTitle.textContent = "Power Bites";
    }
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      // Update active button
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Show/hide sections
      sections.forEach((section) => {
        if (section.dataset.section === targetTab) {
          section.style.display = "grid";
          // Trigger animation for newly visible section
          const heading = section.querySelector(".section-heading");
          if (heading) {
            heading.classList.add("animate");
          }
        } else {
          section.style.display = "none";
        }
      });

      updateTitle(targetTab);
    });
  });

  // Handle "Our Products" button click
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    ctaButton.addEventListener("click", (e) => {
      e.preventDefault();
      // Show energy balls section and activate that tab
      const energyBallsSection = document.querySelector('[data-section="energy-balls"]');
      const energyBallsTab = document.querySelector('[data-tab="energy-balls"]');
      
      if (energyBallsSection && energyBallsTab) {
        // Hide all sections first
        sections.forEach((section) => {
          section.style.display = "none";
        });
        
        // Show energy balls
        energyBallsSection.style.display = "grid";
        
        // Activate energy balls tab
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        energyBallsTab.classList.add("active");
        
        updateTitle("energy-balls");
        
        // Scroll to tabs
        const tabsElement = document.getElementById("product-tabs");
        if (tabsElement) {
          tabsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  }
});

function triggerBallRain(container, colors, imageSrc) {
  if (!container) return;
  
  // Use requestAnimationFrame to prevent blocking
  requestAnimationFrame(() => {
    console.debug("[PowerMunch] triggerBallRain()", {
      container,
      colorCount: colors?.length,
      imageSrc,
    });
    container.innerHTML = "";
    const ballCount = 20; // Reduced for better performance

    // Create balls in batches to prevent blocking
    const createBalls = (startIndex, endIndex) => {
      for (let i = startIndex; i < endIndex; i++) {
        const useImage = Boolean(imageSrc);
        const ball = document.createElement(useImage ? "img" : "span");
        ball.className = useImage ? "ball ball-image" : "ball";

        const size = 48 + Math.random() * 24;
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 1 + Math.random() * 0.5;
        const drift = (Math.random() - 0.5) * 50;
        const color =
          colors[Math.floor(Math.random() * colors.length)] || "#ffffff";

        ball.style.setProperty("--size", `${size}px`);
        ball.style.setProperty("--x", `${left}%`);
        ball.style.setProperty("--delay", `${delay}s`);
        ball.style.setProperty("--duration", `${duration}s`);
        ball.style.setProperty("--drift", `${drift}px`);
        ball.style.setProperty("--ball-color", color);
        ball.style.opacity = "0.95";

        if (useImage) {
          ball.src = imageSrc;
          ball.alt = "";
          ball.decoding = "async";
          ball.loading = "lazy";
        }

        container.appendChild(ball);
      }
    };

    // Create balls in smaller batches
    const batchSize = 5;
    let currentIndex = 0;
    
    const createNextBatch = () => {
      if (currentIndex < ballCount) {
        const endIndex = Math.min(currentIndex + batchSize, ballCount);
        createBalls(currentIndex, endIndex);
        currentIndex = endIndex;
        if (currentIndex < ballCount) {
          requestAnimationFrame(createNextBatch);
        } else {
          container.classList.add("show");
          setTimeout(() => {
            container.classList.remove("show");
            setTimeout(() => {
              container.innerHTML = "";
            }, 600);
          }, 1800);
        }
      }
    };
    
    createNextBatch();
  });
}
