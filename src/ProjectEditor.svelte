<script lang="ts">
    import { type Project } from "./projectStore";
    import { selectedProjectId, getProject} from "./projectStore";

</script>

<h2>This is the project Editor for project number: {$selectedProjectId}</h2>
<!-- TODO: project edit button-->
<button on:click={() => selectedProjectId.set(undefined)}>Back to project picker</button>

{#if $selectedProjectId === undefined}
    <h2>No project selected - error</h2>
{:else}
<div class="main-container grid">
    <pre>
        {JSON.stringify(getProject($selectedProjectId), null, 4)}
    </pre>
       
</div>
{/if}


