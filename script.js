// ===== SPONSORS DATA =====
const sponsorsData = [
  {
    name: 'الراعي الذهبي',
    logo: 'assets/images/sponsor.png',
    desc: 'الراعي الرئيسي لمسابقة روح مصريه للتصوير الفوتوغرافي. يدعم المصورين المصريين ويساهم في تنمية مجتمع التصوير في مصر.',
    link: '#'
  },
  {
    name: 'الراعي الفضي',
    logo: 'assets/images/sponsor.png',
    desc: 'داعم رسمي لمسابقة التصوير. يقدم جوائز قيمة للفائزين ويساهم في نشر ثقافة التصوير الفوتوغرافي.',
    link: '#'
  },
  {
    name: 'الراعي البرونزي',
    logo: 'assets/images/sponsor.png',
    desc: 'الشريك الإعلامي لمسابقة روح مصريه. يساهم في التغطية الإعلامية وترويج المسابقة.',
    link: '#'
  }
];

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const icon = mobileMenuBtn.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.navbar-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.hero-stat .number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased).toLocaleString('ar-EG');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== HERO COUNTER OBSERVER =====
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) heroObserver.observe(heroSection);

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (5 + Math.random() * 8) + 's';
    particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(particle);
  }
}
createParticles();

// ===== THEME SELECTION =====
function selectTheme(theme) {
  const select = document.getElementById('theme');
  if (select) select.value = theme;
}

// ===== MULTIPLE FILE UPLOAD =====
const uploadArea = document.getElementById('uploadArea');
const photoFile = document.getElementById('photoFile');
const previewContainer = document.getElementById('previewContainer');
let selectedFiles = [];
const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

if (uploadArea && photoFile) {
  ['dragenter', 'dragover'].forEach(evt => {
    uploadArea.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    uploadArea.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
    });
  });

  uploadArea.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addFiles(files);
  });

  photoFile.addEventListener('change', (e) => {
    addFiles(Array.from(e.target.files));
  });
}

function addFiles(files) {
  for (const file of files) {
    if (selectedFiles.length >= MAX_FILES) {
      showToast(`الحد الأقصى ${MAX_FILES} صور`, 'error');
      break;
    }
    if (file.size > MAX_SIZE) {
      showToast(`${file.name} أكبر من 10MB`, 'error');
      continue;
    }
    if (!file.type.startsWith('image/')) continue;
    selectedFiles.push(file);
  }
  renderPreviews();
}

