
(function(){
    const form = document.getElementById('contactForm');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const topicEl = document.getElementById('topic');
    const msgEl = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const clearStorageBtn = document.getElementById('clearStorageBtn');
    const alertBox = document.getElementById('alert');
  
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const topicError = document.getElementById('topicError');
    const messageError = document.getElementById('messageError');
    const msgCount = document.getElementById('msgCount');
  
    const pName = document.getElementById('pName');
    const pEmail = document.getElementById('pEmail');
    const pTopic = document.getElementById('pTopic');
    const pMessage = document.getElementById('pMessage');
    const preview = document.getElementById('preview');
  
    const KEY = 'contactForm';
  
    // Helpers
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  
    function setAlert(msg){
      alertBox.textContent = msg;
      alertBox.style.display = 'block';
      setTimeout(()=>{ alertBox.style.display = 'none'; }, 2500);
    }
  
    function save(){
      const data = {
        name: nameEl.value,
        email: emailEl.value,
        topic: topicEl.value,
        message: msgEl.value
      };
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  
    function load(){
      const raw = localStorage.getItem(KEY);
      if(!raw) return;
      try{
        const data = JSON.parse(raw);
        if (data.name) nameEl.value = data.name;
        if (data.email) emailEl.value = data.email;
        if (data.topic) topicEl.value = data.topic;
        if (data.message) msgEl.value = data.message;
        updateCharCount();
        validateAll();
      }catch(e){}
    }
  
    function clearSaved(){
      localStorage.removeItem(KEY);
    }
  
    function updateCharCount(){
      msgCount.textContent = (msgEl.value || '').length;
    }
  
    function validateName(){
      const v = nameEl.value.trim();
      if (v.length < 3){
        nameError.textContent = 'Nama minimal 3 karakter.';
        return false;
      }
      nameError.textContent = '';
      return true;
    }
  
    function validateEmail(){
      const v = emailEl.value.trim();
      if (!emailRe.test(v)){
        emailError.textContent = 'Email tidak valid.';
        return false;
      }
      emailError.textContent = '';
      return true;
    }
  
    function validateTopic(){
      const v = topicEl.value.trim();
      if (!v){
        topicError.textContent = 'Topik wajib dipilih.';
        return false;
      }
      topicError.textContent = '';
      return true;
    }
  
    function validateMessage(){
      const v = msgEl.value.trim();
      if (v.length < 10){
        messageError.textContent = 'Pesan minimal 10 karakter.';
        return false;
      }
      messageError.textContent = '';
      return true;
    }
  
    function validateAll(){
      const ok = validateName() & validateEmail() & validateTopic() & validateMessage();
      submitBtn.disabled = !ok;
      return !!ok;
    }
  
    // Events
    nameEl.addEventListener('input', ()=>{ validateName(); save(); });
    emailEl.addEventListener('input', ()=>{ validateEmail(); save(); });
    topicEl.addEventListener('change', ()=>{ validateTopic(); save(); });
    msgEl.addEventListener('input', ()=>{ updateCharCount(); validateMessage(); save(); });
  
    resetBtn.addEventListener('click', ()=>{
      form.reset();
      [nameError,emailError,topicError,messageError].forEach(el=>el.textContent='');
      updateCharCount();
      submitBtn.disabled = true;
      preview.style.display='none';
    });
  
    clearStorageBtn.addEventListener('click', ()=>{
      clearSaved();
      setAlert('Data autosave dihapus.');
    });
  
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(!validateAll()) return;
  
      // Show preview
      pName.textContent = nameEl.value.trim();
      pEmail.textContent = emailEl.value.trim();
      pTopic.textContent = topicEl.value.trim();
      pMessage.textContent = msgEl.value.trim();
      preview.style.display = 'block';
      setAlert('Form berhasil divalidasi dan dipreview.');
    });
  
    // Init
    updateCharCount();
    load();
    validateAll();
  })();