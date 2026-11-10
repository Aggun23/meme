// 편집 모드: 태그 편집 켜고 끄기, 새 #태그 추가, 새 짤 등록, pads.js 내보내기
// (카드 안의 태그 버튼을 눌렀을 때의 처리는 view.js의 onTagButtonClick)

const editModeBtn = $('editModeBtn');
const newTagInput = $('newTagInput');
const dropZone = $('dropZone');
const fileInput = $('fileInput');

editModeBtn.addEventListener('click', () => {
  state.editMode = !state.editMode;
  editModeBtn.classList.toggle('active', state.editMode);
  editModeBtn.textContent = state.editMode ? '✅ 편집 완료' : '⚙️ 태그 편집';
  $('editBanner').classList.toggle('show', state.editMode);
  render();
});

// ── 새 #태그 추가 ──────────────────────────────────────
function addNewTag() {
  const name = newTagInput.value.trim().replace(/^[+#@]+/, '');
  if (!name) {
    showToast('추가할 #태그 이름을 입력해 주세요.');
    return;
  }
  if (state.typeList.includes(name) || state.themeList.includes(name)) {
    showToast('이미 있는 태그입니다.');
    return;
  }
  state.themeList.push(name);
  newTagInput.value = '';
  renderFilterChips();
  render();
  showToast(`'#${name}' 태그가 추가되었습니다!`);
}

$('addTagBtn').addEventListener('click', addNewTag);
newTagInput.addEventListener('keydown', e => {
  if (!e.isComposing && e.key === 'Enter') {   // 한글을 조합하는 중의 Enter는 넘긴다
    e.preventDefault();
    addNewTag();
  }
});

// ── 새 짤 등록 ─────────────────────────────────────────
// 파일 이름으로 짤을 만들어 목록에 넣는다. 파일 자체는 images 폴더에 따로 올려야 하고,
// 그 전까지는 브라우저 안의 임시 주소(_previewUrl)로 보여준다
function registerNewFiles(files) {
  if (!files || !files.length) return;

  let added = 0;
  Array.from(files).forEach(file => {
    const path = `images/${file.name}`;
    const label = file.name.replace(/\.[^/.]+$/, '');
    if (state.pads.some(p => (p.video || p.image) === path || p.label === label)) return;   // 이미 있는 짤

    const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
    const isVideo = ext === 'mp4' || ext === 'webm' || file.type.startsWith('video/');
    const isGif = ext === 'gif' || file.type === 'image/gif';
    const pad = isVideo
      ? { video: path, label, cat: 'video', tags: ['MEME'] }
      : { image: path, label, cat: isGif ? 'gif' : 'img', tags: ['짤'] };
    try { pad._previewUrl = URL.createObjectURL(file); } catch (e) {}
    state.pads.push(pad);
    added++;
  });

  if (!added) {
    showToast('이미 등록된 파일이거나 지원하지 않는 형식입니다.');
    return;
  }
  render();
  showToast(`🎉 새 짤 ${added}개 등록됨! 태그를 선택한 뒤 pads.js를 다운로드하세요.`);
}

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  registerNewFiles(fileInput.files);
  fileInput.value = '';
});
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  registerNewFiles(e.dataTransfer.files);
});

// ── pads.js 내보내기 ───────────────────────────────────
// pads.js에서 짤을 묶는 주석 이름: 한글은 첫 글자의 초성(쌍자음은 홑자음으로), 그 밖에는 'A-Z'
const SINGLE_CHOSUNG = { 'ㄲ': 'ㄱ', 'ㄸ': 'ㄷ', 'ㅃ': 'ㅂ', 'ㅆ': 'ㅅ', 'ㅉ': 'ㅈ' };

function indexGroupOf(label) {
  const name = sortName(label);
  if (!name) return '기타';
  const chosung = chosungOf(name[0]);
  return chosung ? (SINGLE_CHOSUNG[chosung] || chosung) : 'A-Z';
}

// 지금 상태(태그·즐겨찾기·새 짤)를 담은 pads.js 파일 내용을 만든다. 짤은 이름순으로 적는다
function buildPadsJs() {
  const quote = text => `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const list = items => `[${items.map(quote).join(', ')}]`;

  const lines = [];
  let lastGroup = null;
  [...state.pads].sort(compareByLabel).forEach(p => {
    const group = indexGroupOf(p.label);
    if (group !== lastGroup) {
      if (lastGroup !== null) lines.push('');
      lines.push(`  // [${group}]`);
      lastGroup = group;
    }
    const file = p.video ? `video: ${quote(p.video)}` : `image: ${quote(p.image)}`;
    lines.push(`  { ${file}, label: ${quote(p.label)}, cat: ${quote(padFormat(p))}, tags: ${list(sortTags(p.tags))}${isFav(p) ? ', fav: true' : ''} },`);
  });

  return [
    `// 짤패드 데이터. 편집 모드의 'pads.js 다운로드'로 만든 파일이다.`,
    `var typeList = ${list(state.typeList)}; // +분류`,
    `var extraTagList = ${list(state.themeList)}; // #태그`,
    '',
    'var pads = [',
    ...lines,
    '];',
    '',
  ].join('\n');
}

$('copyPadsBtn').addEventListener('click', async () => {
  await copyText(buildPadsJs());
  showToast('pads.js 전체 코드가 복사되었습니다! pads.js에 붙여넣으세요.');
});

$('downloadPadsBtn').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([buildPadsJs()], { type: 'application/javascript;charset=utf-8' }));
  downloadFile(url, 'pads.js');
  URL.revokeObjectURL(url);
  showToast('수정된 pads.js 다운로드 완료!');
});
