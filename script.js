(function () {
  'use strict';

  function initPageLoadAnimation() {
    document.body.classList.add('page-loaded');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(initPageLoadAnimation);
      });
    });
  } else {
    requestAnimationFrame(initPageLoadAnimation);
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in').forEach(function (el) {
    observer.observe(el);
  });

  requestAnimationFrame(function () {
    document.querySelectorAll('.hero .animate-in').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });

  var downloadBtn = document.getElementById('download-btn');
  var downloadThanks = document.getElementById('download-thanks');
  if (downloadBtn && downloadThanks) {
    downloadBtn.addEventListener('click', function () {
      downloadThanks.textContent = 'Thank you for downloading my app!!';
      downloadThanks.classList.add('is-visible');
    });
  }

})();
