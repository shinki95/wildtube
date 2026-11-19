async function show() {
  const { pauseUntil = 0, off = false } = await chrome.storage.local.get(['pauseUntil', 'off']);
  const st = document.getElementById('st'), offB = document.getElementById('off');
  if (off) { st.textContent = '꺼져 있어요'; offB.textContent = '다시 켜기'; }
  else if (pauseUntil > Date.now()) { st.textContent = `쉬는 중 · ${new Date(pauseUntil).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })}에 다시 켜져요`; offB.textContent = '완전히 끄기'; }
  else { st.textContent = '켜져 있어요 · 인스타·유튜브 홈, 릴스, 쇼츠가 야생 피드로 가요'; offB.textContent = '완전히 끄기'; }
}
document.getElementById('p10').onclick = async () => { await chrome.storage.local.set({ pauseUntil: Date.now() + 10 * 60 * 1000 }); show(); };
document.getElementById('off').onclick = async () => { const { off = false } = await chrome.storage.local.get('off'); await chrome.storage.local.set({ off: !off, pauseUntil: 0 }); show(); };
show();
