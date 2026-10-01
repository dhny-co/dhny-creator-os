// ========================================
// AFFILIATE CREATOR TOOL - V1
// Personal Content & Hook Manager
// ========================================


// ========================================
// DATA
// ========================================

let contents =
    loadLocalData("affiliateContents");

let hooks =
    loadLocalData("affiliateHooks");


// ========================================
// ELEMENTS
// ========================================

const contentModal =
    document.getElementById("contentModal");

const hookModal =
    document.getElementById("hookModal");

const contentList =
    document.getElementById("contentList");

const contentList2 =
    document.getElementById("contentList2");

const hookList =
    document.getElementById("hookList");

const totalContent =
    document.getElementById("totalContent");

const totalHooks =
    document.getElementById("totalHooks");

const postedContent =
    document.getElementById("postedContent");


// ========================================
// LOCAL STORAGE
// ========================================

function loadLocalData(key) {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(key)
            );


        return Array.isArray(saved)
            ? saved
            : [];

    }

    catch (error) {

        console.error(
            `Gagal membaca ${key}:`,
            error
        );

        return [];

    }

}


function saveData() {

    localStorage.setItem(
        "affiliateContents",
        JSON.stringify(contents)
    );

    localStorage.setItem(
        "affiliateHooks",
        JSON.stringify(hooks)
    );

}


// ========================================
// MODAL
// ========================================

function openModal(modal) {

    modal.classList.add("active");

}


function closeModal(modal) {

    modal.classList.remove("active");

}


// ========================================
// ADD CONTENT BUTTON
// ========================================

document
    .getElementById("addContentBtn")
    .addEventListener(
        "click",
        () => {
            openModal(contentModal);
        }
    );


document
    .getElementById("addContentBtn2")
    .addEventListener(
        "click",
        () => {
            openModal(contentModal);
        }
    );


// ========================================
// ADD HOOK BUTTON
// ========================================

document
    .getElementById("addHookBtn")
    .addEventListener(
        "click",
        () => {
            openModal(hookModal);
        }
    );


// ========================================
// CLOSE BUTTON
// ========================================

document
    .querySelectorAll(".close-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modalId =
                    button.dataset.close;

                const modal =
                    document.getElementById(
                        modalId
                    );


                if (modal) {
                    closeModal(modal);
                }

            }
        );

    });


// ========================================
// CLICK OUTSIDE MODAL
// ========================================

window.addEventListener(
    "click",
    event => {

        if (
            event.target === contentModal
        ) {

            closeModal(contentModal);

        }


        if (
            event.target === hookModal
        ) {

            closeModal(hookModal);

        }

    }
);


// ========================================
// SAVE CONTENT
// ========================================

document
    .getElementById("saveContentBtn")
    .addEventListener(
        "click",
        () => {

            const product =
                document
                    .getElementById(
                        "productInput"
                    )
                    .value
                    .trim();


            const hook =
                document
                    .getElementById(
                        "contentHookInput"
                    )
                    .value
                    .trim();


            const category =
                document
                    .getElementById(
                        "categoryInput"
                    )
                    .value;


            const selectedPlatforms =
                Array
                    .from(
                        document.querySelectorAll(
                            ".platform:checked"
                        )
                    )
                    .map(
                        checkbox => ({
                            name:
                                checkbox.value,

                            posted:
                                false
                        })
                    );


            // VALIDASI

            if (!product) {

                alert(
                    "Nama produk belum diisi."
                );

                return;

            }


            if (!hook) {

                alert(
                    "Hook belum diisi."
                );

                return;

            }


            // CREATE CONTENT

            const newContent = {

                id:
                    Date.now(),

                product:
                    product,

                hook:
                    hook,

                category:
                    category,

                platforms:
                    selectedPlatforms,

                createdAt:
                    new Date()
                        .toLocaleDateString(
                            "id-ID",
                            {
                                day:
                                    "numeric",

                                month:
                                    "short",

                                year:
                                    "numeric"
                            }
                        )

            };


            contents.unshift(
                newContent
            );


            saveData();

            renderAll();

            resetContentForm();

            closeModal(
                contentModal
            );

        }
    );


// ========================================
// RESET CONTENT FORM
// ========================================

function resetContentForm() {

    document
        .getElementById(
            "productInput"
        )
        .value = "";


    document
        .getElementById(
            "contentHookInput"
        )
        .value = "";


    document
        .getElementById(
            "categoryInput"
        )
        .value =
            "Curiosity";


    document
        .querySelectorAll(
            ".platform"
        )
        .forEach(
            checkbox => {
                checkbox.checked =
                    false;
            }
        );

}


