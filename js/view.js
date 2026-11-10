// 화면 그리기: 필터 칩, 짤 카드와 그리드, 미리보기 팝업, 최근 사용

const grid = $('grid');
const searchInput = $('search');
const previewPopup = $('previewPopup');
const filterRows = [...document.querySelectorAll('.chips-row[data-filter]')];

let visiblePads = [];            // 지금 그리드에 보이는 짤 (그려진 순서). Enter로 첫 짤을 복사할 때 쓴다
const openDrawers = new Set();   // 태그 서랍을 펼쳐 둔 짤. 그리드를 다시 그려도 펼친 채로 둔다
let previewTimer = null;

const searchQuery = () => searchInput.value.trim().toLowerCase();

// ── 필터 칩 ────────────────────────────────────────────
// 포맷 줄은 index.html에 적혀 있고, 분류·태그 줄은 목록에 맞춰 여기서 만든다
function tagChipsHtml(rowLabel, tags, prefix) {
  const chip = (value, text) =>
    `<div class="chip" data-value="${escapeHtml(value)}" data-t="${escapeHtml(value)}">${escapeHtml(text)} <span class="count"></span></div>`;
  return `<span class="row-label">${rowLabel}</span>` + chip('all', '전체') + tags.map(t => chip(t, prefix + t)).join('');
}

function renderFilterChips() {
  $('typeChips').innerHTML = tagChipsHtml('분류', state.typeList, '+');
  $('themeChips').innerHTML = tagChipsHtml('태그', state.themeList, '#');
  markActiveChips();
}

function markActiveChips() {
  filterRows.forEach(row => {
    const selected = state.filters[row.dataset.filter];
    row.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('active', chip.dataset.value === selected));
  });
}

// 칩마다 '이 칩을 고르면 몇 개가 나오는지'를 적는다
function updateCounts() {
  const query = searchQuery();
  filterRows.forEach(row => {
    row.querySelectorAll('.chip').forEach(chip => {
      const filters = { ...state.filters, [row.dataset.filter]: chip.dataset.value };
      chip.querySelector('.count').textContent = state.pads.filter(p => matchesFilters(p, filters, query)).length;
    });
  });
}

$('filterSection').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  state.filters[chip.parentElement.dataset.filter] = chip.dataset.value;
  markActiveChips();
  render();
});

// ── 미리보기 팝업 ──────────────────────────────────────
// 카드 위쪽에 띄우고, 위에 자리가 없으면 아래쪽에 띄운다
function showPreview(p, card) {
  const src = escapeHtml(padSrc(p));
  previewPopup.innerHTML =
    (p.video
      ? `<video src="${src}" autoplay muted loop playsinline></video>`
      : `<img src="${src}" alt="${escapeHtml(p.label)}">`) +
    `<div class="preview-caption">${escapeHtml(p.label)}</div>`;
  const img = previewPopup.querySelector('img');
  if (img) showNameIfBroken(img, p.label, 240);
  previewPopup.classList.add('show');

  const rect = card.getBoundingClientRect();
  const width = 340, height = 360, margin = 12, gap = 10;
  const left = Math.max(margin, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - margin));
  const top = rect.top - height - gap < margin ? rect.bottom + gap : rect.top - height - gap;
  previewPopup.style.left = `${left}px`;
  previewPopup.style.top = `${top}px`;
}

function hidePreview() {
  clearTimeout(previewTimer);
  previewPopup.classList.remove('show');
}

// ── 짤 사용 ────────────────────────────────────────────
function markUsed(p) {
  recordRecent(p);
  renderRecent();
}

// 짤을 복사(또는 다운로드)하고 최근 사용에 올린다. el은 눌림 효과를 줄 요소
async function usePad(p, el) {
  if (el) {
    el.classList.add('fired');
    setTimeout(() => el.classList.remove('fired'), 150);
  }
  showToast(await copyPad(p));
  markUsed(p);
}

// 썸네일을 채팅창으로 끌어다 놓으면 브라우저가 원본 파일을 넘겨준다. 여기서는 끄는 동안의 표시와 최근 사용 기록만 맡는다
function enableThumbDrag(container, thumb, p) {
  thumb.setAttribute('draggable', 'true');
  thumb.addEventListener('dragstart', e => {
    if (state.editMode) { e.preventDefault(); return; }
    hidePreview();
    container.classList.add('dragging');
    markUsed(p);
  });
  thumb.addEventListener('dragend', () => container.classList.remove('dragging'));
}

