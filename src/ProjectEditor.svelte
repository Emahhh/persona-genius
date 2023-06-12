<script lang="ts">
    import DebugPanel from "./DebugPanel.svelte";
    import { selectedProjectId, selectedProject, type Persona} from "./projectStore";
    import { onMount } from "svelte";

    let selectedPersonaId: string | undefined = undefined;
    let selectedPersona: Persona | undefined = undefined;

    $: if ($selectedProject?.personas && selectedPersonaId) {  // reactive statement
        selectedPersona = $selectedProject.personas[selectedPersonaId]; // quando cambia la persona selezionata, cambia anche l'oggetto persona
    }

    
    
    onMount(() => {
        if ($selectedProject?.personas && Object.keys($selectedProject.personas).length > 0) {
            selectedPersonaId = Object.keys($selectedProject.personas)[0]; // Imposta la prima persona come selezionata all'avvio
        }
    });

    function selectPersona(personaId: string) {
        selectedPersonaId = personaId;
    }
</script>

<button
    style="width: 75%; align-self: center; margin: 0 auto;"
    on:click={() => selectedProjectId.set(undefined)}
>
    Back to project picker
</button>

<h2>This is the project Editor for project number: {$selectedProjectId}</h2>
<!-- TODO: add button to edit the project: owner, invites ecc-->

{#if $selectedProjectId === undefined || $selectedProject === undefined}
    <h2>No project selected - error</h2>
{:else}
    <div class="main-container grid">
        <div class="persona-list">





            <div class="column">  <!-- PARTE SINISTRA, CHE SI OCCUPA DI MOSTRARE LA LISTA DELLE PERSONE E DI GESTIRE LA SELEZIONE ----------------------------------------- -->
                {#if $selectedProject.personas}
                    {#each Object.entries($selectedProject.personas) as [currentPersonaId, currentPersona]}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="persona-item {selectedPersonaId === currentPersonaId
                            ? 'selected'
                            : ''}"
                        on:click={() => selectPersona(currentPersonaId)}
                    >
                        <img src={currentPersona.image}/> 
                        <span>{currentPersona.name}</span>
                    </div>
                    {/each}
                {:else}
                    <p>Non ci sono ancora persone associate a questo progetto. Crea la prima!</p>
                {/if}
            </div>





            {#if selectedPersona} <!-- PARTE DESTRA, CHE SI OCCUPA DI MOSTRARE I DETTAGLI DELLA PERSONA SELEZIONATA E EDITOR ----------------------------------------- -->
                <div class="editor-area">
                    <h3>Dettagli Persona</h3>
                    <p><strong>Nome:</strong> {selectedPersona.name}</p>
                    <p><strong>Job:</strong> {selectedPersona.job}</p>
                    <p><strong>Descrizione:</strong> {selectedPersona.description}</p>
                    <p><strong>Goals:</strong> {selectedPersona.goals}</p>
                    <p><strong>Needs:</strong> {selectedPersona.needs}</p>
                    <p><strong>Frustrations:</strong> {selectedPersona.frustrations}</p>

                </div>
            {/if}




        </div>
    </div>
{/if}

<DebugPanel variables={[selectedPersonaId, selectedPersona, $selectedProjectId, $selectedProject]} varNames={"selectedPersonaId, selectedPersona, $selectedProjectId, $selectedProject"}  />

<style>
    .persona-list {
        display: flex;
        overflow: hidden;
        width: 100vh; /* TODO: NON DOvrebbe essere 100% ???*/
        height: 100vh;
    }

    .column {
        padding: 10px;
        background-color: #def3c9;
        width: 30%;
        height: 100%;
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
        width: 70%; /* TODO: sure? strano che debba imporre il complementare della colonna */
    }
</style>
