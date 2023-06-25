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
    import PersonaEditor from "./PersonaEditor.svelte";
    import { bind } from "svelte/internal";

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

                        <PersonaEditor bind:editPersonaMode={editPersonaMode} bind:selectedPersona={selectedPersona} bind:selectedPersonaId={selectedPersonaId} handleCancel={handleCancel} selectPersona={selectPersona} getFirstPersonaId={getFirstPersonaId} />

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



    .persona-area {
        display: flex;
        overflow: hidden;
        height: 100%;
        width: 100%;

    }

    .column {
        padding: 10px;
        background-color: #38650b3e;
        width: 40%;
        height: 100%;
        overflow-y: auto;
        box-shadow: 0 0 10px 0 #9dbde06f;
        border-radius: 20px;
        margin-left: 10px;

    }

    @media (max-width: 800px) {
        .column {
            width: 100%;
            margin-left: 0;
        }

        .persona-area {
            flex-direction: column;
        }
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
        padding-right: 25px;
        width: 100%;
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



</style>
