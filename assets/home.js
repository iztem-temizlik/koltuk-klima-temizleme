const comparison = document.querySelector('.compare');
comparison.querySelector('input').addEventListener('input', event => {
  comparison.style.setProperty('--position', event.target.value + '%');
});

const filters = document.querySelectorAll('[data-filter]');
for (const filter of filters) {
  filter.addEventListener('click', () => {
    for (const button of filters) button.setAttribute('aria-pressed', String(button === filter));
    for (const review of document.querySelectorAll('[data-types]')) {
      review.hidden = filter.dataset.filter !== 'Tümü' && !review.dataset.types.split(' ').includes(filter.dataset.filter);
    }
  });
}

function track(event, properties = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event, ...properties});
}

document.addEventListener('click', event => {
  const href = event.target.closest('a')?.getAttribute('href') || '';
  if (href.startsWith('tel:')) track('phone_click');
  if (href.startsWith('https://wa.me/')) track('whatsapp_click');
});

document.querySelector('#teklif').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const service = form.elements.service.value;
  const text = ['Merhaba İZTEM, fiyat ve randevu bilgisi almak istiyorum.',
    'Hizmet: ' + service, 'İlçe / mahalle: ' + form.elements.area.value.trim(),
    'Adet: ' + form.elements.count.value].join('\n');
  const file = form.elements.photo.files[0];
  track('quote_form_submit', {service});
  if (file && navigator.canShare?.({files: [file]})) {
    try {
      await navigator.share({files: [file], text: text + '\nİZTEM: 0543 810 80 96'});
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  track('whatsapp_click', {service});
  location.assign('https://wa.me/905438108096?text=' + encodeURIComponent(text));
});
