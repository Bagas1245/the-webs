// Modal logic for "Tambah Data Siswa"
document.addEventListener("DOMContentLoaded", function() {
  const btnOpen = document.getElementById("btn-tambah-siswa");
  const modal = document.getElementById("modal-tambah-siswa");
  const btnClose = document.getElementById("close-modal-siswa");
  const form = document.getElementById("form-siswa");

  // Show modal when menu clicked
  btnOpen && btnOpen.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style.display = "flex";
    // Reset form and focus
    form.reset();
    setTimeout(() => {
      document.getElementById("input-nama").focus();
    }, 120);
  });

  // Close modal
  btnClose && btnClose.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Close modal if click outside the modal-content
  window.addEventListener("mousedown", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Submit handler
  form && form.addEventListener("submit", function(e) {
    e.preventDefault();
    // Ambil data dari form
    const data = {
      nama: form.nama.value.trim(),
      nis: form.nis.value.trim(),
      kelas: form.kelas.value.trim()
    };
    // Validasi sederhana (bisa dikembangkan)
    if (data.nama && data.nis && data.kelas) {
      alert("Data siswa berhasil disimpan:\n" + JSON.stringify(data, null, 2));
      modal.style.display = "none";
      // TODO: Lanjutkan simpan ke backend / state app Anda
    }
  });
});