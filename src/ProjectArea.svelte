<script lang="ts">
    import ProjectPicker from "./ProjectPicker.svelte";
    import { selectedProjectId } from "./projectStore";
    import ProjectEditor from "./ProjectEditor.svelte";

</script>

{#if $selectedProjectId}
    <ProjectEditor /> <!-- TODO: give the project id as a prop -->
{:else if $selectedProjectId === undefined}
    <ProjectPicker />
{/if}