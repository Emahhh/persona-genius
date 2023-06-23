import { writable, get as getStore} from "svelte/store";
import { getDatabase, ref, onValue, set, get, type DatabaseReference } from "firebase/database";
import DEBUGMODE from "../DebugPanel.svelte";
import type { Project, Persona } from "../utils/interfaces";

export interface Invitation {
    invitedUserId: string;
    status: string;
    timestamp: string;
}


// STORES
const myInvites = writable<Record<string, Invitation>>({}); // invites of the current user

// TODO: add uid to the project - here:  invitedUsers: Record<string, boolean>;
// TODO: check for new invites - if there are send a notification
// TODO: function to send new invite


export const invitesStore = { myInvites };