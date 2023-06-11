<script lang="ts">
    import DebugPanel from "./DebugPanel.svelte";
import { type Project } from "./projectStore";
    import { selectedProjectId, selectedProject} from "./projectStore";
</script>

<h2>This is the project Editor for project number: {$selectedProjectId}</h2>
<!-- TODO: project info edit button-->
<button
    style="width: 75%; align-self: center; margin: 0 auto;"
    on:click={() => selectedProjectId.set(undefined)}
>
Back to project picker
</button>

{#if $selectedProjectId === undefined || $selectedProject === undefined}
    <h2>No project selected - error</h2>
{:else}
    <div class="main-container grid">
        {$selectedProject.prjName}

    </div>
{/if}

<DebugPanel />