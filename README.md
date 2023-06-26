---
# compila pdf con:
# pandoc readme.md -o relazione.pdf --from markdown --template eisvogel --listings
titlepage: true
title: "Persona Genius"
subtitle: "Progetto per il corso di Sviluppo Applicazioni Web - UniPi 22/23"
author: [Emanuele Buonaccorsi - 598855]
lang: "it"

titlepage-color: "d8f3dc"
listings-disable-line-numbers: true
titlepage-text-color: "081c15"
titlepage-rule-color: "360049"
titlepage-rule-height: 0

toc-own-page: true
toc-title: "Indice"
toc: true
...

## Introduzione

### Idea

Persona Genius è un'applicazione per la creazione e gestione **collaborativa** di user personas, strumenti utilizzati nel campo del design e dello sviluppo per rappresentare i diversi tipi di utenti target di un prodotto o servizio. L'applicazione offre funzionalità per agevolare i piccoli team nella creazione delle user personas, sfruttando anche l'**intelligenza artificiale** (tramite delle chiamate API) per generarle.

### Implementazione
Persona Genius è stato implementato utilizzando il framework Svelte. Per il backend, sono state utilizzate le Firebase Cloud Functions e il Firebase Realtime Database.

## Funzionalità
**Creazione e Modifica dei Progetti**
Ogni utente può creare diversi progetti all'interno di Persona Genius. Ogni progetto può rappresentare un prodotto, come ad esempio un'applicazione, un sito web o un servizio. Durante la creazione del progetto, l'utente inserisce una **descrizione** che verrà utilizzata successivamente come prompt per l'intelligenza artificiale.

**Generazione di User Personas**
Dopo aver creato un progetto, l'utente ha la possibilità di generare nuove User Personas utilizzando l'apposito pulsante. Quando viene premuto il bottone, viene inviata una richiesta API alla Firebase Cloud Function, che a sua volta effettua una **richiesta all'API di OpenAI**. Verrà quindi restituita una User Persona inventata dall'intelligenza artificiale basandosi sulla descrizione del progetto.

**Modifica delle User Personas**
Una volta create, **le User Personas possono essere modificate** dall'utente secondo le necessità. Questo permette di personalizzare le personas in base alle caratteristiche specifiche dei utenti target del progetto.

**Funzionalità Avanzate**
Persona Genius è una Progressive Web Application (**PWA**). Inoltre, dispone di una **pagina di fallback** offline che viene mostrata in caso di mancanza di connessione. Nel caso di disconnessione improvvisa, invece, l'applicazione mostra un **indicatore "Offline"**, e quando la connessione viene ripristinata, Firebase cerca di sincronizzare i cambiamenti effettuati offline con il database.
L'applicazione implementa anche le **notifiche**: se un utente si unisce a un progetto, il proprietario del progetto riceverà una notifica. 

### Funzionalità Collaborative
Persona Genius permette agli utenti di **invitare altri collaboratori** ai propri progetti, facilitando così la collaborazione di team. Solo il proprietario del progetto ha il permesso di creare o cancellare inviti. Gli inviti sono costituiti da **un codice** con una scadenza di 3 giorni e possono essere accettati da chiunque. Nel momento in cui un utente inserisce il codice di invito, una cloud function gestisce in modo sicuro l'accettazione dell'invito, aggiungendo l'utente al progetto.

## Backend
Il backend di Persona Genius è composto da due componenti principali: il Realtime Database e le Firebase Cloud Functions.

### Realtime Database
Il Realtime Database è strutturato in tre nodi:

- `projects`: Contiene i dati dei progetti, come la descrizione e le User Personas associate ad essi.

- `users`: Contiene i dati degli utenti, inclusi il nome e gli ID dei progetti di cui sono proprietari o collaboratori.

- `invites`: Contiene i dati degli inviti, inclusi i codici e le relative informazioni.
  
Esempio di schema:

````jsonc

````

Il database è configurato con **regole di sicurezza** che permettono agli utenti di accedere solo ai progetti di cui sono proprietari o collaboratori e di modificare solo i dati relativi al proprio account.

### Cloud Functions

Persona Genius utilizza due Firebase Cloud Functions con il trigger **onRequest**, che vengono attivate quando un utente effettua una **richiesta HTTP**.

- `acceptInvite`: Questa cloud function viene chiamata quando un utente desidera accettare un invito. La funzione verifica la validità del codice di invito e la sua non scadenza. Se il codice è valido, l'utente viene aggiunto al progetto, e i dati vengono **modificati nel database** in modo appropriato.

- `generatePersona`: Questa cloud function viene chiamata quando un utente vuole generare una persona. La funzione effettua una chiamata all'**API di OpenAI utilizzando un token di autenticazione segreto**, nascosto in questo modo al client. La richiesta si basa su un prompt generato utilizzando la descrizione del progetto. Verrà quindi restituita una User Persona sotto forma di JSON, generata dall'intelligenza artificiale.

esempio di richiesta e risposta:

```jsonc

```

