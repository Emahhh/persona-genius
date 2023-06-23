<script lang="ts">
    import {
        selectedProjectId,
        selectedProject,
        editProjectInfo,
        deleteProject,
        getProject,
    } from "./stores/projectStore";

    export let infoEditMode: boolean;

    // resets the changes by reloading the unedited project from the database
    export async function cancelEditInfo(): Promise<void> {
        try {
            let oldProject = await getProject($selectedProjectId);
            $selectedProject = oldProject;
            infoEditMode = false;
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    }

    function handleConfirmEdit(): any {
        editProjectInfo($selectedProjectId, $selectedProject);
        infoEditMode = false;
    }


    async function handleDeleteProject($selectedProjectId: string | undefined): Promise<void> {
        if (!confirm("Are you sure you want to delete this project named " + $selectedProject?.prjName + "?")) {
            return;
        }

        if (!$selectedProjectId) {
            console.error("Error while deleting project: no project selected");
            return;
        }

        await deleteProject($selectedProjectId);
        infoEditMode = false;
        selectedProjectId.set(undefined);
        selectedProject.set(undefined);
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
            <button class="delete-button" on:click={()=> handleDeleteProject($selectedProjectId)}>Delete project</button> 
            <footer>
                <a role="button" href="#" class="secondary" on:click={()=> cancelEditInfo()}>Cancel</a>
                <a role="button" href="#" on:click={()=> handleConfirmEdit()}>Confirm and save</a>
            </footer>
        </article>
    </dialog>
{/if}

<style>
    .delete-button {
        background-color: red;
    }
</style>