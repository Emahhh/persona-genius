import { app } from "./firebaseConf";
import { writable } from "svelte/store";
import { getDatabase, ref, onValue, set, type DatabaseReference } from "firebase/database";



// INTERFACES
export interface Project {
    prjName: string;
    owner: string;
    invitedUsers: Record<string, Invitation>;
    personas: Record<string, Persona>;
}

export interface Invitation {
    status: string;
    timestamp: string;
}

export interface Persona {
    // id: string; // attenzione, l'ID è dentro l'oggetto o fuori come record?
    name: string;
    description: string;
    goals: string;
    needs: string;
    frustrations: string;
    image: string;
    job: string;
    // TODO: inserire per ordinare? lastEdit: string;
    // TODO: chat?
}

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

// aggiorna il nodo 'projects' con dati nuovi
export function editProject(projectId: string | undefined, newProject:  Project | undefined) {
    if (!projectId || projectId === '' || !newProject) {
        console.error('editProject: missing projectId or newProject. Cannot edit project.');
        return;
    }
    const projectRef: DatabaseReference = ref(rtDatabase, `projects/${projectId}`);
    set(projectRef, newProject).then(() => {
        console.log('Project edited successfully.');
    }).catch((error) => {
        console.error('Project editing failed: ', error);
        alert('Project editing failed. See console for details.');  // TODO: gestire meglio l'errore
    });
}


// MANIPOLAZIONE DEI DATI

function filterProjects(unfilteredProjects: any) {
    // TODO: implementare politica di sicurezza nel realtime database
    // TODO: implementare la funzione che filtra i progetti in base all'utente loggato, se ce ne sono in più, è un errore - il database dovrebbe restituire solo i progetti su cui l'utente ha diritto
    return unfilteredProjects;
}


