# Bönornas Delikatesser – ny hemsida

Statisk, responsiv one-page-sajt (HTML/CSS/JS) – inga byggsteg eller beroenden.

## Publicera (t.ex. one.com)
Ladda upp allt i mappen till webbrotens `public_html` **utom**:
- `_originalbilder-ladda-ej-upp/` (bilder i full upplösning, ~20 MB)
- `README.md`

`.htaccess` är en dold fil – se till att den följer med. Den tvingar HTTPS, pekar gamla
adresser (`/katalog`, `/faq`, `/kontakt`, `/om`) till rätt ny sida med 301-omdirigering, och slår på
komprimering och cachning.

## Efter publicering
1. Lägg till sajten i **Google Search Console** och skicka in `https://bonornasdelikatesser.se/sitemap.xml`.
2. Kontrollera/uppdatera **Google Företagsprofil** (adress, telefon, öppettider, länk till sajten).
3. Testa strukturerad data på https://search.google.com/test/rich-results

## Att kontrollera innan lansering
- **Facebook-länken** är antagen till `facebook.com/bonornasdelikatesser` – byt ut om sidan har annan adress
  (sök på `facebook.com/bonornasdelikatesser` i `index.html`).
- **Öppettider**: lägg gärna in fasta tider i `index.html` (sektionen "Hitta hit") och i JSON-LD som
  `openingHoursSpecification` – det ger bättre lokal SEO.
- **Kontaktformuläret** öppnar besökarens e-postprogram (mailto). Vill ni att det skickas direkt kan
  `action` på formuläret pekas mot t.ex. Formspree eller one.com:s formulärtjänst.

## Struktur
```
index.html          Startsida: kort om allt, med tydliga vägar vidare
om-oss.html         Butiken, Jessica och historien, leverantörer, bilder
sortiment.html      Ostar, te och kaffe, choklad och lakrits, skafferi, ostpåsar
presentkorgar.html  Så går det till, tillfällen, frågor om presenter
recept.html         Månadens recept, receptarkiv och tips
kontakt.html        Hitta hit med karta, kontaktformulär, vanliga frågor
404.html            Felsida
css/style.css       All design
js/main.js          Meny, animationer, karta, formulär
images/             Webboptimerade bilder (480/960/1600 px)
robots.txt, sitemap.xml, site.webmanifest, favicon.svg, *.png-ikoner, .htaccess
```

Länken `kontakt.html?amne=presentkorg` väljer automatiskt ämnet "Beställa en presentkorg" i formuläret.

## Efter ändringar i CSS eller JavaScript
Servern sparar `css/style.css` och `js/main.js` i besökarnas webbläsare i en månad. Höj versionsnumret
(`?v=2` till `?v=3` och så vidare) i alla HTML-filer när du ändrar dem, så att besökarna får den nya versionen direkt.
