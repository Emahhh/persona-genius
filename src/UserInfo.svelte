<script lang="ts">
    import { userStore } from "./stores/loginStore";

/*     // initializes the user entry in the "users" database, if it doesn't exist yet
    function initializeUsersEntry(): void {
        if (!$userStore){
            console.log("Error: user undefined.");
            return;
        }

        const newUsersEntry = {
            name: $userStore?.displayName,
        };

    } */


    function handleLogout() {
        userStore.logout();
        window.location.reload(); // reload to reset the state
    }
</script>

<!-- TODO: rename in LoggedNavbar ? -->

<nav>
    <ul>
        <li><strong>Persona Genius</strong></li>
        <!-- TODO: add logo-->
    </ul>
    <ul>
        Logged in as <i> {$userStore?.displayName ?? $userStore?.email ?? "unknown"} </i>
        <li>
            <a href="#" role="button" on:click={handleLogout}>Logout</a>
        </li>
    </ul>
</nav>
