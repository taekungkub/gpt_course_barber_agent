const { app } = require("@azure/functions");
const { getContentByRead, getContentByLayout } = require("../services/form_regonizer.service");

app.http("layoutImageContentByURL", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const bodyJson = JSON.parse(await request.text());
            const { imageURL } = bodyJson;
            const { textContent, tables } = await getContentByLayout({ formUrl: imageURL });
            return {
                body: JSON.stringify({ text: `${textContent}`, tables }),
                headers: { "content-type": "application/json" },
            };
        } catch (error) {
            return { body: JSON.stringify({ error: `${error}` }), headers: { "content-type": "application/json" } };
        }
    },
});
