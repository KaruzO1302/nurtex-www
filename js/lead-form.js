(function initNurtexLeadForms() {
  const ENDPOINT = '/api/lead-wycena';
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

  function showError(form) {
    let error = form.querySelector('.nurtex-lead-error');
    if (!error) {
      error = document.createElement('p');
      error.className = 'nurtex-lead-error';
      error.setAttribute('role', 'alert');
      error.tabIndex = -1;
      error.style.cssText = 'margin-top:16px;padding:16px;border:1px solid currentColor;border-radius:8px;color:inherit;line-height:1.6';
      error.innerHTML = 'Nie udało się potwierdzić wysłania zgłoszenia. Twoje dane pozostały w formularzu. Spróbuj ponownie lub zadzwoń: <a href="tel:+48662070695" style="color:inherit;font-weight:700">662 070 695</a>.';
      form.appendChild(error);
    }
    error.hidden = false;
    error.focus();
  }

  function showSuccess(form) {
    let ok = form.querySelector('.nurtex-lead-ok');
    if (!ok) {
      ok = document.createElement('div');
      ok.className = 'nurtex-lead-ok';
      ok.setAttribute('role', 'status');
      ok.tabIndex = -1;
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
    ok.focus();
  }

  document.querySelectorAll(SELECTORS).forEach((form) => {
    if (form.dataset.leadReady === '1') return;
    form.dataset.leadReady = '1';

    const submitBtn = form.querySelector('[type="submit"]');
    const defaultService = form.dataset.service || '';
    const pageUrl = form.dataset.url || window.location.href;
    let sending = false;
    let sent = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending || sent) return;

      const honey = form.querySelector('input[name="website"]');
      if (honey && honey.value.trim() !== '') return;
      if (!form.reportValidity()) return;

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
      if (!payload.message) {
        alert('Napisz krótko, w czym możemy pomóc.');
        form.querySelector('[name="message"], [name="msg"], [name="opis"]')?.focus();
        return;
      }

      sending = true;
      form.setAttribute('aria-busy', 'true');
      const previousError = form.querySelector('.nurtex-lead-error');
      if (previousError) previousError.hidden = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.prevText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const json = await res.json();
        if (!res.ok || json?.success !== true) {
          throw new Error('Lead not accepted');
        }
        sent = true;
        showSuccess(form);
      } catch {
        showError(form);
      } finally {
        clearTimeout(timeout);
        sending = false;
        form.setAttribute('aria-busy', 'false');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.prevText || 'Wyślij zapytanie';
        }
      }
    });
  });
})();
