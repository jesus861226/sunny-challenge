(function () {
  var C = window.SUNNY_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 설정값 반영 ---------- */
  $$('[data-cfg]').forEach(function (el) {
    var v = C[el.getAttribute('data-cfg')];
    if (v === undefined) return;
    if (v === '') { el.style.display = 'none'; return; }
    el.textContent = v;
  });
  var B = C.BUSINESS || {};
  $$('[data-biz]').forEach(function (el) { el.textContent = B[el.getAttribute('data-biz')] || '-'; });
  if (B.phone) { var p = $('[data-biz-phone]'); if (p) p.textContent = ' · 전화 ' + B.phone; }
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  var kakao = $('#kakaoBtn');
  if (C.KAKAO_URL && kakao) { kakao.href = C.KAKAO_URL; kakao.hidden = false; }

  /* 섹션 이미지 추출 모드 (?export=1) */
  if (/[?&]export=1/.test(location.search)) document.documentElement.classList.add('export');

  /* ---------- 등장 애니메이션 ---------- */
  var io = 'IntersectionObserver' in window && !document.documentElement.classList.contains('export')
    ? new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px' })
    : null;
  $$('.rv-in').forEach(function (el) { io ? io.observe(el) : el.classList.add('on'); });

  /* ---------- 마감 카운트다운 ---------- */
  var cdWrap = $('#countdown'), cd = $('#cd'), stickyInfo = $('#stickyInfo');
  var deadline = C.DEADLINE ? new Date(C.DEADLINE).getTime() : NaN;
  function tick() {
    var left = deadline - Date.now();
    if (left <= 0) { cd.textContent = '마감되었어요'; if (stickyInfo) stickyInfo.textContent = '이번 기수 모집 마감'; return false; }
    var d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60, s = Math.floor(left / 1e3) % 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    cd.textContent = d + '일 ' + pad(h) + ':' + pad(m) + ':' + pad(s);
    if (stickyInfo) stickyInfo.textContent = '마감까지 ' + d + '일 ' + pad(h) + '시간';
    return true;
  }
  if (!isNaN(deadline) && cdWrap) { cdWrap.hidden = false; if (tick()) setInterval(tick, 1000); }

  /* ---------- 하단 고정 버튼: 신청 폼이 보이면 숨김 ---------- */
  var sticky = $('#sticky'), form = $('#applyForm');
  if (sticky && form && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { sticky.classList.toggle('hide', es[0].isIntersecting); }, { threshold: 0.05 }).observe(form);
  }

  /* ---------- 신청 폼 ---------- */
  if (!form) return;
  var phone = $('#f-phone'), msg = $('#formMsg'), btn = $('#submitBtn');

  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '').slice(0, 11);
    phone.value = d.length < 4 ? d : d.length < 8 ? d.slice(0, 3) + '-' + d.slice(3) : d.slice(0, 3) + '-' + d.slice(3, d.length - 4) + '-' + d.slice(-4);
  });

  function setInvalid(field, bad) { if (field) field.classList.toggle('invalid', !!bad); return !bad; }
  function validate() {
    var ok = true, first = null;
    var chk = function (field, bad) { if (!setInvalid(field, bad)) { ok = false; first = first || field; } };
    chk($('#f-name').closest('.field'), $('#f-name').value.trim().length < 2);
    chk(phone.closest('.field'), !/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone.value.trim()));
    var em = $('#f-email').value.trim();
    chk($('#f-email').closest('.field'), em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em));
    chk($('[data-group="level"]'), !form.querySelector('input[name="level"]:checked'));
    chk($('#privacyField'), !$('#f-privacy').checked);
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return ok;
  }
  $$('input,select,textarea', form).forEach(function (el) {
    el.addEventListener('change', function () { var f = el.closest('.field'); if (f) f.classList.remove('invalid'); if (el.id === 'f-privacy') $('#privacyField').classList.remove('invalid'); });
  });

  function showMsg(t) { msg.textContent = t; msg.classList.add('show'); }
  function utm() {
    var q = new URLSearchParams(location.search), out = [];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (k) { if (q.get(k)) out.push(k.replace('utm_', '') + '=' + q.get(k)); });
    return out.join('&');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.classList.remove('show');
    if (!validate()) return;
    if (form.website.value) return; // 스팸봇
    if (!C.APPS_SCRIPT_URL) { showMsg('⚠️ 아직 신청 접수 주소가 설정되지 않았어요. (config.js의 APPS_SCRIPT_URL)'); return; }

    var fd = new FormData(form);
    var body = new URLSearchParams();
    ['name', 'phone', 'email', 'level', 'goal', 'source', 'website'].forEach(function (k) { body.append(k, (fd.get(k) || '').toString().trim()); });
    body.append('privacy', $('#f-privacy').checked ? 'Y' : 'N');
    body.append('marketing', form.marketing.checked ? 'Y' : 'N');
    body.append('cohort', C.COHORT || '');
    body.append('utm', utm());
    body.append('referrer', document.referrer || '');
    body.append('page', location.href.split('?')[0]);

    btn.disabled = true; btn.textContent = '제출 중...';
    // Apps Script는 CORS 응답을 읽기 어려워 no-cors로 전송합니다. (전송 실패 시에만 catch로 떨어짐)
    fetch(C.APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () {
        form.reset();
        $('#doneModal').classList.add('show');
        if (window.gtag) window.gtag('event', 'generate_lead');
        if (window.fbq) window.fbq('track', 'Lead');
      })
      .catch(function () { showMsg('제출 중 문제가 생겼어요. 잠시 후 다시 시도하거나 문의 채널로 연락주세요.'); })
      .finally(function () { btn.disabled = false; btn.textContent = '신청서 제출하기'; });
  });

  var modal = $('#doneModal');
  $('#closeModal').addEventListener('click', function () { modal.classList.remove('show'); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('show'); });
})();