// ── 짤 카드 ────────────────────────────────────────────
// 카드 아래쪽.
//   평소     : +분류 배지가 보이는 버튼, 누르면 #태그 서랍이 펼쳐진다
//   편집 모드 : 모든 분류·태그가 버튼으로 나오고 눌러서 켜고 끈다
function padMetaHtml(p) {
  if (state.editMode) {
    const buttons = (tags, prefix) => tags.map(t =>
      `<button type="button" class="edit-tag-btn ${p.tags.includes(t) ? 'on' : ''}" data-t="${escapeHtml(t)}">${prefix}${escapeHtml(t)}</button>`).join('');
    return `
      <div class="tag-drawer">
        <div class="type-group">${buttons(state.typeList, '+')}</div>
        <div class="theme-footer edit-divider">${buttons(state.themeList, '#')}</div>
      </div>`;
  }

  const badges = (tags, kind, prefix) => tags.map(t =>
    `<span class="tag ${kind}" data-t="${escapeHtml(t)}">${prefix}${escapeHtml(t)}</span>`).join('');
  const types = p.tags.filter(t => state.typeList.includes(t));
  const themes = p.tags.filter(t => state.themeList.includes(t));
  return `
    <button type="button" class="drawer-toggle-btn" title="클릭해서 상세 태그 펼치기/접기">
      ${types.length ? badges(types, 'sub-type', '+') : '<span class="meta-empty">분류 없음</span>'}
      <span class="arrow">▾</span>
    </button>
    <div class="tag-drawer">
      ${themes.length
        ? `<div class="theme-footer flat">${badges(themes, 'sub-theme', '#')}</div>`
        : '<span class="meta-empty">추가 #태그 없음</span>'}
    </div>`;
}

function padCardHtml(p) {
  const format = padFormat(p), fav = isFav(p);
  const src = escapeHtml(padSrc(p)), label = escapeHtml(p.label);
  const thumb = p.video
    ? `<video class="pad-img" src="${src}" muted loop playsinline></video>`
    : `<img class="pad-img" src="${src}" alt="${label}">`;
  // 신호등 도트: 이 짤에 달린 #태그마다 하나씩
  const dots = p.tags.filter(t => state.themeList.includes(t))
    .map(t => `<span class="t-dot" data-t="${escapeHtml(t)}"></span>`).join('');
  const metaState = state.editMode ? ' edit-open' : (openDrawers.has(padKey(p)) ? ' open' : '');

  return `
    <button type="button" class="pad-corner-btn zoom-btn" title="원본 비율 크게 보기 (우클릭 가능)">🔍</button>
    <button type="button" class="pad-corner-btn fav-btn ${fav ? 'active' : ''}" title="즐겨찾기 고정">${fav ? '★' : '☆'}</button>
    <div class="pad-top">
      <div class="pad-format-row"><span class="tag ${format}">${FORMAT_NAME[format]}</span></div>
      <div class="thumb-area">
        ${thumb}
        ${dots ? `<div class="traffic-dots">${dots}</div>` : ''}
      </div>
      <span class="label">${label}</span>
    </div>
    <div class="pad-meta${metaState}">${padMetaHtml(p)}</div>`;
}

