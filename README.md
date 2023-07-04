<!-- ---
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
... -->

# Persona Genius

A project for my Web App Development course at the University of Pisa.
Implemented using Svelte and Firebase.
Try it live at: <https://saw-prova.web.app/>. 

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
{

  "invites": {
    "inviteID-07cc-4dfc-8b44": {
      "exp": "999",
      "prjID": "999",
      "prjName": "Prova",
      "senderUID": "uidpersona-07cc-4dfc-8b44"
    }
  },

  "projects": {
    "09b5e0d5-21b2-41a4-a352-d45d9472cfd2": {
      "owner": "ScWr1bpNiIYWZ4FoBRiZvRJHPGD2",
      "desc": "...",
      "name": "New Project",
      "personas": {
        "4b183376-07cc-4dfc-8b44-9ccfe9cef1ef": {
          "desc": "...",
          "frustrations": "...",
          "goals": "...",
          "image": "https://...",
          "job": "...",
          "name": "...",
          "needs": "..."
        }
      }
    }
  },

  "users": {
    "3dBvVut6XWYPsgm8I3iFBocB3Ri2": {
      "displayName": "Emanuele Buonaccorsi",
      "projects": {
        "dc9c8ee6-d262-45a4-a1d5-e674ca906f38": true,
        "09b5e0d5-21b2-41a4-a352-d4589472cfd2": true
      }
    }
  }

}


````

Il database è configurato con **regole di sicurezza** che permettono agli utenti di accedere solo ai progetti di cui sono proprietari o collaboratori e di modificare solo i dati relativi al proprio account.

### Cloud Functions

Persona Genius utilizza due Firebase Cloud Functions con il trigger **onRequest**, che vengono attivate quando un utente effettua una **richiesta HTTP**.
Sono testabili in locale con l'ausilio di [Firebase Emulators](https://firebase.google.com/docs/functions/get-started?gen=2nd#set-up-your-environment-and-the-firebase-cli).

- `acceptInvite`: Questa cloud function viene chiamata quando un utente desidera accettare un invito. La funzione verifica la validità del codice di invito e la sua non scadenza. Se il codice è valido, l'utente viene aggiunto al progetto, e i dati vengono **modificati nel database** in modo appropriato.

- `generatePersona`: Questa cloud function viene chiamata quando un utente vuole generare una persona. La funzione effettua una chiamata all'**API di OpenAI utilizzando un token di autenticazione segreto**, nascosto in questo modo al client. La richiesta si basa su un prompt generato utilizzando la descrizione del progetto. Verrà quindi restituita una User Persona sotto forma di JSON, generata dall'intelligenza artificiale.

esempio di richiesta sottoposta a `generatePersona`:
```jsonc
const prompt = "You will generate a JSON representing a UX persona. Your response MUST be valid JSON. Your response can only contain JSON, nothing more. And it must include these fields. They are all strings: name, description, goals, needs, frustrations, job. You will complete these field inventing an effective and useful persona for a project with the following description: a collaborative web app that helps teams generate user personas with ai"
```

e relativa risposta:
```jsonc
{
    "description": "Alicia is a curious and detail-orientated UX researcher who works for a tech company in San Francisco.",
    "name": "Alicia Nguyen", 
    "goals": "Alicias primary goal is to help her team create detailed user ...",
    "needs": "Alicias key needs include a collaborative platform where her team can ...",
    "frustrations": "Alicia is frustrated by outdated tools and conventional...",
    "job": "As a UX researcher, Alicia needs to be able to provide in-depth..."
}
```
