<script lang="ts">
    import DebugPanel from "./DebugPanel.svelte";
    import { selectedProjectId, selectedProject, type Persona} from "./projectStore";
    import { onMount } from "svelte";

    let personas = [
        // TODO: replace with real personas from database
        {
            id: "1",
            name: "Persona1",
            description: "Persona1 description",
            goals: "Persona1 goals",
            needs: "Persona1 needs",
            frustrations: "Persona1 frustrations",
            image: "https://picsum.photos/200",
            job: "Persona1 job",
        },
        {
            id: "2",
            name: "Persona2",
            description: "Persona2 description",
            goals: "Persona2 goals",
            needs: "Persona2 needs",
            frustrations: "Persona2 frustrations",
            image: "https://picsum.photos/200",
            job: "Persona2 job",
        },
        {
            id: "3",
            name: "Persona3",
            description: "Persona3 description",
            goals: "Persona3 goals",
            needs: "Persona3 needs",
            frustrations: "Persona3 frustrations",
            image: "https://picsum.photos/200",
            job: "Persona3 job",
        },
        {
            id: "4",
            name: "Persona4",
            description: "Persona4 description",
            goals: "Persona4 goals",
            needs: "Persona4 needs",
            frustrations: "Persona4 frustrations",
            image: "https://picsum.photos/200",
            job: "Persona4 job",
        },
        {
            id: "5",
            name: "Persona5",
            description: "Persona5 description",
            goals: "Persona5 goals",
            needs: "Persona5 needs",
            frustrations: "Persona5 frustrations",
            image: "https://picsum.photos/200",
            job: "Persona5 job",
        },
        {
            id: "6",
            name: "Persona6",
            description: "Persona6 description",
            goals: "Persona6 goals",
            needs: "Persona6 needs",
            frustrations: "Persona6 frustrations",
            image: "https://picsum.photos/200",
            job: "Persona6 job",
        },
        {
            id: "7",
            name: "Persona7",
            description: "Persona7 description",
            goals: "Persona7 goals",
            needs: "Persona7 needs",
            frustrations: "Persona7 frustrations",
            image: "https://picsum.photos/200",
            job: "Persona7 job",
        }

    ];

    let selectedPersona: Persona | null = null;
    
    onMount(() => {
        selectedPersona = personas[0]; // Imposta la prima persona come selezionata all'avvio
    });

    function selectPersona(persona: Persona) {
        selectedPersona = persona;
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
            <div class="column">
                {#each personas as persona}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="persona-item {selectedPersona === persona
                            ? 'selected'
                            : ''}"
                        on:click={() => selectPersona(persona)}
                    >
                        <img src={persona.image} alt={persona.name} /> <!-- TODO: add border o ombra; add immagine vera-->
                        <span>{persona.name}</span>
                    </div>
                {/each}
            </div>
            {#if selectedPersona}
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

<DebugPanel />

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
