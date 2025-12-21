🎯 แบบฝึกหัด 1: Layer Decision Tree (10 นาที)
คำถาม: โค้ดต่อไปนี้ควรอยู่ใน Layer ไหน? เพราะอะไร?


const tasks = await database.all('SELECT * FROM tasks')

 Controller
 Service
 Repository
คำตอบ: Repository
เหตุผล: เป็นการติดต่อกับฐานข้อมูลโดยตรง (Direct Database Access) โดยใช้คำสั่ง SQL ซึ่งเป็นหน้าที่หลักของ Data Access Layer ในการจัดการ Query


if (title.length < 3) throw new Error('Title too short')

 Controller
 Service
 Repository
คำตอบ: Service
เหตุผล: เป็นการตรวจสอบกฎทางธุรกิจ (Business Rule Validation) เกี่ยวกับความถูกต้องของเนื้อหาข้อมูลก่อนที่จะนำไปประมวลผลหรือบันทึก


res.status(201).json({ success: true, data: task })

 Controller
 Service
 Repository
คำตอบ: Controller
เหตุผล: เป็นการจัดการ HTTP Response และการส่งข้อมูลกลับไปยัง Client (Presentation Layer) ซึ่งเกี่ยวข้องกับ Web Framework (Express)


if (priority === 'HIGH' && !description) throw new Error(...)

 Controller
 Service
 Repository
คำตอบ: Service
เหตุผล: เป็น Complex Business Logic ที่มีการตรวจสอบเงื่อนไขความสัมพันธ์ระหว่างข้อมูล (หากความสำคัญสูงต้องมีรายละเอียด) ซึ่งต้องอยู่ในส่วนประมวลผลหลัก


const taskData = { title: req.body.title, description: req.body.description }

 Controller
 Service
 Repository
คำตอบ: Controller
เหตุผล: เป็นการรับข้อมูลจาก Request Object (req.body) และการจัดเตรียมข้อมูล (Input Parsing) เพื่อส่งต่อไปยังชั้นถัดไป


ส่วนที่ 4: การวิเคราะห์และเอกสาร (40 นาที)
🎯 ส่วนที่ 4.1: การวิเคราะห์เปรียบเทียบ (20 นาที) ⭐ ต้องทำเอง
นี่คือส่วนที่สำคัญที่สุดของ Lab นี้ นักศึกษาต้องวิเคราะห์และเปรียบเทียบ Monolithic vs Layered Architecture

สร้างไฟล์ ANALYSIS.md และตอบคำถามต่อไปนี้:

คำถาม 1: การเปรียบเทียบโครงสร้าง (5 คะแนน)
ก. จำนวนบรรทัดโค้ดและไฟล์

สร้างตารางเปรียบเทียบ:
| ข้อมูล | Monolithic (Week 3) | Layered (Week 4) |
|:---|:---:|:---:|
| จำนวนไฟล์ JS หลัก | ~1-3 ไฟล์ | ~10+ ไฟล์ |
| จำนวนบรรทัดทั้งหมด | น้อยกว่า (Compact) | มากกว่า (Boilerplate) |
| จำนวน layers | 1 (Flat) | 3 (Presentation, Logic, Data) |
| ความซับซ้อนโดยรวม | ต่ำ | ปานกลาง-สูง |

ข้อมูล	Monolithic (Week 3)	Layered (Week 4)
จำนวนไฟล์ JS หลัก		
จำนวนบรรทัดทั้งหมด		
จำนวน layers		
ความซับซ้อนโดยรวม		
คำถาม:

Layered มีจำนวนไฟล์และบรรทัดโค้ดมากกว่าหรือน้อยกว่า Monolithic? เพราะอะไร?
ความซับซ้อนที่เพิ่มขึ้นคุ้มค่าหรือไม่? อธิบาย
คำตอบของคุณ:
Layered มีจำนวน **มากกว่า** เนื่องจากมีการแยกความรับผิดชอบ (Separation of Concerns) ออกเป็นส่วนๆ ทำให้ต้องมีไฟล์ Interface และการส่งต่อข้อมูลระหว่างชั้น (Data Transfer) มากขึ้น


