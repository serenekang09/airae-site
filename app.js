/* ═══════════════════════════════════════════════
   AIRAE — Application Logic
   Single-Page Application router + data
═══════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   WORKS DATA
   ref 폴더 이미지 파일명을 그대로 활용
──────────────────────────────────────────────── */
const WORKS = [

async function loadWorks() {
  const res = await fetch('/content/works.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('works.json 로드 실패: ' + res.status);
  WORKS = await res.json();
}
];

/* ──────────────────────────────────────────────
   LOG DATA
──────────────────────────────────────────────── */
const LOGS = [
  {
    date: '2024. 11',
    tag: '작업 메모',
    title: '"Muted Flower" 시리즈 마무리',
    memo: '꽃의 침묵과 체류에 관한 마지막 레이어 작업 완료. 이미지와 향조의 정합 검토 중.'
  },
  {
    date: '2024. 09',
    tag: '전시 소식',
    title: '그룹 전시 — 《체류하는 감각들》 참여',
    memo: '서울 소재 독립 공간에서 진행된 그룹전. "La Vie Dor" 및 "Desire Before Drowning" 수록.'
  },
  {
    date: '2024. 06',
    tag: '업데이트',
    title: 'AIRAE 아카이브 1차 오픈',
    memo: '10점의 작업을 담아 비판매 아카이브로 사이트를 개설합니다. 이 공간은 기록의 공간입니다.'
  },
  {
    date: '2024. 03',
    tag: '작업 메모',
    title: '"Level Unlocked" 개념 정립',
    memo: '성취 이후의 공백에 관한 작업. 금속 냄새와 형광등 빛을 교차시키는 실험 진행.'
  },
  {
    date: '2023. 11',
    tag: '작업 메모',
    title: '"Forbidden Fig" — 억제와 향기 기억 연구',
    memo: '억제된 욕망이 후각 기억에 더 깊이 새겨진다는 가설 탐구. 무화과 향을 중심으로.'
  },
  {
    date: '2023. 05',
    tag: '전시 소식',
    title: '개인 리서치 전시 — 《감정이 체류하는 공간》',
    memo: '스튜디오 오픈 형식의 소규모 발표. 방문자와 직접 향을 경험하고 기록을 공유.'
  },
  {
    date: '2022. 12',
    tag: '업데이트',
    title: '"Worn by The City" 시리즈 완성',
    memo: '도시의 마모와 감각 체류에 관한 작업. 도시-인간 관계를 후각과 시각으로 병치.'
  },
  {
    date: '2022. 04',
    tag: '작업 메모',
    title: '감정체류(Emotional Residency) 개념 선언',
    memo: '특정 감정이 사건으로 끝나지 않고 공간과 신체에 체류한다는 연구의 시작점.'
  }
];


/* ──────────────────────────────────────────────
   ROUTER
──────────────────────────────────────────────── */
const pages = {
  home: document.getElementById('page-home'),
  works: document.getElementById('page-works'),
  detail: document.getElementById('page-detail'),
  about: document.getElementById('page-about'),
  log: document.getElementById('page-log'),
};

const navLinks = document.querySelectorAll('[data-page]');

function showPage(pageId) {
  Object.values(pages).forEach(p => {
    p.classList.add('hidden');
    // re-trigger animation by cloning trick
    p.style.animation = 'none';
  });

  const target = pages[pageId];
  if (!target) return;

  target.classList.remove('hidden');
  // force reflow
  void target.offsetWidth;
  target.style.animation = '';

  // Update nav active state
  navLinks.forEach(link => {
    const linkPage = link.dataset.page;
    if (linkPage === pageId || (pageId === 'detail' && linkPage === 'works')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ──────────────────────────────────────────────
   NAVIGATION EVENTS
──────────────────────────────────────────────── */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.page;
    if (target && pages[target]) {
      showPage(target);
    }
  });
});

/* ──────────────────────────────────────────────
   WORKS GRID — BUILD
──────────────────────────────────────────────── */
function buildWorksGrid() {
  const grid = document.getElementById('works-grid');
  if (!grid) return;
  grid.innerHTML = '';

  WORKS.forEach((work, i) => {
    const card = document.createElement('article');
    card.className = 'work-card';
    card.id = `work-card-${work.id}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `작품 보기: ${work.title}`);

    card.innerHTML = `
      <img class="work-card-img" src="${work.image}" alt="${work.title}, ${work.year}" loading="lazy" />
      <div class="work-card-overlay">
        <p class="work-card-title">${work.title}</p>
        <p class="work-card-year">${work.year}</p>
      </div>
    `;

    card.addEventListener('click', () => openDetail(work, i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openDetail(work, i);
    });

    grid.appendChild(card);
  });
}

/* ──────────────────────────────────────────────
   WORK DETAIL — OPEN
──────────────────────────────────────────────── */
function openDetail(work, index) {
  const pad = (n) => String(n + 1).padStart(2, '0');

  document.getElementById('detail-index').textContent = `No. ${pad(index)} — ${WORKS.length} works`;
  document.getElementById('detail-title').textContent = work.title;
  document.getElementById('detail-year').textContent = work.year;

  const img = document.getElementById('detail-img');
  img.src = work.image;
  img.alt = work.title;

  // emotion 필드 (기존 concept 필드와 호환)
  const emotionEl = document.getElementById('detail-emotion');
  const emotionBlock = document.getElementById('detail-emotion-block');
  const emotionVal = work.emotion || work.concept || '';
  if (emotionVal) {
    emotionEl.textContent = emotionVal;
    emotionBlock.classList.remove('hidden');
  } else {
    emotionBlock.classList.add('hidden');
  }

  const visualEl = document.getElementById('detail-visual');
  const visualBlock = document.getElementById('detail-visual-block');
  if (work.visual) {
    visualEl.textContent = work.visual;
    visualBlock.classList.remove('hidden');
  } else {
    visualBlock.classList.add('hidden');
  }

  const scentEl = document.getElementById('detail-scent');
  const scentBlock = document.getElementById('detail-scent-block');
  if (work.scent) {
    scentEl.textContent = work.scent;
    scentBlock.classList.remove('hidden');
  } else {
    scentBlock.classList.add('hidden');
  }

  document.getElementById('detail-writing').style.whiteSpace = 'pre-line';
  document.getElementById('detail-writing').textContent = work.writing;

  showPage('detail');
}

/* ──────────────────────────────────────────────
   BACK BUTTON
──────────────────────────────────────────────── */
document.getElementById('back-btn').addEventListener('click', () => {
  showPage('works');
});

/* ──────────────────────────────────────────────
   LOG — BUILD
──────────────────────────────────────────────── */
function buildLog() {
  const list = document.getElementById('log-list');
  if (!list) return;
  list.innerHTML = '';

  LOGS.forEach((entry) => {
    const el = document.createElement('div');
    el.className = 'log-entry';
    el.innerHTML = `
      <p class="log-date">${entry.date}</p>
      <div class="log-body">
        <span class="log-tag">${entry.tag}</span>
        <p class="log-title">${entry.title}</p>
        <p class="log-memo">${entry.memo}</p>
      </div>
    `;
    list.appendChild(el);
  });
}

/* ──────────────────────────────────────────────
   ADMIN CONSTANTS (init 이전에 선언 필요)
──────────────────────────────────────────────── */
const ADMIN_PASSWORD = 'airaeK09@';
const STORAGE_WORKS = 'airae_works';
const STORAGE_LOGS = 'airae_logs';
const STORAGE_ABOUT = 'airae_about';

/* ──────────────────────────────────────────────
   INIT
──────────────────────────────────────────────── */
function init() {
  loadDataFromStorage();
  buildWorksGrid();
  buildLog();
  showPage('home');
  initAdmin();
}

init();


/* ══════════════════════════════════════════════════
   ADMIN MODE
   접근: AIRAE 로고를 5회 연속 클릭
   비밀번호: airae2024  (원하시면 변경 가능)
══════════════════════════════════════════════════ */

/* ── LocalStorage 데이터 로드 ── */
function loadDataFromStorage() {
  const savedWorks = localStorage.getItem(STORAGE_WORKS);
  const savedLogs = localStorage.getItem(STORAGE_LOGS);

  if (savedWorks) {
    const parsed = JSON.parse(savedWorks);
    // 저장된 데이터가 비어있지 않을 때만 교체 (빈 배열이면 기본 데이터 유지)
    if (parsed && parsed.length > 0) {
      WORKS.length = 0;
      parsed.forEach(w => WORKS.push(w));
    } else {
      // 빈 배열이 저장된 경우 localStorage를 초기화하고 기본 데이터 유지
      localStorage.removeItem(STORAGE_WORKS);
    }
  }

  if (savedLogs) {
    const parsed = JSON.parse(savedLogs);
    if (parsed && parsed.length > 0) {
      LOGS.length = 0;
      parsed.forEach(l => LOGS.push(l));
    } else {
      localStorage.removeItem(STORAGE_LOGS);
    }
  }

  // About 데이터 로드
  loadAboutFromStorage();
}

function saveWorksToStorage() {
  localStorage.setItem(STORAGE_WORKS, JSON.stringify(WORKS));
}

function saveLogsToStorage() {
  localStorage.setItem(STORAGE_LOGS, JSON.stringify(LOGS));
}

/* ── About 데이터 로드/저장 ── */
function loadAboutFromStorage() {
  const saved = localStorage.getItem(STORAGE_ABOUT);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data.airaeText) {
      const el = document.getElementById('about-airae-text');
      if (el) el.innerHTML = data.airaeText;
    }
    if (data.evoText) {
      const el = document.getElementById('about-evo-text');
      if (el) el.innerHTML = data.evoText;
    }
    if (data.sereneText) {
      const el = document.getElementById('about-serene-text');
      if (el) el.innerHTML = data.sereneText;
    }
    if (data.sereneCareer) {
      const el = document.getElementById('about-serene-career');
      if (el) el.innerHTML = data.sereneCareer;
    }
    if (data.noticeText) {
      const el = document.getElementById('about-notice-text');
      if (el) el.textContent = data.noticeText;
    }
    if (data.contactText) {
      const el = document.getElementById('about-contact-text');
      if (el) el.textContent = data.contactText;
    }
  } catch (e) { }
}

function saveAboutToStorage(data) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_ABOUT) || '{}');
  const merged = Object.assign(existing, data);
  localStorage.setItem(STORAGE_ABOUT, JSON.stringify(merged));
}

/* ── 관리자 초기화 ── */
function initAdmin() {
  const logo = document.getElementById('nav-logo');
  const overlay = document.getElementById('admin-modal-overlay');
  const form = document.getElementById('admin-password-form');
  const cancelBtn = document.getElementById('admin-modal-cancel');
  const errorEl = document.getElementById('admin-error');
  const adminNavBtn = document.getElementById('admin-nav-btn');
  const adminLogout = document.getElementById('admin-logout-btn');

  // 로고 5회 클릭으로 모달 열기
  let logoClickCount = 0;
  let logoClickTimer = null;

  logo.addEventListener('click', (e) => {
    // 기본 홈 이동은 그대로 동작
    logoClickCount++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 2000);

    if (logoClickCount >= 5) {
      logoClickCount = 0;
      clearTimeout(logoClickTimer);
      openAdminModal();
    }
  });

  // 관리자 nav 버튼 클릭 → 패널 이동
  adminNavBtn.addEventListener('click', () => {
    showPage('admin');
    buildAdminWorksList();
    buildAdminLogList();
  });

  // 비밀번호 폼 제출
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('admin-password-input').value;
    if (input === ADMIN_PASSWORD) {
      closeAdminModal();
      adminNavBtn.classList.remove('hidden');
      showPage('admin');
      buildAdminWorksList();
      buildAdminLogList();
      switchAdminTab('works');
    } else {
      errorEl.classList.remove('hidden');
      document.getElementById('admin-password-input').value = '';
      document.getElementById('admin-password-input').focus();
    }
  });

  cancelBtn.addEventListener('click', closeAdminModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAdminModal();
  });

  // 로그아웃
  adminLogout.addEventListener('click', () => {
    adminNavBtn.classList.add('hidden');
    showPage('home');
  });

  // 탭 전환
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchAdminTab(tab.dataset.tab);
    });
  });

  // Works 추가 폼
  document.getElementById('admin-works-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('a-title').value.trim();
    const year = document.getElementById('a-year').value.trim();
    // 기준: 파일 업로드(base64) 우선, 없으면 URL 입력값
    const imageData = document.getElementById('a-image-data').value;
    const imageUrl = document.getElementById('a-image').value.trim();
    const image = imageData || imageUrl;
    const emotion = document.getElementById('a-emotion').value.trim();
    const scent = document.getElementById('a-scent').value.trim();
    const visual = document.getElementById('a-visual').value.trim();
    const writing = document.getElementById('a-writing').value.trim();
    const errorEl = document.getElementById('admin-works-error');

    if (!title || !year || !image || !emotion) {
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');

    const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newWork = { id, title, year, image, emotion, scent, visual, writing };

    WORKS.unshift(newWork);
    saveWorksToStorage();
    buildWorksGrid();
    buildAdminWorksList();

    // 폼 초기화
    document.getElementById('admin-works-form').reset();
    document.getElementById('a-image-data').value = '';
    resetImageUploadUI('a-image-preview-wrap', 'a-image-drop-zone', 'a-image-preview');

    showAdminSuccess('✓ 작품이 추가되었습니다.', 'works');
  });

  // Log 추가 폼
  document.getElementById('admin-log-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('l-date').value.trim();
    const tag = document.getElementById('l-tag').value.trim();
    const title = document.getElementById('l-title').value.trim();
    const memo = document.getElementById('l-memo').value.trim();
    const errorEl = document.getElementById('admin-log-error');

    if (!date || !tag || !title || !memo) {
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');

    const newLog = { date, tag, title, memo };
    LOGS.unshift(newLog);
    saveLogsToStorage();
    buildLog();
    buildAdminLogList();

    document.getElementById('admin-log-form').reset();
    showAdminSuccess('✓ 로그가 추가되었습니다.', 'log');
  });

  // 페이지 라우터에 admin 등록
  pages['admin'] = document.getElementById('page-admin');

  // About 관리 폼 초기화
  initAboutAdmin();

  // 이미지 업로드 UI 초기화
  initImageUpload();
}

function openAdminModal() {
  const overlay = document.getElementById('admin-modal-overlay');
  const input = document.getElementById('admin-password-input');
  const errorEl = document.getElementById('admin-error');

  overlay.classList.remove('hidden');
  errorEl.classList.add('hidden');
  input.value = '';
  setTimeout(() => input.focus(), 60);
}

function closeAdminModal() {
  document.getElementById('admin-modal-overlay').classList.add('hidden');
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  document.querySelectorAll('.admin-tab-content').forEach(c => {
    c.classList.add('hidden');
  });
  const target = document.getElementById(`admin-tab-content-${tabName}`);
  if (target) target.classList.remove('hidden');
}

/* ── 관리자 Works 목록 렌더링 ── */
function buildAdminWorksList() {
  const container = document.getElementById('admin-works-list');
  if (!container) return;

  if (WORKS.length === 0) {
    container.innerHTML = '<p style="font-family:var(--font-sans);font-size:13px;color:var(--gray-400);padding:20px 0;">등록된 작품이 없습니다.</p>';
    return;
  }

  container.innerHTML = WORKS.map((work, i) => `
    <div class="admin-list-item admin-list-item-editable" id="admin-work-item-${i}" data-index="${i}">
      <div class="admin-list-item-row">
        <div class="admin-list-item-info">
          <span class="admin-list-item-chevron">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
          <span class="admin-list-item-title">${escapeHtml(work.title)}</span>
          <span class="admin-list-item-meta">${escapeHtml(work.year)}</span>
        </div>
        <button
          class="admin-delete-btn"
          data-index="${i}"
          data-type="work"
          aria-label="작품 삭제: ${escapeHtml(work.title)}"
          title="삭제"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="admin-edit-panel" id="admin-edit-panel-${i}">
        <div class="admin-edit-form-grid">
          <div class="admin-field">
            <label class="admin-label" for="edit-title-${i}">제목 (Title)</label>
            <input type="text" id="edit-title-${i}" class="admin-input" value="${escapeHtml(work.title)}" />
          </div>
          <div class="admin-field">
            <label class="admin-label" for="edit-year-${i}">연도 (Year)</label>
            <input type="text" id="edit-year-${i}" class="admin-input" value="${escapeHtml(work.year)}" />
          </div>
          <div class="admin-field admin-field-full">
            <label class="admin-label">이미지</label>
            <div class="img-upload-zone" id="edit-image-drop-zone-${i}">
              <div class="img-upload-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <p class="img-upload-hint">클릭하거나 이미지를 드래그하세요</p>
              <p class="img-upload-sub">PNG · JPG · WEBP</p>
              <input type="file" id="edit-image-file-${i}" accept="image/*" class="img-upload-input" />
            </div>
            <div class="img-upload-preview-wrap ${work.image ? '' : 'hidden'}" id="edit-image-preview-wrap-${i}">
              <img id="edit-image-preview-${i}" src="${escapeHtml(work.image)}" alt="미리보기" class="img-upload-preview" />
              <button type="button" class="img-upload-remove" id="edit-image-remove-${i}" data-index="${i}" aria-label="이미지 제거">✕ 제거</button>
            </div>
            <div class="img-upload-url-row">
              <span class="img-upload-or">또는 URL 직접 입력</span>
              <input type="text" id="edit-image-${i}" class="admin-input img-upload-url-input" value="${work.image && !work.image.startsWith('data:') ? escapeHtml(work.image) : ''}" placeholder="https:// 또는 images/ref/..."/>
            </div>
            <input type="hidden" id="edit-image-data-${i}" value="${work.image && work.image.startsWith('data:') ? escapeHtml(work.image) : ''}" />
          </div>
          <div class="admin-field admin-field-full">
            <label class="admin-label" for="edit-emotion-${i}">Emotion</label>
            <textarea id="edit-emotion-${i}" class="admin-textarea" rows="3">${escapeHtml(work.emotion || work.concept || '')}</textarea>
          </div>
          <div class="admin-field admin-field-full">
            <label class="admin-label" for="edit-scent-${i}">Scent</label>
            <input type="text" id="edit-scent-${i}" class="admin-input" value="${escapeHtml(work.scent || '')}" />
          </div>
          <div class="admin-field admin-field-full">
            <label class="admin-label" for="edit-visual-${i}">Visual</label>
            <input type="text" id="edit-visual-${i}" class="admin-input" value="${escapeHtml(work.visual || '')}" />
          </div>
          <div class="admin-field admin-field-full">
            <label class="admin-label" for="edit-writing-${i}">Writing</label>
            <textarea id="edit-writing-${i}" class="admin-textarea" rows="4">${escapeHtml(work.writing || '')}</textarea>
          </div>
        </div>
        <div class="admin-edit-actions">
          <button class="admin-edit-save-btn" data-index="${i}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            저장
          </button>
          <button class="admin-edit-cancel-btn" data-index="${i}">취소</button>
        </div>
      </div>
    </div>
  `).join('');

  // 행 클릭 → 수정 패널 토글
  container.querySelectorAll('.admin-list-item-editable').forEach(item => {
    const idx = parseInt(item.dataset.index);
    const row = item.querySelector('.admin-list-item-row');
    row.addEventListener('click', (e) => {
      // 삭제 버튼 클릭은 무시
      if (e.target.closest('.admin-delete-btn')) return;
      toggleEditPanel(item, idx);
    });
  });

  // 저장 버튼
  container.querySelectorAll('.admin-edit-save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const title = document.getElementById(`edit-title-${idx}`).value.trim();
      const year = document.getElementById(`edit-year-${idx}`).value.trim();
      // 파일 업로드 base64 코드 우선, 없으면 URL 필드
      const imageData = document.getElementById(`edit-image-data-${idx}`).value;
      const imageUrl = document.getElementById(`edit-image-${idx}`).value.trim();
      const image = imageData || imageUrl;
      const emotion = document.getElementById(`edit-emotion-${idx}`).value.trim();
      const scent = document.getElementById(`edit-scent-${idx}`).value.trim();
      const visual = document.getElementById(`edit-visual-${idx}`).value.trim();
      const writing = document.getElementById(`edit-writing-${idx}`).value.trim();

      if (!title || !year || !image || !emotion) {
        alert('제목, 연도, 이미지, Emotion은 필수 항목입니다.');
        return;
      }

      const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || WORKS[idx].id;
      WORKS[idx] = { id, title, year, image, emotion, scent, visual, writing };
      saveWorksToStorage();
      buildWorksGrid();
      buildAdminWorksList();
      showAdminSuccess('✓ 작품이 수정되었습니다.', 'works');
    });
  });

  // 취소 버튼
  container.querySelectorAll('.admin-edit-cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const item = document.getElementById(`admin-work-item-${idx}`);
      if (item) closeEditPanel(item);
    });
  });

  // 삭제 버튼
  container.querySelectorAll('.admin-delete-btn[data-type="work"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      if (confirm(`"${WORKS[idx].title}" 작품을 삭제하시겠습니까?`)) {
        WORKS.splice(idx, 1);
        saveWorksToStorage();
        buildWorksGrid();
        buildAdminWorksList();
      }
    });
  });

  // 수정 패널 이미지 업로드 연결
  container.querySelectorAll('.img-upload-input').forEach(input => {
    const idx = parseInt(input.id.replace('edit-image-file-', ''));
    if (isNaN(idx)) return;
    const dropZone = document.getElementById(`edit-image-drop-zone-${idx}`);
    const previewWrap = document.getElementById(`edit-image-preview-wrap-${idx}`);
    const preview = document.getElementById(`edit-image-preview-${idx}`);
    const dataInput = document.getElementById(`edit-image-data-${idx}`);
    const urlInput = document.getElementById(`edit-image-${idx}`);

    if (dropZone) {
      dropZone.addEventListener('click', () => input.click());
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadImageFile(file, preview, previewWrap, dropZone, dataInput, urlInput);
      });
    }
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) loadImageFile(file, preview, previewWrap, dropZone, dataInput, urlInput);
    });

    const removeBtn = document.getElementById(`edit-image-remove-${idx}`);
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        dataInput.value = '';
        urlInput.value = '';
        if (preview) { preview.src = ''; }
        if (previewWrap) previewWrap.classList.add('hidden');
        if (dropZone) dropZone.classList.remove('hidden');
        input.value = '';
      });
    }
  });
}

function toggleEditPanel(item, idx) {
  const panel = document.getElementById(`admin-edit-panel-${idx}`);
  const chevron = item.querySelector('.admin-list-item-chevron');
  const isOpen = item.classList.contains('admin-list-item-expanded');

  // 다른 열린 패널 모두 닫기
  document.querySelectorAll('.admin-list-item-expanded').forEach(el => {
    if (el !== item) closeEditPanel(el);
  });

  if (isOpen) {
    closeEditPanel(item);
  } else {
    item.classList.add('admin-list-item-expanded');
    panel.style.maxHeight = panel.scrollHeight + 'px';
    if (chevron) chevron.classList.add('rotated');
  }
}

function closeEditPanel(item) {
  const idx = item.dataset.index;
  const panel = document.getElementById(`admin-edit-panel-${idx}`);
  const chevron = item.querySelector('.admin-list-item-chevron');
  item.classList.remove('admin-list-item-expanded');
  if (panel) panel.style.maxHeight = '0';
  if (chevron) chevron.classList.remove('rotated');
}

/* ── 관리자 Log 목록 렌더링 ── */
function buildAdminLogList() {
  const container = document.getElementById('admin-log-list');
  if (!container) return;

  if (LOGS.length === 0) {
    container.innerHTML = '<p style="font-family:var(--font-sans);font-size:13px;color:var(--gray-400);padding:20px 0;">등록된 로그가 없습니다.</p>';
    return;
  }

  container.innerHTML = LOGS.map((log, i) => `
    <div class="admin-list-item admin-list-item-editable" id="admin-log-item-${i}" data-index="${i}">
      <div class="admin-list-item-row">
        <div class="admin-list-item-info">
          <span class="admin-list-item-chevron">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:3px;">
            <span class="admin-list-item-title">${escapeHtml(log.title)}</span>
            <span class="admin-list-item-meta">${escapeHtml(log.date)} &nbsp;·&nbsp; <span class="admin-list-item-badge">${escapeHtml(log.tag)}</span></span>
          </div>
        </div>
        <button
          class="admin-delete-btn"
          data-index="${i}"
          data-type="log"
          aria-label="로그 삭제: ${escapeHtml(log.title)}"
          title="삭제"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="admin-edit-panel" id="admin-log-edit-panel-${i}">
        <div class="admin-edit-form-grid">
          <div class="admin-field">
            <label class="admin-label" for="edit-log-date-${i}">날짜 (Date)</label>
            <input type="text" id="edit-log-date-${i}" class="admin-input" value="${escapeHtml(log.date)}" placeholder="예) 2025.03" />
          </div>
          <div class="admin-field">
            <label class="admin-label" for="edit-log-tag-${i}">태그 (Tag)</label>
            <input type="text" id="edit-log-tag-${i}" class="admin-input" value="${escapeHtml(log.tag)}" placeholder="예) note" />
          </div>
          <div class="admin-field admin-field-full">
            <label class="admin-label" for="edit-log-title-${i}">제목 (Title)</label>
            <input type="text" id="edit-log-title-${i}" class="admin-input" value="${escapeHtml(log.title)}" />
          </div>
          <div class="admin-field admin-field-full">
            <label class="admin-label" for="edit-log-memo-${i}">내용 (Memo)</label>
            <textarea id="edit-log-memo-${i}" class="admin-textarea" rows="4">${escapeHtml(log.memo)}</textarea>
          </div>
        </div>
        <div class="admin-edit-actions">
          <button class="admin-edit-save-btn" data-index="${i}" data-type="log">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            저장
          </button>
          <button class="admin-edit-cancel-btn" data-index="${i}" data-type="log">취소</button>
        </div>
      </div>
    </div>
  `).join('');

  // 행 클릭 → 수정 패널 토글
  container.querySelectorAll('.admin-list-item-editable').forEach(item => {
    const idx = parseInt(item.dataset.index);
    const row = item.querySelector('.admin-list-item-row');
    row.addEventListener('click', (e) => {
      if (e.target.closest('.admin-delete-btn')) return;
      toggleLogEditPanel(item, idx);
    });
  });

  // 저장 버튼
  container.querySelectorAll('.admin-edit-save-btn[data-type="log"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const date = document.getElementById(`edit-log-date-${idx}`).value.trim();
      const tag = document.getElementById(`edit-log-tag-${idx}`).value.trim();
      const title = document.getElementById(`edit-log-title-${idx}`).value.trim();
      const memo = document.getElementById(`edit-log-memo-${idx}`).value.trim();

      if (!date || !tag || !title || !memo) {
        alert('날짜, 태그, 제목, 내용은 모두 필수 항목입니다.');
        return;
      }

      LOGS[idx] = { date, tag, title, memo };
      saveLogsToStorage();
      buildLog();
      buildAdminLogList();
      showAdminSuccess('✓ 로그가 수정되었습니다.', 'log');
    });
  });

  // 취소 버튼
  container.querySelectorAll('.admin-edit-cancel-btn[data-type="log"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const item = document.getElementById(`admin-log-item-${idx}`);
      if (item) closeLogEditPanel(item);
    });
  });

  // 삭제 버튼
  container.querySelectorAll('.admin-delete-btn[data-type="log"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      if (confirm(`"${LOGS[idx].title}" 로그를 삭제하시겠습니까?`)) {
        LOGS.splice(idx, 1);
        saveLogsToStorage();
        buildLog();
        buildAdminLogList();
      }
    });
  });
}

function toggleLogEditPanel(item, idx) {
  const panel = document.getElementById(`admin-log-edit-panel-${idx}`);
  const chevron = item.querySelector('.admin-list-item-chevron');
  const isOpen = item.classList.contains('admin-list-item-expanded');

  // 다른 열린 패널 모두 닫기
  document.querySelectorAll('#admin-log-list .admin-list-item-expanded').forEach(el => {
    if (el !== item) closeLogEditPanel(el);
  });

  if (isOpen) {
    closeLogEditPanel(item);
  } else {
    item.classList.add('admin-list-item-expanded');
    panel.style.maxHeight = panel.scrollHeight + 'px';
    if (chevron) chevron.classList.add('rotated');
  }
}

function closeLogEditPanel(item) {
  const idx = item.dataset.index;
  const panel = document.getElementById(`admin-log-edit-panel-${idx}`);
  const chevron = item.querySelector('.admin-list-item-chevron');
  item.classList.remove('admin-list-item-expanded');
  if (panel) panel.style.maxHeight = '0';
  if (chevron) chevron.classList.remove('rotated');
}

/* ── 성공 메시지 토스트 ── */
function showAdminSuccess(message, tab) {
  let container;
  if (tab === 'works') container = document.getElementById('admin-works-form');
  else if (tab === 'log') container = document.getElementById('admin-log-form');
  else if (tab === 'about-airae') container = document.getElementById('admin-about-airae-form');
  else if (tab === 'about-serene') container = document.getElementById('admin-about-serene-form');
  else container = document.getElementById('admin-log-form');

  if (!container) return;
  const toast = document.createElement('p');
  toast.textContent = message;
  toast.style.cssText = `
    font-family: var(--font-sans);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: #3a6e4a;
    margin-top: 12px;
    opacity: 1;
    transition: opacity 0.6s ease;
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 600);
  }, 2200);
}

