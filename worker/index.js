```javascript
export default {

    async fetch(request) {

        var url =
            new URL(request.url);


        /*
           CORS
        */

        var corsHeaders = {

            "Access-Control-Allow-Origin":
                "https://ralkerie.com",

            "Access-Control-Allow-Methods":
                "GET, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type"

        };


        /*
           OPTIONS
        */

        if (
            request.method === "OPTIONS"
        ) {

            return new Response(
                null,
                {
                    status: 204,
                    headers: corsHeaders
                }
            );

        }


        /*
           Only allow GET
        */

        if (
            request.method !== "GET"
        ) {

            return new Response(
                "Method not allowed",
                {
                    status: 405,
                    headers: corsHeaders
                }
            );

        }


        /*
           Presence endpoint
        */

        if (
            url.pathname.startsWith(
                "/presence/"
            )
        ) {

            var userId =
                url.pathname.split(
                    "/"
                )[2];


            /*
               Only allow YOUR Discord ID.
            */

            if (
                userId !==
                "1044800788817510460"
            ) {

                return new Response(
                    "Not found",
                    {
                        status: 404,
                        headers: corsHeaders
                    }
                );

            }


            try {

                var response =
                    await fetch(
                        "https://api.lanyard.rest/v1/users/" +
                        userId
                    );


                var body =
                    await response.text();


                return new Response(
                    body,
                    {
                        status:
                            response.status,

                        headers: {

                            ...corsHeaders,

                            "Content-Type":
                                "application/json",

                            "Cache-Control":
                                "no-store"

                        }

                    }
                );


            } catch (error) {

                return new Response(
                    JSON.stringify({
                        error:
                            "Presence request failed"
                    }),
                    {
                        status: 502,

                        headers: {
                            ...corsHeaders,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            }

        }


        return new Response(
            "Not found",
            {
                status: 404,
                headers: corsHeaders
            }
        );

    }

};
```
