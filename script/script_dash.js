(function(){
  // Element inti
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const menuSearch = document.getElementById('menuSearch');
  const menuList = document.getElementById('menuList');
  const content = document.getElementById('content');
  const reportsToggle = document.getElementById('reportsToggle');
  const reportsSub = document.getElementById('reportsSub');
  const searchResults = document.getElementById('searchResults');

  // Keys penyimpanan lokal
  const ACTIVE_KEY = 'menu.active';
  const SUB_OPEN_KEY = 'menu.reports.open';
  const COLLAPSE_KEY = 'menu.sidebar.collapsed';

  // 1) Toggle sidebar
  toggleBtn.addEventListener('click', ()=>{
    sidebar.classList.toggle('collapsed');
    localStorage.setItem(COLLAPSE_KEY, sidebar.classList.contains('collapsed') ? '1':'0');
  });

  // Restore collapse state
  if(localStorage.getItem(COLLAPSE_KEY) === '1'){
    sidebar.classList.add('collapsed');
  }

  // 2) Submenu toggle
  function setSubOpen(open){
    if (!reportsToggle) return;
    reportsToggle.setAttribute('aria-expanded', open ? 'true':'false');
    reportsSub.classList.toggle('collapsed', !open);
    localStorage.setItem(SUB_OPEN_KEY, open ? '1':'0');
  }

  if (reportsToggle) {
    reportsToggle.addEventListener('click', ()=>{
      const open = reportsToggle.getAttribute('aria-expanded') !== 'true';
      setSubOpen(open);
    });
  }

  setSubOpen(localStorage.getItem(SUB_OPEN_KEY) !== '0');

  // 3) PENCARIAN NAMA (ditampilkan tepat di bawah input, di dalam main)
  // Data contoh: ganti dengan data Anda sendiri
  const daftarNama = [
    { nama: 'Bagas Mishbahuddin', href: 'daftar/BagasMishbahuddin.html' },
    { nama: 'Ayu Lestari', href: 'daftar/AyuLestari.html' },
    { nama: 'Dimas Pratama', href: 'daftar/DimasPratama.html' },
    { nama: 'Siti Rahma', href: 'daftar/SitiRahma.html' },
    { nama: 'Budi Santoso', href: 'daftar/BudiSantoso.html' },
  ];

  // Render hasil tepat di bawah input
  function renderHasilNama(query) {
    const q = query.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (!q) return; // kosongkan saat input kosong

    const hasil = daftarNama.filter(d => d.nama.toLowerCase().includes(q)).slice(0, 20);

    if (hasil.length === 0) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'Tidak ada hasil';
      searchResults.appendChild(li);
      return;
    }

    const frag = document.createDocumentFragment();
    hasil.forEach(d => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = d.href;           // klik langsung ke file
      a.textContent = d.nama;
      li.appendChild(a);
      frag.appendChild(li);
    });
    searchResults.appendChild(frag);
  }

  // Event: ketik & Enter
  menuSearch.addEventListener('input', e => renderHasilNama(e.target.value));

  menuSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const first = searchResults.querySelector('a[href]');
      if (first) window.location.href = first.href;
    }
  });

  // 4) Active link + konten placeholder (tetap fungsional)
  // Saat diklik, simpan active key
  if (menuList) {
    menuList.addEventListener('click', (e)=>{
      const a = e.target.closest('a[href]');
      if(!a) return;
      localStorage.setItem(ACTIVE_KEY, a.dataset.key || '');
    });
  }

  // Keyboard navigation di menu (tetap)
  if (menuList) {
    menuList.addEventListener('keydown', (e)=>{
      const focusable = Array.from(menuList.querySelectorAll('a'))
        .filter(a=>a.closest('li')?.style.display !== 'none');

      const idx = focusable.indexOf(document.activeElement);

      if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
        e.preventDefault();

        const next = e.key === 'ArrowDown'
          ? focusable[Math.min(focusable.length-1, idx+1)] || focusable[0]
          : focusable[Math.max(0, idx-1)] || focusable[focusable.length-1];

        next.focus();
      } else if(e.key === 'Enter'){
        const a = document.activeElement;
        if(a?.tagName === 'A' && a.href){
          localStorage.setItem(ACTIVE_KEY, a.dataset.key || '');
          window.location.href = a.href;
        }
      }
    });
  }

  // Restore active link jika diperlukan (optional)
  const savedActive = localStorage.getItem(ACTIVE_KEY);
  if(savedActive){
    // Implementasikan jika ada kebutuhan menandai link aktif
  }

})();