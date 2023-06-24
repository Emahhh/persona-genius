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
    import CollaboratorsEditor from "./CollaboratorsEditor.svelte";

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

    async function handleConfirmEdit(){
        try{
            await editProjectInfo($selectedProjectId, $selectedProject);
        } catch (error:any) {
            if (error.message === 'editProjectInfo: missing projectId. Cannot edit project info.'){
                alert("Please fill in all the fields!");
            }else{
                alert("Error while editing project: " + error.message);
            }
            console.error("Error while editing project:", error);
            cancelEditInfo()
        }
        infoEditMode = false;
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

            <CollaboratorsEditor bind:infoEditMode={infoEditMode}/>
        


            <footer>
                <a role="button" href="#" class="secondary" on:click={()=> cancelEditInfo()}>Cancel</a>
                <a role="button" href="#" on:click={()=> handleConfirmEdit()}>Confirm and save</a>
            </footer>
        </article>
    </dialog>
{/if}

<style>


    .project-info-editor {
        width: 100%;
    }
</style>