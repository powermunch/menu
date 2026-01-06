document.addEventListener("DOMContentLoaded", () => {
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
        // Reset animations for slide-in effect
        const listItems = details.querySelectorAll(".ingredient-list li");
        listItems.forEach((li) => {
          li.style.animation = "";
        });
        requestAnimationFrame(() => details.classList.add("open"));
        button.setAttribute("aria-expanded", "true");
        button.textContent = "Hide ingredients";
        button.classList.add("active");
        triggerBallRain(rainLayer, colors, imageSrc);
      }
    });
  });

  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const sections = document.querySelectorAll("[data-section]");

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
    });
  });
});

function triggerBallRain(container, colors, imageSrc) {
  if (!container) return;
  console.debug("[PowerMunch] triggerBallRain()", {
    container,
    colorCount: colors?.length,
    imageSrc,
  });
  container.innerHTML = "";
  const ballCount = 24;

  for (let i = 0; i < ballCount; i++) {
    // Only image balls when an image is provided (e.g., choco-green)
    const useImage = Boolean(imageSrc);
    const ball = document.createElement(useImage ? "img" : "span");
    ball.className = useImage ? "ball ball-image" : "ball";

    const size = 48 + Math.random() * 24; // bigger for clearer visibility
    const left = Math.random() * 100;
    const delay = Math.random() * 0.35; // faster start cadence
    const duration = 1 + Math.random() * 0.6; // quicker drop with slight variation
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
    }

    container.appendChild(ball);
  }

  console.debug("[PowerMunch] Balls appended", container.children.length);

  container.classList.add("show");

  setTimeout(() => {
    container.classList.remove("show");
    setTimeout(() => {
      container.innerHTML = "";
    }, 600);
  }, 1800);
}
