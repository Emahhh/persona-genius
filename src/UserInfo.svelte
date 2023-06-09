<script>
    import { userStore } from "./loginStore";
</script>

<div class="user-info">
    <h2>Logged in as {$userStore?.email}!!! c:</h2>
    <button on:click={userStore.logout}>Logout</button>
</div>

<style>
    /* a classic user card displayed on the top right corner */
    .user-info {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1rem;
        background-color: #fff;
        border-radius: 0 0 0 1rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
    }
</style>