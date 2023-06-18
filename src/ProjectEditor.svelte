<script lang="ts">
    import { get } from "firebase/database";
    import DebugPanel from "./DebugPanel.svelte";
    import ProjectInfoEditor from "./ProjectInfoEditor.svelte";
    import {
        selectedProjectId,
        selectedProject,
        editProject,
        editProjectInfo,
        setPersona,
        getProject,
    } from "./projectStore";
    import { onMount } from "svelte";
    import type { Persona } from "./interfaces";
    import {jsonToPersona} from "./interfaces";

    let selectedPersonaId: string | undefined = undefined;
    let selectedPersona: Persona | undefined = undefined;

    let editMode:boolean = false;
    let infoEditMode:boolean = false;


    $: if ($selectedProject?.personas && selectedPersonaId) {
        // reactive statement: quando cambia la persona selezionata, cambia anche l'oggetto persona selezionato
        selectedPersona = $selectedProject.personas[selectedPersonaId];
    }


    onMount(() => {
        // all'avvio, Imposta la prima persona come selezionata
        if (
            $selectedProject?.personas &&
            Object.keys($selectedProject.personas).length > 0
        ) {
            selectedPersonaId = Object.keys($selectedProject.personas)[0];
        }
    });

    function selectPersona(personaId: string) {
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
        editMode = false;
    }

    function handleCreateNewPersona(): void {
        if (!$selectedProject){
            console.error("error: no project selected");
            return;
        }            


        // crea una nuova persona vuota e la aggiunge al progetto
        // TODO: genera con AI
        const myNewPersona: Persona = {
            name: "New Persona",
            job: "",
            description: "",
            goals: "",
            needs: "",
            frustrations: "",
            image: "",
        };

        const newPersonaId = crypto.randomUUID();

        setPersona($selectedProjectId, newPersonaId, myNewPersona);

        selectedPersonaId = newPersonaId;
    }

    // resets the changes by reloading the unedited project from the database
    // TODO: use it in the cancel project editor button
    async function handleCancel(): Promise<void> {
        try {
            let oldProject = await getProject($selectedProjectId);
            $selectedProject = oldProject;
            editMode = false;
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    }

</script>





<header class="panel-bar">
    <a role="button" href="#"    class="back-button secondary"  on:click={() => selectedProjectId.set(undefined)}  >    Back to project picker     </a> <!-- TODO: add back icon-->
    <a role="button" href="#" on:click={() => infoEditMode = true}> Edit project info</a>
    <br />
    <h5>This is the project Editor for {$selectedProject?.prjName}</h5>

</header>

{#if $selectedProjectId === undefined || $selectedProject === undefined}
    <h2>error: No project selected</h2>
    Debug info: $selectedProjectId: {$selectedProjectId} <br />
    $selectedProject: {$selectedProject}

{:else} 
    <div class="main-container container"> <!-- EDITOR AREA--------------------------------------------------->
        <div class="persona-area">
            <div class="column"><!-- PARTE SINISTRA, CHE SI OCCUPA DI MOSTRARE LA LISTA DELLE PERSONE E DI GESTIRE LA SELEZIONE ----------------------------------------- -->
                <div class="persona-item add-new-persona" on:click={() => handleCreateNewPersona()}>
                    + Add new persona
                </div>
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
                    {#if editMode}
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
                            <label>Import persona from JSON</label>
                            <textarea bind:value={jsonPersona} />
                        </form>




                    {:else} <!-- EDIT MODE OFF -->
                        <button class="edit-button" on:click={() => editMode = true}>Edit</button>

                        <h3>Dettagli Persona</h3>
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
    </div>


    {#if infoEditMode} <!-- EDITOR MODAL --------------------------------------------------->
        <!-- TODO: triggherarlo se il progetto si chiama ancora "new project" -->
        <ProjectInfoEditor bind:infoEditMode={infoEditMode}/>
    {/if}

{/if}



<DebugPanel variables={[selectedPersonaId, selectedPersona, $selectedProjectId, $selectedProject]} varNames={"selectedPersonaId, selectedPersona, $selectedProjectId, $selectedProject"}  />




<style>
    .panel-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #def3c9a8;
        box-shadow: 0 0 10px 0 #9dbde06f;
        width: 80%;
        margin: auto;
        margin-top: 30px;
        border-radius: 10px;
    }

    .back-button {
        width: 300px;
        font-size: 1.2em;
        margin: 0;
    }
    .persona-area {
        display: flex;
        overflow: hidden;
        width: 100%; 
        height: 100%;
    }

    .column {
        padding: 10px;
        background-color: #def3c9;
        width: 30%;
        height: 100vh;
        overflow-y: auto;
        box-shadow: 0 0 10px 0 #9dbde06f;
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
        background-color: #9dbde06f;
        box-shadow: 0 0 5px 0 #9dbde06f;
    }

    .editor-area {
        padding: 10px;
        padding-left: 25px;
        width: 100vh; /* TODO: sure? */
    }

    .add-new-persona {
        font-weight: bold;
        background-color: #175b086f;
    }

    .edit-button{
        /* in alto a dx*/
        width: 100px; /* TODO: rendere responsive*/
    }

    .persona-bar {
        display: flex;
    
        width: 100%;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
    }

    .project-info-editor {
        width: 85%;
        max-width: 800px;
    }
</style>
