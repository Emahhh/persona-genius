<script lang="ts">
    import { get } from "firebase/database";
    import DebugPanel from "./DebugPanel.svelte";
    import {
        selectedProjectId,
        selectedProject,
        type Persona,
        editProject,
    } from "./projectStore";
    import { onMount } from "svelte";

    let selectedPersonaId: string | undefined = undefined;
    let selectedPersona: Persona | undefined = undefined;

    let editMode:boolean = false;

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
</script>





<div class="panel-bar">
    <button    class="back-button"  on:click={() => selectedProjectId.set(undefined)}  >    Back to project picker     </button> <!-- TODO: add back icon-->
    <h5>This is the project Editor for project number: {$selectedProject?.prjName}</h5>

    <!-- TODO: add button to edit the project: owner, invites ecc. Idea: link ad un div che sta sotto al project editor-->
    <button> Edit project info</button>
</div>

{#if $selectedProjectId === undefined || $selectedProject === undefined}
    <h2>error: No project selected</h2>

{:else} 
    <div class="main-container container"> <!-- EDITOR AREA--------------------------------------------------->
        <div class="persona-area">
            <div class="column"><!-- PARTE SINISTRA, CHE SI OCCUPA DI MOSTRARE LA LISTA DELLE PERSONE E DI GESTIRE LA SELEZIONE ----------------------------------------- -->
                
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
                        Non ci sono ancora persone associate a questo progetto.
                        Crea la prima!
                    </p>
                {/if}
            </div>



            {#if selectedPersona} <!-- PARTE DESTRA, CHE SI OCCUPA DI MOSTRARE I DETTAGLI DELLA PERSONA SELEZIONATA E EDITOR ----------------------------------------- -->
                <div class="editor-area">
                    {#if editMode}
                        <div class="persona-bar">
                            <h3>Modifica Persona</h3>
                            <button class="edit-button" on:click={()=> {
                                editMode = false;
                                editProject($selectedProjectId, $selectedProject) // salva il progetto modificato nel database
                                }}>Save</button>
                        </div>
                        
                        <p>Questo è il form per modificare la persona {selectedPersona.name}</p>
                        <form>
                            <label>Name</label>
                            <input type="text" bind:value={selectedPersona.name} autocomplete="off" />
                            <label>Job</label>
                            <input type="text" bind:value={selectedPersona.job} autocomplete="off" />
                            <!-- TODO: il resto-->
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


    <!-- PROJECT INFO AREA--------------------------------------------------->
    <div class="contaier">
        <form>
            <label>Project Name</label>
            <input type="text" bind:value={$selectedProject.prjName}> 


        </form>
    </div>
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
</style>
