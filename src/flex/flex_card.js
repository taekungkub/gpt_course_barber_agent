function flexCardQueue({contents , length}) {

  return  {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "รายการคิวที่ว่าง",
              weight: "bold",
              size: "lg",
              color: "#1DB446",
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `มีคิวที่ว่างอยู่ ${length} คิว:`,
              weight: "bold",
              size: "sm",
              margin: "md",
            },
            ...contents,
          ],
        }
      };
}

function flexCardSuccess(queue) {
    return {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://img5.pic.in.th/file/secure-sv1/01_1_cafe456906b316e19535.md.png",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
          action: {
            type: "uri",
            uri: "https://line.me/",
          },
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "จองคิวสำเร็จ",
              wrap: true,
              weight: "bold",
              gravity: "center",
              size: "xl",
              color: "#007bff",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "วันที่",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: "28 พฤศจิกายน 2564",
                      wrap: true,
                      size: "sm",
                      color: "#666666",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "สถานที่",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: "ร้านตัดผม บาร์เบอร์บีเบอร์",
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "รอบเวลา",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: `${queue.startTime} - ${queue.endTime}`,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "บริการ",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: `${queue.service}`,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ลูกค้า",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: `${queue.customerName}`,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 4,
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "xxl",
              contents: [],
            },
          ],
        }
      };
}

module.exports = { flexCardQueue,  flexCardSuccess };
