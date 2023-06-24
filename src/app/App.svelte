<script lang="ts">
  import LoginForm from "../LoginForm.svelte";
  import { userStore } from "../stores/loginStore";
  import UserInfo from "../UserInfo.svelte";
  import ProjectArea from "../PrjComponents/ProjectArea.svelte";
</script>



{#if $userStore}
  <UserInfo />
  <ProjectArea />
{:else}
  <LoginForm />
{/if}

<br />
<!-- TODO: footer-->

<br />