/* ── XSS 방지 유틸 ── */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ── About 관리 폼 초기화 ── */
function initAboutAdmin() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_ABOUT) || '{}');

  const airaeTextEl = document.getElementById('ab-airae-text');
  const evoTextEl = document.getElementById('ab-evo-text');
  if (airaeTextEl && saved.airaeText) airaeTextEl.value = saved.airaeText;
  if (evoTextEl && saved.evoText) evoTextEl.value = saved.evoText;

  const sereneTextEl = document.getElementById('ab-serene-text');
  const sereneCareerEl = document.getElementById('ab-serene-career');
  const noticeEl = document.getElementById('ab-notice');
  const contactEl = document.getElementById('ab-contact');
  if (sereneTextEl && saved.sereneText) sereneTextEl.value = saved.sereneText;
  if (sereneCareerEl && saved.sereneCareer) sereneCareerEl.value = saved.sereneCareer;
  if (noticeEl && saved.noticeText) noticeEl.value = saved.noticeText;
  if (contactEl && saved.contactText) contactEl.value = saved.contactText;

  const airaeForm = document.getElementById('admin-about-airae-form');
  if (airaeForm) {
    airaeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const airaeText = document.getElementById('ab-airae-text').value.trim();
      const evoText = document.getElementById('ab-evo-text').value.trim();
      const data = {};
      if (airaeText) {
        data.airaeText = airaeText;
        const el = document.getElementById('about-airae-text');
        if (el) el.innerHTML = airaeText;
      }
      if (evoText) {
        data.evoText = evoText;
        const el = document.getElementById('about-evo-text');
        if (el) el.innerHTML = evoText;
      }
      saveAboutToStorage(data);
      showAdminSuccess('✓ AIRAE 소개가 저장되었습니다.', 'about-airae');
    });
  }

  const sereneForm = document.getElementById('admin-about-serene-form');
  if (sereneForm) {
    sereneForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sereneText = document.getElementById('ab-serene-text').value.trim();
      const sereneCareer = document.getElementById('ab-serene-career').value.trim();
      const noticeText = document.getElementById('ab-notice').value.trim();
      const contactText = document.getElementById('ab-contact').value.trim();
      const data = {};
      if (sereneText) {
        data.sereneText = sereneText;
        const el = document.getElementById('about-serene-text');
        if (el) el.innerHTML = sereneText;
      }
      if (sereneCareer) {
        data.sereneCareer = sereneCareer;
        const el = document.getElementById('about-serene-career');
        if (el) el.innerHTML = sereneCareer;
      }
      if (noticeText) {
        data.noticeText = noticeText;
        const el = document.getElementById('about-notice-text');
        if (el) el.textContent = noticeText;
      }
      if (contactText) {
        data.contactText = contactText;
        const el = document.getElementById('about-contact-text');
        if (el) el.textContent = contactText;
      }
      saveAboutToStorage(data);
      showAdminSuccess('✓ Serene 이력이 저장되었습니다.', 'about-serene');
    });
  }
}

