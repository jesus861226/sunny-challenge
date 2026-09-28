# Sunny의 1년 스피킹 챌린지 · 랜딩페이지

써니권 잉글리시 챌린지 모집용 랜딩페이지예요. 신청자 정보는 **구글 스프레드시트**에 쌓이고, 페이지는 **GitHub Pages**에서 무료로 호스팅합니다.

```
index.html        페이지 본문 (15개 섹션 + 신청 폼)
styles.css        디자인
app.js            폼 검증·전송, 카운트다운, 애니메이션
config.js         ★ 가격·마감일·접수 URL 등 설정값 (여기만 고치면 됨)
assets/           사진, 공유 썸네일(og.png)
apps-script/      구글 스프레드시트 연동 코드 (Code.gs)
```

신청 데이터 흐름: **방문자 → 신청 폼 → Google Apps Script → 구글 스프레드시트**
(신청자 개인정보는 GitHub에 저장되지 않아요.)

---

## 1. 설정값 바꾸기 — `config.js`

| 항목 | 설명 |
|---|---|
| `APPS_SCRIPT_URL` | 2단계에서 받은 웹앱 URL |
| `COHORT` | 모집 기수 (예: `1기`) |
| `START_TEXT` | 시작 시기 안내 문구 |
| `PRICE_MAIN` / `PRICE_SUB` / `PRICE_ORIGINAL` / `PRICE_BADGE` | 가격 표시. 안 쓰는 항목은 `""` 로 두면 숨겨져요 |
| `DEADLINE` | 신청 마감 일시 → 카운트다운 표시. `""` 이면 숨김 |
| `KAKAO_URL` | 카카오톡 채널/오픈채팅 주소 → 신청 완료 창에 버튼 표시 |
| `BUSINESS` | 푸터 사업자 정보 |

---

## 2. 구글 스프레드시트 연동 (약 5분)

1. [Google Sheets](https://sheets.new)에서 새 스프레드시트를 만들어요. (예: `써니 챌린지 신청자`)
2. 상단 메뉴 **확장 프로그램 → Apps Script** 클릭
3. 기본 코드를 모두 지우고 `apps-script/Code.gs` 내용을 붙여넣은 뒤 저장 (💾)
   - 새 신청 알림 메일을 받고 싶으면 맨 위 `NOTIFY_EMAIL` 에 이메일 입력
4. 위쪽 함수 선택에서 `setup` 선택 → **실행** → 권한 승인
   (“확인되지 않은 앱” 경고가 나오면 *고급 → 이동* 클릭. 본인 계정 스크립트라 안전해요)
   → 시트에 `신청자` 탭과 머리글이 생겨요.
5. 오른쪽 위 **배포 → 새 배포**
   - 유형: **웹 앱**
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자**
6. **배포** 후 나오는 **웹 앱 URL** (`https://script.google.com/macros/s/.../exec`) 을 복사해서 `config.js` 의 `APPS_SCRIPT_URL` 에 붙여넣기

✅ 확인: 웹 앱 URL을 브라우저에서 열면 `OK - 써니 챌린지 신청 접수 서버가 동작 중입니다.` 가 보여요.

> `Code.gs` 를 수정했다면 **배포 → 배포 관리 → 수정(연필) → 버전: 새 버전 → 배포** 를 해야 반영돼요. (URL은 그대로 유지)

시트에는 `처리 상태` 열(신규/연락완료/결제완료/보류/취소 드롭다운)과 `메모` 열이 있어서 바로 CRM처럼 쓸 수 있어요.

---

## 3. GitHub Pages로 배포

1. [github.com/new](https://github.com/new) 에서 저장소 생성 (예: `sunny-challenge`, **Public**)
2. 이 폴더의 파일을 전부 업로드
   - 웹에서: 저장소 화면 **Add file → Upload files** → 폴더 안 파일 드래그 → Commit
   - 또는 터미널:
     ```bash
     git remote add origin https://github.com/<아이디>/sunny-challenge.git
     git push -u origin main
     ```
3. 저장소 **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main / (root)** → Save
4. 1~2분 뒤 `https://<아이디>.github.io/sunny-challenge/` 에서 확인

**나만의 도메인 연결 (선택):** Settings → Pages → Custom domain 에 도메인 입력 후, 도메인 업체 DNS에 `CNAME → <아이디>.github.io` 추가.

**수정할 때:** GitHub에서 파일(예: `config.js`)을 열고 연필 아이콘으로 고친 뒤 Commit 하면 1~2분 뒤 자동 반영돼요.

---

## 4. 광고/유입 추적 (선택)

- 링크에 `?utm_source=instagram&utm_campaign=1기` 처럼 붙이면 시트의 `UTM` 열에 기록돼요.
- GA4나 메타 픽셀 코드를 `index.html` `<head>` 에 넣으면 신청 완료 시 `generate_lead` / `Lead` 이벤트가 자동 전송돼요.

---

## 5. 섹션 이미지로 쓰기

`index.html?export=1` 로 열면 폼·하단 버튼이 빠진 “이미지용” 화면이 돼요. 플랫폼 상세페이지용 섹션별 PNG(가로 900px @2x)는 별도 압축파일로 전달했어요.

---

## 체크리스트 (오픈 전)

- [ ] `config.js` 가격·마감일·기수·카카오 링크·사업자 정보 입력
- [ ] `APPS_SCRIPT_URL` 입력 후 실제로 1건 테스트 신청 → 시트 확인 → 테스트 행 삭제
- [ ] 커리큘럼(⑨), Q&A(⑭), 환불정책(⑮) 문구 최종 확인
- [ ] `index.html` 의 `og:image` 를 절대주소로 변경 (예: `https://<아이디>.github.io/sunny-challenge/assets/og.png`) → 카카오톡 공유 썸네일 확인
