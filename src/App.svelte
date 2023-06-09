<script lang="ts">
  import LoginForm from "./LoginForm.svelte";
  import { userStore } from "./loginStore";
  import UserInfo from "./UserInfo.svelte";

</script>



<br />

{#if $userStore}
<UserInfo />
{:else}
  <LoginForm />
{/if}