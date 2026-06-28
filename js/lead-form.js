(function initNurtexLeadForms() {
  const ENDPOINT = '/api/lead-wycena';
  const WHATSAPP = '48662070695';
  const SELECTORS = '.nurtex-lead-form, #quoteForm, #quote-form, #recuperacjaForm';

  function getField(form, ...names) {
    for (const name of names) {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) continue;
      if (el.type === 'checkbox') return el.checked ? 'tak' : '';
      const value = String(el.value || '').trim();
      if (value) return value;
    }
    return '';
  }

  function buildWhatsappText(payload) {
    const lines = [
      'Zapytanie ze strony NURTEX',
      '',
      `Usługa: ${payload.service || 'Wycena'}`,
      `Imię: ${payload.name}`,
      `Tel klienta: ${payload.phone}`
    ];
    if (payload.message) lines.push(`Wiadomość: ${payload.message}`);
    if (payload.url) lines.push(`Strona: ${payload.url}`);
    return lines.join('\n');
  }

  function showSuccess(form) {
    let ok = form.querySelector('.nurtex-lead-ok');
    if (!ok) {
      ok = document.createElement('div');
      ok.className = 'nurtex-lead-ok';
      ok.innerHTML = [
        '<strong style="color:#19c37d">Dziękujemy!</strong>',
        '<p style="margin-top:8px">Zgłoszenie wysłane. Oddzwonimy w 24h (często szybciej).',
        ' Pilne? <a href="tel:+48662070695" style="color:inherit;font-weight:700">662 070 695</a></p>'
      ].join('');
      form.appendChild(ok);
    }
    Array.from(form.children).forEach((child) => {
      if (!child.classList.contains('nurtex-lead-ok')) child.style.display = 'none';
    });
    ok.hidden = false;
    ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.querySelectorAll(SELECTORS).forEach((form) => {
    if (form.dataset.leadReady === '1') return;
    form.dataset.leadReady = '1';

    const submitBtn = form.querySelector('[type="submit"]');
    const defaultService = form.dataset.service || '';
    const pageUrl = form.dataset.url || window.location.href;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const honey = form.querySelector('input[name="website"]');
      if (honey && honey.value.trim() !== '') return;

      const payload = {
        name: getField(form, 'name', 'imie'),
        phone: getField(form, 'phone', 'telefon'),
        email: getField(form, 'email'),
        type: getField(form, 'type', 'typ_obiektu', 'obiekt'),
        area: getField(form, 'area'),
        service: getField(form, 'service') || defaultService,
        district: getField(form, 'district', 'dzielnica', 'lokalizacja'),
        message: getField(form, 'message', 'msg', 'opis'),
        url: pageUrl,
        website: ''
      };

      if (!payload.name) {
        alert('Podaj imię i nazwisko.');
        form.querySelector('[name="name"], [name="imie"]')?.focus();
        return;
      }
      if (!payload.phone) {
        alert('Podaj telefon — oddzwonimy w 24h.');
        form.querySelector('[name="phone"], [name="telefon"]')?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';
      }

      const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildWhatsappText(payload))}`;
      window.open(waUrl, '_blank', 'noopener');

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) {
          console.warn('[lead-form] API:', json.error || res.status);
        }
      } catch (err) {
        console.warn('[lead-form] API offline:', err);
      }

      showSuccess(form);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.prevText || 'Wyślij zapytanie';
      }
    });
  });
})();