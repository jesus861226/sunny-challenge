/* =========================================================
   써니권 잉글리시 · 1년 스피킹 챌린지 랜딩페이지 설정
   값만 바꾸면 페이지 전체에 반영됩니다. (README.md 참고)
   ========================================================= */
window.SUNNY_CONFIG = {
  // 1) 구글 Apps Script 웹앱 URL (배포 후 붙여넣기) — 비어 있으면 신청이 저장되지 않아요.
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyQ5xZBDJUAmxSXQku1Qv9f5ArKMbInywwm7mV6h6AI5d5_cTQoGuPIWrTJuniLokye/exec",

  // 2) 챌린지 기본 정보
  COHORT: "1기",                          // 모집 기수
  START_TEXT: "11월 첫째 주 시작",         // 시작 시기 안내 문구

  // 3) 가격 (확정 후 수정)
  PRICE_MAIN: "월 00,000원",               // 대표 가격
  PRICE_SUB: "12개월 이용 기준",           // 가격 아래 작은 설명
  PRICE_ORIGINAL: "정가 000,000원",        // 할인 전 가격 (없으면 "" 로)
  PRICE_BADGE: "1기 얼리버드",             // 가격 뱃지 (없으면 "" 로)

  // 4) 신청 마감 (카운트다운) — 한국시간 기준, 없으면 "" 로
  DEADLINE: "2026-10-31T23:59:59+09:00",

  // 5) 문의 채널 (카카오톡 채널/오픈채팅 URL, 없으면 "" 로)
  KAKAO_URL: "",

  // 6) 푸터 사업자 정보
  BUSINESS: {
    name: "써니권 잉글리시 (Sunny Kwon English)",
    ceo: "권보선",
    regNo: "000-00-00000",
    email: "hello@example.com",
    phone: ""
  }
};
