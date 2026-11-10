// 짤을 눌렀을 때 채팅창에 보낼 수 있게 내보내는 동작.
//   이미지 → PNG로 바꿔 클립보드에 복사 (채팅창에 Ctrl+V)
//   GIF    → 파일 주소를 복사 (브라우저는 GIF 파일 자체를 클립보드에 못 넣는다. 디코에 붙여넣으면 움직이는 GIF로 뜸)
//   영상   → 파일 다운로드

// 브라우저 클립보드는 이미지 중 PNG만 받아 주므로, jpg·webp도 캔버스에 그려 PNG로 바꾼 뒤 복사한다
async function copyImageAsPng(url) {
  const response = await fetch(url);
  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0);
  const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
}

// 짤을 포맷에 맞게 복사(또는 다운로드)하고, 화면에 띄울 안내 문구를 돌려준다
async function copyPad(p) {
  const format = padFormat(p);
  try {
    if (p.video || format === 'video') {
      downloadFile(padSrc(p), (p.video || p.label).split('/').pop());
      return `'${p.label}' 영상 다운로드됨`;
    }
    if (format === 'gif' || /\.gif($|\?)/i.test(p.image)) {
      // 방금 등록해서 아직 올리지 않은 GIF도, 올린 뒤에 쓰일 주소를 복사한다
      await copyText(new URL(p.image, location.href).href);
      return `'${p.label}' GIF 복사됨 (디코 Ctrl+V / 카톡은 썸네일 사진 드래그)`;
    }
    await copyImageAsPng(padSrc(p));
    return `'${p.label}' 이미지 복사됨 → Ctrl+V`;
  } catch (e) {
    // 이미지 복사가 안 되는 환경에서는 이름이라도 복사해 둔다
    await copyText(p.label);
    return `'${p.label}' 복사됨`;
  }
}
