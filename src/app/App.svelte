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
<br />
<br />
<br />
<br />


<div class="footer container">
  <p> Made with ❤️ by Emanuele. </p>
  <p> Remember that creating User Personas requires empathy and understanding of the user's needs. Use AI to help you, not to replace you. </p>
  <a  href="https://icons8.com/icon/TMYQ30SxsVAb/checked-user-female">User</a> icon by <a href="https://icons8.com">Icons8</a>
</div>

<br />


<style>
  .footer {
    width: 100%;
    text-align: center;
  }

  .footer a, .footer p {
    font-size: 1em;
    margin: 0;
  }
</style>