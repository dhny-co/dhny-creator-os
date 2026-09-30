// ========================================
// AFFILIATE CREATOR TOOL - V1
// Personal Content & Hook Manager
// ========================================


// ========================================
// DATA
// ========================================

let contents = JSON.parse(
    localStorage.getItem("affiliateContents")
) || [];

let hooks = JSON.parse(
    localStorage.getItem("affiliateHooks")
) || [];


// ========================================
// ELEMENTS
// ========================================

const contentModal = document.getElementById("contentModal");
const hookModal = document.getElementById("hookModal");

const contentList = document.getElementById("contentList");
const contentList2 = document.getElementById("contentList2");
const hookList = document.getElementById("hookList");

const totalContent = document.getElementById("totalContent");
const totalHooks = document.getElementById("totalHooks");
const postedContent = document.getElementById("postedContent");


// ========================================
// SAVE DATA
// ========================================

async function saveData() {
    // Ambil data user yang sedang login saat ini
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
        console.error("User belum login:", userError);
        return;
    }

    const userId = userData.user.id;

    // 1. Simpan/Sinkronkan data contents ke Supabase
    // (Asumsinya 'contents' adalah array objek yang berisi data, misal: { content_text: "..." })
    if (contents && contents.length > 0) {
        for (let item of contents) {
            // Pastikan menyertakan user_id dan unique constraint (misal id jika ada)
            await supabase.from("contents").upsert({
                user_id: userId,
                content_text: item.text || item // sesuaikan dengan struktur datamu
            });
        }
    }

    // 2. Simpan/Sinkronkan data hooks ke Supabase
    if (hooks && hooks.length > 0) {
        for (let item of hooks) {
            await supabase.from("hooks").upsert({
                user_id: userId,
                hook_text: item.text || item // sesuaikan dengan struktur datamu
            });
        }
    }

    // Tetap simpan cadangan lokal juga boleh, biar kalau offline tetap aman
    localStorage.setItem("affiliateContents", JSON.stringify(contents));
    localStorage.setItem("affiliateHooks", JSON.stringify(hooks));
}

async function loatData() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return;

    const userId = userData.user.id;

// Ambil data contents dari Supabase
const { data: contentsData, error: contentsError } = await supabase
     .from('contents')
     .select('*')
     .eq('user_id', userId);

     if (!contentsError && contentsData) {
        contents = contentsData;
        localStorage.setItem('affiliateContents', JSON.stringify (contents));
     }

// Ambil data hooks dari Supabase
const { data: hooksDatam, error: hooksError } = await supabase
     .from('hooks')
     .select('*')
     .eq('user_id', userId);

     if (!hooksError && hooksData) {
        hooks = hooksData;
        localStorage.setItem('affiliateHooks', JSON.stringify(hooks));
     }
     renderAll();
}

// ========================================
// OPEN MODAL
// ========================================

function openModal(modal) {
    modal.classList.add("active");
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal(modal) {
    modal.classList.remove("active");
}


// ========================================
// BUTTON - ADD CONTENT
// ========================================

document
    .getElementById("addContentBtn")
    .addEventListener("click", () => {

        openModal(contentModal);

    });


document
    .getElementById("addContentBtn")
    .addEventListener("click", () => {

        openModal(contentModal);

    });


// ========================================
// BUTTON - ADD HOOK
// ========================================

document
    .getElementById("addHookBtn")
    .addEventListener("click", () => {

        openModal(hookModal);

    });


// ========================================
// CLOSE BUTTON
// ========================================

document
    .querySelectorAll(".close-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const modalId = button.dataset.close;

            document
                .getElementById(modalId)
                .classList.remove("active");

        });

    });


// ========================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ========================================

window.addEventListener("click", (event) => {

    if (event.target === contentModal) {
        closeModal(contentModal);
    }

    if (event.target === hookModal) {
        closeModal(hookModal);
    }

});


// ========================================
// ADD CONTENT
// ========================================

