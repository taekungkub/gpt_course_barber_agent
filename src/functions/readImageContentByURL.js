const { app } = require("@azure/functions");
const { getContentByRead, getContentFromBase64 } = require("../services/form_regonizer.service");

app.http("readImageContentByURL", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const bodyJson = JSON.parse(await request.text());
            const { imageURL } = bodyJson;
            let imageTextContent = await getContentByRead({ formUrl: imageURL });

            return { body: imageTextContent };
        } catch (error) {
            return { body: String(error) };
        }
    },
});
