# İZTEM — Cloudflare Pages geçiş planı

## Proje bilgileri

- GitHub deposu: `iztem-temizlik/koltuk-klima-temizleme`
- Üretim dalı: `main`
- Site türü: Statik HTML/CSS
- Mevcut canlı adres: `https://iztem-temizlik.github.io/koltuk-klima-temizleme/`
- Hedef marka alan adı (henüz satın alma/uygunluk onayı yok): `iztem.com.tr`

## Cloudflare Pages ilk yayın

1. Cloudflare hesabıyla oturum aç: <https://dash.cloudflare.com/>.
2. **Workers & Pages > Create application > Pages > Import an existing Git repository** yolunu izle.
3. GitHub'a bağlan ve `iztem-temizlik/koltuk-klima-temizleme` deposuna erişim izni ver.
4. Ayarlar:
   - Proje adı: `iztem` (uygunsa; farklı ad seçilebilir)
   - Production branch: `main`
   - Framework preset: `None` / `No framework`
   - Build command: boş bırak (arayüz zorunlu kılıyorsa `exit 0`)
   - Root directory: depo kökü
   - Build output directory: `.` (depo kökü)
5. **Save and Deploy** ile başlat, oluşan `*.pages.dev` adresindeki hizmet sayfalarını kontrol et.

**Not:** Bu test yayını tek başına mevcut GitHub Pages sitesini değiştirmez. Alan adı satın alınmadan, doğrulanmadan ve yeni yayın test edilmeden SEO URL'leri güncellenmez.

## Alan adını bağlama (satın aldıktan sonra)

1. Alan adını Cloudflare hesabına site/zone olarak ekle.
2. Kayıt kuruluşunda Cloudflare'ın verdiği nameserver'ları tanımla.
3. Pages projesinde **Custom domains > Set up a domain** ile `iztem.com.tr` ekle.
4. `www.iztem.com.tr` varyantını bağla ve tek bir kanonik adrese yönlendir.
5. HTTPS, tüm hizmet URL'leri, görseller, telefon/WhatsApp bağlantıları ve 404 sayfasını test et.

Cloudflare resmî belgeleri:
- <https://developers.cloudflare.com/pages/get-started/git-integration/>
- <https://developers.cloudflare.com/pages/framework-guides/deploy-anything/>
- <https://developers.cloudflare.com/pages/configuration/custom-domains/>

## Yayın sonrası yapılacak içerik ve SEO geçişi

**Bu işaretli maddeler henüz uygulanmadı.** Tüm değişiklikler yeni alan adı doğrulanınca yapılacak:

- [ ] HTML sayfalarındaki `canonical`, `og:url`, `og:image` ve yapılandırılmış veri URL'lerini yeni adrese taşı.
- [ ] `sitemap.xml`, `robots.txt`, `llms.txt` ve site içi mutlak URL'leri güncelle.
- [ ] Yeni sitemap'i Search Console ve Bing Webmaster Tools'a gönder.
- [ ] Google İşletme Profili ve sosyal medya sitelerindeki web sitesi bağlantılarını güncelle.
- [ ] Önceki GitHub Pages URL'lerinin arama motorlarına geçişini yönet: mümkün olan yönlendirmeleri kullan, kırık bağlantı bırakma ve eski sayfalara ilişkin indeksleme durumunu kontrol et.
- [ ] Yeni alan adının HTTPS ve Google/Bing indeksleme durumunu denetle.

## Yayın güvenliği

- Mevcut GitHub Pages yayını, yeni site ve tüm gerekli URL'ler test edilmeden kapatılmayacak.
- Alan adı kullanıcı hesabında kalacak; parola, kart bilgileri veya güvenlik kodları paylaşılmayacak.
- Marka hakkı değerlendirmesi kullanıcı tarafından ayrıca yürütülüyor; burada alan adının hukuki kullanılabilir olduğu varsayılmıyor.
