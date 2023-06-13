<script>
    import { userStore } from "./loginStore";
</script>

<!-- TODO: rename in LoggedNavbar ? -->

<nav>
    <ul>
        <li><strong>Persona Genius</strong></li>
        <!-- TODO: add logo-->
    </ul>
    <ul>
        Logged in as <i> {$userStore?.email}</i>.
        <li>
            <a href="#" role="button" on:click={userStore.logout}>Logout</a>
        </li>
    </ul>
</nav>
