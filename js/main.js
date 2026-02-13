(() => {
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const backToTop = document.getElementById("backToTop");

  const setScrollLock = (locked) => {
    document.body.classList.toggle("menu-open", locked);
  };

  const openMenu = () => {
    if (!mobileMenu || !mobileOverlay || !navToggle) return;
    mobileMenu.classList.add("open");
    mobileOverlay.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    setScrollLock(true);
  };

  const closeMenu = () => {
    if (!mobileMenu || !mobileOverlay || !navToggle) return;
    mobileMenu.classList.remove("open");
    mobileOverlay.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    setScrollLock(false);
  };

  if (navToggle && mobileMenu && mobileOverlay) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileOverlay.addEventListener("click", closeMenu);

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  const onScroll = () => {
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    if (backToTop) {
      if (window.scrollY > 600) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  };

  window.addEventListener("scroll", onScroll);
  window.addEventListener("pageshow", () => setScrollLock(false));
  onScroll();

  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("formSuccess");

  if (contactForm) {
    const fields = [
      { name: "name", label: "Navn", minLength: 2 },
      { name: "company", label: "Bedrift / borettslag", minLength: 2 },
      { name: "phone", label: "Telefon", minLength: 6 },
      { name: "email", label: "E-post", minLength: 3, type: "email" },
      { name: "message", label: "Hva trenger dere hjelp med?", minLength: 10 }
    ];


    const getErrorElement = (fieldName) =>
      contactForm.querySelector(`[data-error-for="${fieldName}"]`);

    const isValidEmail = (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validateField = (field) => {
      const input = contactForm.elements[field.name];
      const errorElement = getErrorElement(field.name);
      if (!input || !errorElement) return true;

      const value = input.value.trim();
      let error = "";

      if (!value) {
        error = `${field.label} må fylles ut.`;
      } else if (value.length < field.minLength) {
        error = `${field.label} må være minst ${field.minLength} tegn.`;
      } else if (field.type === "email" && !isValidEmail(value)) {
        error = "Skriv inn en gyldig e-postadresse.";
      }

      errorElement.textContent = error;
      return error === "";
    };

    fields.forEach((field) => {
      const input = contactForm.elements[field.name];
      if (!input) return;
      input.addEventListener("input", () => validateField(field));
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const allValid = fields.every((field) => validateField(field));

      if (!allValid) {
        if (successMessage) successMessage.textContent = "";
        return;
      }

      if (successMessage) {
        successMessage.textContent = "Sender...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          if (successMessage) {
            successMessage.textContent = "Takk! Meldingen er sendt.";
          }
          contactForm.reset();
        } else {
          if (successMessage) {
            successMessage.textContent =
              "Noe gikk galt. Prøv igjen eller kontakt oss direkte.";
          }
        }
      } catch (error) {
        if (successMessage) {
          successMessage.textContent =
            "Noe gikk galt. Prøv igjen eller kontakt oss direkte.";
        }
      }
    });
  }
})();
