require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Validate required fields
function validateRequired(body) {
  const { nama, nis, kelas } = body;
  const ok = nama && nis && kelas;

  return { ok, nama };
}

// Create a student
app.post('/api/students', async (req, res) => {
  try {
    const { nama, nis, kelas, birth_date = null, gender = null, address = null } = req.body || {};

    const check = validateRequired({ nama, nis, kelas });
    
    if (!check.ok) {
      return res.status(400).json({ message: 'Field nama, nis, dan kelas wajib diisi.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO students (nis, name, class, birth_date, gender, address)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nis, check.nama, kelas, birth_date || null, gender || null, address || null]
    );

    return res.status(201).json({
      id: result.insertId,
      nis,
      name: check.nama,
      class: kelas,
      birth_date: birth_date || null,
      gender: gender || null,
      address: address || null,
      message: 'Siswa berhasil disimpan',
    });

  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'NIS sudah terdaftar.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// Optional: List students for quick testing
app.get('/api/students', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nis, name, class, birth_date, gender, address, created_at FROM students ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data.' });
  }
});

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API berjalan di http://localhost:${port}`);
});