คำถาม 2: จุดแข็ง-จุดอ่อน (10 คะแนน)
วิเคราะห์จุดแข็งของ Layered Architecture: **คุ้มค่าสำหรับโปรเจกต์ระยะยาว** เพราะทำให้โค้ดเป็นระเบียบ แก้ไขจุดหนึ่งไม่กระทบจุดอื่น (Decoupling) แม้ช่วงแรกจะเขียนยากกว่าแต่ลดหนี้ทางเทคนิค (Technical Debt) ในอนาคต

สร้างตารางวิเคราะห์:

Quality Attribute	Monolithic	Layered	คะแนน
(1-5)	อธิบายเหตุผล
Maintainability
(ความง่ายในการดูแล)				
Testability
(ความง่ายในการทดสอบ)				
Modifiability
(ความง่ายในการแก้ไข)				
Reusability
(การนำกลับมาใช้ใหม่)				
Team Collaboration
(การทำงานเป็นทีม)				
Performance
(ประสิทธิภาพ)				
Simplicity
(ความเรียบง่าย)				
คำแนะนำ:

ให้คะแนน 1-5 (1 = แย่ที่สุด, 5 = ดีที่สุด)
อธิบายเหตุผลอย่างละเอียด โดยยกตัวอย่างจากโค้ดจริง
เปรียบเทียบว่าส่วนไหนของโค้ดทำให้ดีขึ้นหรือแย่ลง
คำถาม 3: สถานการณ์จริง (5 คะแนน)
วิเคราะห์สถานการณ์ต่อไปนี้:

สถานการณ์ที่ 1: ต้องการเพิ่มฟีเจอร์ "assign task to user"

ใน Monolithic จะต้องแก้ไขอย่างไร?
ใน Layered จะต้องแก้ไขอย่างไร?
แบบไหนง่ายกว่า? เพราะอะไร?
คำตอบของคุณ:

Monolithic:




Layered:




สรุป:


สถานการณ์ที่ 2: มีบั๊กที่ validation logic (ตรวจสอบ title)

ใน Monolithic จะต้องหาบั๊กและแก้ไขที่ไหน?
ใน Layered จะต้องหาบั๊กและแก้ไขที่ไหน?
แบบไหนง่ายกว่า? เพราะอะไร?
คำตอบของคุณ:

Monolithic:




Layered:




สรุป:


สถานการณ์ที่ 3: ต้องการเปลี่ยนจาก SQLite เป็น PostgreSQL

ใน Monolithic จะต้องแก้ไขกี่ที่?
ใน Layered จะต้องแก้ไขกี่ที่?
แบบไหนง่ายกว่า? เพราะอะไร?
คำตอบของคุณ:

Monolithic:




Layered:




สรุป:


คำถาม 4: Trade-offs (5 คะแนน)
วิเคราะห์ Trade-offs:

Complexity vs Maintainability
Layered มีความซับซ้อนมากขึ้น แต่ดูแลง่ายขึ้น
คุณคิดว่า trade-off นี้คุ้มค่าหรือไม่? เพราะอะไร?
ในกรณีไหนที่คุ้มค่า? ในกรณีไหนที่ไม่คุ้มค่า?
คำตอบของคุณ:








Performance Overhead
Layered มี overhead จากการเรียกผ่าน layers
คุณคิดว่ามีผลกระทบมากแค่ไหน?
ในแอปพลิเคชันประเภทใดที่ performance overhead นี้สำคัญ?
คำตอบของคุณ:








คำถาม 5: การตัดสินใจเลือกใช้ (5 คะแนน)
ออกแบบกฎการตัดสินใจ:

สร้าง Decision Tree สำหรับตัดสินใจว่าจะใช้ Monolithic หรือ Layered:

