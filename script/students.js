const STORAGE_KEY = 'students.v1';
let students = [];
let deleteId = null;

function showNimPopup(message) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.45)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const box = document.createElement("div");
  box.style.background = "#fff";
  box.style.padding = "20px 24px";
  box.style.borderRadius = "12px";
  box.style.width = "320px";
  box.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
  box.style.textAlign = "center";

  const title = document.createElement("h3");
  title.textContent = "Peringatan";
  title.style.marginTop = "0";
  box.appendChild(title);

  const text = document.createElement("p");
  text.textContent = message;
  text.style.margin = "8px 0 16px";
  box.appendChild(text);

  const okButton = document.createElement("button");
  okButton.textContent = "OK";
  okButton.style.padding = "10px 14px";
  okButton.style.border = "0";
  okButton.style.borderRadius = "8px";
  okButton.style.fontWeight = "600";
  okButton.style.background = "#2563eb";
  okButton.style.color = "#fff";
  okButton.style.cursor = "pointer";

  okButton.onclick = () => document.body.removeChild(overlay);

  box.appendChild(okButton);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function showSuccessPopup(message) {
  const toast = document.createElement('div');
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    background: '#16a34a',  
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    zIndex: '10000',
    fontWeight: '600',
    opacity: '0',
    transform: 'translateY(10px)',
    transition: 'opacity .25s ease, transform .25s ease'
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 2200); // hilang otomatis ~2.2 detik
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    students = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(students)) students = [];
  } catch {
    students = [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function validate(s, editingIdx) {
  const errors = [];

  if (!s.className) errors.push("Silakan pilih kelas.");

  const allowedClasses = [
    "X-1", "X-2", "X-3", "X-4", "X-5",
    "XI-1", "XI-2", "XI-3", "XI-4", "XI-5",
    "XII-1", "XII-2", "XII-3", "XII-4", "XII-5"
  ];

  if (!allowedClasses.includes(s.className)) {
    errors.push("Kelas harus dipilih dari daftar.");
  }

  if (s.email && !/^\S+@\S+\.\S+$/.test(s.email))
    errors.push("Format email tidak valid.");

  const sameIdIdx = students.findIndex(
    x => x.id.toLowerCase() === s.id.trim().toLowerCase()
  );
  if (sameIdIdx !== -1 && sameIdIdx !== editingIdx)
    errors.push("NIM sudah digunakan siswa lain.");

  return errors;
}

function render(filter = '') {
  const tbody = document.getElementById('tbody');
  const infoCount = document.getElementById('infoCount');
  tbody.innerHTML = '';

  const f = filter.trim().toLowerCase();
  const sorted = students.slice().sort((a, b) => a.name.localeCompare(b.name, 'id'));
  const data = sorted.filter(s =>
    !f || [s.id, s.name, s.className].some(v => (v || '').toLowerCase().includes(f))
  );

  infoCount.textContent = `(Total: ${students.length}, Hasil: ${data.length})`;

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Belum ada data</td></tr>';
    return;
  }

  for (const s of data) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.className}</td>
      <td>${s.email || '-'}</td>
      <td>${s.dob || '-'}</td>
      <td>
        <button class="btn-secondary" data-action="edit" data-id="${s.id}">Edit</button>
        <button class="btn-danger" data-action="delete" data-id="${s.id}">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

function showDeletePopup(id) {
  deleteId = id;
  const popup = document.getElementById('deletePopup');
  const text = document.getElementById('popupText');

  text.textContent = "Yakin ingin menghapus siswa dengan NIM: " + id;
  popup.style.display = "flex";
}

function hideDeletePopup() {
  document.getElementById('deletePopup').style.display = "none";
  deleteId = null;
}

document.getElementById('cancelDelete').addEventListener('click', hideDeletePopup);
document.getElementById('confirmDelete').addEventListener('click', () => {
  if (deleteId !== null) {
    const idx = students.findIndex(s => s.id === deleteId);
    if (idx !== -1) {
      students.splice(idx, 1);
      save();
      render(document.getElementById('search').value);

      // 🔥 Tampilkan popup sukses sama seperti tambah/update
      showSuccessPopup('Data siswa berhasil dihapus.');
    }
  }
  hideDeletePopup();
});


function resetForm() {
  document.getElementById('studentForm').reset();
  document.getElementById('editingIndex').value = '';
  document.getElementById('id').disabled = false;
  document.getElementById('saveBtn').textContent = 'Simpan';
}

function fillForm(s, index) {
  document.getElementById('id').value = s.id;
  document.getElementById('name').value = s.name;
  document.getElementById('class').value = s.className;
  document.getElementById('email').value = s.email || '';
  document.getElementById('dob').value = s.dob || '';
  document.getElementById('editingIndex').value = index;

  document.getElementById('id').disabled = true;
  document.getElementById('saveBtn').textContent = 'Update';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('studentForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const idEl = document.getElementById('id');

  // VALIDASI NIM (8 ANGKA) — PAKAI POPUP
  if (!/^\d{8}$/.test(idEl.value.trim())) {
    showNimPopup("NIM harus terdiri dari 8 angka.");
    return;
  }

  const editingVal = document.getElementById('editingIndex').value;
  const editingIdx = editingVal === '' ? -1 : students.findIndex(s => s.id === idEl.value);

  const student = {
    id: idEl.value.trim(),
    name: document.getElementById('name').value.trim(),
    className: document.getElementById('class').value.trim(),
    email: document.getElementById('email').value.trim(),
    dob: document.getElementById('dob').value
  };

  const errs = validate(student, editingIdx);
  if (errs.length) {
    alert('Periksa input:\n- ' + errs.join('\n- '));
    return;
  }

  if (editingIdx !== -1) {
    students[editingIdx] = student;
    showSuccessPopup('Data siswa telah diperbarui.');
  } else {
    students.push(student);
    showSuccessPopup('Data siswa telah ditambahkan.');
  }
  save();
  render(document.getElementById('search').value);
  resetForm();
});

document.getElementById('resetBtn').addEventListener('click', resetForm);

document.getElementById('search').addEventListener('input', (e) => {
  render(e.target.value);
});

document.getElementById('tbody').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.dataset.action === 'edit') {
    const idx = students.findIndex(s => s.id === id);
    fillForm(students[idx], idx);
  } else if (btn.dataset.action === 'delete') {
    showDeletePopup(id);
  }
});

load();
render();
