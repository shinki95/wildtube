#!/bin/bash
# 야생튜브 화면 게시 (GitHub Pages, 1~2분 뒤 반영). 주제·퀘스트 내용은 여기 없고
# 사장님 개인 구글 시트 백엔드에 있다: python3 ~/.aside/u/0/data/personal/wildtube/wt.py push <slug>
set -euo pipefail
cd "$(dirname "$0")"
export PATH=$HOME/.local/bin:$HOME/.aside/runtime/bin:$PATH
git add -A index.html feed.html listen.html listen extension README.md .nojekyll publish.sh
git -c user.name=shinki95 -c user.email=shinki95@users.noreply.github.com commit -qm "${1:-야생튜브 화면 갱신}" || echo "바뀐 것 없음"
git push -q origin main
echo "PUBLISHED https://shinki95.github.io/wildtube/"