เริ่มต้นโปรเจกต์
│
├─ ขนาดทีม?
│  ├─ 1-2 คน → [คำตอบของคุณ]
│  └─ 3+ คน → [คำตอบของคุณ]
│
├─ ขนาดโปรเจกต์?
│  ├─ เล็ก (< 1000 บรรทัด) → [คำตอบของคุณ]
│  ├─ กลาง (1000-10000 บรรทัด) → [คำตอบของคุณ]
│  └─ ใหญ่ (> 10000 บรรทัด) → [คำตอบของคุณ]
│
├─ ระยะเวลาพัฒนา?
│  ├─ ต้องการเร็ว (< 1 เดือน) → [คำตอบของคุณ]
│  └─ มีเวลา (> 1 เดือน) → [คำตอบของคุณ]
│
└─ ต้องการ maintainability สูง?
   ├─ ใช่ → [คำตอบของคุณ]
   └─ ไม่ → [คำตอบของคุณ]
อธิบายเหตุผลของการตัดสินใจแต่ละข้อ:









🎯 ส่วนที่ 4.2: เอกสารประกอบ (20 นาที)
สร้าง README.md
# Week 4: Task Board - Layered Architecture

## ภาพรวม

โปรเจกต์นี้ใช้ **Layered (3-Tier) Architecture**:

### Layers:

1. **Presentation Layer** (`src/controllers/`)
   - จัดการ HTTP requests/responses
   - ตรวจสอบรูปแบบข้อมูลเข้า
   - จัดรูปแบบข้อมูลออก

2. **Business Logic Layer** (`src/services/`)
   - กฎทางธุรกิจและการตรวจสอบ
   - การประสานงาน workflow
   - การแปลงข้อมูล

3. **Data Access Layer** (`src/repositories/`)
   - การดำเนินการฐานข้อมูล
   - ประมวลผล queries
   - จัดเก็บข้อมูล

## โครงสร้างโปรเจกต์
```
week4-layered/
├── src/
│   ├── controllers/    # Presentation Layer
│   ├── services/       # Business Logic Layer
│   ├── repositories/   # Data Access Layer
│   ├── models/         # Data Models
│   └── middleware/     # Express middleware
├── database/
├── public/
└── server.js
```
## การติดตั้ง

```bash
npm install
```

## การตั้งค่า

สร้างไฟล์ `.env`:

NODE_ENV=development
PORT=3000
DB_PATH=./database/tasks.db
LOG_LEVEL=debug

## การรัน

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Tasks
- `GET /api/tasks` - ดึง tasks ทั้งหมด (พร้อมตัวกรอง)
- `GET /api/tasks/:id` - ดึง task ตาม ID
- `POST /api/tasks` - สร้าง task ใหม่
- `PUT /api/tasks/:id` - อัพเดท task
- `DELETE /api/tasks/:id` - ลบ task

### Statistics
- `GET /api/tasks/stats` - ดึงสถิติ tasks

### Actions
- `PATCH /api/tasks/:id/next-status` - เลื่อนไปสถานะถัดไป

## กฎทางธุรกิจ

1. ชื่อ task ต้องมี 3-100 ตัวอักษร
2. งาน HIGH priority ต้องมีรายละเอียด
3. ไม่สามารถเปลี่ยนงาน DONE กลับไปเป็น TODO
4. สถานะที่ใช้ได้: TODO, IN_PROGRESS, DONE
5. ระดับความสำคัญที่ใช้ได้: LOW, MEDIUM, HIGH

## ข้อดีของ Layered Architecture

✅ **Maintainability** - แก้ไข layers ที่ต้องการได้ง่าย  
✅ **Testability** - ทดสอบแต่ละ layer ได้อิสระ  
✅ **Reusability** - Layers สามารถนำกลับมาใช้ได้  
✅ **Separation of Concerns** - หน้าที่ชัดเจน  
✅ **Team Collaboration** - ทีมต่างๆ ทำงานใน layers ต่างกันได้

## Trade-offs

❌ **Complexity** - มีไฟล์และโครงสร้างมากขึ้น  
❌ **Performance** - มี overhead จาก layers  
❌ **Over-engineering** - อาจมากเกินไปสำหรับโปรเจกต์เล็ก

## เทคโนโลยีที่ใช้