function createPadCard(p, isFirstMatch) {
  const key = padKey(p);
  const card = document.createElement('div');
  card.className = 'pad' + (isFav(p) ? ' is-fav' : '') + (isFirstMatch ? ' first-match' : '');
  card.dataset.padKey = key;
  card.title = '클릭: 복사 / 썸네일 사진 드래그: 채팅창 전송 / 하단 바 클릭: 태그 펼치기';
  card.innerHTML = padCardHtml(p);

  const thumb = card.querySelector('.pad-img');
  const zoomBtn = card.querySelector('.zoom-btn');
  const meta = card.querySelector('.pad-meta');

  // 클릭: 카드 안의 무엇을 눌렀는지에 따라 나눈다
  card.addEventListener('click', e => {
    const hit = selector => e.target.closest(selector);
    if (hit('.zoom-btn')) {
      previewPopup.classList.contains('show') ? hidePreview() : showPreview(p, card);
    } else if (hit('.edit-tag-btn')) {
      onTagButtonClick(p, hit('.edit-tag-btn').dataset.t);
    } else if (hit('.fav-btn')) {
      hidePreview();
      onFavClick(p);
    } else if (hit('.drawer-toggle-btn, .t-dot')) {
      hidePreview();
      const open = meta.classList.toggle('open');
      open ? openDrawers.add(key) : openDrawers.delete(key);
    } else if (!state.editMode) {
      hidePreview();
      usePad(p, card);
    }
  });

  // 미리보기: 돋보기에 올리면 바로, 썸네일에 올리면 잠깐 뒤에, 우클릭하면 바로
  zoomBtn.addEventListener('mouseenter', () => showPreview(p, card));
  zoomBtn.addEventListener('mouseleave', hidePreview);
  thumb.addEventListener('mouseenter', () => { previewTimer = setTimeout(() => showPreview(p, card), 450); });
  thumb.addEventListener('mouseleave', hidePreview);
  card.addEventListener('mouseleave', hidePreview);
  card.addEventListener('contextmenu', e => { e.preventDefault(); showPreview(p, card); });

  if (p.video) {
    // 영상은 카드에 마우스를 올린 동안만 재생
    card.addEventListener('mouseenter', () => { thumb.currentTime = 0; thumb.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => { thumb.pause(); thumb.currentTime = 0; });
  } else {
    showNameIfBroken(thumb, p.label.slice(0, 4), 96);
  }
  enableThumbDrag(card, thumb, p);
  return card;
}

function onFavClick(p) {
  showToast(toggleFav(p)
    ? `⭐ '${p.label}' 즐겨찾기 추가! (영구 동기화하려면 편집 모드에서 pads.js 저장)`
    : `'${p.label}' 즐겨찾기 해제`);
  render();
}

// 편집 모드에서 카드의 태그 버튼을 눌렀을 때
function onTagButtonClick(p, tag) {
  const turnedOn = toggleTag(p, tag);
  const { type, theme } = state.filters;
  const stillShown = (type === 'all' || p.tags.includes(type)) && (theme === 'all' || p.tags.includes(theme));
  if (!stillShown) {
    render();   // 지금 고른 필터에서 빠지게 됐으니 목록에서 치운다
    return;
  }
  // 이미지가 깜빡이지 않게 전체를 다시 그리지 않고 버튼만 바꾼다. 같은 짤이 즐겨찾기 묶음에도 있으면 그 카드까지 같이
  grid.querySelectorAll(`.pad[data-pad-key="${CSS.escape(padKey(p))}"] .edit-tag-btn[data-t="${CSS.escape(tag)}"]`)
    .forEach(btn => btn.classList.toggle('on', turnedOn));
  updateCounts();
}

// ── 그리드 ─────────────────────────────────────────────
function render() {
  const query = searchQuery();
  const { cat } = state.filters;
  const padsIn = groupCat => state.pads
    .filter(p => matchesFilters(p, { ...state.filters, cat: groupCat }, query))
    .sort(compareByLabel);

  // '전체'에서는 즐겨찾기 → 이미지 → GIF → 영상 순으로 묶어 제목과 함께 보여준다 (즐겨찾기한 짤은 두 번 나온다)
  const groups = cat === 'all'
    ? [['fav', '⭐ 즐겨찾기'], ...Object.entries(FORMAT_NAME)].map(([groupCat, title]) => ({ cat: groupCat, title, pads: padsIn(groupCat) }))
    : [{ cat, title: null, pads: padsIn(cat) }];

  grid.innerHTML = '';
  visiblePads = [];
  updateCounts();

  groups.filter(group => group.pads.length).forEach(group => {
    if (group.title) {
      const title = document.createElement('div');
      title.className = 'category-title' + (group.cat === 'fav' ? ' fav-title' : '');
      title.textContent = `${group.title} (${group.pads.length})`;
      grid.appendChild(title);
    }
    group.pads.forEach(p => {
      const isFirstMatch = Boolean(query) && !visiblePads.length;   // 검색 중이면 Enter로 복사될 첫 짤을 표시
      grid.appendChild(createPadCard(p, isFirstMatch));
      visiblePads.push(p);
    });
  });

  if (!visiblePads.length) {
    grid.innerHTML = `<div class="empty-note">${cat === 'fav'
      ? '즐겨찾기한 짤이 없어요. 각 카드 우측 상단의 ☆ 버튼을 눌러 고정해 보세요!'
      : '조건에 맞는 짤이 없어요 😢'}</div>`;
  }
}

// ── 최근 사용 ──────────────────────────────────────────
function renderRecent() {
  const row = $('recentRow');
  if (!state.recent.length) {
    row.innerHTML = '<span class="empty-note">아직 사용한 짤이 없어요</span>';
    return;
  }
  row.innerHTML = '';
  state.recent.forEach(p => {
    const item = document.createElement('div');
    item.className = 'recent-item';
    item.title = '클릭: 다시 복사 / 썸네일 사진 드래그: 채팅창에 바로 놓기';
    item.innerHTML =
      (p.video ? '🎬' : `<img class="recent-thumb" src="${escapeHtml(padSrc(p))}" alt="${escapeHtml(p.label)}">`) +
      ` <span>${escapeHtml(p.label)}</span>`;
    const thumb = item.querySelector('.recent-thumb');
    if (thumb) {
      showNameIfBroken(thumb, p.label.slice(0, 2), 48);
      enableThumbDrag(item, thumb, p);
    }
    item.addEventListener('click', () => usePad(p, item));
    row.appendChild(item);
  });
}
