#!/bin/bash
# 야생튜브 게시: data.json 검사 → 커밋 → push (GitHub Pages가 1~2분 뒤 반영)
# 쓰기: bash ~/Projects/wildtube/publish.sh "커밋 메시지"
set -euo pipefail
cd "$(dirname "$0")"
export PATH=$HOME/.local/bin:$HOME/.aside/runtime/bin:$PATH
python3 - <<'EOF'
import json, sys, urllib.request
d = json.load(open('data.json'))
bad = []
for t in d['topics']:
    if len(t['videos']) > 5:
        bad.append(f"{t['slug']}: 영상 {len(t['videos'])}개 (5개까지)")
    for v in t['videos']:
        url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={v['id']}&format=json"
        try:
            urllib.request.urlopen(url, timeout=10)
        except Exception as e:
            bad.append(f"{v['id']} 퍼가기 안 됨 ({e})")
if bad:
    print("멈춤:\n" + "\n".join(bad)); sys.exit(1)
print("검사 통과")
EOF
git add data.json index.html README.md .nojekyll publish.sh
git -c user.name=shinki95 -c user.email=shinki95@users.noreply.github.com commit -qm "${1:-야생튜브 갱신}" || echo "바뀐 것 없음"
git push -q origin main
echo "PUBLISHED https://shinki95.github.io/wildtube/"