- Node.js 20+
- Express.js 4.18+
- SQLite3 5.1+
- dotenv

## ผู้พัฒนา

[ชื่อของคุณ] - ENGSE207 สัปดาห์ที่ 4

---
สร้าง REFLECTION.md
# การสะท้อนคิด สัปดาห์ที่ 4: Layered Architecture

## 1. สิ่งที่เรียนรู้

[อธิบายสิ่งที่คุณเรียนรู้เกี่ยวกับ layered architecture]

## 2. ข้อดีที่พบจากการทำจริง

[บอกข้อดีที่คุณสังเกตเห็นขณะทำ lab นี้]

## 3. ความท้าทายที่พบ

[อธิบายความท้าทายและวิธีแก้ปัญหา]

## 4. การจัดโครงสร้างโค้ด

การแบ่ง layers ช่วยให้การจัดโครงสร้างโค้ดดีขึ้นอย่างไรเมื่อเทียบกับสัปดาห์ที่ 3?

[คำตอบของคุณ]

## 5. เมื่อไหร่ควรใช้ Layered Architecture

[อธิบายสถานการณ์ที่ layered architecture เหมาะสม]

## 6. การวิเคราะห์ Trade-offs

### ข้อดี
- 

### ข้อเสีย
-

### การประเมินโดยรวม
[ข้อสรุปของคุณ]

---
4.3 Create Architecture Diagram
Create ARCHITECTURE.md with diagram:

# Architecture Diagram

## High-Level Architecture


┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                    │
│                    (HTML/CSS/JavaScript)                │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Requests
                           ▼
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (Controllers)           │
│                                                         │
│  ┌──────────────┐    ┌─────────────────────────┐        │
│  │Task          │    │  - Input Validation     │        │
│  │Controller    │───▶│  - Response Formatting  │        │
│  └──────────────┘    │  - HTTP Error Handling  │        │
│                      └─────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│            BUSINESS LOGIC LAYER (Services)              │
│                                                         │
│  ┌──────────────┐    ┌─────────────────────────┐        │
│  │Task          │    │  - Business Rules       │        │
│  │Service       │───▶│  - Validation Logic     │        │
│  └──────────────┘    │  - Orchestration        │        │
│                      └─────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│           DATA ACCESS LAYER (Repositories)              │
│                                                         │
│  ┌──────────────┐    ┌─────────────────────────┐        │
│  │Task          │    │  - CRUD Operations      │        │
│  │Repository    │───▶│  - Query Execution      │        │
│  └──────────────┘    │  - Data Mapping         │        │
│                      └─────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │   DATABASE   │
                   │   (SQLite)   │
                   └──────────────┘

## Data Flow Example: Create Task

1. Client sends POST /api/tasks
   ↓
2. TaskController.createTask()
   - Validates HTTP request
   - Extracts data
   ↓
3. TaskService.createTask(data)
   - Validates business rules
   - Applies business logic
   ↓
4. TaskRepository.create(task)
   - Executes SQL INSERT
   - Returns created task
   ↓
5. Response flows back up
   Repository → Service → Controller → Client
📤 การส่งงานและเกณฑ์การให้คะแนน
Checklist การส่งงาน:
 แบ่ง layers ได้ถูกต้องครบทั้ง 3 layers
 โค้ดทำงานได้ไม่มี errors
 CRUD operations ทั้งหมดทำงานได้
 ANALYSIS.md เสร็จสมบูรณ์ ⭐ (สำคัญมาก)
 README.md เสร็จสมบูรณ์
 REFLECTION.md ตอบคำถามครบ
 Git commits มีความหมาย
 ไม่มี node_modules ใน Git
ส่งงาน:
GitHub Repository (แนะนำ)

git add .
git commit -m "Week 4: เสร็จสมบูรณ์ Layered Architecture"
git remote add origin <your-repo-url>
git push -u origin main
ไฟล์ ZIP (ทางเลือก)

# ไม่รวม node_modules และ database
zip -r week4-layered.zip . -x "node_modules/*" "*.db"
