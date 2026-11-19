// 잠깐 원래대로(통과) 켜고 끄기. 끝나면 자동으로 다시 켭니다.
async function setOn(on) {
  await chrome.declarativeNetRequest.updateEnabledRulesets(on ? { enableRulesetIds: ['redirects'] } : { disableRulesetIds: ['redirects'] });
  await chrome.action.setBadgeText({ text: on ? '' : '쉼' });
  await chrome.action.setBadgeBackgroundColor({ color: '#8e8e8e' });
}
async function sync() {
  const { pauseUntil = 0, off = false } = await chrome.storage.local.get(['pauseUntil', 'off']);
  const paused = off || Date.now() < pauseUntil;
  await setOn(!paused);
  if (!off && pauseUntil > Date.now()) chrome.alarms.create('resume', { when: pauseUntil });
}
chrome.runtime.onInstalled.addListener(sync);
chrome.runtime.onStartup.addListener(sync);
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'resume') chrome.storage.local.set({ pauseUntil: 0 }).then(sync); });
chrome.storage.onChanged.addListener(sync);
