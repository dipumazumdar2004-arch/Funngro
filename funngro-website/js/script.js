/**
 * Funngro Two-Page Website Redesign — Interactive Enhancements
 * Pure Vanilla JS: Navigation, Accordions, Category Filters, Modals, and Demo Form Validation
 */

(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  /* --------------------------------------------------------------------------
     1. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function setDrawerState(open) {
    if (!menuToggle || !mobileDrawer) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileDrawer.classList.toggle('is-open', open);
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
      const firstLink = mobileDrawer.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }
  }

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setDrawerState(!isExpanded);
    });

    mobileDrawer.querySelectorAll('a, button').forEach(function (item) {
      item.addEventListener('click', function () {
        setDrawerState(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        setDrawerState(false);
        menuToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. Active Navigation State on Scroll
     -------------------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
  const observedSections = navLinks
    .map(function (link) {
      const id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (observedSections.length > 0 && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const targetHref = '#' + entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle('is-active', link.getAttribute('href') === targetHref);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.01 }
    );

    observedSections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* --------------------------------------------------------------------------
     3. Project Categories Filter Tabs
     -------------------------------------------------------------------------- */
  const filterButtons = Array.from(document.querySelectorAll('[data-filter-group]'));
  const categoryCards = Array.from(document.querySelectorAll('[data-category-group]'));

  if (filterButtons.length > 0 && categoryCards.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const selectedGroup = btn.getAttribute('data-filter-group');

        filterButtons.forEach(function (item) {
          const isCurrent = item === btn;
          item.classList.toggle('is-active', isCurrent);
          item.setAttribute('aria-pressed', String(isCurrent));
        });

        categoryCards.forEach(function (card) {
          const cardGroup = card.getAttribute('data-category-group');
          const matches = selectedGroup === 'all' || cardGroup === selectedGroup;
          card.hidden = !matches;
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. FAQ Accordion (Accessible Toggle)
     -------------------------------------------------------------------------- */
  const faqTriggers = Array.from(document.querySelectorAll('.faq-trigger'));

  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;

      faqTriggers.forEach(function (other) {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanelId = other.getAttribute('aria-controls');
          const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) panel.hidden = isExpanded;
    });
  });

  /* --------------------------------------------------------------------------
     5. Modal Dialog System (Sample Briefs, Join Teen CTA, Privacy / Terms)
     -------------------------------------------------------------------------- */
  let lastFocusedElement = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const focusTarget = modal.querySelector('.modal-close, input, select, button');
    if (focusTarget) focusTarget.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const targetId = trigger.getAttribute('data-open-modal');
      const modal = document.getElementById(targetId);
      if (!modal) return;

      // Support dynamic content injection for brief previews or legal notices
      const briefTitle = trigger.getAttribute('data-brief-title');
      const briefSummary = trigger.getAttribute('data-brief-summary');
      const briefTasks = trigger.getAttribute('data-brief-tasks');
      const briefCategory = trigger.getAttribute('data-brief-category');

      if (briefTitle && targetId === 'brief-modal') {
        const titleEl = document.getElementById('brief-modal-title');
        const summaryEl = document.getElementById('brief-modal-summary');
        const listEl = document.getElementById('brief-modal-tasks');
        const selectBtn = document.getElementById('brief-select-cta');

        if (titleEl) titleEl.textContent = briefTitle;
        if (summaryEl) summaryEl.textContent = briefSummary || '';
        if (listEl && briefTasks) {
          listEl.innerHTML = '';
          briefTasks.split('|').forEach(function (task) {
            const li = document.createElement('li');
            li.textContent = task.trim();
            listEl.appendChild(li);
          });
        }
        if (selectBtn && briefCategory) {
          selectBtn.setAttribute('data-prefill-category', briefCategory);
        }
      }

      const legalTitle = trigger.getAttribute('data-legal-title');
      const legalText = trigger.getAttribute('data-legal-text');
      if (legalTitle && targetId === 'legal-modal') {
        const lTitle = document.getElementById('legal-modal-title');
        const lText = document.getElementById('legal-modal-text');
        if (lTitle) lTitle.textContent = legalTitle;
        if (lText) lText.textContent = legalText || '';
      }

      openModal(modal);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) {
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) {
        closeModal(backdrop);
      }
    });

    backdrop.querySelectorAll('[data-close-modal]').forEach(function (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeModal(backdrop);
      });
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop:not([hidden])').forEach(function (openBackdrop) {
        closeModal(openBackdrop);
      });
    }
  });

  // Category template prefill button on Company / Teen pages
  document.querySelectorAll('[data-prefill-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetSelectId = btn.getAttribute('data-prefill-target');
      const categoryValue = btn.getAttribute('data-prefill-category');
      const scrollTargetId = btn.getAttribute('data-scroll-target');
      const selectEl = targetSelectId ? document.getElementById(targetSelectId) : null;

      const openBriefModal = document.getElementById('brief-modal');
      if (openBriefModal && !openBriefModal.hidden) {
        closeModal(openBriefModal);
      }

      if (selectEl && categoryValue) {
        selectEl.value = categoryValue;
      }

      if (scrollTargetId) {
        const section = document.getElementById(scrollTargetId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          if (selectEl) {
            setTimeout(function () {
              selectEl.focus();
            }, 350);
          }
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Demonstration Form Validation (Honest Local Feedback Only)
     -------------------------------------------------------------------------- */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function setupDemoForm(formId, statusId, successBuilder) {
    const form = document.getElementById(formId);
    const statusBox = document.getElementById(statusId);
    if (!form || !statusBox) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let isValid = true;
      const formData = {};

      const fields = Array.from(form.querySelectorAll('[data-validate]'));
      fields.forEach(function (field) {
        const rule = field.getAttribute('data-validate');
        const errorEl = document.getElementById(field.id + '-error');
        let message = '';

        if (field.type === 'checkbox') {
          if (!field.checked) {
            message = 'Please confirm you understand this is a frontend demonstration form.';
          }
          formData[field.name] = field.checked;
        } else {
          const value = field.value.trim();
          formData[field.name] = value;

          if (!value) {
            message = 'This field is required.';
          } else if (rule === 'email' && !validateEmail(value)) {
            message = 'Enter a valid email address.';
          } else if (rule === 'min-10' && value.length < 10) {
            message = 'Please enter at least 10 characters.';
          }
        }

        field.classList.toggle('is-invalid', Boolean(message));
        field.setAttribute('aria-invalid', String(Boolean(message)));
        if (errorEl) errorEl.textContent = message;
        if (message) isValid = false;
      });

      if (!isValid) {
        statusBox.hidden = false;
        statusBox.className = 'form-status is-error';
        statusBox.textContent = 'Please review the highlighted fields before continuing.';
        return;
      }

      statusBox.hidden = false;
      statusBox.className = 'form-status is-success';
      statusBox.textContent = successBuilder(formData);
      form.reset();
    });
  }

  setupDemoForm('teen-demo-form', 'teen-demo-status', function (data) {
    return (
      'Demo validation passed for ' +
      data.fullName +
      ' (' +
      data.skillTrack +
      '). Note: This is a concept demonstration only—no personal information was submitted to Funngro.'
    );
  });

  setupDemoForm('company-demo-form', 'company-demo-status', function (data) {
    return (
      'Demo brief validated for ' +
      data.companyName +
      ' (' +
      data.projectCategory +
      '). Note: This is a concept demonstration only—no inquiry was transmitted to Funngro.'
    );
  });

  /* --------------------------------------------------------------------------
     7. Lightweight Scroll Reveal & Back-to-Top Button
     -------------------------------------------------------------------------- */
  const revealNodes = Array.from(document.querySelectorAll('.reveal'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach(function (node) {
      node.classList.add('is-revealed');
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  }

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    function toggleBackToTop() {
      backToTopBtn.classList.toggle('is-visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }
})();
