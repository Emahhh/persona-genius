import { getDatabase, onValue, ref } from "firebase/database";
import { writable } from "svelte/store";

const db = getDatabase();


export const isOnline = writable(false);
{ // sets isOnline store to true when connected to firebase, false when not
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
        isOnline.set(true);
    } else {
        isOnline.set(false);
    }
});
}