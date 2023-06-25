<script lang="ts">
    import { deletePersona, setPersona } from "../stores/projectStore";
    import { jsonToPersona, type Persona } from "../utils/interfaces";
    import { selectedProject, selectedProjectId, } from "../stores/projectStore";


    export let editPersonaMode: boolean = false;
    export let selectedPersona: Persona | undefined;
    export let selectedPersonaId: string | undefined;

    export let selectPersona: (personaId: string | undefined) => void;
    export let getFirstPersonaId: () => string | undefined;
    export let handleCancel: () => void;



    // salva il progetto nel database, dopo averlo editato TODO: farlo in realtime?
    let jsonPersona: string = "";
    function handleSavePersona() {
        if (jsonPersona && jsonPersona !== "") { // IMPORT PERSONA FROM JSON, if there is one
            try {
                selectedPersona = jsonToPersona(jsonPersona);
            } catch (e) {
                console.error("error parsing jsonPersona: ", e);
                alert ("error parsing jsonPersona: " + e);
            }
        }

        setPersona($selectedProjectId, selectedPersonaId, selectedPersona);
        editPersonaMode = false;
    }

        // deletes the persona from the project
        function handleDeletePersona(projectId: string | undefined, personaId: string | undefined): void {
        if (!confirm(`Are you sure you want to delete this persona named "${selectedPersona?.name}" from this project?`)) {
            return;
        }
        deletePersona(projectId, personaId);

        selectPersona(getFirstPersonaId());
        editPersonaMode = false;
    }


</script>





{#if !$selectedProject || !$selectedProjectId || !selectedPersonaId || !selectedPersona}
    <h3>Error: no project or persona selected</h3>
{:else}


    <div class="persona-bar">
        <h3>Modifica Persona</h3>
        <span>
            <button class="edit-button" on:click={() => handleSavePersona()}>Save</button>
            <button class="edit-button secondary" on:click={() => handleCancel()}>Cancel</button>
        </span>
    </div>

    <p>Questo è il form per modificare la persona {selectedPersona.name}</p>
    <form>
        <label>Name</label>
        <input type="text" bind:value={selectedPersona.name} autocomplete="off" />
        <label>Job</label>
        <input type="text" bind:value={selectedPersona.job} autocomplete="off" />
        <!-- TODO: il resto-->
        <hr />
        <label>Import persona from JSON</label>
        <textarea bind:value={jsonPersona} autocomplete="off"/>

        <button class="delete-button" on:click={() => handleDeletePersona($selectedProjectId, selectedPersonaId)}>Delete this persona</button>
    </form>

{/if}


<style>

.persona-bar {
        display: flex;
        justify-content: space-between;
    
        width: 100%;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
    }


    .persona-bar button{
        width: fit-content;
        margin: 0 0.5rem;
    }

    .persona-bar span {
        display: flex;
        margin-bottom: 20px;
    }

    .persona-bar h3{
        margin: 0;
    }

    .delete-button {
        background-color: #c30000;
    }
</style>


