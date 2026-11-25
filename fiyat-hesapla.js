/* İZTEM fiyat hesaplama aracı – 2026 başlangıç fiyatları.
   Kullanım: <div data-fiyat-hesapla data-bolge="Çiğli" data-uzak="0"></div>
   Araç koltuğu: <div data-fiyat-hesapla data-tur="arac"></div> */
(function () {
  var URUNLER = [
    ['tekli', 'Tekli koltuk / berjer', 800],
    ['kanepe', 'İkili / üçlü kanepe, çekyat', 1250],
    ['chester', 'Chester (kapitone) kanepe', 1750],
    ['l', 'L / köşe koltuk', 2250],
    ['lminder', 'Sırt minderli L / köşe koltuk', 2750],
    ['u', 'U köşe / büyük köşe takımı', 3500],
    ['takim', 'Koltuk takımı (3+3+1, 3+2+1)', 2500],
    ['chtakim', 'Chester koltuk takımı', 3500],
    ['sandalye', 'Kumaş sandalye', 150],
    ['tekyatak', 'Tek kişilik yatak', 1000],
    ['ciftyatak', 'Çift kişilik yatak', 1400]
  ];
  var EKLER = [
    ['leke', 'Eski leke var'],
    ['hayvan', 'Evcil hayvan lekesi veya kokusu'],
    ['kumas', 'Kadife, keten, tay tüyü veya açık renk kumaş']
  ];
  var TEL = '905438108096';
  function kucuk(t) { return t.toLocaleLowerCase('tr-TR').replace(/^l \//, 'L /').replace(/^u köşe/, 'U köşe'); }
  function tl(n) { return n.toLocaleString('tr-TR') + ' TL'; }
  function css() {
    if (document.getElementById('fh-css')) return;
    var st = document.createElement('style'); st.id = 'fh-css';
    st.textContent =
      '.fh{background:#fff;border:1px solid #e4dfd5;border-radius:18px;padding:18px;margin:18px 0;max-width:820px;color:#121417}' +
      '.fh h3{margin:0 0 4px;font-size:1.2rem}.fh .fh-sub{margin:0 0 14px;opacity:.75;font-size:.95rem}' +
      '.fh-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid #f0ece4}' +
      '.fh-row span small{display:block;opacity:.65;font-size:.85rem}' +
      '.fh-step{display:flex;align-items:center;gap:6px;flex-shrink:0}' +
      '.fh-step button{width:36px;height:36px;border-radius:50%;border:1px solid #cfc8bb;background:#f7f4ee;font-size:20px;line-height:1;cursor:pointer;color:#121417}' +
      '.fh-step output{min-width:22px;text-align:center;font-weight:700}' +
      '.fh-ek{margin:14px 0 4px}.fh-ek label{display:flex;gap:8px;align-items:center;padding:5px 0;font-size:.95rem}' +
      '.fh-ek input{width:18px;height:18px}' +
      '.fh-sum{margin:16px 0 10px;padding:14px;border-radius:14px;background:#121417;color:#fff}' +
      '.fh-sum b{display:block;font-size:1.45rem;color:#F2B300;margin-top:2px}' +
      '.fh-note{font-size:.88rem;opacity:.75;margin:8px 0 0}' +
      '.fh .b{width:100%;justify-content:center;margin-top:6px}';
    document.head.appendChild(st);
  }

  var ARAC = [
    ['2', '2 koltuk (ön koltuklar)', 1500],
    ['4', '4 koltuk', 1800],
    ['5', '5 koltuk (tam otomobil)', 2000],
    ['7', '7–8 koltuk (7 kişilik, minivan)', 3500],
    ['servis', 'Servis aracı, minibüs (9+ koltuk)', 0]
  ];
  var ARAC_EK = [['taban', 'Taban (paspas altı)'], ['tavan', 'Tavan döşemesi'], ['kapi', 'Kapı döşemeleri'], ['bagaj', 'Bagaj'], ['deri', 'Deri veya alcantara koltuk']];
  function buildArac(el) {
    var html = '<div class="fh"><h3>Araç Koltuğu Fiyat Hesapla</h3><p class="fh-sub">Koltuk sayısını ve istediğiniz ek alanları seçin, başlangıç fiyatını görün ve WhatsApp’tan fiyat isteyin.</p><div class="fh-ek" style="margin-top:0"><b>Yıkanacak koltuk sayısı:</b>';
    ARAC.forEach(function (a, i) {
      html += '<label><input type="radio" name="fh-arac" data-a="' + a[0] + '"' + (i === 2 ? ' checked' : '') + '> ' + a[1] + (a[2] ? ' — ' + tl(a[2]) + '’den' : ' — fotoğrafla, toplu işe indirimli') + '</label>';
    });
    html += '</div><div class="fh-ek"><b>Ek alanlar (isteğe bağlı):</b>';
    ARAC_EK.forEach(function (e) { html += '<label><input type="checkbox" data-e="' + e[0] + '"> ' + e[1] + '</label>'; });
    html += '</div><div class="fh-sum" aria-live="polite">Koltuklar için başlangıç fiyatı<b data-t>0 TL</b></div>' +
      '<a class="b b-wa b-lg" data-wa href="https://wa.me/' + TEL + '" rel="noopener noreferrer" target="_blank">WhatsApp’tan Fiyat İste</a>' +
      '<p class="fh-note">2026 başlangıç fiyatlarıdır. Taban, tavan, kapı ve bagaj ayrıca fiyatlanır; işin kapsamına göre toplam 1.500 TL ile 7.000 TL arasında değişir. Kesin fiyat koltukların ve aracın fotoğrafına göre bildirilir.</p></div>';
    el.innerHTML = html;
    function guncelle() {
      var sec = null;
      ARAC.forEach(function (a) { if (el.querySelector('[data-a="' + a[0] + '"]').checked) sec = a; });
      var ekler = [];
      ARAC_EK.forEach(function (e) { if (el.querySelector('[data-e="' + e[0] + '"]').checked) ekler.push(kucuk(e[1])); });
      el.querySelector('[data-t]').textContent = sec && sec[2] ? tl(sec[2]) + '’den' + (ekler.length ? ' + ek alanlar' : '') : 'Fotoğrafla teklif';
      var msg = 'Merhaba İZTEM, araç koltuk yıkama fiyatı almak istiyorum.';
      if (sec) msg += ' Koltuk: ' + kucuk(sec[1]) + '.';
      if (ekler.length) msg += ' Ek alanlar: ' + ekler.join(', ') + '.';
      msg += ' Araç modeli: ... Adres/ilçe: ... Fotoğrafları gönderiyorum.';
      el.querySelector('[data-wa]').href = 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(msg);
    }
    el.addEventListener('change', guncelle);
    guncelle();
  }
  function build(el) {
    if (el.getAttribute('data-tur') === 'arac') return buildArac(el);
    var bolge = el.getAttribute('data-bolge') || '';
    var uzak = el.getAttribute('data-uzak') === '1';
    var adet = {};
    var html = '<div class="fh"><h3>Fiyat Hesapla</h3><p class="fh-sub">Yıkatmak istediklerinizi seçin, başlangıç fiyatını görün ve tek dokunuşla WhatsApp’tan fiyat isteyin.</p>';
    URUNLER.forEach(function (u) {
      adet[u[0]] = 0;
      html += '<div class="fh-row"><span>' + u[1] + '<small>' + tl(u[2]) + '’den</small></span>' +
        '<span class="fh-step"><button type="button" data-k="' + u[0] + '" data-d="-1" aria-label="' + u[1] + ' azalt">−</button>' +
        '<output id="fh-' + u[0] + '-' + Math.random().toString(36).slice(2, 7) + '" data-o="' + u[0] + '">0</output>' +
        '<button type="button" data-k="' + u[0] + '" data-d="1" aria-label="' + u[1] + ' artır">+</button></span></div>';
    });
    html += '<div class="fh-ek"><b>Varsa işaretleyin:</b>';
    EKLER.forEach(function (e) { html += '<label><input type="checkbox" data-e="' + e[0] + '"> ' + e[1] + '</label>'; });
    html += '</div><div class="fh-sum" aria-live="polite">Başlangıç toplamı<b data-t>0 TL</b></div>' +
      '<a class="b b-wa b-lg" data-wa href="https://wa.me/' + TEL + '" rel="noopener noreferrer" target="_blank">WhatsApp’tan Fiyat İste</a>' +
      '<p class="fh-note">Bu tutar 2026 başlangıç fiyatıdır' + (bolge ? (uzak ? '; ' + bolge + ' için yol ücreti fiyat bildirilirken ayrıca yazılır' + (bolge === 'Bergama' ? '' : ', 4.000 TL ve üzeri işlerde alınmaz') : '; ' + bolge + ' için yol ücreti alınmaz') : '') +
      '. İşaretlediğiniz durumlar, minder sayısı ve kumaş fiyatı artırabilir. Kesin fiyat, göndereceğiniz fotoğraflara göre bildirilir.</p></div>';
    el.innerHTML = html;
    function guncelle() {
      var top = 0, liste = [];
      URUNLER.forEach(function (u) {
        var n = adet[u[0]]; if (n > 0) { top += n * u[2]; liste.push(n + ' ' + kucuk(u[1])); }
        el.querySelector('[data-o="' + u[0] + '"]').textContent = n;
      });
      var ekler = [];
      EKLER.forEach(function (e) { if (el.querySelector('[data-e="' + e[0] + '"]').checked) ekler.push(kucuk(e[1])); });
      el.querySelector('[data-t]').textContent = top ? tl(top) + '’den' : '0 TL';
      var msg = 'Merhaba İZTEM, ' + (bolge ? bolge + ' için ' : '') + 'koltuk yıkama fiyatı almak istiyorum.';
      if (liste.length) msg += ' Yıkanacaklar: ' + liste.join(', ') + '.';
      if (ekler.length) msg += ' Durum: ' + ekler.join(', ') + '.';
      if (top) msg += ' Sitedeki başlangıç toplamı: ' + tl(top) + '.';
      msg += ' Fotoğrafları gönderiyorum.';
      el.querySelector('[data-wa]').href = 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(msg);
    }
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-k]'); if (!b) return;
      var k = b.getAttribute('data-k'); adet[k] = Math.max(0, Math.min(20, adet[k] + parseInt(b.getAttribute('data-d'), 10)));
      guncelle();
    });
    el.addEventListener('change', guncelle);
    guncelle();
  }
  function init() { css(); var els = document.querySelectorAll('[data-fiyat-hesapla]'); for (var i = 0; i < els.length; i++) build(els[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
