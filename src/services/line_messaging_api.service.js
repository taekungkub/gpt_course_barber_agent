const LINE_REPLY_URL = "https://api.line.me/v2/bot/message/reply";
const APIAxios = require("./axios.service");

const getImageContent = async ({ messageId = "", returnType = "base64" }) => {
    try {
        // LINE Messaging API endpoint สำหรับดึงรูปภาพ
        const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;

        // ดึงรูปภาพจาก LINE API
        const response = await APIAxios({
            method: "get",
            url: url,
            responseType: "arraybuffer", // สำคัญ: ต้องระบุ responseType เป็น arraybuffer
            headers: { Authorization: `Bearer ${process.env.CHANNEL_SECRET_TOKEN}` },
        });
        if (returnType === "base64") {
            // แปลงข้อมูลเป็น base64
            const base64Image = Buffer.from(response.data, "binary").toString("base64");

            // เพิ่ม data URI scheme สำหรับ base64
            const contentType = response.headers["content-type"];
            const base64WithPrefix = `data:${contentType};base64,${base64Image}`;

            return base64WithPrefix;
        }
        return Buffer.from(response.data, "binary");
    } catch (error) {
        console.error("Error getting image from LINE:", error);
        throw new Error(`Failed to get image content: ${error.message}`);
    }
};

const getUserProfile = async (lineID) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env?.CHANNEL_SECRET_TOKEN}`,
    };
    const response = await APIAxios.get(`https://api.line.me/v2/bot/profile/${lineID}`, { headers });
    return {
        displayName: response.data?.displayName,
        userId: response.data?.userId,
        language: response.data?.language,
        pictureUrl: response.data?.pictureUrl,
        statusMessage: response.data?.statusMessage,
    };
};

const replyMessage = async ({ messageType = "flex", messageText = "", contents = {}, replyToken = "", altText = "" }) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env?.CHANNEL_SECRET_TOKEN}`,
    };
    const data = {
        replyToken: replyToken,
        messages: [
            messageType === "flex"
                ?  {
                    "type": "flex",
                    "altText": "This is a Flex Message",
                    "contents": contents,
                  }
                : { type: messageType, text: messageText },
        ],
    };

    try {
        const response = await APIAxios.post(LINE_REPLY_URL, data, { headers: headers });
        return { status: "ok", message: "Message sented" };
    } catch (error) {
        return { status: "fail", message: String(error) };
    }
};

// line_messaging_api.service.js
const pushMessageToGroup = async ({ to = "Cc1b7368b252b717b11f15eac12383526", messageText = "" }) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env?.CHANNEL_SECRET_TOKEN}`,
    };

    try {
        await APIAxios.post(
            "https://api.line.me/v2/bot/message/push",
            {
                to: to,
                messages: [
                    {
                        type: "text",
                        text: messageText,
                    },
                ],
            },
            { headers },
        );
        return { status: "success" };
    } catch (error) {
        console.error("Error pushing message:", error);
        throw error;
    }
};
module.exports = { replyMessage, getUserProfile, getImageContent, pushMessageToGroup };
