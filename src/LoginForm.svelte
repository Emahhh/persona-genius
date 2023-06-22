<script lang="ts">
    import { userStore } from "./loginStore";

    let email:string = "";
    let pwd:string = "";
</script>

<div class="big-container">
    <article class="form-container">
        <h1>Login</h1>
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
                <!-- TODO: implementa sign up? Meglio portare ad un'altra schermata?
                <button type="button" on:click={() => userStore.signUp(email, pwd)}>Sign Up</button>  
            -->
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
        max-width: 900px;
    }
    .big-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>