document
    .getElementById("saveContentBtn")
    .addEventListener("click", () => {

        const product =
            document
                .getElementById("productInput")
                .value
                .trim();

        const hook =
            document
                .getElementById("contentHookInput")
                .value
                .trim();

        const category =
            document
                .getElementById("categoryInput")
                .value;


        // Ambil platform yang dicentang

        const selectedPlatforms =
            Array.from(
                document.querySelectorAll(".platform:checked")
            ).map(
                checkbox => ({
                    name: checkbox.value,
                    posted: false
                })
            );


        // Validasi

        if (!product) {

            alert("Nama produk belum diisi.");

            return;

        }


        if (!hook) {

            alert("Hook belum diisi.");

            return;

        }


        // Buat object content

        const newContent = {

            id: Date.now(),

            product: product,

            hook: hook,

            category: category,

            platforms: selectedPlatforms,

            createdAt: new Date().toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )

        };


        contents.unshift(newContent);

        saveData();

        renderAll();

        resetContentForm();

        closeModal(contentModal);

    });


// ========================================
// RESET CONTENT FORM
// ========================================

function resetContentForm() {

    document
        .getElementById("productInput")
        .value = "";

    document
        .getElementById("contentHookInput")
        .value = "";

    document
        .getElementById("categoryInput")
        .value = "Curiosity";


    document
        .querySelectorAll(".platform")
        .forEach(
            checkbox => checkbox.checked = false
        );

}


// ========================================
// ADD HOOK
// ========================================

document
    .getElementById("saveHookBtn")
    .addEventListener("click", () => {

        const hookText =
            document
                .getElementById("hookInput")
                .value
                .trim();

        const category =
            document
                .getElementById("hookCategoryInput")
                .value;


        if (!hookText) {

            alert("Hook belum diisi.");

            return;

        }


        const newHook = {

            id: Date.now(),

            text: hookText,

            category: category,

            createdAt: new Date().toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )

        };


        hooks.unshift(newHook);

        saveData();

        renderAll();

        resetHookForm();

        closeModal(hookModal);

    });


// ========================================
// RESET HOOK FORM
// ========================================

function resetHookForm() {

    document
        .getElementById("hookInput")
        .value = "";

    document
        .getElementById("hookCategoryInput")
        .value = "Curiosity";

}


// ========================================
// RENDER CONTENT
// ========================================

function renderContents(list = contents) {

    if (list.length === 0) {

        const emptyHTML = `
            <div class="empty">
                <h3>Belum ada konten</h3>
                <p>
                    Tambahkan konten pertamamu.
                </p>
            </div>
        `;

        contentList.innerHTML = emptyHTML;

        contentList2.innerHTML = emptyHTML;

        return;

    }


    const html = list.map(content => {

        const platformsHTML =
            content.platforms.length > 0

                ? content.platforms.map(platform => `

                    <div class="platform-item">

                        <span>
                            ${escapeHTML(platform.name)}
                        </span>

                        <button
                            class="status ${
                                platform.posted
                                    ? "posted"
                                    : "not-posted"
                            }"
                            onclick="togglePlatform(
                                ${content.id},
                                '${escapeAttribute(platform.name)}'
                            )"
                        >

                            ${
                                platform.posted
                                    ? "✓ Sudah"
                                    : "Belum"
                            }

                        </button>

                    </div>

                `).join("")

                : `
                    <p style="color:#777;font-size:13px;">
                        Belum ada platform.
                    </p>
                `;


        return `

            <article class="content-card">

                <span class="category">
                    ${escapeHTML(content.category)}
                </span>

                <h3>
                    ${escapeHTML(content.product)}
                </h3>

                <div class="hook">
                    ${escapeHTML(content.hook)}
                </div>

                <small style="color:#888;">
                    Dibuat ${content.createdAt}
                </small>

                <div class="platform-list">

                    ${platformsHTML}

                </div>

                <div class="card-actions">

                    <button
                        class="small-btn"
                        onclick="copyText(
                            '${escapeAttribute(content.hook)}'
                        )"
                    >
                        Copy Hook
                    </button>

                    <button
                        class="small-btn delete-btn"
                        onclick="deleteContent(${content.id})"
                    >
                        Hapus
                    </button>

                </div>

            </article>

        `;

    }).join("");


    contentList.innerHTML = html;

    contentList2.innerHTML = html;

}


// ========================================
// RENDER HOOKS
// ========================================

