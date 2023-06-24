<script lang="ts">
    import DebugPanel from "../DebugPanel.svelte";
    import {
        projectsStore,
        selectedProjectId,
        editProject,
        
    } from "../stores/projectStore";
    import { userStore } from "../stores/loginStore";
    import { usersDBStore } from "../stores/usersDBStore";

    import JoinOrCreateProject from "./JoinOrCreateProject.svelte";

    const userProjectsList = usersDBStore.userProjectsList;

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

<div class="main-container"> <!-- TODO: sostituire con CSS migliore -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
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

<DebugPanel variables={[$userProjectsList, $selectedProjectId, $projectsStore, $userStore, $currentUser]} varNames={"$userProjectsList, $selectedProjectId, $projectsStore, $userStore, $currentUser"} />

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

    .main-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        align-items: start;
        align-content: start;
    }


    .project {
        aspect-ratio: 1/ 1;
        width: 18%;
        margin: 10px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
        font-size: 16px;
        cursor: pointer;
        
        background-color: rgba(255, 255, 255, 0.634);
        border-radius: 12px;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.376);
        transition: box-shadow 0.3s ease; /* per l'hover */
    }

    @media screen and (max-width: 1200px) {
        .project {
            width: 23%;
        }
    }

    @media screen and (max-width: 1000px) {
        .project {
            width: 30%;
        }
    }

    @media screen and (max-width: 800px) {
        .project {
            width: 45%;
        }
    }

    @media screen and (max-width: 600px) {
        .project {
            width: 250px;
        }
        .main-container {
            justify-content: center;
        }
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
        background-color: #008550b5;
        color: white;
    }
</style>
