import { getDatabase, ref, onValue, set, get, type DatabaseReference } from "firebase/database";
import { writable, type Writable } from "svelte/store";
import { userStore } from "./loginStore";


interface UserRecord {
    displayUsername: string;
    projects?: Record<string, boolean>;
}


const rtDatabase = getDatabase(); // istanza del mio Real Time Database di Firebase

// TODO: crea database rules per users
// TODO: crea database con i dati degli utenti o elimina questo file




// get username from uid
async function getUsername(uid: string | undefined): Promise<string> {
    if (!uid || uid === '') {
        console.error('getUsername: missing uid. Cannot get username.');
        return Promise.resolve("Unknown");
    }
    const usernameRef: DatabaseReference = ref(rtDatabase, `users/${uid}/displayUsername`);
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


// currentUserDBStore is a store that contains the data of the current user, retrieved from the "users" database
// if there is no entry for the current user, it will be created (it should only happen when the user logs in for the first time)
const currentUser: Writable<UserRecord> = writable<UserRecord>({ displayUsername: "Unknown", projects: {} });

// when the userStore changes, update the currentUserDBStore
userStore.subscribe((newUser) => {
    if (!newUser) {
        currentUser.set({ displayUsername: "Unknown", projects: {} });
        return;
    }

    const currentUserRef: DatabaseReference = ref(rtDatabase, `users/${newUser.uid}`);

    onValue(currentUserRef, (snapshot) => { // keeps the local store in sync with the database
        const currentUserValue = snapshot.val();

        if (!currentUserValue) {
            // user does not exist in the database, create a new entry (should only happen when the user logs in for the first time)
            const newUserRecord: UserRecord = {
                displayUsername: newUser.displayName ?? newUser.email ?? "Unknown",
                projects: {}
            };
            set(currentUserRef, newUserRecord);
            currentUser.set(newUserRecord);
            console.log('currentUserDBStore: new user initialized in the users/ database');

        } else {
            currentUser.set(currentUserValue);
        }
    });

});









// store containing a list of project ids that the current user is a member of
const userProjectsList = writable<string[]>([]);
currentUser.subscribe((newUserDB) => {
    if (!newUserDB) {
        userProjectsList.set([]);
        return;
    }

    const userProjectsListValue = newUserDB.projects;
    if (!userProjectsListValue){
        userProjectsList.set([]);
    }else{
        userProjectsList.set(Object.keys(userProjectsListValue));
    }
});


// add a project to the user's projects list
async function addPrjToUser(uid: string, prjid: string):Promise<void>{
    const userProjectsListRef: DatabaseReference = ref(rtDatabase, `users/${uid}/projects/${prjid}`);
    try {
        await set(userProjectsListRef, true);
    } catch (error) {
        console.error('addUserProject: error setting data:', error);
    }
}

export const usersDBStore = { getUsername, currentUser, userProjectsList , addPrjToUser  };
