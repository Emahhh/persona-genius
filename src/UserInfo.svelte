<script lang="ts">
    import { userStore } from "./stores/loginStore";
    import { usersDBStore } from "./stores/usersDBStore";
    import {isOnline}from "./utils/offlineHandle";
    const currentUserStore = usersDBStore?.currentUser;
    const displayName = $currentUserStore.displayUsername ?? $userStore?.displayName ?? $userStore?.email;
    




    function handleLogout() {
        userStore.logout();
        window.location.reload(); // reload to reset the state
    }
</script>
<!-- TODO: rename in LoggedNavbar ? -->

<nav>
    <ul>
        <li><img src="/assets/icons8-user-group-100.png" alt="logo" width="50" height="50"></li>
        <li><strong>Persona Genius</strong></li>

        <!-- TODO: add logo-->
    </ul>
    <ul>
        <li>
            {#if !$isOnline}
            Offline!
            {/if}
        </li>
    </ul>
    <ul>
        <i> { displayName} </i>
        <li>
            <a href="#" role="button" class="secondary" on:click={handleLogout}>Logout</a>
        </li>
    </ul>
</nav>

<style>
    nav li {
        display: inline-block;
        padding: 10px;
    }
</style>
