# LinkedIn Ads Scraper

Questo scraper usa Playwright (via Crawlee) per raccogliere dati dalla LinkedIn Ads Library
di un elenco di aziende. Estrae headline, testo annuncio, formati, link e impression per nazione.

## Come funziona

- Inserisci le URL della Ads Library (es. `https://www.linkedin.com/ad-library/search?accountOwner=stripe`)
- Lo scraper visita ogni pagina e raccoglie i dati pubblici delle campagne
- I dati vengono salvati in un dataset esportabile in CSV/JSON

## Dipendenze
- Node.js
- Crawlee ^3.7.0
- Playwright (incluso tramite Crawlee)