function renderPreviews() {
  previewContainer.innerHTML = '';
  selectedFiles.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <img src="${e.target.result}" alt="preview">
        <button class="remove-btn" onclick="removeFile(${idx})" type="button">✕</button>
      `;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderPreviews();
  if (selectedFiles.length === 0) photoFile.value = '';
}

// ===== UPLOAD TO CLOUDINARY =====
async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'rouh_masrya');

  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('فشل رفع الصورة على Cloudinary');
  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    fileName: file.name,
    fileSize: file.size
  };
}

// ===== FORM SUBMISSION (CLOUDINARY + FIRESTORE) =====
const form = document.getElementById('registrationForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');

    if (selectedFiles.length === 0) {
      showToast('من فضلك ارفع صورة واحدة على الأقل', 'error');
      return;
    }

    // تأكد من تهيئة Firebase
    if (typeof db === 'undefined') {
      showToast('خطأ: لم يتم تهيئة Firebase بعد. تأكد من وضع الإعدادات الصحيحة.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width:24px;height:24px;border-width:2px;"></div> جاري رفع الصور...';

    try {
      // 1. رفع كل الصور على Cloudinary
      const uploadedPhotos = [];
      for (const file of selectedFiles) {
        const photoData = await uploadToCloudinary(file);
        uploadedPhotos.push(photoData);
      }

      submitBtn.innerHTML = '<div class="spinner" style="width:24px;height:24px;border-width:2px;"></div> جاري حفظ البيانات...';

      // 2. تجهيز بيانات المشاركة
      const submission = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        phone: document.getElementById('phone').value.trim(),
        instagram: document.getElementById('instagram').value.trim(),
        theme: document.getElementById('theme').value,
        photoTitle: document.getElementById('photoTitle').value.trim(),
        photoDesc: document.getElementById('photoDesc').value.trim(),
        photos: uploadedPhotos,
        // للتوافق مع كود لوحة التحكم
        photoBase64: uploadedPhotos[0].url, 
        fileName: uploadedPhotos[0].fileName,
        fileSize: uploadedPhotos[0].fileSize,
        photoCount: uploadedPhotos.length,
        status: 'pending',
        rating: 0,
        submittedAt: new Date().toISOString()
      };

      // 3. حفظ البيانات في Firebase Firestore
      await db.collection("submissions").add(submission);

      showToast(`تم إرسال مشاركتك ورفع ${uploadedPhotos.length} صورة بنجاح! 🎉`, 'success');
      form.reset();
      selectedFiles = [];
      previewContainer.innerHTML = '';

    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'حصل خطأ أثناء الإرسال، حاول تاني', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال المشاركة';
    }
  });
}

// ===== MY SUBMISSIONS LOOKUP (FIRESTORE) =====
async function lookupSubmissions() {
  const email = document.getElementById('lookupEmail').value.trim().toLowerCase();
  const resultDiv = document.getElementById('mySubmissionsResult');

  if (!email) {
    showToast('ادخل الإيميل الأول', 'error');
    return;
  }

  if (typeof db === 'undefined') {
    showToast('خطأ في تهيئة قاعدة البيانات', 'error');
    return;
  }

  resultDiv.innerHTML = '<div class="spinner" style="margin:20px auto;"></div>';

  try {
    const snapshot = await db.collection("submissions").where("email", "==", email).get();

    if (snapshot.empty) {
      resultDiv.innerHTML = `
        <div class="glass-card" style="text-align:center; padding:40px;">
          <i class="fas fa-inbox" style="font-size:2.5rem; color:var(--text-muted); margin-bottom:15px; display:block;"></i>
          <h3 style="color:var(--text-secondary); margin-bottom:8px;">لا توجد مشاركات</h3>
          <p style="color:var(--text-muted);">مفيش مشاركات مسجلة بالإيميل ده</p>
        </div>
      `;
      return;
    }

    const subs = [];
    snapshot.forEach(doc => {
      subs.push({ id: doc.id, ...doc.data() });
    });

    // Group by theme
    const byTheme = {};
    subs.forEach(s => {
      if (!byTheme[s.theme]) byTheme[s.theme] = [];
      byTheme[s.theme].push(s);
    });

    let html = `
      <div class="glass-card" style="padding:25px; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:15px; flex-wrap:wrap;">
          <div style="flex:1;">
            <h3 style="color:var(--gold-primary); margin-bottom:5px;">
              <i class="fas fa-user"></i> ${subs[0].fullName}
            </h3>
            <p style="color:var(--text-secondary); font-size:0.9rem;">${subs[0].email}</p>
          </div>
          <div style="display:flex; gap:20px; text-align:center;">
            <div>
              <span style="font-size:1.8rem; font-weight:800; color:var(--gold-primary); display:block;">${subs.length}</span>
              <span style="color:var(--text-muted); font-size:0.8rem;">مشاركة</span>
            </div>
            <div>
              <span style="font-size:1.8rem; font-weight:800; color:var(--gold-primary); display:block;">${Object.keys(byTheme).length}</span>
              <span style="color:var(--text-muted); font-size:0.8rem;">محور</span>
            </div>
            <div>
              <span style="font-size:1.8rem; font-weight:800; color:var(--gold-primary); display:block;">${subs.reduce((sum, s) => sum + (s.photoCount || 1), 0)}</span>
              <span style="color:var(--text-muted); font-size:0.8rem;">صورة</span>
            </div>
          </div>
        </div>
      </div>
    `;

    for (const [theme, themeSubs] of Object.entries(byTheme)) {
      html += `
        <h3 style="color:var(--text-primary); margin-bottom:15px; font-size:1.1rem;">
          <span style="background:rgba(212,160,23,0.15); padding:4px 12px; border-radius:20px; color:var(--gold-primary); font-size:0.85rem; border:1px solid rgba(212,160,23,0.3);">
            ${theme}
          </span>
          <span style="color:var(--text-muted); font-size:0.85rem; margin-right:8px;">(${themeSubs.length} مشاركة)</span>
        </h3>
      `;

      themeSubs.forEach(s => {
        const date = new Date(s.submittedAt).toLocaleDateString('ar-EG', {
          year: 'numeric', month: 'short', day: 'numeric'
        });

        const statusClass = s.status === 'approved' ? 'color:#27AE60' :
                            s.status === 'rejected' ? 'color:#C0392B' : 'color:#F39C12';
        const statusText = s.status === 'approved' ? '✅ مقبولة' :
                           s.status === 'rejected' ? '❌ مرفوضة' : '⏳ في الانتظار';

        const photosHtml = (s.photos || [{ url: s.photoBase64 }]).map(p =>
          `<img src="${p.url || p.base64}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid var(--dark-border);">`
        ).join('');

        html += `
          <div class="glass-card" style="padding:20px; margin-bottom:12px;">
            <div style="display:flex; gap:15px; align-items:flex-start; flex-wrap:wrap;">
              <div style="display:flex; gap:8px; flex-wrap:wrap;">${photosHtml}</div>
              <div style="flex:1; min-width:200px;">
                <h4 style="margin-bottom:5px;">${s.photoTitle}</h4>
                ${s.photoDesc ? `<p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:8px;">${s.photoDesc}</p>` : ''}
                <div style="display:flex; gap:15px; flex-wrap:wrap; font-size:0.8rem; color:var(--text-muted);">
                  <span><i class="fas fa-calendar"></i> ${date}</span>
                  <span><i class="fas fa-images"></i> ${s.photoCount || 1} صورة</span>
                  <span style="${statusClass}; font-weight:600;">${statusText}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }

    resultDiv.innerHTML = html;

  } catch (error) {
    console.error(error);
    showToast('فشل جلب المشاركات', 'error');
  }
}

// ===== SPONSOR MODAL =====
function openSponsorModal(index) {
  const sponsor = sponsorsData[index];
  if (!sponsor) return;

  document.getElementById('modalSponsorLogo').src = sponsor.logo;
  document.getElementById('modalSponsorName').textContent = sponsor.name;
  document.getElementById('modalSponsorDesc').textContent = sponsor.desc;
  document.getElementById('modalSponsorLink').href = sponsor.link;
  document.getElementById('sponsorModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSponsorModal() {
  document.getElementById('sponsorModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('sponsorModal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeSponsorModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSponsorModal();
});

// ===== TOAST =====
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, 3500);
}
