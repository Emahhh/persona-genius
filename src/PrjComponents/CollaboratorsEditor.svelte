<script lang="ts">
    import { invitesStore } from "../stores/invitesStore";
    import { userStore } from "../stores/loginStore";
    import { deleteProject, selectedProject, selectedProjectId } from "../stores/projectStore";
    import { usersDBStore } from "../stores/usersDBStore";

    export let infoEditMode: boolean;

    async function handleCreateInvite() {
        if (!$selectedProjectId || !$selectedProject?.prjName) {
            console.error("Error while inviting: no project selected");
            return;
        }

        const timeToExpire = 1000 * 60 * 60 * 24 * 3; // 3 days
        const expirationDate: number = Date.now() + timeToExpire;


        const uid: string = await invitesStore.createInvite(
            $selectedProjectId,
            $selectedProject?.prjName,
            expirationDate
        );
        if (!uid) {
            console.error("Error while inviting: no uid returned");
            return;
        }
        //TODO: farlo con link? alert("Invite link: " + window.location.origin + "/#/invite/" + uid);
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

{#if !$selectedProject || !$selectedProjectId}
    <h2>error: No project selected</h2>
{:else if !$selectedProject.owner || $selectedProject.owner !== $userStore?.uid}

    <p>
        Only the owner of the project can invite collaborators. If you need to
        add collaborators, please contact
        {#await usersDBStore.getUsername($selectedProject?.owner) then userName}
            {userName ?? "unknown"}
        {:catch error}
            {$selectedProject?.owner}
        {/await}
    </p>

{:else}

    <p><b>Collaborators</b> added to your project:</p>
    <ul>
        {#if !$selectedProject.collaborators || Object.values($selectedProject.collaborators).length === 0}
            <li>No user added to your project yet.</li>
        {:else}
            {#each Object.keys($selectedProject.collaborators) as collID}
                <li>
                    {#await usersDBStore.getUsername(collID)}
                        Loading...
                    {:then userName}
                        {userName ?? "unknown"}
                    {:catch error}
                        {collID}
                    {/await}
                </li>
                <!-- TODO: add remove button-->
            {/each}
        {/if}
    </ul>

    <hr />

    <p>These are the <b>invites</b> you have created:</p>
    <ul>
        {#if !$selectedProject.sentInvites || Object.values($selectedProject.sentInvites).length === 0}
            <li>No invite valid at the moment</li>
        {:else}
            {#each Object.keys($selectedProject.sentInvites) as inviteCode}
                <li><code>{inviteCode}</code>
                    <a href="#" on:click={() => navigator.clipboard.writeText(inviteCode)}>Copy
                        <img src="/assets/clipboard.svg" alt="Copy to clipboard" />
                    </a>
                    - 
                    <a href="#" on:click={() => invitesStore.deleteInvite(inviteCode)}>Delete</a>


                    {#await invitesStore.getInvite(inviteCode) ?? "unknown"}
                    {:then invVal}
                        <br /> 
                        { Date.now() > invVal.expiration ? "expired on:" : "valid until: "}
                        { new Date(invVal.expiration).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }) ?? "unknown"}
                    {/await}
                
                </li>
                <!-- TODO: aggiungere expiration e altri dati-->
            {/each}
        {/if}
        <li>
            <a href="#" on:click={() => handleCreateInvite()}
                ><b>Create new invite...</b></a
            >
        </li>
    </ul>


    <hr>
    <button class="delete-button" on:click={()=> handleDeleteProject($selectedProjectId)}>Delete project</button> 


{/if}

<style>

    li {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    a > img {
        width: 1.2rem;
        height: 1.2rem;
        margin-left: -6px;
    }

    .delete-button {
        background-color: red;
    }
</style>
