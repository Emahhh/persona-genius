import { getDatabase, ref, onValue, set, get, type DatabaseReference } from "firebase/database";

const rtDatabase = getDatabase(); // istanza del mio Real Time Database di Firebase

// TODO: crea database rules per users
// TODO: crea database con i dati degli utenti o elimina questo file
// get username from uid
export async function getUsername(uid: string | undefined): Promise<string> {
    if (!uid || uid === '') {
        console.error('getUsername: missing uid. Cannot get username.');
        return Promise.resolve("Unknown");
    }
    const usernameRef: DatabaseReference = ref(rtDatabase, `users/${uid}/username`);
    let returningUsername = "Unknown";

    try {
        const snapshot = await get(usernameRef);
        if (snapshot.exists()) {
            returningUsername = snapshot.val();
        } else {
            console.error('getUsername: no data available in snapshot');
            returningUsername = "Unknown";
        }
    } catch (error) {
        console.error('getUsername: error getting data:', error);
        returningUsername = "Unknown";
    }

    return Promise.resolve(returningUsername);
}