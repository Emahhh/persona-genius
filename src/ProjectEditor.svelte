<script lang="ts">
    import DebugPanel from "./DebugPanel.svelte";
    import { type Project } from "./projectStore";
    import { selectedProjectId, selectedProject } from "./projectStore";
    import { onMount } from "svelte";

    let personas = [
        // TODO: replace with real personas from database
        {
            id: 1,
            name: "John",
            lastname: "Doe",
            job: "Developer",
            image: "john.jpg",
        },
        {
            id: 2,
            name: "Jane",
            lastname: "Smith",
            job: "Designer",
            image: "jane.jpg",
        },
        // Aggiungi altre personas se necessario
    ];

    interface Persona {
        id: number;
        name: string;
        lastname: string;
        job: string;
        image: string;
    }

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
                    <p><strong>Cognome:</strong> {selectedPersona.lastname}</p>
                    <p><strong>Job:</strong> {selectedPersona.job}</p>
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
