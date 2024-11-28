const COMPLETION_TEMPLATE = {
    model: "gpt-4o-mini",
    messages: [
        {
            role: "system",
            content: [
                {
                    text: "เป็นพนักงานต้อนรับ ที่ร้านตัดผม จะคอยจัดการคิว และนัดคิวให้ลูกค้าที่มาจอง",
                    type: "text",
                },
            ],
        },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    tools: [
       
        {
            type: "function",
            function: {
                name: "view_all_queue",
                strict: true,
                parameters: {
                    type: "object",
                    required: [],
                    properties: {},
                    additionalProperties: false,
                },
                description: "ผู้ใช้จองคิว หรือ เรียกดูจำนวนคิวทั้งหมด",
            },
        },
        {
            type: "function",
            function: {
                name: "reserve_queue",
                description: "หลังจากที่ผู้ใช้จองคิวแล้ว ให้ขอรายละเอียดชื่อผู้จอง เบอร์โทรผู้จอง",
                strict: true,
                parameters: {
                    type: "object",
                    additionalProperties: false,
                    properties: {},
                    required: [],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "add_to_queue",
                description: "ผู้ใช้ระบุชื่อและเบอร์โทร แล้วหลังจากนั้นจองคิวได้",
                strict: true,
                parameters: {
                    type: "object",
                    required: ["customerName", "phone","slotId"],
                    properties: {
                        customerName: {
                            type: "string",
                            description: "ชื่อลูกค้า",
                        },
                        phone: {
                            type: "string",
                            description: "เบอร์โทรศัพท์ของลูกค้า",
                        },
                        slotId: {
                            type: "string",
                            description: "คิวของรอบที่ลูกค้าจอง",
                        },
                    },
                    additionalProperties: false,
                },
            },
        },
        {
            type: "function",
            function: {
                name: "view_my_queue",
                description: "ดูรายละเอียดที่ผู้ใช้จองคิวไป",
                strict: true,
                parameters: {
                    type: "object",
                    additionalProperties: false,
                    properties: {},
                    required: [],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "confirm_queue",
                description: "ยืนยันการจองคิวโดยรับค่า ยืนยัน หรือ ยกเลิก",
                strict: true,
                parameters: {
                    type: "object",
                    additionalProperties: false,
                    properties: {},
                    required: [],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "clear_queue",
                description: "ยกเลิกคิวของผู้ใช้, ยกเลิกที่ผู้ใช้จองคิวไป",
                strict: true,
                parameters: {
                    type: "object",
                    additionalProperties: false,
                    properties: {},
                    required: [],
                },
            },
        },
    ],
    parallel_tool_calls: true,
    response_format: {
        type: "text",
    },
};

module.exports = { COMPLETION_TEMPLATE };
