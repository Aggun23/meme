// 공용 도우미: 문자열 처리, 초성 변환, 복사·다운로드, 토스트
// 짤패드의 데이터나 화면 상태는 여기서 다루지 않는다.

const $ = id => document.getElementById(id);

// HTML 문자열에 값을 끼워 넣을 때 태그·따옴표가 깨지지 않게 바꾼다
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);

// ── 한글 초성 ──────────────────────────────────────────
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const HANGUL_FIRST = 0xAC00, HANGUL_LAST = 0xD7A3, SYLLABLES_PER_CHOSUNG = 588;

// 한글 한 글자의 초성. 한글이 아니면 null
function chosungOf(ch) {
  const code = ch.charCodeAt(0);
  if (code < HANGUL_FIRST || code > HANGUL_LAST) return null;
  return CHOSUNG[Math.floor((code - HANGUL_FIRST) / SYLLABLES_PER_CHOSUNG)];
}

// '가챠 실패' → 'ㄱㅊ ㅅㅍ' (한글이 아닌 글자는 그대로)
const toChosung = str => Array.from(str, ch => chosungOf(ch) || ch).join('');

// ── 이름순 정렬 ────────────────────────────────────────
// '(경악)', '!라이드…'처럼 기호로 시작하는 이름은 기호를 떼고 비교한다
const sortName = label => label.replace(/^[^가-힣a-zA-Z0-9]+/, '').trim();
const compareByLabel = (a, b) => sortName(a.label).localeCompare(sortName(b.label), 'ko');

// ── 복사·다운로드 ──────────────────────────────────────
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // 클립보드 API가 막힌 환경에서는 예전 방식으로 복사한다
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e2) {}
    ta.remove();
  }
}

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ── 토스트 ─────────────────────────────────────────────
let toastTimer = null;

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
}

// ── 이미지를 못 불러왔을 때 ────────────────────────────
// 깨진 이미지 아이콘 대신, 이름이 적힌 어두운 네모를 보여준다
function showNameIfBroken(img, name, size) {
  img.addEventListener('error', () => {
    const fontSize = Math.round(Math.min(size / 6, size * 0.9 / Math.max(Array.from(name).length, 1)));   // 긴 이름은 작게
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="100%" height="100%" fill="#1d2229"/>` +
      `<text x="50%" y="50%" fill="#f2f1ed" font-family="sans-serif" font-size="${fontSize}" ` +
      `text-anchor="middle" dominant-baseline="central">${escapeHtml(name)}</text></svg>`;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }, { once: true });
}
