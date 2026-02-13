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

  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("formSuccess");

  if (!contactForm) return;

  const fields = [
    { name: "name", label: "Navn", minLength: 2 },
    { name: "company", label: "Bedrift / borettslag", minLength: 2, optional: true },
    { name: "phone", label: "Telefon", minLength: 6, type: "phone" },
    { name: "email", label: "E-post", minLength: 3, type: "email" },
    { name: "message", label: "Hva trenger dere hjelp med?", minLength: 10 }
  ];

  const getErrorElement = (fieldName) => contactForm.querySelector(`[data-error-for="${fieldName}"]`);
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^\+?[0-9\s()-]{6,}$/.test(value);

  const validateField = (field) => {
    const input = contactForm.elements[field.name];
    const errorElement = getErrorElement(field.name);
    if (!input || !errorElement) return true;

    const value = input.value.trim();
    let error = "";

    if (!value && !field.optional) {
      error = `${field.label} må fylles ut.`;
    } else if (value && value.length < field.minLength) {
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
    const input = contactForm.elements[field.name];
    if (input) input.addEventListener("input", () => validateField(field));
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isValid = fields.every((field) => validateField(field));
    if (!isValid) {
      if (successMessage) successMessage.textContent = "";
      return;
    }

    if (successMessage) successMessage.textContent = "Sender...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Form submission failed");
      if (successMessage) successMessage.textContent = "Takk! Meldingen er sendt.";
      contactForm.reset();
    } catch (error) {
      if (successMessage) successMessage.textContent = "Noe gikk galt. Prøv igjen.";
    }
  });
})();
