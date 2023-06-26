import { app } from "../utils/firebaseConf";
import { writable, get as getStore} from "svelte/store";
import { getDatabase, ref, onValue, set, get, type DatabaseReference } from "firebase/database";
import DEBUGMODE from "../DebugPanel.svelte";
import type { Project, Persona } from "../utils/interfaces";
import { usersDBStore } from "./usersDBStore";
import { userStore } from "./loginStore";
import { notifications } from "../utils/notifications";

// STORES
export const projectsStore = writable<Record<string, Project>>({});
export const selectedProjectId = writable<string | undefined>(undefined);
export const selectedProject = writable<Project | undefined>(undefined);

const rtDatabase = getDatabase(); // istanza del mio Real Time Database di Firebase
const allProjectsRef = ref(rtDatabase, 'projects/'); // riferimento al nodo 'projects' del mio database


// SYNC

async function onValueErrorCallback(error: Error) {
    console.error('onValue: error getting data:', error);
}

// to keep the list of projects in sync with the database
// triggerata: quando userProjects cambia (es: user ha creato un nuovo progetto)
// o quando un singolo progetto (progetto modificato) cambia
// effetto: aggiorna projectsStore con i dati aggiornati dei progetti a cui l'utente ha accesso
usersDBStore.userProjectsList.subscribe((newUserProjectsList) => {
    if (!newUserProjectsList) {
        projectsStore.set({});
        return;
    }
    for (const projectId of newUserProjectsList) {
        const projectRef = ref(rtDatabase, `projects/${projectId}`);

        onValue(projectRef, (snapshot) => {
            console.log('change detected in project', projectId, 'updating projectsStore with the value of the project...');

            const projectValue = snapshot.val();
            if (!projectValue) {
                console.log('userProjectsList: no data found for project', projectId, ". This is normal if the project has been deleted");
                projectsStore.update((projects) => {
                    delete projects[projectId];
                    return projects;
                });
                return;
            }
            if(!checkProjectRights(projectValue)) {
                console.error('selectedProjectId: user has no rights to access this project (but the db returned it anyway). critical error in the db rules, this should not happen');
                projectsStore.update((projects) => {
                    delete projects[projectId];
                    return projects;
                });
                return;
            }

            notifyIfNewCollaborators(getStore(projectsStore)[projectId], projectValue);

            projectsStore.update((projects) => {
                projects[projectId] = projectValue;
                return projects;
            });

        }, 
        onValueErrorCallback
        );
    }
});


// to keep the selectedProjectId in sync with the database
// when the selectedProjectId store changes (cioè user selects a new id), update the selectedProject w the value
selectedProjectId.subscribe((newSelectedProjectId) => {
    if (!newSelectedProjectId) {
        selectedProject.set(undefined);
        return;
    }

    const selectedProjectRef = ref(rtDatabase, `projects/${newSelectedProjectId}`);
    
    onValue(selectedProjectRef, (snapshot) => {
        const selectedProjectValue = snapshot.val();
        if(!selectedProjectValue) {
            console.log('Trying to get the value of this projectID, but no data found. This is normal if the project has been deleted');
            selectedProject.set(undefined);
            selectedProjectId.set(undefined);
            return;
        }
        if(!checkProjectRights(selectedProjectValue)) {
            console.error('selectedProjectId: user has no rights to access this project (but the db returned it anyway). critical error in the db rules, this should not happen');
            selectedProject.set(undefined);
            selectedProjectId.set(undefined)
            return;
        }
        selectedProject.set(selectedProjectValue);
    },
    onValueErrorCallback
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
    if (!projectId || projectId === ''){
        throw new Error('editProjectInfo: missing projectId. Cannot edit project info.');
    } 
    
    if( !newProjectInfo || !newProjectInfo.prjName || !newProjectInfo.prjDescription) {
        throw new Error('editProjectInfo: missing newProjectInfo. Cannot edit project info. Please fill all the fields!');
    }
    const prjNameRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}/prjName`);
    const prjDescriptionRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}/prjDescription`);


    await set(prjNameRef, newProjectInfo.prjName);
    await set(prjDescriptionRef, newProjectInfo.prjDescription);
    console.log('Project info edited successfully.');
}

// delete project
export async function deleteProject(projectId: string | undefined) {
    if (!projectId || projectId === '') {
        console.error('deleteProject: missing projectId. Cannot delete project.');
        return;
    }

    const projectRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}`);

    try {
        await set(projectRef, null);
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
    if(!currUserID){
        console.error('checkProjectRights: user not logged in');
        return false;
    }

    if(currUserID == prj.owner) return true;
    if( prj.collaborators && prj.collaborators[currUserID]) return true;

    return false;
}

/**
 * Detects if a new collaborator has been added to the project. Id there are, send a notification to the user.
 * @param oldProj the project before the update
 * @param newProj the project after the update
 */
async function notifyIfNewCollaborators(oldProj: Project, newProj: Project){

    if(!oldProj.collaborators) oldProj.collaborators = {};
    if(!newProj.collaborators) newProj.collaborators = {};

    const oldCollaborators = Object.keys(oldProj.collaborators);
    const newCollaborators = Object.keys(newProj.collaborators);

    const newCollaboratorsIds = newCollaborators.filter((id) => !oldCollaborators.includes(id));

    if(newCollaboratorsIds.length > 0){
        const newCollaboratorsNames = await Promise.all(newCollaboratorsIds.map(async (id) => {
            return await usersDBStore.getUsername(id) ?? 'unknown';
        }));

        const newCollaboratorsNamesString = newCollaboratorsNames.join(', ');

        notifications.send("New collaborators added!", `${newCollaboratorsNamesString} have been added to the project ${newProj.prjName}.`);
    }
}