// ========================================
// SAVE HOOK
// ========================================

document
    .getElementById("saveHookBtn")
    .addEventListener(
        "click",
        () => {

            const hookText =
                document
                    .getElementById(
                        "hookInput"
                    )
                    .value
                    .trim();


            const category =
                document
                    .getElementById(
                        "hookCategoryInput"
                    )
                    .value;


            if (!hookText) {

                alert(
                    "Hook belum diisi."
                );

                return;

            }


            const newHook = {

                id:
                    Date.now(),

                text:
                    hookText,

                category:
                    category,

                createdAt:
                    new Date()
                        .toLocaleDateString(
                            "id-ID",
                            {
                                day:
                                    "numeric",

                                month:
                                    "short",

                                year:
                                    "numeric"
                            }
                        )

            };


            hooks.unshift(
                newHook
            );


            saveData();

            renderAll();

            resetHookForm();

            closeModal(
                hookModal
            );

        }
    );


// ========================================
// RESET HOOK FORM
// ========================================

function resetHookForm() {

    document
        .getElementById(
            "hookInput"
        )
        .value = "";


    document
        .getElementById(
            "hookCategoryInput"
        )
        .value =
            "Curiosity";

}


// ========================================
// RENDER CONTENTS
// ========================================

function renderContents(
    list = contents
) {

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        const emptyHTML = `

            <div class="empty">

                <h3>
                    Belum ada konten
                </h3>

                <p>
                    Tambahkan konten pertamamu.
                </p>

            </div>

        `;


        contentList.innerHTML =
            emptyHTML;

        contentList2.innerHTML =
            emptyHTML;

        return;

    }


    const html =
        list
            .map(content => {

                const platforms =
                    Array.isArray(
                        content.platforms
                    )
                        ? content.platforms
                        : [];


                const platformsHTML =
                    platforms.length > 0

                        ? platforms
                            .map(platform => `

                                <div
                                    class="platform-item"
                                >

                                    <span>
                                        ${escapeHTML(
                                            platform.name
                                        )}
                                    </span>


                                    <button
                                        class="status ${
                                            platform.posted
                                                ? "posted"
                                                : "not-posted"
                                        }"

                                        onclick="
                                            togglePlatform(
                                                ${content.id},
                                                '${escapeAttribute(
                                                    platform.name
                                                )}'
                                            )
                                        "

                                        type="button"
                                    >

                                        ${
                                            platform.posted
                                                ? "✓ Sudah"
                                                : "Belum"
                                        }

                                    </button>

                                </div>

                            `)
                            .join("")

                        : `

                            <p
                                style="
                                    color:#777;
                                    font-size:13px;
                                "
                            >
                                Belum ada platform.
                            </p>

                        `;


                return `

                    <article
                        class="content-card"
                    >

                        <span
                            class="category"
                        >
                            ${escapeHTML(
                                content.category ||
                                "Other"
                            )}
                        </span>


                        <h3>
                            ${escapeHTML(
                                content.product ||
                                ""
                            )}
                        </h3>


                        <div class="hook">
                            ${escapeHTML(
                                content.hook ||
                                ""
                            )}
                        </div>


                        <small
                            style="color:#888;"
                        >
                            Dibuat
                            ${escapeHTML(
                                content.createdAt ||
                                "-"
                            )}
                        </small>


                        <div
                            class="platform-list"
                        >

                            ${platformsHTML}

                        </div>


                        <div
                            class="card-actions"
                        >

                            <button
                                class="small-btn"

                                onclick="
                                    copyText(
                                        '${escapeAttribute(
                                            content.hook ||
                                            ""
                                        )}'
                                    )
                                "

                                type="button"
                            >
                                Copy Hook
                            </button>


                            <button
                                class="
                                    small-btn
                                    delete-btn
                                "

                                onclick="
                                    deleteContent(
                                        ${content.id}
                                    )
                                "

                                type="button"
                            >
                                Hapus
                            </button>

                        </div>

                    </article>

                `;

            })
            .join("");


    contentList.innerHTML =
        html;

    contentList2.innerHTML =
        html;

}


// ========================================
// RENDER HOOKS
// ========================================

