# N & M Vaktmesterservice AS – Konverteringsoptimal nettside

## Prosjektmål
Bygge en moderne, profesjonell og konverteringsoptimal nettside for et norsk vaktmesterfirma med fokus på borettslag, sameier, næringseiendom og privatpersoner.

## Ferdig implementert funksjonalitet
- Hero-seksjon med verdibasert overskrift og to tydelige CTA-knapper
- Tjenesteseksjon direkte etter hero med tydelig oversikt og konsise beskrivelser
- Om oss-seksjon med kort presentasjon av selskapet
- Avsluttende CTA-seksjon helt til slutt
- Skandinavisk, minimalistisk design med mørk blå, hvit og grå palett
- Moderne kortdesign med ikoner og hover-effekter
- Strammere spacing og typografi for et mer premium uttrykk
- Tjenestekort i 2 kolonner på desktop og 1 kolonne på mobil
- Forbedrede knapper, kort og navigasjon for tydeligere CTA og kontrast
- Mobiloptimalisert layout med hamburger-meny, scroll-lock og slide-in navigasjon
- Integrert firmalogo i header, footer og favicon
- Tydelige CTA-knapper med hover-effekter og forbedret spacing
- Kontaktskjema med frontend-validering, feilmeldinger og suksessmelding (Formspree-integrasjon) på egen kontaktside
- SEO-utvidelser med Open Graph, Twitter card, canonical, robots og LocalBusiness schema
- Ytelsesforbedringer: lazy loading, bildedimensjoner og faste aspektforhold for å unngå forvrengning
- Tilgjengelighet: skip-to-content, fokusmarkering, aria-current og back-to-top-knapp
- Respekterer prefers-reduced-motion for redusert bevegelse
- GDPR-vennlig informasjonstekst (ingen informasjonskapsler)

## Funksjonelle inngangspunkter (URIer)
- `/index.html` – Hovedside
- `/contact.html` – Kontakt og skjema
- `/404.html` – Feilside
- Interne ankerlenker:
  - `#tjenester`
  - `#om`

## Kort sjekkliste (tekniske endringer)
- Oppdatert container til 1100px maks og 20px inline-padding
- Strammet hero-padding og satt H1-størrelse til 40px/30px
- Tjenestekort: 2 kolonner desktop, 1 kolonne mobil, ny border/shadow
- Standardisert knappestil og hover-effekt
- Justert seksjons-padding og footer til mørk, sentrert layout

## Ikke implementert (enda)
- Server-side e-postintegrasjon
- CRM-integrasjon eller database for lead-lagring
- Flerspråklig innhold

## Anbefalte neste steg
- Koble kontaktskjema til ekstern form-tjeneste med CORS (f.eks. Formspree) for direkte innsending
- Legge til tjenesteområder og konkrete leveransebeskrivelser
- Implementere sporing av CTA-klikk (f.eks. uten cookies)

## Offentlige URL-er
- Produksjon: Ikke publisert (bruk Publish-fanen for å publisere)
- API-endepunkter: Ingen

## Datamodeller og lagring
- Ingen databaser eller tabeller benyttes
- Ingen eksterne lagringstjenester integrert

## Prosjektstruktur
- `index.html`
- `css/style.css`
- `js/main.js`
- `images/logo.png`
- `contact.html`
- `images/logo-mark.png`
- `404.html`
