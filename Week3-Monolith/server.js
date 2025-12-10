// server.js - Task Board Monolithic Application
// ENGSE207 Software Architecture - Week 3 Lab

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});


// =====================================================
// 1) GET ALL TASKS (+ SEARCH SUPPORT)
// =====================================================
app.get('/api/tasks', (req, res) => {
    const search = req.query.search || ""; // ?search=keyword

    const sql = `
        SELECT * FROM tasks
        WHERE title LIKE ?
        ORDER BY created_at DESC
    `;

    db.all(sql, [`%${search}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ tasks: rows });
    });
});


// =====================================================
// 2) GET SINGLE TASK BY ID
// =====================================================
app.get('/api/tasks/:id', (req, res) => {
    db.get("SELECT * FROM tasks WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Task not found" });
        res.json(row);
    });
});


// =====================================================
// 3) CREATE TASK (WITH CATEGORY + DUE DATE)
// =====================================================
app.post('/api/tasks', (req, res) => {
    const { title, description, priority, category, due_date } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    const sql = `
        INSERT INTO tasks (title, description, status, priority, category, due_date)
        VALUES (?, ?, 'TODO', ?, ?, ?)
    `;

    db.run(sql, [title, description, priority, category, due_date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});


// =====================================================
// 4) UPDATE TASK (PUT) — ALL FIELDS
// =====================================================
app.put('/api/tasks/:id', (req, res) => {
    const { title, description, status, priority, category, due_date } = req.body;
    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push("title = ?"); values.push(title); }
    if (description !== undefined) { updates.push("description = ?"); values.push(description); }
    if (status !== undefined) { updates.push("status = ?"); values.push(status); }
    if (priority !== undefined) { updates.push("priority = ?"); values.push(priority); }
    if (category !== undefined) { updates.push("category = ?"); values.push(category); }
    if (due_date !== undefined) { updates.push("due_date = ?"); values.push(due_date); }

    if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.id);

    const sql = `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`;

    db.run(sql, values, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task updated successfully" });
    });
});


// =====================================================
// 5) UPDATE STATUS (PATCH)
// =====================================================
app.patch('/api/tasks/:id/status', (req, res) => {
    const { status } = req.body;
    const valid = ['TODO', 'IN_PROGRESS', 'DONE'];

    if (!valid.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    db.run(
        "UPDATE tasks SET status = ? WHERE id = ?",
        [status, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
            res.json({ message: "Status updated successfully" });
        }
    );
});


// =====================================================
// 6) DELETE TASK
// =====================================================
app.delete('/api/tasks/:id', (req, res) => {
    db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    });
});


// =====================================================
// 7) SERVE FRONTEND (index.html)
// =====================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// =====================================================
// 8) START SERVER
// =====================================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("📝 Task Board application started");
    console.log("📊 Architecture: Monolithic");
});


// =====================================================
// 9) GRACEFUL SHUTDOWN
// =====================================================
process.on('SIGINT', () => {
    console.log("\n⏳ Shutting down...");
    db.close((err) => {
        if (err) console.error("❌ Error closing DB:", err.message);
        else console.log("✅ Database closed successfully");
        process.exit(0);
    });
});
