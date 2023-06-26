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
    import UserInfo from "../UserInfo.svelte";

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




<div class="main-container"> 
    <header class="panel-bar">
        <h5>Open a project or create a new one</h5>
    </header>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="project new-project" on:click={() => handleAddButton()}>
        <span class="projectName">
            <img src="/assets/add-circle-fill.svg" alt="add" width="50px" height="50px" />
        </span> 

        <br />
        <span class="createdBy">Create a new project or join one.</span>
    </div>
    
    {#each Object.entries($projectsStore) as [projectId, project]} <!-- TODO: show loading? -->
        {#if projectId && project && project.prjName && project.owner}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="project" on:click={() => selectedProjectId.set(projectId)}>
                <span class="projectName"><b>{project.prjName}</b></span>
                <br />

                {#await usersDBStore.getUsername(project.owner)}
                {:then username}
                    <span class="createdBy">Created by<br /><b>
                        { username === $currentUser?.displayUsername ? "Me" : username }
                    </b></span> 
                {:catch error}
                {/await}

            </div>
        {/if}

    {/each}
    
</div>

<DebugPanel variables={[$userProjectsList, $selectedProjectId, $projectsStore, $userStore, $currentUser]} varNames={"$userProjectsList, $selectedProjectId, $projectsStore, $userStore, $currentUser"} />

<style>
    .panel-bar {
        width: 100%;
        margin-top: 0px;
        margin-bottom: 10px;
        padding: 25px;
    }

    .main-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        align-items: start;
        align-content: start;

        margin-top: 60px;
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
        
        background-color: #f5f5f5e7;
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
        text-align: center;
    }

    .new-project {
        background-color: var(--primary);
        color: white;
    }

</style>
