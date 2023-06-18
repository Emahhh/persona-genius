<script lang="ts">
    import ProjectPicker from "./ProjectPicker.svelte";
    import { selectedProjectId, selectedProject} from "./projectStore";
    import ProjectEditor from "./ProjectEditor.svelte";

</script>

{#if $selectedProjectId && $selectedProject}
    <ProjectEditor /> <!-- TODO: give the project id as a prop -->
{:else}
    <ProjectPicker />
{/if}