// 사이트 안에서 홈·릴스·쇼츠·탐색으로 넘어갈 때(새로고침 없는 이동)도 야생 피드로.
const FEED = 'https://shinki95.github.io/wildtube/feed.html';
const IG = /instagram\.com$/.test(location.hostname);
const BLOCK = IG ? /^\/(explore|reels)?\/?$|^\/(explore|reels)\// : /^\/(shorts|feed\/(subscriptions|trending|explore))(\/|$)|^\/?$/;
let state = { on: true };
function check() {
  if (!state.on) return;
  if (BLOCK.test(location.pathname)) location.replace(`${FEED}?from=${IG ? 'instagram' : 'youtube'}`);
}
chrome.storage.local.get(['pauseUntil', 'off']).then(({ pauseUntil = 0, off = false }) => {
  state.on = !off && Date.now() >= pauseUntil;
  document.documentElement.classList.toggle('yasaeng-on', state.on);
  check();
  let last = location.href;
  setInterval(() => { if (location.href !== last) { last = location.href; check(); } }, 400);
});
chrome.storage.onChanged.addListener(() => chrome.storage.local.get(['pauseUntil', 'off']).then(({ pauseUntil = 0, off = false }) => {
  state.on = !off && Date.now() >= pauseUntil; document.documentElement.classList.toggle('yasaeng-on', state.on);
}));
