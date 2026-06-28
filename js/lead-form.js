(function initNurtexLeadForms() {
  const ENDPOINT = '/api/lead-wycena';

  document.querySelectorAll('.nurtex-lead-form').forEach((form) => {
    const ok = form.querySelector('.nurtex-lead-ok');
    const submitBtn = form.querySelector('[type="submit"]');
    const defaultService = form.dataset.service || '';
    const pageUrl = form.dataset.url || window.location.href;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const honey = form.querySelector('input[name="website"]');
      if (honey && honey.value.trim() !== '') return;

      const get = (name) => {
        const el = form.querySelector(`[name="${name}"]`);
        if (!el) return '';
        if (el.type === 'checkbox') return el.checked ? 'tak' : '';
        return String(el.value || '').trim();
      };

      const payload = {
        name: get('name'),
        phone: get('phone'),
        email: get('email'),
        type: get('type'),
        area: get('area'),
        service: get('service') || defaultService,
        district: get('district'),
        message: get('message'),
        url: pageUrl,
        website: ''
      };

      if (!payload.name) {
        alert('Podaj imię i nazwisko.');
        form.querySelector('[name="name"]')?.focus();
        return;
      }
      if (!payload.phone && !payload.email) {
        alert('Podaj telefon lub e-mail — oddzwonimy w 24h.');
        form.querySelector('[name="phone"]')?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';
      }

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Błąd wysyłki');
        }
        Array.from(form.children).forEach((child) => {
          if (!child.classList.contains('nurtex-lead-ok')) child.style.display = 'none';
        });
        if (ok) {
          ok.hidden = false;
          ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.prevText || 'Wyślij zapytanie';
        }
        alert(err.message || 'Nie udało się wysłać. Zadzwoń: 662 070 695');
      }
    });
  });
})();