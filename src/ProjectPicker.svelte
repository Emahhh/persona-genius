<script lang="ts">
    import DebugPanel from "./DebugPanel.svelte";
    import {
        projectsStore,
        type Project,
        selectedProjectId,
    } from "./projectStore";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
</script>

<p>Apri un progetto, o creane uno nuovo.</p>
<div class="main-container grid">
    <div class="project new-project">+</div>
    {#each Object.entries($projectsStore) as [projectId, project]}
        <div class="project" on:click={() => selectedProjectId.set(projectId)}>
            <span class="projectName">{project.prjName}</span>
            <br />
            <span class="createdBy">Created by <br/> <b>{project.owner}</b></span>
        </div>
    {/each}
</div>

<DebugPanel />

<style>
    .project {
        width: 200px;
        height: 200px;
        background-color: #ccc;
        margin: 5px;
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
