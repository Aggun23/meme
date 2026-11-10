// 짤 데이터와 화면 상태.
// 즐겨찾기·최근 사용을 브라우저에 저장하고, 짤이 검색어·필터에 맞는지 판정한다. 화면은 건드리지 않는다.

const FAV_STORAGE_KEY = 'jjalpad_favorites_v1';
const RECENT_STORAGE_KEY = 'jjalpad_recent_v1';
const RECENT_LIMIT = 8;
const FORMAT_NAME = { img: '이미지', gif: 'GIF', video: '영상' };

const state = {
  pads: [],        // 짤 목록 (pads.js의 pads)
  typeList: [],    // +분류 (pads.js의 typeList)
  themeList: [],   // #태그 (pads.js의 extraTagList + 짤에 달려 있는 그 밖의 태그)
  favKeys: [],     // 이 브라우저에 저장된 즐겨찾기 (짤의 파일 경로)
  recent: [],      // 최근 사용한 짤, 최신순
  filters: { cat: 'all', type: 'all', theme: 'all' },   // 필터 칩에서 고른 값
  editMode: false,
};

// ── 짤 하나에 대한 정보 ────────────────────────────────
const padKey = p => p.video || p.image || p.label;         // 짤을 구분하는 값 (파일 경로)
const padSrc = p => p._previewUrl || p.video || p.image;   // 화면에 보여줄 주소 (방금 등록한 파일은 임시 주소)
const padFormat = p => p.cat || (p.video ? 'video' : /\.gif$/i.test(p.image || '') ? 'gif' : 'img');
const findPad = keyOrLabel => state.pads.find(p => padKey(p) === keyOrLabel || p.label === keyOrLabel);

// ── 브라우저 저장소 ────────────────────────────────────
function readStoredList(storageKey) {
  try {
    const list = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function storeList(storageKey, list) {
  try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch (e) {}
}

// ── 태그 ───────────────────────────────────────────────
// +분류 먼저, 그다음 #태그 순서로 (목록에 적힌 순서대로) 정렬한다
function sortTags(tags) {
  const order = [...state.typeList, ...state.themeList];
  return [...new Set(tags)].sort((a, b) => {
    const ia = order.indexOf(a), ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, 'ko');
    return ia === -1 ? 1 : (ib === -1 ? -1 : ia - ib);
  });
}

// 짤의 태그를 켜거나 끈다. 켜졌으면 true
function toggleTag(p, tag) {
  const turnOn = !p.tags.includes(tag);
  p.tags = sortTags(turnOn ? [...p.tags, tag] : p.tags.filter(t => t !== tag));
  return turnOn;
}

// ── 즐겨찾기 ───────────────────────────────────────────
// pads.js에 fav: true로 적힌 것 + 이 브라우저에서 누른 것 + '즐겨찾기 링크'(?fav=)로 들어온 것
const isFav = p => Boolean(p.fav) || state.favKeys.includes(padKey(p)) || state.favKeys.includes(p.label);

// 즐겨찾기를 켜거나 끈다. 켜졌으면 true
function toggleFav(p) {
  const turnOn = !isFav(p);
  p.fav = turnOn;
  state.favKeys = state.favKeys.filter(k => k !== padKey(p) && k !== p.label);
  if (turnOn) state.favKeys.push(padKey(p));
  storeList(FAV_STORAGE_KEY, state.favKeys);
  writeFavsToUrl();
  return turnOn;
}

// 주소창의 ?fav= 에 지금 즐겨찾기한 짤 이름을 적어 둔다. 이 주소가 '즐겨찾기 링크'가 된다
function writeFavsToUrl() {
  try {
    const url = new URL(location.href);
    const labels = state.pads.filter(isFav).map(p => p.label);
    if (labels.length) url.searchParams.set('fav', labels.join(','));
    else url.searchParams.delete('fav');
    history.replaceState(null, '', url.toString());
  } catch (e) {}
}

function readFavsFromUrl() {
  try {
    const param = new URLSearchParams(location.search).get('fav') || '';
    return param.split(',').map(s => s.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
}

// ── 최근 사용 ──────────────────────────────────────────
function recordRecent(p) {
  state.recent = [p, ...state.recent.filter(r => padKey(r) !== padKey(p))].slice(0, RECENT_LIMIT);
  storeList(RECENT_STORAGE_KEY, state.recent.map(padKey));
}

function clearRecent() {
  state.recent = [];
  try { localStorage.removeItem(RECENT_STORAGE_KEY); } catch (e) {}
}

// ── 검색·필터 ──────────────────────────────────────────
// 이름이나 태그에 검색어가 들어 있으면 true. 띄어쓰기를 무시한 검색과 초성 검색(ㄱㅇㅁ)도 된다
function matchesSearch(p, query) {
  const q = query.replace(/^[+#@]+/, '').toLowerCase();
  if (!q) return true;
  const qNoSpace = q.replace(/\s+/g, '');
  const found = text => {
    const lower = text.toLowerCase(), chosung = toChosung(lower);
    return lower.includes(q) || chosung.includes(q) ||
      lower.replace(/\s+/g, '').includes(qNoSpace) || chosung.replace(/\s+/g, '').includes(qNoSpace);
  };
  return found(p.label) || p.tags.some(found);
}

function matchesFormat(p, cat) {
  if (cat === 'all') return true;
  return cat === 'fav' ? isFav(p) : padFormat(p) === cat;
}

// 필터 칩 세 줄(포맷·분류·태그)과 검색어를 모두 통과하면 true
function matchesFilters(p, filters, query) {
  return matchesFormat(p, filters.cat) &&
    (filters.type === 'all' || p.tags.includes(filters.type)) &&
    (filters.theme === 'all' || p.tags.includes(filters.theme)) &&
    matchesSearch(p, query);
}

// ── 시작할 때 데이터 읽기 ──────────────────────────────
// pads.js가 만든 전역 변수 pads, typeList, extraTagList를 state로 옮기고 저장된 즐겨찾기·최근 사용을 복원한다
function loadPadData() {
  state.pads = window.pads;
  state.typeList = [...(window.typeList || [])];
  state.themeList = [...new Set(window.extraTagList || [])];

  state.pads.forEach(p => {
    p.tags = p.tags || [];
    // 목록에 없는 태그가 짤에 달려 있으면 #태그로 취급한다
    p.tags.forEach(t => {
      if (!state.typeList.includes(t) && !state.themeList.includes(t)) state.themeList.push(t);
    });
    p.tags = sortTags(p.tags);
  });

  state.favKeys = readStoredList(FAV_STORAGE_KEY);
  const addFavKey = key => { if (!state.favKeys.includes(key)) state.favKeys.push(key); };
  state.pads.filter(p => p.fav).forEach(p => addFavKey(padKey(p)));
  readFavsFromUrl().forEach(token => {
    const p = findPad(token);
    addFavKey(p ? padKey(p) : token);
  });
  state.pads.forEach(p => { p.fav = isFav(p); });
  storeList(FAV_STORAGE_KEY, state.favKeys);

  state.recent = readStoredList(RECENT_STORAGE_KEY).map(findPad).filter(Boolean).slice(0, RECENT_LIMIT);
}
