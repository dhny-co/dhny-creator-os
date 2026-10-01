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

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const authScreen = document.getElementById("authScreen");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authSubmit = document.getElementById("authSubmit");
const authMessage = document.getElementById("authMessage");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

let authMode = "login";

// =========================
// TAB LOGIN
// =========================

loginTab.addEventListener("click", () => {
    authMode = "login";

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    authSubmit.textContent = "Login";
    authMessage.textContent = "";
});

// =========================
// TAB DAFTAR
// =========================

registerTab.addEventListener("click", () => {
    authMode = "register";

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    authSubmit.textContent = "Daftar";
    authMessage.textContent = "";
});

// =========================
// LOGIN / DAFTAR
// =========================

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email || !password) {
        authMessage.textContent = "Email dan password wajib diisi.";
        return;
    }

    authSubmit.disabled = true;
    authSubmit.textContent =
        authMode === "register"
            ? "Mendaftarkan..."
            : "Login...";

    authMessage.textContent = "";

    try {

        // =========================
        // DAFTAR
        // =========================

        if (authMode === "register") {

            const { data, error } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            console.log("Register berhasil:", data);

            if (data.session) {
                authMessage.textContent =
                    "Akun berhasil dibuat. Kamu sudah login.";

                showApp();
            } else {
                authMessage.textContent =
                    "Akun berhasil dibuat. Cek email kamu untuk verifikasi.";
            }

        // =========================
        // LOGIN
        // =========================

        } else {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            console.log("Login berhasil:", data);

            showApp();
        }

    } catch (error) {

        console.error("AUTH ERROR:", error);

        authMessage.textContent =
            error.message || "Terjadi kesalahan.";

    } finally {

        authSubmit.disabled = false;

        authSubmit.textContent =
            authMode === "login"
                ? "Login"
                : "Daftar";
    }
});

// =========================
// TAMPILKAN APP
// =========================

function showApp() {
    authScreen.style.display = "none";
}

// =========================
// TAMPILKAN LOGIN
// =========================

function showLogin() {
    authScreen.style.display = "flex";
}

// =========================
// CEK SESSION
// =========================

async function checkAuth() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error("SESSION ERROR:", error);
        showLogin();
        return;
    }

    if (data.session) {
        showApp();
    } else {
        showLogin();
    }
}

// =========================
// PERUBAHAN AUTH
// =========================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log("AUTH EVENT:", event);

        if (session) {
            showApp();
        } else {
            showLogin();
        }
    }
);

checkAuth();