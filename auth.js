// ========================================
// AFFILIATE CREATOR TOOL - AUTH
// ========================================


// ========================================
// SUPABASE CONFIG
// ========================================

const SUPABASE_URL =
    "https://npeutglwjpuwwzjaikn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_wdSkArJGYB_0CuLoJfN5fw_JgtAfNpp";


// Supabase client
const supabase = window.supabase.createClient(
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

    authPassword.setAttribute(
        "autocomplete",
        "current-password"
    );

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

    authPassword.setAttribute(
        "autocomplete",
        "new-password"
    );

    authMessage.textContent = "";

});


// ========================================
// LOGIN / REGISTER
// ========================================

authForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            authEmail.value.trim();

        const password =
            authPassword.value;


        authSubmit.disabled = true;

        authSubmit.textContent =
            "Memproses...";

        authMessage.textContent = "";


        try {

            // =========================
            // REGISTER
            // =========================

            if (authMode === "register") {

                const {
                    data,
                    error
                } =
                    await supabase.auth.signUp({
                        email,
                        password
                    });


                if (error) {
                    throw error;
                }


                if (data.session) {

                    showApp();

                } else {

                    authMessage.textContent =
                        "Akun berhasil dibuat. Silakan cek email untuk verifikasi.";

                }


                return;
            }


            // =========================
            // LOGIN
            // =========================

            const { error } =
                await supabase.auth.signInWithPassword({
                    email,
                    password
                });


            if (error) {
                throw error;
            }


            showApp();

        }


        catch (error) {

            console.error(
                "Auth error:",
                error
            );

            authMessage.textContent =
                error?.message ||
                "Terjadi kesalahan. Coba lagi.";

        }


        finally {

            authSubmit.disabled = false;

            authSubmit.textContent =
                authMode === "login"
                    ? "Login"
                    : "Daftar";

        }

    }
);


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

    try {

        const {
            data,
            error
        } =
            await supabase.auth.getSession();


        if (error) {
            throw error;
        }


        if (data.session) {

            showApp();

        } else {

            showLogin();

        }

    }

    catch (error) {

        console.error(
            "Session error:",
            error
        );

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

        } else {

            showLogin();

        }

    }
);


// ========================================
// START AUTH
// ========================================

checkAuth();