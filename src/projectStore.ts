import { app } from "./firebaseConf";
import { writable, get as getStore} from "svelte/store";
import { getDatabase, ref, onValue, set, get, type DatabaseReference } from "firebase/database";
import DEBUGMODE from "./DebugPanel.svelte";
import type { Project, Persona, Invitation } from "./interfaces";
import { usersDBStore } from "./usersDBStore";
import { userStore } from "./loginStore";

// STORES
export const projectsStore = writable<Record<string, Project>>({});
export const selectedProjectId = writable<string | undefined>(undefined);
export const selectedProject = writable<Project | undefined>(undefined);

// FIREBASE STUFF
const rtDatabase = getDatabase(); // istanza del mio Real Time Database di Firebase
const allProjectsRef = ref(rtDatabase, 'projects/'); // riferimento al nodo 'projects' del mio database

// quando il nodo 'projects' cambia nel db, sincronizza il mio store con i dati aggiornati
// TODO: cambiare con mi prendo solo i progetti a cui l'utente ha accesso
onValue(allProjectsRef, (snapshot) => {
    const unfilteredProjects = snapshot.val();
    const filteredProjects = filterProjects(unfilteredProjects);
    projectsStore.set(filteredProjects);
});

// quando userProjects (es: utente è stato aggiunto a un progetto) o un singolo progetto (progetto modificato) cambiano, aggiorna projectsStore
usersDBStore.userProjectsList.subscribe((newUserProjectsList) => {
    if (!newUserProjectsList) {
        projectsStore.set({});
        return;
    }

    for (const projectId of newUserProjectsList) {
        const projectRef = ref(rtDatabase, `projects/${projectId}`);
        onValue(projectRef, (snapshot) => {
            const projectValue = snapshot.val();
            projectsStore.update((projects) => {
                projects[projectId] = projectValue;
                return projects;
            });
        }
        );
    }
});



// when the selectedProjectId store changes, update the selectedProject
// also: keep the selectedProjectId in sync with the selectedProject
selectedProjectId.subscribe((newSelectedProjectId) => {
    if (!newSelectedProjectId) {
        selectedProject.set(undefined);
        return;
    }

    const selectedProjectRef = ref(rtDatabase, `projects/${newSelectedProjectId}`);
    
    onValue(selectedProjectRef, (snapshot) => {
        const selectedProjectValue = snapshot.val();
        if(!selectedProjectValue) {
            console.error('selectedProjectId: no data available in snapshot');
            return;
        }
        if(!checkProjectRights(selectedProjectValue)) {
            console.error('selectedProjectId: user has no rights to access this project (but the db returned it anyway). critical error in the db rules, this should not happen');
            return;
        }
        selectedProject.set(selectedProjectValue);
    }
    );
});



// ONE TIME GETTERS ----

// GETPROJECT (in addition to the realtime one)
export function getProject(projectId: string | undefined): Promise<Project | undefined> {
    if (!projectId || projectId === '') {
        console.error('getProject: missing projectId. Cannot get project.');
        return Promise.resolve(undefined);
    }

    const projectRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}`);

    return get(projectRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
               // console.log('getProject: returning', JSON.stringify(snapshot.val()));
                return snapshot.val();
            } else {
                console.error('getProject: no data available');
                return undefined;
            }
        })
        .catch((error) => {
            console.error('getProject: error getting data:', error);
            return undefined;
        });
}






// SETTERS -------

// TODO: aggiornare solo la singola persona in realtime? con "applying your changes" e "your changes are up to date"?

// aggiorna il nodo 'projects' con dati nuovi 
export async function editProject(projectId: string | undefined, newProject: Project | undefined) {

    if(DEBUGMODE) console.log('funzione chiamata con valori editProject(', projectId, ',', newProject, ')');

    if (!projectId || projectId === '' || !newProject) {
        console.error('editProject: missing projectId or newProject. Cannot edit project.');
        return;
    }
    const projectRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}`);

    try {
        await set(projectRef, newProject);
        console.log('Project edited successfully.');
    } catch (error) {
        console.error('Project editing failed: ', error); // TODO: gestire meglio l'errore
    }

}

// edit project info
export async function editProjectInfo(projectId: string | undefined, newProjectInfo: Project | undefined) {
    if (!projectId || projectId === '' || !newProjectInfo || !newProjectInfo.prjName || !newProjectInfo.prjDescription) {
        console.error('editProjectInfo: missing projectId or newProjectInfo. Cannot edit project.');
        return;
    }
    const prjNameRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}/prjName`);
    const prjDescriptionRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}/prjDescription`);

    try {
        await set(prjNameRef, newProjectInfo.prjName);
        await set(prjDescriptionRef, newProjectInfo.prjDescription);
        console.log('Project info edited successfully.');
    } catch (error) {
        console.error('Project info editing failed: ', error);
    }
}

// delete project
export async function deleteProject(projectId: string | undefined) {
    if (!projectId || projectId === '') {
        console.error('deleteProject: missing projectId. Cannot delete project.');
        return;
    }

    const projectRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}`);

    try {
        await set(projectRef, null); //TODO: sure?
        console.log('Project deleted successfully.');
    } catch (error) {
        console.error('Project deletion failed: ', error);
    }
}

// delete persona
export async function deletePersona(projectId: string | undefined, personaId: string | undefined) {
    if (!projectId || projectId === '' || !personaId || personaId === '') {
        console.error('deletePersona: missing projectId or personaId. Cannot delete persona.');
        return;
    }

    const personaRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}/personas/${personaId}`);
    try{
        await set(personaRef, null);
        console.log('Persona deleted successfully.');
    } catch (error) {
        console.error('Persona deletion failed: ', error);
    }
}

// set persona
export async function setPersona(projectId: string | undefined, personaId: string | undefined, newPersona: Persona | undefined) {
    if (!projectId || projectId === '' || !personaId || personaId === '' || !newPersona) {
        console.error('setPersona: missing projectId or personaId or newPersona. Cannot set persona.');
        return;
    }

    const personaRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}/personas/${personaId}`);

    try {
        await set(personaRef, newPersona);
        console.log('Persona set successfully.');
    } catch (error) {
        console.error('Persona setting failed: ', error);
    }
}






// MANIPOLAZIONE DEI DATI-------------------

function filterProjects(unfilteredProjects: any) { // TODO: rimuovere?
    // TODO: implementare politica di sicurezza nel realtime database
    // TODO: implementare la funzione che filtra i progetti in base all'utente loggato, se ce ne sono in più, è un errore - il database dovrebbe restituire solo i progetti su cui l'utente ha diritto
    return unfilteredProjects;
}

// check if the user has rights on the project, if not, return false, and notify that c'è un errore nelle rules del sb, perché non dovrebbe essere possibile
function checkProjectRights(prj: Project):boolean {

    const currUserID = getStore(userStore)?.uid;
    if(currUserID == prj.owner) return true;
    //TODO: handle invites if(prj.invitedUsers.includes(currUserID)) return true;

    return false;
}





