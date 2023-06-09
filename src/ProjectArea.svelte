<script lang="ts">
    import ProjectPicker from "./ProjectPicker.svelte";
    import { type Project } from "./projectStore";
    import { selectedProjectId } from "./projectStore";
    import ProjectEditor from "./ProjectEditor.svelte";

</script>

{#if $selectedProjectId}
    <ProjectEditor />
{:else if $selectedProjectId === undefined}
    <ProjectPicker />
{/if}