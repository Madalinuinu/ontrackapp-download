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

  var emailForm = document.getElementById('email-form');
  var emailMessage = document.getElementById('email-form-message');
  var sendEmailBtn = document.getElementById('send-email-btn');
  if (emailForm && emailMessage && sendEmailBtn) {
    emailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = emailForm.querySelector('input[name="email"]');
      var email = emailInput && emailInput.value ? emailInput.value.trim() : '';
      if (!email) {
        emailMessage.textContent = 'Please enter your email.';
        emailMessage.className = 'email-form-message error';
        return;
      }
      emailMessage.textContent = '';
      emailMessage.className = 'email-form-message';
      sendEmailBtn.disabled = true;
      sendEmailBtn.textContent = 'Sending…';
      fetch('/.netlify/functions/send-apk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data && !result.data.error) {
            emailMessage.textContent = 'Check your inbox—we sent you the download link.';
            emailMessage.className = 'email-form-message success';
            if (emailInput) emailInput.value = '';
          } else {
            emailMessage.textContent = result.data && result.data.message ? result.data.message : 'Something went wrong. Try again.';
            emailMessage.className = 'email-form-message error';
          }
        })
        .catch(function () {
          emailMessage.textContent = 'Network error. Try again later.';
          emailMessage.className = 'email-form-message error';
        })
        .finally(function () {
          sendEmailBtn.disabled = false;
          sendEmailBtn.textContent = 'Send to my email';
        });
    });
  }
})();
