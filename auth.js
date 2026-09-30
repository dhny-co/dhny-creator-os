// ========================================
// AFFILIATE CREATOR TOOL - AUTH
// ========================================

const SUPABASE_URL =
    "https://npeutglwjpucwwzjaikn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_wdSkArJGYB_0CuLoJfN5fw_JgtAfNpp";

// Jadikan variabel global agar bisa diakses oleh scrip.js
supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// AUTH ELEMENTS
// ========================================

const authScreen =
    document.getElementById("authScreen");

const authForm =
    document.getElementById("authForm");

const authEmail =
    document.getElementById("authEmail");

const authPassword =
    document.getElementById("authPassword");

const authSubmit =
    document.getElementById("authSubmit");

const authMessage =
    document.getElementById("authMessage");

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");


let authMode = "login";


// ========================================
// LOGIN TAB
// ========================================

loginTab.addEventListener("click", () => {

    authMode = "login";

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    authSubmit.textContent = "Login";

    authMessage.textContent = "";

});


// ========================================
// REGISTER TAB
// ========================================

registerTab.addEventListener("click", () => {

    authMode = "register";

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    authSubmit.textContent = "Daftar";

    authMessage.textContent = "";

});


// ========================================
// LOGIN / REGISTER
// ========================================

authForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        authEmail.value.trim();

    const password =
        authPassword.value;


    authSubmit.disabled = true;

    authSubmit.textContent = "Memproses...";

    authMessage.textContent = "";


    try {

        // REGISTER

        if (authMode === "register") {

            const { error } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            authMessage.textContent =
                "Akun berhasil dibuat. Silakan cek email untuk verifikasi.";

        }

        // LOGIN

        else {

            const { error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            showApp();

        }

    }

    catch (error) {

        console.error(error);

        authMessage.textContent =
            error.message;

    }

    finally {

        authSubmit.disabled = false;

        authSubmit.textContent =
            authMode === "login"
                ? "Login"
                : "Daftar";

    }

});


// ========================================
// SHOW APP
// ========================================

function showApp() {

    authScreen.style.display = "none";

}


// ========================================
// SHOW LOGIN
// ========================================

function showLogin() {

    authScreen.style.display = "flex";

}


// ========================================
// CHECK SESSION
// ========================================

async function checkAuth() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {

        console.error(error);

        return;

    }

    if (data.session) {

        showApp();

    }

    else {

        showLogin();

    }

}


// ========================================
// AUTH STATE
// ========================================

supabase.auth.onAuthStateChange(
    (event, session) => {

        if (session) {

            showApp();

        }

        else {

            showLogin();

        }

    }
);


// ========================================
// START
// ========================================

checkAuth();