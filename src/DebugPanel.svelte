<script lang="ts">

    export let DEBUGMODE = true; // METTERE A FALSE PER NASCONDERE IL PANNELLO DI DEBUG

    export let variables: any[] = []; // input
    export let varNames: string = ""; // input

    let variableList: { name: string; value: any; }[] = [];
    $: variableList = variables.map((variable, index) => ({
        name: varNames.split(",")[index].trim(),
        value: variable,
    }));
    
</script>

{#if DEBUGMODE}
    <div class="debugDiv">
        {#each variableList as variable}
            <h3>{variable.name}</h3>
            <pre>{JSON.stringify(variable.value, null, 4)}</pre>
        {/each}
    </div>
{/if}

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
