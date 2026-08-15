export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        /*
         * Discord presence API
         */

        if (url.pathname === "/api/discord") {

            try {

                const response = await fetch(
                    "https://api.lanyard.rest/v1/users/1044800788817510460"
                );

                return new Response(
                    await response.text(),
                    {
                        status: response.status,

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Access-Control-Allow-Origin":
                                "*",

                            "Cache-Control":
                                "no-store"
                        }
                    }
                );

            } catch (error) {

                return new Response(
                    JSON.stringify({
                        error:
                            "Discord presence request failed"
                    }),
                    {
                        status: 500,

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Access-Control-Allow-Origin":
                                "*"
                        }
                    }
                );

            }
        }


        /*
         * Everything else goes to
         * your normal website.
         */

        return env.ASSETS.fetch(request);
    }
};
