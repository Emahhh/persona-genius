import { app } from "./firebaseConf";
import { writable } from "svelte/store";
import { getDatabase, ref, onValue, set, type DatabaseReference } from "firebase/database";
import DEBUGMODE from "./DebugPanel.svelte";
import type { Project, Persona, Invitation } from "./interfaces";

// STORES
export const projectsStore = writable<Record<string, Project>>({});
export const selectedProjectId = writable<string | undefined>(undefined);
export const selectedProject = writable<Project | undefined>(undefined);

// FIREBASE STUFF

const rtDatabase = getDatabase(); // istanza del mio Real Time Database di Firebase

const allProjectsRef = ref(rtDatabase, 'projects/'); // riferimento al nodo 'projects' del mio database

// quando il nodo 'projects' cambia, aggiorna il mio store con i dati aggiornati
onValue(allProjectsRef, (snapshot) => {
    const unfilteredProjects = snapshot.val();
    const filteredProjects = filterProjects(unfilteredProjects);
    projectsStore.set(filteredProjects);
});

// when the selectedProjectId changes, update the selectedProject
selectedProjectId.subscribe((newSelectedProjectId) => {
    if (!newSelectedProjectId) {
        selectedProject.set(undefined);
        return;
    }

    const selectedProjectRef = ref(rtDatabase, `projects/${newSelectedProjectId}`);
    onValue(selectedProjectRef, (snapshot) => {
        const selectedProjectValue = snapshot.val();
        selectedProject.set(selectedProjectValue);
    }
    );
});



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

function filterProjects(unfilteredProjects: any) {
    // TODO: implementare politica di sicurezza nel realtime database
    // TODO: implementare la funzione che filtra i progetti in base all'utente loggato, se ce ne sono in più, è un errore - il database dovrebbe restituire solo i progetti su cui l'utente ha diritto
    return unfilteredProjects;
}


