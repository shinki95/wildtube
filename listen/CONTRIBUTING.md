# 비교 듣기: 새 비교 더하기

같은 곡의 두 연주를 나란히 듣는 페이지(`listen.html`)의 데이터는 모두 `listen/db/` 에 있다. 화면 코드를 건드리지 않고 JSON만 더하면 된다. 음원은 올리지 않는다. 녹음은 유튜브 영상을 페이지에 임베드해 구간만 재생한다.

## 1. 짝 더하기 (5분)
`db/catalog.json` 의 `entries` 에 한 줄을 더한다.

```json
{"id":"schubert-d899-3","genre":"classical",
 "composer":{"en":"Schubert","ko":"슈베르트"},
 "work":{"en":"Impromptu in G-flat major, D.899 No.3","ko":"즉흥곡 내림사장조 D.899-3"},
 "part":"", "performers":[{"name":"라두 루푸","en":"Radu Lupu","year":null},{"name":"우치다 미쓰코","en":"Mitsuko Uchida","year":null}],
 "tags":["피아노","독주"], "lesson":null}
```
- `genre`: `classical` 또는 `jazz`. 재즈는 `composer` 에 곡을 쓴 사람, `performers` 에 연주자.
- `performers` 는 2개(많아야 3개). 순서가 곧 A, B, C이고 바꾸지 않는다.
- 짝을 고를 땐 서로 대비되는 연주로: 다른 지휘자·같은 악단, 같은 연주자의 다른 시기, 스튜디오 vs 실황, 현대 악기 vs 시대 악기.

## 2. 비교 페이지 만들기 (구간 비교)
`db/lessons/<id>.json` 을 만들고 catalog 항목의 `lesson` 에 같은 id를 쓴다. 예시는 `db/lessons/brahms-op118-2.json`.

| 칸 | 내용 |
|-|-|
| `A`, `B` | `name`(짧게), `full`(연도 포함), `youtube`(영상 id) |
| `intro` | 곡 배경 문단 배열 |
| `critics` | 두 연주에 대한 평단의 대체적인 평. 여러 평을 종합해 자기 말로 쓴다. 평론가·매체·유튜버 이름과 직접 인용은 쓰지 않는다. 근거 URL은 `refs` 에만 둔다(화면에 안 나옴). 평이 갈리면 갈린다고 쓴다. |
| `question` | 오늘의 질문 한 문장 |
| `steps` | 파트마다 `title`, `score_img`(선택), `bars_label`, `explain`, `point`, `clips`(`["A",시작초,끝초]`, A 먼저), `after`(문단 배열), `bars`(`[라벨, A초, B초]`) |
| `outro` | 정리 문단 배열 |
| `measure_note`, `score_credit` | 측정 방법·오차, 악보 출처 |

글에는 HTML을 쓰지 않는다. 굵게는 `**이렇게**`만 된다.

### 빠르기 지도 (선택)
`bar_times` 와 `curve_skip` 이 있으면 비교 페이지에 "곡 전체 빠르기 지도"가 생긴다.
- `bar_times`: `{"A":[...], "B":[...]}`. 각 녹음에서 악보 마디가 시작하는 시각(초, 유튜브 영상 시간과 같은 기준)과 맨 끝에 곡이 끝나는 시각. 반복은 악보 MIDI에 풀어 쓴 순서 그대로(그래서 마디 번호가 아니라 "몇 번째 마디"로 보인다). 두 배열 길이는 같아야 한다. `compare-listening` 의 `align.py` 결과 `align.json` 의 `bars` 를 그대로 쓴다.
- `curve_skip`: 그래프에서 비울 마디(1부터 센 몇 번째 마디). 마지막 울림, 정렬이 흔들린 곳(예: 같은 음이 계속 되풀이되는 부분), 쉼표로 시작하는 첫 마디처럼 `measure_note` 에서 "재지 않았다"고 한 곳은 꼭 넣는다.
- 화면은 세 마디씩 평균 내서 그리고, 그래프를 누르면 그 자리부터 네 마디를 A, B로 들을 수 있다.

### 짧은 이름
catalog 항목의 `short`(예: "브람스 Op.118-2")가 비교 페이지 위 칩 이름으로 쓰인다. 비교 페이지가 있는 항목엔 lesson 의 `short` 와 같은 값을 넣는다.

### 지키는 것
- 숫자는 잰 것만 쓴다. 잰 방법과 오차를 `measure_note` 에 쓴다.
- 비교할 곳은 차이가 큰 곳만이 아니라 ‘여기선 같다’는 곳, 같은 연주자의 처음 주제 vs 돌아온 주제, 악보 빠르기 지시를 실제로 따르는지도 넣는다.
- 평은 출발점이다. 평과 실제 소리가 다르면 다르다고 쓴다.
- 악보 그림은 저작권 없는 판만(퍼블릭 도메인, 또는 CC 판이면 `score_credit` 에 표기).

## 3. 유튜브 영상 찾기
```
python3 listen/tools/find_youtube.py schubert-d899-3
```
후보마다 채널, 길이, 임베드 가능 여부가 나온다. 공식 ‘Topic’ 채널 > 레이블 채널 > 팬 업로드 순으로 고르고, 실황 팬 업로드면 `critics` 나 `question` 에 음질이 다르다고 한 줄 쓴다.

## 4. 올리기
포크한 뒤 풀 리퀘스트로 보낸다. 곡 요청이나 구간·영상 문제는 이슈로 남긴다(페이지의 ‘요청’, ‘알려 주세요’ 링크).
