(function () {
  "use strict";

  /* Popups */
  function openPopup(id) {
    var popup = document.getElementById(id);
    if (!popup) return;
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closePopup(popup) {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".popup.is-open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  function closeAllPopups() {
    document.querySelectorAll(".popup.is-open").forEach(closePopup);
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-popup-open]");
    if (openBtn) {
      e.preventDefault();
      openPopup(openBtn.getAttribute("data-popup-open"));
      return;
    }

    if (e.target.closest("[data-popup-close]")) {
      var popup = e.target.closest(".popup");
      if (popup) closePopup(popup);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllPopups();
  });

  /* Forms */
  document.querySelectorAll("form[data-no-submit]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var success = form.querySelector(".form-success, .form__success");
      Array.from(form.children).forEach(function (child) {
        if (child !== success) child.hidden = true;
      });
      if (success) success.hidden = false;
    });
  });

  /* Phone mask */
  function formatPhone(value) {
    var digits = value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (!digits.startsWith("7")) digits = "7" + digits;
    digits = digits.slice(0, 11);

    var result = "+7";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 4) result += ") " + digits.slice(4, 7);
    if (digits.length >= 7) result += "-" + digits.slice(7, 9);
    if (digits.length >= 9) result += "-" + digits.slice(9, 11);
    return result;
  }

  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener("input", function () {
      var pos = input.selectionStart;
      var oldLen = input.value.length;
      input.value = formatPhone(input.value);
      var diff = input.value.length - oldLen;
      input.setSelectionRange(pos + diff, pos + diff);
    });

    input.addEventListener("focus", function () {
      if (!input.value) input.value = "+7 (";
    });

    input.addEventListener("blur", function () {
      if (input.value === "+7 (" || input.value === "+7") input.value = "";
    });
  });

  /* Quiz */
  var TOTAL_QUESTION_STEPS = 4;

  function initQuiz(quizEl) {
    var steps = Array.from(quizEl.querySelectorAll(".quiz__step"));
    var btnPrev = quizEl.querySelector(".quiz__btn--prev");
    var btnNext = quizEl.querySelector(".quiz__btn--next");
    var btnSubmit = quizEl.querySelector(".quiz__btn--submit");
    var progressBar = quizEl.querySelector(".quiz__progress-bar");
    var stepCurrent = quizEl.querySelector(".quiz__step-current");
    var current = 0;

    function getActiveIndex() {
      return steps.findIndex(function (s) { return s.classList.contains("is-active"); });
    }

    function goTo(index) {
      steps.forEach(function (s, i) {
        s.classList.toggle("is-active", i === index);
      });
      current = index;

      var displayStep = Math.min(index + 1, TOTAL_QUESTION_STEPS);
      if (stepCurrent) stepCurrent.textContent = String(displayStep);
      if (progressBar) {
        progressBar.style.width = (displayStep / TOTAL_QUESTION_STEPS * 100) + "%";
      }

      var isFirst = index === 0;
      var isLast = index === steps.length - 1;
      var isPhoneStep = index === steps.length - 1;

      if (btnPrev) btnPrev.hidden = isFirst;
      if (btnNext) btnNext.hidden = isPhoneStep;
      if (btnSubmit) btnSubmit.hidden = !isPhoneStep;
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        var idx = getActiveIndex();
        if (idx < steps.length - 1) goTo(idx + 1);
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        var idx = getActiveIndex();
        if (idx > 0) goTo(idx - 1);
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener("click", function () {
        var form = quizEl.querySelector(".quiz__form");
        if (form) {
          form.requestSubmit();
        }
      });
    }

    goTo(0);
  }

  document.querySelectorAll("[data-quiz]").forEach(initQuiz);

  /* Cookie banner */
  var cookieBanner = document.querySelector(".cookie-banner");
  var cookieKey = "cookie_accepted_vsezubysrazy";

  if (cookieBanner && !localStorage.getItem(cookieKey)) {
    requestAnimationFrame(function () {
      cookieBanner.classList.add("is-visible");
    });
  }

  var cookieBtn = document.querySelector(".cookie-banner__ok");
  if (cookieBtn) {
    cookieBtn.addEventListener("click", function () {
      localStorage.setItem(cookieKey, "1");
      cookieBanner.classList.remove("is-visible");
    });
  }

  /* Promo deadline: today + 15 days */
  var PROMO_MONTHS = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];

  function getPromoDeadlineDate() {
    var date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + 15);
    return date;
  }

  function formatPromoDeadline(date) {
    return "Акция до " + date.getDate() + "\u00a0" + PROMO_MONTHS[date.getMonth()];
  }

  document.querySelectorAll("[data-promo-deadline]").forEach(function (el) {
    el.textContent = formatPromoDeadline(getPromoDeadlineDate());
  });

  /* Duplicate marquee content for seamless loop */
  function kickMarqueeAnimations() {
    document.querySelectorAll(".marquee__track").forEach(function (track) {
      track.style.webkitAnimation = "none";
      track.style.animation = "none";
      void track.offsetHeight;
      track.style.removeProperty("-webkit-animation");
      track.style.removeProperty("animation");
    });
  }

  document.querySelectorAll(".marquee__track").forEach(function (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  kickMarqueeAnimations();
  requestAnimationFrame(kickMarqueeAnimations);

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      kickMarqueeAnimations();
      kickButtonShimmer();
    }
  });

  /* iOS Safari: перезапуск перелива на псевдоэлементах кнопок */
  function kickButtonShimmer() {
    document.querySelectorAll(".btn--accent:not(.btn--pulse), .btn--hero").forEach(function (btn) {
      btn.classList.remove("is-shimmer-active");
      void btn.offsetHeight;
      btn.classList.add("is-shimmer-active");
    });
  }

  kickButtonShimmer();
  requestAnimationFrame(kickButtonShimmer);

  /* Scroll to top */
  var scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
