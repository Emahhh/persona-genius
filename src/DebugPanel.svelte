<script lang="ts">
    import { projectsStore, selectedProjectId, selectedProject} from "./projectStore";
</script>

<div class="debugDiv">
    <p>ID Progetto selezionato: </p>
    <pre>{$selectedProjectId}</pre>
    <br />
    <p>contenuto Progetto selezionato: </p>
    <pre>{JSON.stringify($selectedProject, null, 4)}</pre>
    <br />

    <p>projectsStore:</p>
    <pre>{JSON.stringify($projectsStore, null, 4)}</pre>
</div>

<style>
    .debugDiv {
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        margin: 40px auto;
        width: 90%;
        padding: 20px;
    }
</style>
