(function initNurtexMailtoForms() {
  const TO = 'kontakt@nurtex.pl';

  const LABELS = {
    name: 'Imię i nazwisko',
    imie: 'Imię i nazwisko',
    phone: 'Telefon',
    telefon: 'Telefon',
    email: 'E-mail',
    message: 'Wiadomość',
    msg: 'Wiadomość',
    opis: 'Wiadomość',
    service: 'Usługa',
    type: 'Typ obiektu',
    typ_obiektu: 'Typ obiektu',
    obiekt: 'Typ obiektu',
    area: 'Metraż',
    district: 'Lokalizacja',
    dzielnica: 'Lokalizacja',
    lokalizacja: 'Lokalizacja'
  };

  const SELECTORS = '.nurtex-lead-form, #quoteForm, #quote-form, #recuperacjaForm';

  document.querySelectorAll(SELECTORS).forEach((form) => {
    if (form.dataset.mailtoReady === '1') return;
    form.dataset.mailtoReady = '1';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const honey = form.querySelector('input[name="website"]');
      if (honey && honey.value.trim() !== '') return;

      const fd = new FormData(form);
      const name = String(fd.get('name') || fd.get('imie') || '').trim();
      const phone = String(fd.get('phone') || fd.get('telefon') || '').trim();

      if (!name) {
        alert('Podaj imię i nazwisko.');
        form.querySelector('[name="name"], [name="imie"]')?.focus();
        return;
      }
      if (!phone) {
        alert('Podaj telefon — oddzwonimy w 24h.');
        form.querySelector('[name="phone"], [name="telefon"]')?.focus();
        return;
      }

      const service = form.dataset.service
        || String(fd.get('service') || '').trim()
        || 'Zapytanie NURTEX';

      const lines = [`Strona: ${form.dataset.url || window.location.href}`, ''];
      for (const [key, value] of fd.entries()) {
        if (key === 'website' || key === 'rodo') continue;
        if (value instanceof File) continue;
        const text = String(value).trim();
        if (!text) continue;
        lines.push(`${LABELS[key] || key}: ${text}`);
      }

      const subject = encodeURIComponent(`NURTEX — ${service} — ${name}`);
      const body = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    });
  });
})();