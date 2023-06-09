<script lang="ts">
    import { type Project } from "./projectStore";
    import { selectedProjectId } from "./projectStore";

</script>

<h2>This is the project Editor for prj n {$selectedProjectId}</h2>
<button on:click={() => selectedProjectId.set(undefined)}>Back to project picker</button>