<script lang="ts">
    import { userStore } from "../stores/loginStore";
    import { editProject, selectedProjectId } from "../stores/projectStore";
    import { usersDBStore } from "../stores/usersDBStore";
    import type { Project } from "../utils/interfaces";
    import { invitesStore } from "../stores/invitesStore";
    import { v4 as uuidv4 } from 'uuid';

    export let joinDialogOpen: boolean;


    // CREATE LOGIC -----------------------------
    let prjName: string = "";
    let prjDescription: string = "";
    async function handleCreateNewProject(): Promise<void> { 
        const uid = $userStore?.uid;
        if (!uid) {
            console.log("Error: user undefined.");
            return;
        }

        if (!prjName || prjName === "" || !prjDescription || prjDescription === "") {
            alert("Please fill in all fields!");
            return;
        }

        const newProjectId = uuidv4();
        const newProject: Project = {
            prjName: prjName,
            owner: uid,
            personas: {},
            prjDescription: prjDescription,
            collaborators: {},
            sentInvites: {},
        };

        try {
            await editProject(newProjectId, newProject);
        } catch (error:any) {
            alert("Error while creating project: " + error.message);
            console.error("Error while creating project:", error);
            selectedProjectId.set(undefined);
            return;
        }

        usersDBStore.addPrjToUser(uid, newProjectId);
        console.log("new project id: ", newProjectId);
        selectedProjectId.set(newProjectId);
    }


    // JOIN LOGIC -----------------------------
    let isLoading: boolean = false;
    let inviteCode = "";
    async function joinExistingProject() {
        if (!inviteCode || inviteCode === "") {
            alert("Error: invite code field is empty.");
            return;
        }

        if (inviteCode.length !== 36) {
            alert("Error: invite code is not valid. It should be 36 characters long.");
            return;
        }
        
        
        let userid = $userStore?.uid;
        if (!userid) {
            alert("Error: user undefined.");
            return;
        }
        let projid: string | undefined;

        try{
            projid = await invitesStore.acceptInvite(inviteCode, userid);
        } catch (e:any) {
            alert("Error: " + e.message);
        }

        if (projid) {
            selectedProjectId.set(projid);
            joinDialogOpen = false;
        }
    }
    async function handleJoin() {
        isLoading = true;
        await joinExistingProject();
        isLoading = false;
    }
</script>

{#if $selectedProjectId}
    <h2>error: there is a project selected!</h2>
{:else}
    <dialog open>
        <article>
            <header>
                <a href="#" aria-label="Close" class="close" on:click={() => (joinDialogOpen = false)} />
                Add Project
            </header>
            <div class="dialog">
                <div class="left-half">
                    <h3><b>Create</b> New Project</h3>

                    <form>
                        <label>Project Name</label>
                        <input
                            type="text"
                            bind:value={prjName}
                            placeholder="My Wonderful Project"
                            autocomplete="off"

                        />

                        <label>Project Description</label>
                        <textarea
                            bind:value={prjDescription}
                            placeholder=""
                            autocomplete="off"

                        ></textarea>

                        <details>
                            <summary>Why should I write a good description?</summary>
                            <p> Your project description is going to be used by AI to generate personas. It is important to write a good description to get good results. It should be clear and descriptive. You can also edit it later.
                            </p>
                        </details>

                        <button on:click={handleCreateNewProject}>
                            Create
                        </button>
                    </form>                        
                </div>
                <div class="right-half">
                    <h3><b>Join</b> Existing Project</h3>
                    <label>Invite Code</label>
                    <input
                        type="text"
                        bind:value={inviteCode}
                        class="input-field"
                        placeholder=""
                        autocomplete="off"
                    />
                    {#if isLoading}
                    <button class="join-button" aria-busy="true"
                        >Join</button
                    >
                    {:else}
                    <button on:click={handleJoin} class="join-button"
                        >Join</button
                    >
                    {/if}

                </div>
            </div>
        </article>
    </dialog>
{/if}

<style>
    .dialog {
        display: flex;
        width: 60vw;
        max-width: 1000px;
        min-width: 600px;

        padding: 20px;
        background-color: #a8d7b9;
        border-radius: 8px;
    }

    dialog > article {
        max-width: 100%;
    }

    .left-half {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        margin-right: 20px;
    }

    .right-half {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        margin-left: 20px;
    }

    @media (max-width: 800px) {
        .dialog {
            flex-direction: column;
            width: 95vw;
            min-width: 300px;
            max-width: 100%;
            padding: 10px;
        }

        .left-half {
            margin-right: 0px;
            margin-bottom: 20px;
        }

        .right-half {
            margin-left: 0px;
        }
    }

</style>
