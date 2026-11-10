// 검색창과 나머지 버튼을 연결하고, 화면을 처음 그린다

searchInput.addEventListener('input', render);
searchInput.addEventListener('keydown', e => {
  if (e.isComposing) return;   // 한글을 조합하는 중의 Enter는 넘긴다
  if (e.key === 'Enter') {
    // 검색 결과의 첫 짤을 바로 복사
    e.preventDefault();
    if (visiblePads.length) usePad(visiblePads[0], grid.querySelector('.pad'));
    else showToast('검색 결과가 없습니다 😢');
  } else if (e.key === 'Escape') {
    searchInput.value = '';
    render();
  }
});

$('syncFavBtn').addEventListener('click', async () => {
  writeFavsToUrl();
  await copyText(location.href);
  showToast('🔗 현재 즐겨찾기가 포함된 링크가 복사되었습니다! 다른 기기에서 열면 바로 동기화됩니다.');
});

$('clearRecentBtn').addEventListener('click', () => {
  clearRecent();
  renderRecent();
  showToast('최근 사용 기록을 비웠습니다.');
});

if (Array.isArray(window.pads)) {
  loadPadData();
  renderFilterChips();
  render();
  renderRecent();
} else {
  grid.innerHTML = '<div class="empty-note">pads.js를 불러오지 못했어요. index.html과 같은 폴더에 pads.js가 있는지 확인해 주세요.</div>';
}
