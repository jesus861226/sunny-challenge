/**
 * 써니권 잉글리시 · 챌린지 신청 → 구글 스프레드시트 저장
 * 사용법은 README.md 의 "2. 구글 스프레드시트 연동" 참고
 */

// ▼ 설정
var SHEET_NAME = '신청자';                 // 데이터가 쌓일 시트(탭) 이름
var NOTIFY_EMAIL = '';                     // 새 신청 알림 받을 이메일 (비워두면 알림 없음)

var HEADERS = ['접수일시', '기수', '이름', '연락처', '이메일', '영어 수준', '이루고 싶은 것',
  '유입 경로', '개인정보 동의', '마케팅 수신 동의', 'UTM', '이전 페이지', '신청 페이지', '처리 상태', '메모'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var p = (e && e.parameter) || {};

    // 스팸봇(숨김 필드) 차단
    if (p.website) return json_({ ok: true });

    // 필수값 검증
    var name = clean_(p.name, 30), phone = clean_(p.phone, 20);
    if (!name || !/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone) || p.privacy !== 'Y') {
      return json_({ ok: false, error: 'invalid' });
    }

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      clean_(p.cohort, 20),
      name,
      "'" + phone,                        // 앞자리 0이 사라지지 않도록 텍스트로 저장
      clean_(p.email, 80),
      clean_(p.level, 20),
      clean_(p.goal, 500),
      clean_(p.source, 30),
      p.privacy === 'Y' ? '동의' : '미동의',
      p.marketing === 'Y' ? '동의' : '미동의',
      clean_(p.utm, 200),
      clean_(p.referrer, 300),
      clean_(p.page, 300),
      '신규',
      ''
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, '[써니 챌린지] 새 신청: ' + name,
        '이름: ' + name + '\n연락처: ' + phone + '\n수준: ' + clean_(p.level, 20) +
        '\n목표: ' + clean_(p.goal, 500) + '\n\n시트 확인: ' + SpreadsheetApp.getActive().getUrl());
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 브라우저로 URL을 열었을 때 동작 확인용
function doGet() {
  return ContentService.createTextOutput('OK - 써니 챌린지 신청 접수 서버가 동작 중입니다.');
}

// 시트 준비: 처음 한 번 수동 실행해도 되고, 첫 신청 때 자동 생성돼요.
function setup() { getSheet_(); }

function getSheet_() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#2356F6').setFontColor('#ffffff');
    sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
    sh.setColumnWidths(1, HEADERS.length, 130);
    sh.setColumnWidth(7, 280);
    // 처리 상태 드롭다운
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(['신규', '연락완료', '결제완료', '보류', '취소'], true).build();
    sh.getRange(2, 14, 1000, 1).setDataValidation(rule);
  }
  return sh;
}

// 수식 주입(=, +, -, @ 로 시작) 방지 + 길이 제한
function clean_(v, max) {
  v = String(v || '').trim().slice(0, max || 200);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