function renderHooks() {

    if (hooks.length === 0) {

        hookList.innerHTML = `

            <div class="empty">

                <h3>Hook Bank masih kosong</h3>

                <p>
                    Simpan hook pertama kamu.
                </p>

            </div>

        `;

        return;

    }


    hookList.innerHTML = hooks.map(hook => `

        <article class="hook-card">

            <span class="category">
                ${escapeHTML(hook.category)}
            </span>

            <p class="hook-text">
                ${escapeHTML(hook.text)}
            </p>

            <small style="color:#888;">
                ${hook.createdAt}
            </small>

            <div class="card-actions">

                <button
                    class="small-btn"
                    onclick="copyText(
                        '${escapeAttribute(hook.text)}'
                    )"
                >
                    Copy
                </button>

                <button
                    class="small-btn delete-btn"
                    onclick="deleteHook(${hook.id})"
                >
                    Hapus
                </button>

            </div>

        </article>

    `).join("");

}


// ========================================
// TOGGLE PLATFORM
// ========================================

function togglePlatform(contentId, platformName) {

    const content =
        contents.find(
            item => item.id === contentId
        );

    if (!content) return;


    const platform =
        content.platforms.find(
            item => item.name === platformName
        );

    if (!platform) return;


    platform.posted = !platform.posted;

    saveData();

    renderAll();

}


// ========================================
// DELETE CONTENT
// ========================================

function deleteContent(id) {

    const confirmed =
        confirm(
            "Hapus konten ini?"
        );

    if (!confirmed) return;


    contents =
        contents.filter(
            content => content.id !== id
        );

    saveData();

    renderAll();

}


// ========================================
// DELETE HOOK
// ========================================

function deleteHook(id) {

    const confirmed =
        confirm(
            "Hapus hook ini?"
        );

    if (!confirmed) return;


    hooks =
        hooks.filter(
            hook => hook.id !== id
        );

    saveData();

    renderAll();

}


// ========================================
// COPY TEXT
// ========================================

function copyText(text) {

    navigator.clipboard
        .writeText(text)
        .then(() => {

            alert("Hook berhasil disalin!");

        })
        .catch(() => {

            alert("Gagal menyalin.");

        });

}


// ========================================
// SEARCH
// ========================================

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const keyword =
            this.value
                .toLowerCase()
                .trim();


        if (!keyword) {

            renderContents();

            return;

        }


        const filtered =
            contents.filter(content => {

                return (

                    content.product
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    content.hook
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    content.category
                        .toLowerCase()
                        .includes(keyword)

                );

            });


        renderContents(filtered);

    });


// ========================================
// TABS
// ========================================

document
    .querySelectorAll(".tab")
    .forEach(tab => {

        tab.addEventListener("click", () => {

            const target =
                tab.dataset.tab;


            // Hilangkan active dari semua tab

            document
                .querySelectorAll(".tab")
                .forEach(item =>
                    item.classList.remove("active")
                );


            // Hilangkan active dari semua halaman

            document
                .querySelectorAll(".tab-content")
                .forEach(section =>
                    section.classList.remove("active")
                );


            // Aktifkan tab yang dipilih

            tab.classList.add("active");

            document
                .getElementById(target)
                .classList.add("active");

        });

    });


// ========================================
// STATISTICS
// ========================================

function updateStats() {

    totalContent.textContent =
        contents.length;

    totalHooks.textContent =
        hooks.length;


    let totalPosted = 0;


    contents.forEach(content => {

        content.platforms.forEach(platform => {

            if (platform.posted) {

                totalPosted++;

            }

        });

    });


    postedContent.textContent =
        totalPosted;

}


// ========================================
// RENDER ALL
// ========================================

function renderAll() {

    renderContents();

    renderHooks();

    updateStats();

}


// ========================================
// SECURITY HELPERS
// ========================================

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(text) {

    return String(text)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll("\n", "\\n")
        .replaceAll("\r", "");

}

// == LOAD DATA DARI SUPABASE ==
async function loadData() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return;

    const userId = userData.user.id;

    // Ambil data contents
    const { data: contentsData, error: contentsError } = await supabase
        .from('contents')
        .select('*')
        .eq('user_id', userId);

    if (!contentsError && contentsData) {
        contents = contentsData;
        localStorage.setItem('affiliateContents', JSON.stringify(contents));
    }

    // Ambil data hooks
    const { data: hooksData, error: hooksError } = await supabase
        .from('hooks')
        .select('*')
        .eq('user_id', userId);

    if (!hooksError && hooksData) {
        hooks = hooksData;
        localStorage.setItem('affiliateHooks', JSON.stringify(hooks));
    }

    renderAll();
}

// ==========================================
// START APP
// ==========================================
async function initApp() {
    await loadData();
    renderAll();
}
initApp();

