import { writable } from "svelte/store";

export interface Project {
    name: string;
    id: number;
}

export let projects: Project[] = [
    { name: "Project 1", id: 1 },
    { name: "Project 2", id: 2 },
    { name: "Project 3", id: 3 },
];

export function getProject(id: number): Project | undefined {
    return projects.find((p) => p.id === id);
}


export const selectedProjectId = writable<number | undefined>(undefined);



