const { COMPLETION_TEMPLATE } = require("../config/ai_tool");
const OpenAI = require("openai");
const {
  viewAvailableQueue,
  addToQueue,
  clearMyQueue,
  updateTime,
  getUserQueue,
} = require("./database.services");
const { flexCardSuccess, flexCardQueue } = require("../flex/flex_card");

const submitMessageToGPT = async ({ userID, messages }) => {
  const allQueue = await viewAvailableQueue();
  const payload_template = { ...COMPLETION_TEMPLATE };
  payload_template.messages = payload_template.messages.concat(messages);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const gptResponseMessage = await openai.chat.completions.create(
    payload_template
  );
  payload_template.messages.push(gptResponseMessage.choices[0].message);

  let messageToReplyCallback = "";
  let flexData;
  if (gptResponseMessage?.choices?.[0]?.finish_reason === "tool_calls") {
    for (const toolCall of gptResponseMessage.choices[0].message.tool_calls) {
      let toolArg = JSON.parse(toolCall.function.arguments);
      toolArg = Object.keys(toolArg).length === 0 ? null : toolArg;

      const toolName = toolCall.function.name;
      const toolCallID = toolCall.id;

      let toolResponseText = "ฟีเจอร์นี้ยังไม่ได้พัฒนา";
      if (toolName === "view_all_queue") {
        const allQueueFilter = allQueue.filter(
          (queue) => queue.isAvailable == 1
        );

        const queueDetails = allQueueFilter.map((q) => ({
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: `คิวที่ ${q.slotId}`,
              size: "sm",
              weight: "bold",
              color: "#1DB446",
            },
            {
              type: "text",
              text: `วันที่: 28 พย. 2567`,
              size: "sm",
              color: "#555555",
            },
            {
              type: "text",
              text: `รอบเวลา: ${q.startTime} - ${q.endTime}`,
              size: "sm",
              color: "#555555",
            },
            {
              type: "button",
              style: "primary",
              height: "sm",
              action: {
                type: "message",
                label: "จองคิว",
                text: `จอง ${q.startTime} - ${q.endTime}`,
              },
            },
          ],
        }));
        flexData = flexCardQueue({
          contents: queueDetails,
          length: allQueueFilter.length,
        });
      } else if (toolName === "reserve_queue") {
        toolResponseText = `ขอทราบชื่อผู้จอง และเบอร์โทรศัพท์ของผู้จอง เช่น ชื่อ เบอร์โทรศัพท์`;
      } else if (toolName === "add_to_queue") {

        const availableQueue = allQueue.find(
          (queue) => queue.isAvailable === 1 && queue.slotId === parseInt(toolArg.slotId)
        );
        
        if (!availableQueue) {
          toolResponseText = "คุณไม่สามารถจองคิวได้เนื่องจากคิวนี้ไม่ว่าง";
        } else {
          await addToQueue(
            userID,
            toolArg?.customerName,
            toolArg?.phone,
            parseInt(toolArg?.slotId)
          );
          await updateTime(toolArg?.slotId, 0);
          const userQueue = await getUserQueue(userID);
          flexData = flexCardSuccess(userQueue[0]);

        }
      } else if (toolName === "clear_queue") {
        const userQueue = await getUserQueue(userID);
        if (userQueue.length > 0) {
          const queue = userQueue[0];
          await clearMyQueue(userID);
          await updateTime(queue.slotId, 1);
          toolResponseText = `ยกเลิกคิวเรียบร้อยแล้ว`;
        } else {
          toolResponseText = "คุณไม่มีคิวในระบบ";
        }
      } else if (toolName === "view_my_queue") {
        const userQueue = await getUserQueue(userID);
        if (userQueue.length > 0) {
          flexData = flexCardSuccess(userQueue[0]);
        } else {
          toolResponseText = "คุณไม่มีคิวในระบบ";
        }
      }
      payload_template.messages.push({
        role: "tool",
        content: [{ type: "text", text: toolResponseText }],
        tool_call_id: toolCallID,
      });
    }
    const responseAfterToolCall = await openai.chat.completions.create(
      payload_template
    );
    payload_template.messages.push(responseAfterToolCall.choices[0].message);
    messageToReplyCallback = responseAfterToolCall.choices[0].message.content;
  } else {
    messageToReplyCallback = gptResponseMessage.choices[0].message.content;
  }
  payload_template.messages.splice(0, 1);
  return {
    status: "success",
    message_to_reply: messageToReplyCallback,
    messages: payload_template.messages,
    flexData,
  };
};

module.exports = { submitMessageToGPT };
