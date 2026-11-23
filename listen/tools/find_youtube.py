#!/usr/bin/env python3
"""비교 듣기: 카탈로그 한 항목의 연주를 유튜브에서 찾아 후보를 보여 준다.

  python3 listen/tools/find_youtube.py <entry-id> [후보 수]
  python3 listen/tools/find_youtube.py "Brahms Op.118 No.2 Perahia"

yt-dlp 가 PATH 에 있어야 한다(pip install yt-dlp). 음원은 내려받지 않는다.
후보마다 채널, 길이, 임베드 가능 여부(oembed 200)를 보여 준다.
고르는 순서: 공식 'Topic' 채널 > 레이블 채널 > 팬 업로드(실황이면 음질 다름 표기).
"""
import json, os, subprocess, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def embeddable(vid):
    try:
        u = "https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=" + vid
        return urllib.request.urlopen(u, timeout=10).status == 200
    except Exception:
        return False

def search(q, n):
    out = subprocess.run(["yt-dlp", "--flat-playlist", "-j", "--no-warnings", f"ytsearch{n}:{q}"],
                         capture_output=True, text=True).stdout
    for line in out.splitlines():
        v = json.loads(line)
        d = v.get("duration") or 0
        yield v["id"], v.get("channel") or v.get("uploader") or "?", f"{int(d)//60}:{int(d)%60:02d}", v.get("title", "")

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    key, n = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 5
    cat = json.load(open(os.path.join(ROOT, "db", "catalog.json")))
    e = next((x for x in cat["entries"] if x["id"] == key), None)
    queries = [(key, key)] if not e else [
        (chr(65 + i), " ".join(filter(None, [e["composer"]["en"], e["work"]["en"], p.get("en") or p["name"], str(p.get("year") or "")])))
        for i, p in enumerate(e["performers"])]
    for who, q in queries:
        print(f"\n[{who}] {q}")
        for vid, ch, dur, title in search(q, n):
            topic = " (Topic)" if ch.endswith("- Topic") else ""
            print(f"  {vid}  {dur:>6}  {'임베드됨' if embeddable(vid) else '임베드 안 됨'}  {ch}{topic}  |  {title[:70]}")

if __name__ == "__main__":
    main()
