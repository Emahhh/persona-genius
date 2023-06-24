import { writable, get as getStore} from "svelte/store";
import { getDatabase, ref, onValue, set, get, type DatabaseReference } from "firebase/database";
import DEBUGMODE from "../DebugPanel.svelte";
import type { Project, Persona } from "../utils/interfaces";
import { userStore } from "./loginStore";
import axios, { AxiosError } from "axios";

export interface Invitation {
    projectId: string;
    projectName: string;
    expiration: string;
    senderUID: string;
}

/*
Idea: 
- ogni utente può invitare altri utenti a partecipare ai suoi progetti
- utente che vuole invitare crea un invito e ottiene un codice
- invito viene salvato nel nodo "invites" e nel nodo progetto/sentInvites
- l'utente invia manualmente il codice all'utente che vuole invitare

- l'utente che riceve il codice può accettare o rifiutare l'invito inserendo il codice in un form
- se l'utente accetta l'invito, una cloud function
    - controlla che il codice sia valido e non scaduto (se è scaduto, l'invito viene cancellato)
    - aggiunge l'utente alla lista degli utenti invitati del progetto
    - aggiunge il progetto alla lista dei progetti dell'utente
*/


// STORES
const myInvites = writable<Record<string, Invitation>>({}); // invites of the current user
// TODO: rimuovere?

// TODO: add uid to the project - here:  invitedUsers: Record<string, boolean>; e tenerli in sync
// TODO: check for new invites - if there are send a notification
// TODO: function to send new invite

const rtDatabase = getDatabase(); // istanza del mio Real Time Database di Firebase





async function createInvite(projectId: string, projectName: string, expiration: string): Promise<string> {
    // create a new invite for the current user
    const uid = getStore(userStore)?.uid;
    const projectRef = ref(rtDatabase, `projects/${projectId}`);

    if (!(await get(projectRef)).exists()) {
        throw new Error(`Project ${projectId} does not exist`);
    }
    if( (await get(ref(rtDatabase, `projects/${projectId}/owner`))).val() !== uid) {
        throw new Error(`User ${uid} is not the owner of project ${projectId}`);
    }

    const inviteUID: string = crypto.randomUUID();
    const invite: Invitation = {
        projectId: projectId,
        projectName: projectName ?? "Unknown",
        expiration: expiration,
        senderUID: getStore(userStore)?.uid ?? "Unknown",
    }
    try{
        await set(ref(rtDatabase, `invites/${inviteUID}`), invite);
        await set(ref(rtDatabase, `projects/${projectId}/sentInvites/${inviteUID}`), true);
    }  catch (e) {
        throw new Error(`Error creating invite: ${e}`);
    }
    return inviteUID;
}

async function acceptInvite(inviteUID: string, myUserUID: string): Promise<string> {
    // accept an invite by sending the inviteUID to a cloud function
    let response;
    try {
        response = await axios.post("https://acceptinvite-nq7k3rf5jq-uc.a.run.app", {
            inviteUID: inviteUID,
            myUserUID: myUserUID,
        });
        // Process the successful response here
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const response = axiosError.response;
            if (response) {
                throw new Error(`Error from cloud function: ${response.status} ${response.statusText} ${response.data}`);
            } else {
                throw new Error(`Error from axios: ${axiosError.message}`);
            }
        } else {
            throw new Error(`Error: ${error}`);
        }
    }


    // TODO: far restituire projectID dalla cloud function

    console.log("Invite accepted successfully");

    if (!response.data.projectId) throw new Error("ProjectId has value ", response.data.projectId);

    return response.data.projectId
}


// TODO: completare e usarla in InfoEditor
async function getInvite(inviteUID: string): Promise<Invitation> {
    // get an invite from the database
    return {} as Invitation;
}


export const invitesStore = { myInvites, createInvite, acceptInvite, getInvite };