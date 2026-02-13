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
      isOpen ? closeMenu() : openMenu();
    });

    mobileOverlay.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", onScroll);
  window.addEventListener("pageshow", () => setScrollLock(false));
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("#currentYear").forEach((el) => {
    el.textContent = new Date().getFullYear().toString();
  });

  const timelineItems = document.querySelectorAll('[data-animate="timeline-item"]');
  if (timelineItems.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    timelineItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 80}ms`;
      observer.observe(item);
    });
  } else {
    timelineItems.forEach((item) => item.classList.add("is-visible"));
  }

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^\+?[0-9\s()-]{6,}$/.test(value);

  const initAjaxForm = ({ formId, successId, submittingText, successText, fields }) => {
    const form = document.getElementById(formId);
    const successMessage = document.getElementById(successId);
    if (!form) return;

    const getErrorElement = (fieldName) => form.querySelector(`[data-error-for="${fieldName}"]`);

    const validateField = (field) => {
      const input = form.elements[field.name];
      const errorElement = getErrorElement(field.name);
      if (!input || !errorElement) return true;

      const isRadio = field.inputType === "radio";
      const rawValue = isRadio
        ? form.querySelector(`input[name="${field.name}"]:checked`)?.value || ""
        : input.value;
      const value = rawValue.trim();
      let error = "";

      if (!value && !field.optional) {
        error = `${field.label} må fylles ut.`;
      } else if (value && field.minLength && value.length < field.minLength) {
        error = `${field.label} må være minst ${field.minLength} tegn.`;
      } else if (field.type === "email" && value && !isValidEmail(value)) {
        error = "Skriv inn en gyldig e-postadresse.";
      } else if (field.type === "phone" && value && !isValidPhone(value)) {
        error = "Skriv inn et gyldig telefonnummer.";
      }

      errorElement.textContent = error;
      return error === "";
    };

    fields.forEach((field) => {
      const input = form.elements[field.name];
      if (!input) return;

      if (field.inputType === "radio" && typeof RadioNodeList !== "undefined" && input instanceof RadioNodeList) {
        Array.from(input).forEach((radio) => {
          radio.addEventListener("change", () => validateField(field));
        });
      } else {
        input.addEventListener("input", () => validateField(field));
        input.addEventListener("change", () => validateField(field));
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const isValid = fields.every((field) => validateField(field));
      if (!isValid) {
        if (successMessage) successMessage.textContent = "";
        return;
      }

      if (successMessage) successMessage.textContent = submittingText;

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Form submission failed");
        if (successMessage) successMessage.textContent = successText;
        form.reset();
      } catch (_error) {
        if (successMessage) successMessage.textContent = "Noe gikk galt. Prøv igjen.";
      }
    });
  };

  initAjaxForm({
    formId: "contactForm",
    successId: "formSuccess",
    submittingText: "Sender...",
    successText: "Takk! Meldingen er sendt.",
    fields: [
      { name: "name", label: "Navn", minLength: 2 },
      { name: "company", label: "Bedrift / borettslag", minLength: 2, optional: true },
      { name: "phone", label: "Telefon", minLength: 6, type: "phone" },
      { name: "email", label: "E-post", minLength: 3, type: "email" },
      { name: "message", label: "Hva trenger dere hjelp med?", minLength: 10 }
    ]
  });


  initAjaxForm({
    formId: "privateApplicationForm",
    successId: "privateApplicationSuccess",
    submittingText: "Sender...",
    successText: "Takk, vi har mottatt søknaden",
    fields: [
      { name: "name", label: "Navn", minLength: 2 },
      { name: "phone", label: "Telefon", minLength: 6, type: "phone" },
      { name: "email", label: "E-post", minLength: 3, type: "email" },
      { name: "address", label: "Adresse", minLength: 3 },
      { name: "message", label: "Hva trenger du hjelp med?", minLength: 10 }
    ]
  });

  initAjaxForm({
    formId: "applicationForm",
    successId: "applicationSuccess",
    submittingText: "Sender...",
    successText: "Takk, vi har mottatt søknaden",
    fields: [
      { name: "contractType", label: "Type kontrakt" },
      { name: "customerType", label: "Type kunde" },
      { name: "area", label: "Adresse/område", minLength: 2 },
      { name: "scope", label: "Størrelse/omfang" },
      { name: "startDate", label: "Ønsket oppstart" },
      { name: "duration", label: "Ønsket varighet" },
      { name: "name", label: "Navn", minLength: 2 },
      { name: "phone", label: "Telefon", minLength: 6, type: "phone" },
      { name: "email", label: "E-post", minLength: 3, type: "email" },
      { name: "extraInfo", label: "Ekstra info", minLength: 10, optional: true }
    ]
  });
})();
