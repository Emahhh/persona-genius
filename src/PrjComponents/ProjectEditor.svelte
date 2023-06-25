<script lang="ts">
    import { get } from "firebase/database";
    import DebugPanel from "../DebugPanel.svelte";
    import ProjectInfoEditor from "./InfoEditor.svelte";
    import {
        selectedProjectId,
        selectedProject,
        setPersona,
        getProject,
        deletePersona,
    } from "../stores/projectStore";
    import { onMount } from "svelte";
    import {jsonToPersona, type Persona, } from "../utils/interfaces";
    import { generatePersona } from "../utils/apiRequests";

    let selectedPersonaId: string | undefined = undefined;
    let selectedPersona: Persona | undefined = undefined;

    let editPersonaMode:boolean = false;
    let infoEditMode:boolean = false;

    let isLoading:boolean = false;


    $: if ($selectedProject?.personas && selectedPersonaId) {
        // reactive statement: quando cambia la persona selezionata, cambia anche l'oggetto persona selezionato
        selectedPersona = $selectedProject.personas[selectedPersonaId];
    }else{
        selectedPersona = undefined;
    }


    onMount(() => {
        selectPersona(getFirstPersonaId());
    });

    function getFirstPersonaId(): string | undefined {
        if (
            $selectedProject?.personas &&
            Object.keys($selectedProject.personas).length > 0
        ) {
            return Object.keys($selectedProject.personas)[0];
        }
        return undefined;
    }

    function selectPersona(personaId: string | undefined) {
        selectedPersonaId = personaId;
    }


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


    // crea una nuova persona vuota e la aggiunge al progetto
    async function handleCreateNewPersona(): Promise<void> {
        if (!$selectedProject){
            console.error("error: no project selected");
            return;
        }            

        isLoading = true;
        // TODO: sistema genera con AI
        let myNewPersona : Persona | undefined = undefined;

        try {
            myNewPersona = await generatePersona($selectedProject.prjDescription);
        } catch (e) {
            console.error("error generating persona: ", e);
            alert ("error generating persona: " + e);
            isLoading = false;
            return;
        }

        const newPersonaId = crypto.randomUUID();
        setPersona($selectedProjectId, newPersonaId, myNewPersona);
        selectedPersonaId = newPersonaId;
        isLoading = false;
    }

    // resets the changes by reloading the unedited project from the database
    export async function handleCancel(): Promise<void> {
        try {
            let oldProject = await getProject($selectedProjectId);
            $selectedProject = oldProject;
            editPersonaMode = false;
        } catch (error) {
            console.error("Error fetching project:", error);
        }
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




<div class="main-container"> <!-- EDITOR AREA--------------------------------------------------->

<header class="panel-bar">
    <a  href="#" on:click={() => selectedProjectId.set(undefined)}  >    Choose another project    </a> <!-- TODO: add back icon-->
    <h5>You are editing {$selectedProject?.prjName}</h5>
    <a  href="#" on:click={() => infoEditMode = true}> Edit project info</a>
</header>

{#if $selectedProjectId === undefined || $selectedProject === undefined}
    <h2>error: No project selected</h2>
    Debug info: $selectedProjectId: {$selectedProjectId} <br />
    $selectedProject: {$selectedProject}

{:else} 
        <div class="persona-area">
            <div class="column"><!-- PARTE SINISTRA, CHE SI OCCUPA DI MOSTRARE LA LISTA DELLE PERSONE E DI GESTIRE LA SELEZIONE ----------------------------------------- -->

                {#if isLoading}
                    <div class="persona-item add-new-persona" aria-busy="true">
                        + Add new persona
                    </div>
                {:else}
                    <div class="persona-item add-new-persona" on:click={() => handleCreateNewPersona() }>
                        + Add new persona
                    </div>
                {/if}

                {#if $selectedProject.personas}
                    {#each Object.entries($selectedProject.personas) as [currentPersonaId, currentPersona]}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="persona-item {selectedPersonaId ===currentPersonaId? 'selected': ''}"
                            on:click={() => selectPersona(currentPersonaId)}
                        >
                            <img src={currentPersona.image} />
                            <span>{currentPersona.name}</span>
                        </div>
                    {/each}

                {:else}
                    <p>
                        Non ci sono ancora persone in questo progetto.
                        Crea la prima!
                    </p>
                {/if}
            </div>



            {#if selectedPersona} <!-- PARTE DESTRA, CHE SI OCCUPA DI MOSTRARE I DETTAGLI DELLA PERSONA SELEZIONATA E EDITOR ----------------------------------------- -->
                <div class="editor-area">

                    {#if editPersonaMode} <!-- EDIT PERSONA MODE ON -->
                        <div class="persona-bar">
                            <h3>Modifica Persona</h3>
                            <button class="edit-button" on:click={() => handleSavePersona()}>Save</button>
                            <button class="edit-button secondary" on:click={() => handleCancel()}>Cancel</button>
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
                            <textarea bind:value={jsonPersona} />

                            <button class="delete-button" on:click={() => handleDeletePersona($selectedProjectId, selectedPersonaId)}>Delete this persona</button>
                        </form>




                    {:else} <!-- EDIT MODE OFF -->
                        <div class="persona-bar">
                            <h3>{selectedPersona.name}</h3>
                            <a class="edit-button" role="button" href="#" on:click={() => editPersonaMode = true}>Edit this Persona</a>
                        </div>


                        <p><strong>Nome:</strong> {selectedPersona.name}</p>
                        <p><strong>Job:</strong> {selectedPersona.job}</p>
                        <p>
                            <strong>Descrizione:</strong>
                            {selectedPersona.description}
                        </p>
                        <p><strong>Goals:</strong> {selectedPersona.goals}</p>
                        <p><strong>Needs:</strong> {selectedPersona.needs}</p>
                        <p>
                        <strong>Frustrations:</strong>
                        {selectedPersona.frustrations}
                    </p>
                    {/if}
                    
                </div>
            {/if}
        </div>


    {#if infoEditMode} <!-- EDITOR MODAL --------------------------------------------------->
        <ProjectInfoEditor bind:infoEditMode={infoEditMode}/>
    {/if}

{/if}
</div>



<DebugPanel variables={[selectedPersonaId, selectedPersona, $selectedProjectId, $selectedProject]} varNames={"selectedPersonaId, selectedPersona, $selectedProjectId, $selectedProject"}  />




<style>
    .panel-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #def3c981;
        box-shadow: 0 0 10px 0 #3a413a41;
        margin: auto;
        margin-top: 30px;
        border-radius: 20px;
        margin-bottom: 20px;
    }

    .panel-bar a {
        height: fit-content;
        padding: 12px;
        color: #000000;
        /*TODO: icone e background-color */
    }

    .panel-bar h5 {
        margin: 0;
    }



    .persona-area {
        display: flex;
        overflow: hidden;
        height: 100%;
        width: 100%;

    }

    .column {
        padding: 10px;
        background-color: #38650b3e;
        width: 30%;
        height: 100%;
        overflow-y: auto;
        box-shadow: 0 0 10px 0 #9dbde06f;
        border-radius: 20px;
        margin-left: 10px;

    }

    .persona-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;

        transition: background-color 0.3s;
    }

    .persona-item img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #ccc; /* Aggiungi lo sfondo */
        box-shadow: 0 0 5px 0 #9dbde06f;
    }

    .selected {
        background-color: #589d61;
        box-shadow: 0 0 5px 0 #2a55306f;
        
    }

    .editor-area {
        padding: 10px;
        padding-left: 25px;
        width: 100vh; /* TODO: sure? */
    }

    .add-new-persona {
        font-weight: bold;
        background-color: #175b086f;
        height: 80px;
        justify-content: center;
        margin-bottom: 20px;
        border-radius: 15px;
        box-shadow: 0 0 10px 0 #2879657c;
    }

    .edit-button{
        height: fit-content;
        width: fit-content;
    }

    .persona-bar {
        display: flex;
        justify-content: space-between;
    
        width: 100%;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
    }


    .delete-button {
        background-color: #c30000;
    }
</style>