function renderHooks() {

    if (
        !Array.isArray(hooks) ||
        hooks.length === 0
    ) {

        hookList.innerHTML = `

            <div class="empty">

                <h3>
                    Hook Bank masih kosong
                </h3>

                <p>
                    Simpan hook pertama kamu.
                </p>

            </div>

        `;

        return;

    }


    hookList.innerHTML =
        hooks
            .map(hook => `

                <article
                    class="hook-card"
                >

                    <span
                        class="category"
                    >
                        ${escapeHTML(
                            hook.category ||
                            "Other"
                        )}
                    </span>


                    <p
                        class="hook-text"
                    >
                        ${escapeHTML(
                            hook.text ||
                            ""
                        )}
                    </p>


                    <small
                        style="color:#888;"
                    >
                        ${escapeHTML(
                            hook.createdAt ||
                            "-"
                        )}
                    </small>


                    <div
                        class="card-actions"
                    >

                        <button
                            class="small-btn"

                            onclick="
                                copyText(
                                    '${escapeAttribute(
                                        hook.text ||
                                        ""
                                    )}'
                                )
                            "

                            type="button"
                        >
                            Copy
                        </button>


                        <button
                            class="
                                small-btn
                                delete-btn
                            "

                            onclick="
                                deleteHook(
                                    ${hook.id}
                                )
                            "

                            type="button"
                        >
                            Hapus
                        </button>

                    </div>

                </article>

            `)
            .join("");

}


// ========================================
// TOGGLE PLATFORM
// ========================================

function togglePlatform(
    contentId,
    platformName
) {

    const content =
        contents.find(
            item =>
                item.id === contentId
        );


    if (
        !content ||
        !Array.isArray(
            content.platforms
        )
    ) {

        return;

    }


    const platform =
        content.platforms.find(
            item =>
                item.name ===
                platformName
        );


    if (!platform) {
        return;
    }


    platform.posted =
        !platform.posted;


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


    if (!confirmed) {
        return;
    }


    contents =
        contents.filter(
            content =>
                content.id !== id
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


    if (!confirmed) {
        return;
    }


    hooks =
        hooks.filter(
            hook =>
                hook.id !== id
        );


    saveData();

    renderAll();

}


// ========================================
// COPY TEXT
// ========================================

function copyText(text) {

    if (
        !navigator.clipboard
    ) {

        alert(
            "Fitur copy tidak tersedia di browser ini."
        );

        return;

    }


    navigator.clipboard
        .writeText(text)

        .then(() => {

            alert(
                "Hook berhasil disalin!"
            );

        })

        .catch(() => {

            alert(
                "Gagal menyalin."
            );

        });

}


// ========================================
// SEARCH
// ========================================

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            if (!keyword) {

                renderContents();

                return;

            }


            const filtered =
                contents.filter(
                    content => {

                        const product =
                            String(
                                content.product ||
                                ""
                            )
                            .toLowerCase();


                        const hook =
                            String(
                                content.hook ||
                                ""
                            )
                            .toLowerCase();


                        const category =
                            String(
                                content.category ||
                                ""
                            )
                            .toLowerCase();


                        return (

                            product.includes(
                                keyword
                            )

                            ||

                            hook.includes(
                                keyword
                            )

                            ||

                            category.includes(
                                keyword
                            )

                        );

                    }
                );


            renderContents(
                filtered
            );

        }
    );


// ========================================
// TABS
// ========================================

document
    .querySelectorAll(".tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                document
                    .querySelectorAll(
                        ".tab"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                document
                    .querySelectorAll(
                        ".tab-content"
                    )
                    .forEach(section => {

                        section.classList.remove(
                            "active"
                        );

                    });


                tab.classList.add(
                    "active"
                );


                const targetSection =
                    document.getElementById(
                        target
                    );


                if (
                    targetSection
                ) {

                    targetSection.classList.add(
                        "active"
                    );

                }

            }
        );

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


    contents.forEach(
        content => {

            if (
                !Array.isArray(
                    content.platforms
                )
            ) {

                return;

            }


            content.platforms.forEach(
                platform => {

                    if (
                        platform.posted
                    ) {

                        totalPosted++;

                    }

                }
            );

        }
    );


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

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(text) {

    return String(text)

        .replaceAll(
            "\\",
            "\\\\"
        )

        .replaceAll(
            "'",
            "\\'"
        )

        .replaceAll(
            "\n",
            "\\n"
        )

        .replaceAll(
            "\r",
            ""
        );

}


// ========================================
// START APP
// ========================================

renderAll();