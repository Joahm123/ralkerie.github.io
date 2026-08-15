export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        /*
         * Discord presence endpoint
         */

        if (url.pathname === "/api/discord") {

            const response = await fetch(
                "https://api.lanyard.rest/v1/users/1044800788817510460"
            );

            return new Response(
                await response.text(),
                {
                    status: response.status,

                    headers: {
                        "Content-Type": "application/json",

                        "Access-Control-Allow-Origin": "*",

                        "Cache-Control": "no-store"
                    }
                }
            );
        }


        /*
         * Everything else goes to
         * your existing website files.
         */

        return env.ASSETS.fetch(request);
    }
};
