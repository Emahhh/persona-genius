<script lang="ts">
    import { userStore } from "./stores/loginStore";

    let email:string = "";
    let pwd:string = "";
</script>

<div class="big-container">
    <article class="form-container">
        <span>
            <h1>Welcome to <br /> Persona Genius</h1>
            <img src="src/assets/icons8-user-group-100.png" alt="logo" width="100" height="100">
        </span>


        <p>A collaborative AI-powered tool to help you create and manage your User Personas.</p>
        <hr />


        <form on:submit|preventDefault>
            <div>
                <label for="username">Username:</label>
                <input id="username" type="email" bind:value={email} required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    bind:value={pwd}
                    required
                />
            </div>

            <div>
                <button
                    type="submit"
                    on:click={() => userStore.login(email, pwd)}>Login</button
                >
                <button type="button" on:click={() => userStore.signUpEmPwd(email,pwd)}>Sign Up</button>
            </div>
            <hr />
            <div>
                <!-- GOOGLE LOGIN-->
                <button type="button" on:click={userStore.googleLogin}
                    >Login or Sign Up <b>with Google</b></button
                >
            </div>
        </form>
    </article>
</div>

<style>
    .form-container {
        min-width: 350px;
        max-width: 500px;
    }
    .big-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    article span {
        display: flex;
        align-items: center;
    }
</style>
