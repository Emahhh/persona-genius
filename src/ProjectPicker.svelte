<script lang="ts">
    import DebugPanel from "./DebugPanel.svelte";
    import {
        projectsStore,
        type Project,
        selectedProjectId,
        editProject,
    } from "./projectStore";
    import { userStore } from "./loginStore";
    import { onMount } from "svelte";
    import { get } from "svelte/store";


    function newProject(): void { 
        if (!get(userStore)?.uid) {
            console.log("Error: user undefined.");
            return;
        }

        const newProjectId = crypto.randomUUID();
        const newProject: Project = {
            prjName: "New Project",
            owner: get(userStore)!.uid,
            personas: {},
            prjDescription: "A wonderful new service that will change the world.",
            invitedUsers: {}
        };

        editProject(newProjectId, newProject);
        console.log("new project id: ", newProjectId);
    }
</script>

<div class="panelTitle">
    <h4>Project Picker: Apri un progetto, o creane uno nuovo.</h4>
</div>

<div class="main-container container"> <!-- TODO: sostituire con CSS migliore -->
    <div class="project new-project" on:click={() => newProject()}>+</div>
    
    {#each Object.entries($projectsStore) as [projectId, project]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="project" on:click={() => selectedProjectId.set(projectId)}>
            <span class="projectName">{project.prjName}</span>
            <br />
            <span class="createdBy"
                >Created by <br /> <b>{project.owner}</b></span
            >
        </div>
    {/each}
    
</div>

<DebugPanel variables={[$selectedProjectId]} varNames={"$selectedProjectId"} />

<style>
    .panelTitle {
        margin-bottom: 10px;
        margin-top: 20px;
        justify-content: center;
        display: flex;
    }
    .panelTitle h4 {
        margin-bottom: 5px;
    }
    .project {
        width: 200px;
        height: 200px;
        background-color: #ccc;
        margin: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        border-radius: 10px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.361);
        transition: box-shadow 0.3s ease; /* per l'hover */
    }

    .project:hover {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.523);
    }

    .projectName {
        margin-bottom: 5px;
    }

    .createdBy {
        font-size: 10px;
        font-weight: normal;
    }

    .new-project {
        background-color: #99ccff;
        color: white;
    }
</style>
