<script lang="ts">
  import LoginForm from "./LoginForm.svelte";

  import { userStore } from "./loginStore";

</script>

<h1>Persona Genius </h1>
<br />

{#if $userStore}
<h2>Logged in as {$userStore.email}!!! c:</h2>
<button on:click={userStore.logout}>Logout</button>
{:else}
  <LoginForm />
{/if}