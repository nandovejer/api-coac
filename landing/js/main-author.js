import '../css/vendor-author.css';
import '@cai-ds/core';
import '../css/styles.css';
import './timeline.js';
import '../src/components/sources-cloud/sources-cloud.js';

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open');
    });
  }
});