/* ─────────────────────────────────────────────
   이미지 업로드 UI (새 작품 추가 폼)
──────────────────────────────────────────────── */
function initImageUpload() {
  const dropZone = document.getElementById('a-image-drop-zone');
  const fileInput = document.getElementById('a-image-file');
  const previewWrap = document.getElementById('a-image-preview-wrap');
  const preview = document.getElementById('a-image-preview');
  const dataInput = document.getElementById('a-image-data');
  const urlInput = document.getElementById('a-image');
  const removeBtn = document.getElementById('a-image-remove');

  if (!dropZone || !fileInput) return;

  // 드롭존 클릭 → 파일 선택
  dropZone.addEventListener('click', () => fileInput.click());

  // 드래그 오버
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

  // 파일 드롭
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImageFile(file, preview, previewWrap, dropZone, dataInput, urlInput);
    }
  });

  // 파일 선택 (input)
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) loadImageFile(file, preview, previewWrap, dropZone, dataInput, urlInput);
  });

  // 제거 버튼
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      resetImageUploadUI('a-image-preview-wrap', 'a-image-drop-zone', 'a-image-preview');
      dataInput.value = '';
      urlInput.value = '';
      fileInput.value = '';
    });
  }
}

/* FileReader로 이미지 → Base64 변환 후 미리보기 표시 */
function loadImageFile(file, previewEl, previewWrap, dropZone, dataInput, urlInput) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    if (previewEl) previewEl.src = base64;
    if (dataInput) dataInput.value = base64;
    if (urlInput) urlInput.value = '';
    if (previewWrap) previewWrap.classList.remove('hidden');
    if (dropZone) dropZone.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

/* 업로드 UI 초기화 (미리보기 숨기고 드롭존 복원) */
function resetImageUploadUI(previewWrapId, dropZoneId, previewImgId) {
  const previewWrap = document.getElementById(previewWrapId);
  const dropZone = document.getElementById(dropZoneId);
  const previewImg = document.getElementById(previewImgId);
  if (previewWrap) previewWrap.classList.add('hidden');
  if (dropZone) dropZone.classList.remove('hidden');
  if (previewImg) previewImg.src = '';
}


