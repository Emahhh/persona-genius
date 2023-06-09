<script lang="ts">
 import { projects, type Project} from "./projectStore";
    import { selectedProjectId } from "./projectStore";
</script>

<p> Apri un progetto, o creane uno nuovo.</p>
<p> Progetto selezionato: {$selectedProjectId}</p>
<div class="main-container grid">
    <div class="project new-project">+</div>
    {#each projects as project}
        <div
            class="project"
            on:click={ () => selectedProjectId.set(project.id) }
        >
            {project.name}
        </div>
    {/each}
</div>

<style>
    .project {
        width: 120px;
        height: 120px;
        background-color: #ccc;
        margin: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        border-radius: 10px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.361);
        transition: box-shadow 0.3s ease; /* per l'hover */
    }

    .project:hover {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.523);
    }

    .new-project {
        background-color: #99ccff;
        color: white;
    }
</style>
