<script lang="ts">
    import {
        selectedProjectId,
        selectedProject,
        editProjectInfo,
        deleteProject,
        getProject,
    } from "../stores/projectStore";

    import { invitesStore } from "../stores/invitesStore";
    import { get } from "firebase/database";
    import { usersDBStore } from "../stores/usersDBStore";

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


    async function handleCreateInvite() {
        if (!$selectedProjectId || !$selectedProject?.prjName) {
            console.error("Error while inviting: no project selected");
            return;
        }
        
        const timeToExpire = 1000 * 60 * 60 * 24 * 3; // 3 days 
        const expirationDate: string = new Date(Date.now() + timeToExpire).toString();
        const uid:string = await invitesStore.createInvite($selectedProjectId, $selectedProject?.prjName, expirationDate);
        if (!uid) {
            console.error("Error while inviting: no uid returned");
            return;
        }
        //alert("Invite link: " + window.location.origin + "/#/invite/" + uid);
        alert("Invite code: " + uid); 
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

            <p><b>Collaborators</b> added to your project:</p>
            <ul>
                {#if !$selectedProject.collaborators || Object.values($selectedProject.collaborators).length === 0}
                    <li>No user added to your project yet.</li>
                {:else}
                    {#each Object.keys($selectedProject.collaborators) as collID}
                        <li>{#await usersDBStore.getUsername(collID) }
                                Loading...
                            {:then userName}
                                {userName ?? "unknown"}
                            {:catch error}
                                {collID}
                            {/await}
                        </li>
                        <!-- TODO: addremove button-->
                    {/each}
                {/if}
            </ul>

            <hr>
            
            <p>These are the <b>invites</b> you have created:</p>
                <ul>
                    {#if !$selectedProject.sentInvites || Object.values($selectedProject.sentInvites).length === 0}
                        <li>No invite valid at the moment</li>
                    {:else}
                        {#each Object.keys($selectedProject.sentInvites) as invite}
                            <li>{invite}</li> <!-- TODO: aggiungere expiration e altri dati-->
                        {/each}
                    {/if}
                    <li><a href="#" on:click={()=> handleCreateInvite()}><b>Create new invite...</b></a></li>
                </ul>
        

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

    .project-info-editor {
        width: 100%;
    }
</style>