const sqlite3 = require("sqlite3");

async function getUserByLineId(lineId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./barber.db");
    db.get("SELECT * FROM tb_user WHERE lineid = ?", [lineId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function viewAvailableQueue() {
  return new Promise((resolve, reject) => {
    const sqlite3 = require("sqlite3").verbose();
    const db = new sqlite3.Database("./barber.db");

    const query = `
        SELECT * FROM tb_time WHERE isAvailable = 1;
        `;

    db.all(query, [], (err, rows) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }

      resolve(rows); 
    });
  });
}

async function addToQueue(
  idUser,
  customerName,
  phone,
  slotId,
  service = "ตัดผม"
) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./barber.db");

    query = `
        INSERT INTO tb_queue (lineid,customerName, service, slotId, status)
        VALUES (?, ?, ?, ?, 'pending');
    `;

    db.run(query, [idUser, customerName, service, slotId], function (err) {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve({ success: true, message: "successfully." });
    });
  });
}

async function updateTime(slotId, status) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./barber.db");

   
    const query = `
      UPDATE tb_time
      SET isAvailable = ?
      WHERE slotId = ?;
    `;

    db.run(query, [status, slotId], (err) => {
      db.close();
      if (err) {
        reject(err); 
        return;
      }

      resolve({ success: true, message: "successfully." });
    });
  });
}


async function clearMyQueue(idUser) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./barber.db");

    const query = `
            DELETE FROM "tb_queue"
            WHERE tb_queue.lineid = ?;
        `;

    db.all(query, [idUser], (err, rows) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      // แปลง rows เป็น array ของ text
      const textOutput = rows.map((row) => row.text_output).join("\n");
      resolve(textOutput);
    });
  });
}

async function checkUserExists(lineId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./barber.db");

    const query = `
            SELECT COUNT(*) AS count FROM tb_user
            WHERE lineid = ?;
        `;

    db.get(query, [lineId], (err, row) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve(row.count > 0); // คืนค่า true ถ้าผู้ใช้มีอยู่แล้ว
    });
  });
}

// ฟังก์ชั่นสำหรับสร้างผู้ใช้ใหม่
async function createUser(lineId, username) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./barber.db");

    const query = `
            INSERT INTO tb_user (lineid, username, messages)
            VALUES (?, ?, ?);
        `;

    db.run(query, [lineId, username, JSON.stringify([])], function (err) {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve({ success: true, message: "User created successfully." });
    });
  });
}

// ฟังก์ชั่นสำหรับดึงข้อมูลข้อความของผู้ใช้
async function getUserMessages(lineId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./barber.db");

    const query = `
            SELECT messages FROM tb_user
            WHERE lineid = ?;
        `;

    db.get(query, [lineId], (err, row) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      if (row) {
        resolve(JSON.parse(row.messages));
      } else {
        resolve({ success: false, message: "User not found." });
      }
    });
  });
}

// ฟังก์ชั่นสำหรับอัปเดตข้อความของผู้ใช้
async function updateUserMessage(lineId, newMessage) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = new sqlite3.Database("./barber.db");

      const query = `
                UPDATE tb_user
                SET messages = ?
                WHERE lineid = ?;
            `;

      db.run(query, [JSON.stringify(newMessage), lineId], function (err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve({
          success: true,
          message: "User messages updated successfully.",
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}


async function getUserQueue(lineId) {
  return new Promise((resolve, reject) => {
      const db = new sqlite3.Database("./barber.db");

      // Query to fetch user queue details
      const query = `
      SELECT 
          q.queueId,
          q.customerName,
          q.service,
          t.startTime,
          t.endTime,
          q.status,
          t.slotId
      FROM tb_queue q
      INNER JOIN tb_time t ON q.slotId = t.slotId
      WHERE q.lineid = ?;
      `;

      db.all(query, [lineId], (err, rows) => {
          db.close();
          if (err) {
              reject(err); 
              return;
          }
          resolve(rows); 
      });
  });
}



module.exports = {
  createUser,
  getUserMessages,
  updateUserMessage,
  checkUserExists,
  getUserByLineId,
  viewAvailableQueue,
  addToQueue,
  clearMyQueue,
  updateTime,
  getUserQueue,
};
