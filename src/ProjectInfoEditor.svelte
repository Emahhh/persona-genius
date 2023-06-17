<script lang="ts">
        import {
        selectedProjectId,
        selectedProject,
        type Persona,
        editProjectInfo,
        deleteProject,
    } from "./projectStore";

    export let infoEditMode: boolean;

function cancelEditInfo(): void {
        infoEditMode = false;
        // TODO: ripristina i valori originali
    }


    function handleDeleteProject($selectedProjectId: string | undefined): any {
        if (!$selectedProjectId) {
            console.error("Error while deleting project: no project selected");
            return;
        }

        deleteProject($selectedProjectId);
        infoEditMode = false;
        selectedProjectId.set(undefined);
        console.log("Deleted project with id: ", $selectedProjectId);
    }
</script>

{#if !$selectedProjectId|| !$selectedProject}
    <h2>error: No project selected</h2>
{:else} 
    <dialog open> 
        <article class="project-info-editor">
            <h3>Edit project information</h3>
            <p>
                Edit your stuff here
            </p>
            <form>
                <label>Project Name</label>
                <input type="text" bind:value={$selectedProject.prjName}>

                <label>Project Description</label>
                <textarea bind:value={$selectedProject.prjDescription}></textarea>
            </form>

            <hr>

            <p> Invited people:</p>
            <p>Invited people:</p>
            <ul>
                {#if !$selectedProject.invitedUsers || Object.values($selectedProject.invitedUsers).length === 0}
                    <li>No one invited yet</li>
                {:else}
                    {#each Object.values($selectedProject.invitedUsers) as invitation}
                        <li>{invitation.invitedUserId}, {invitation.status}</li> <!-- TODO: sostituire con il suo username-->
                    {/each}
                {/if}
            </ul>
        
            <p>Invite someone else...</p> <!--TODO:--> 

            <hr>
            <button class="delete-button" on:click={()=> handleDeleteProject($selectedProjectId)}>Delete project</button> <!-- TODO: aggiungere un sistema di conferma-->
            <footer>
                <a role="button" href="#" class="secondary" on:click={()=> cancelEditInfo()}>Cancel</a>
                <a role="button" href="#" on:click={()=> editProjectInfo($selectedProjectId, $selectedProject)}>Confirm and save</a>
            </footer>
        </article>
    </dialog>
{/if}

<style>
    .delete-button {
        background-color: red;
    }
</style>