import type { User } from 'firebase/auth';

import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { writable } from "svelte/store";
import { app } from '../utils/firebaseConf';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const userStore = createUserStore(); 


function createUserStore() {
    const { subscribe, set, update } = writable<User| undefined>();

    async function login(email: string, pwd: string) {
        try {
            await signInWithEmailAndPassword(auth, email, pwd)
        } catch (err:any) {
            console.error('ERROR signin with email and password:', err);
            alert(getMessageFromErrorCode(err.code));
        }
    }

    async function signUpEmPwd(email: string, pwd: string) {
        try {
            await createUserWithEmailAndPassword(auth, email, pwd)
        } catch (err:any) {
            console.error('ERROR signin up with email and password:' + err);
            alert(getMessageFromErrorCode(err.code));
        }
    }


    // GOOGLE
    function googleLogin() {
        try{
        signInWithPopup(auth, provider);
        } catch (err:any) {
            console.error('ERROR signin with google:', err);
            alert(getMessageFromErrorCode(err.code));
        }
    }




    // OTHER
    async function logout() {
        try {
            await signOut(auth);
        } catch (err:any) {
            console.error('ERROR signing out:', err);
            alert(getMessageFromErrorCode(err.code));
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // signed in
            userStore.set(user);
        } else {
            // signed out
            userStore.set(undefined);
        }
    });

    return {
        subscribe, set, update, login, googleLogin, logout, signUpEmPwd
    };
}



function getMessageFromErrorCode(errorCode: string): string {
    errorCode = errorCode.split('/')[1] || errorCode;
    switch (errorCode) {
        case "ERROR_EMAIL_ALREADY_IN_USE":
        case "account-exists-with-different-credential":
        case "email-already-in-use":
            return "Email already used. Use the login instead, or register with a different email.";
        case "ERROR_WRONG_PASSWORD":
        case "wrong-password":
            return "Wrong password for this email.";
        case "ERROR_USER_NOT_FOUND":
        case "user-not-found":
            return "No user found with this email.";
        case "ERROR_USER_DISABLED":
        case "user-disabled":
            return "User disabled.";
        case "ERROR_TOO_MANY_REQUESTS":
        case "operation-not-allowed":
            return "Too many requests to log into this account.";
        case "ERROR_OPERATION_NOT_ALLOWED":
        case "operation-not-allowed":
            return "Server error, please try again later.";
        case "ERROR_INVALID_EMAIL":
        case "invalid-email":
            return "Email address is invalid.";
        case "weak-password":
            return "The password is too weak. Please choose a stronger password, at least 6 characters long.";
        default:
            return "Login failed. Please try again.\n" + errorCode;
    }
}
