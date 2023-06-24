<script lang="ts">
    import DebugPanel from "../DebugPanel.svelte";
    import {
        projectsStore,
        selectedProjectId,
        editProject,
        
    } from "../stores/projectStore";
    import { userStore } from "../stores/loginStore";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import type { Project } from "../utils/interfaces";
    import { usersDBStore } from "../stores/usersDBStore";
    import UserInfo from "../UserInfo.svelte";
    import { invitesStore } from "../stores/invitesStore";
    import JoinOrCreateProject from "./JoinOrCreateProject.svelte";

    const myInvites = invitesStore.myInvites;

    const currentUser = usersDBStore.currentUser;
    let joinDialogOpen:boolean = false;

    function handleAddButton(): void { 
        joinDialogOpen = true;
    }


</script>

{#if joinDialogOpen}
    <JoinOrCreateProject bind:joinDialogOpen={joinDialogOpen} />
{/if}


<div class="panelTitle">
    <h4>Project Picker: Apri un progetto, o creane uno nuovo.</h4>
</div>

<div class="main-container grid"> <!-- TODO: sostituire con CSS migliore -->
    <div class="project new-project" on:click={() => handleAddButton()}>
        <span class="projectName">+</span> 
        <br />
        <span class="createdBy">Create new project or join one.</span>
    </div>
    
    {#each Object.entries($projectsStore) as [projectId, project]} <!-- TODO: show loading? -->
        {#if projectId && project && project.prjName && project.owner}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="project" on:click={() => selectedProjectId.set(projectId)}>
                <span class="projectName">{project.prjName}</span>
                <br />

                {#await usersDBStore.getUsername(project.owner)}
                    <span class="loading">Loading...</span> <!--TODO: remove message while loading and while error so that its nicer-->
                {:then username}
                    <span class="createdBy">Created by<br /><b>{username}</b></span> <!-- TODO: check if created by ME-->
                {:catch error}
                    <span class="error">Error: {error.message}</span>
                {/await}

            </div>
        {/if}

    {/each}
    
</div>

<DebugPanel variables={[$myInvites, $selectedProjectId, $projectsStore, $userStore, $currentUser]} varNames={"$myInvites, $selectedProjectId, $projectsStore, $userStore, $currentUser"} />

<style>
    :root{
        --project-width: 200px;
    }
    .panelTitle {
        margin-bottom: 10px;
        margin-top: 20px;
        justify-content: center;
        display: flex;
    }
    .panelTitle h4 {
        margin-bottom: 5px;
    }


    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(var(--project-width), 1fr)); /* TODO: sostituire con CSS migliore */
        grid-template-rows: repeat(auto-fill, minmax(var(--project-width), 1fr));
        justify-items: center;
        row-gap: 10px;
    }
    .project {
        width: var(--project-width);
        height: var(--project-width);
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
