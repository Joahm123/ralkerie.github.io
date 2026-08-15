/* =====================================================
   RALKERIE MAIN
   NAVIGATION / TAB SWITCHING
===================================================== */

(() => {
    "use strict";

    console.log("Ralkerie website loaded.");

    const tabs = document.querySelectorAll(".pixel-tab");
    const pages = document.querySelectorAll(".pixel-page");

    if (!tabs.length) {
        console.error("Ralkerie: No navigation tabs found.");
        return;
    }

    if (!pages.length) {
        console.error("Ralkerie: No pages found.");
        return;
    }

    function showPage(pageId) {
        const targetPage = document.getElementById(pageId);

        if (!targetPage) {
            console.warn(
                "Ralkerie: Page not found:",
                pageId
            );
            return;
        }

        /* Remove active state from every tab */
        tabs.forEach(tab => {
            tab.classList.remove("active");
        });

        /* Hide every page */
        pages.forEach(page => {
            page.classList.remove("active");
        });

        /* Activate selected tab */
        const activeTab =
            document.querySelector(
                `.pixel-tab[data-page="${pageId}"]`
            );

        if (activeTab) {
            activeTab.classList.add("active");
        }

        /* Show selected page */
        targetPage.classList.add("active");

        /* Update URL hash without jumping */
        history.replaceState(
            null,
            "",
            `#${pageId}`
        );
    }


    /* =================================================
       TAB CLICKS
    ================================================= */

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const pageId =
                    tab.dataset.page;

                if (!pageId) {
                    return;
                }

                showPage(pageId);
            }
        );

    });


    /* =================================================
       STARTING PAGE
    ================================================= */

    const hash =
        window.location.hash
            .replace("#", "")
            .trim();

    if (
        hash &&
        document.getElementById(hash)
    ) {

        showPage(hash);

    } else {

        showPage("live");

    }


    /* =================================================
       BROWSER BACK / FORWARD
    ================================================= */

    window.addEventListener(
        "popstate",
        () => {

            const pageId =
                window.location.hash
                    .replace("#", "")
                    .trim();

            if (
                pageId &&
                document.getElementById(pageId)
            ) {

                showPage(pageId);

            } else {

                showPage("live");

            }

        }
    );


    console.log(
        "Ralkerie navigation ready."
    );

})();
