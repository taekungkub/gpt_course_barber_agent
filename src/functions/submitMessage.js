const { app } = require("@azure/functions");
const OpenAI = require("openai");
const sqlite3 = require("sqlite3");
const { COMPLETION_TEMPLATE } = require("../config/ai_tool");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.http("submitMessage", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {

        try {
            const bodyJson =  await request.text()
            COMPLETION_TEMPLATE.messages = COMPLETION_TEMPLATE.messages.concat(bodyJson.messages);
            return {
                status: 200,
                body: JSON.stringify({ status: "success", message_to_reply: "สวัสดีค่ะ", messages: COMPLETION_TEMPLATE.messages }),
                headers: { "content-type": "application/json" },
            };
        } catch (error) {
             return {
                status: 400,
                body: JSON.stringify({  data: String(error) }),
                headers: { "content-type": "application/json" },}
        }
      
        // const message = bodyJson.message;
        // const response = await openai.chat.completions.create(COMPLETION_TEMPLATE);

        // // Check condition if tool_calls
        // if (response?.choices?.[0]?.finish_reason === "tool_calls") {
        //     const toolArg = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments); // Args to call function
        //     const toolName = response.choices[0].message.tool_calls[0].function.name; // "get_menu"
        //     const toolCallID = response.choices[0].message.tool_calls[0].id;
        //     COMPLETION_TEMPLATE.messages.push(response.choices[0].message);

        //     let toolResponseText = "";
        //     if (toolName === "get_menu") {
        //         toolResponseText = await fetch_menu(toolArg); // toolarg คือตัว params
        //     }

        //     COMPLETION_TEMPLATE.messages.push({
        //         role: "tool",
        //         content: [
        //             {
        //                 type: "text",
        //                 text: toolResponseText,
        //             },
        //         ],
        //         tool_call_id: toolCallID,
        //     });
        //     const responseAfterToolCall = await openai.chat.completions.create(COMPLETION_TEMPLATE);
        //     COMPLETION_TEMPLATE.messages.push(responseAfterToolCall.choices[0].message);
        // } else {
        //     COMPLETION_TEMPLATE.messages.push(response.choices[0].message);
        // }
        // return { body: JSON.stringify(COMPLETION_TEMPLATE), headers: { "content-type": "application/json" } };
    },
});
