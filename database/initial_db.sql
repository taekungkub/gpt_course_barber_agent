
CREATE TABLE tb_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lineid TEXT NOT NULL,
    username TEXT NOT NULL,
    messages JSON
);

CREATE TABLE tb_time (
    slotId INTEGER PRIMARY KEY AUTOINCREMENT, -- ไอดีของช่วงเวลา (Primary Key)
    startTime TEXT NOT NULL,                  -- เวลาเริ่มต้น เช่น 10:00
    endTime TEXT NOT NULL,                    -- เวลาสิ้นสุด เช่น 11:00
    isAvailable INTEGER DEFAULT 1             -- สถานะความว่าง (1=ว่าง, 0=ไม่ว่าง)
);


CREATE TABLE tb_queue (
    queueId INTEGER PRIMARY KEY AUTOINCREMENT, -- ไอดีของคิว
    lineid TEXT NOT NULL,                      -- ไลน์ลูกค้า
    customerName TEXT NOT NULL,               -- ชื่อลูกค้า
    service TEXT NOT NULL,                    -- ประเภทบริการ
    slotId INTEGER NOT NULL,                  -- เชื่อมโยงกับช่วงเวลา
    status TEXT DEFAULT 'pending',            -- สถานะการจอง
    FOREIGN KEY (slotId) REFERENCES tb_time(slotId) -- ความสัมพันธ์กับ tb_time
);
