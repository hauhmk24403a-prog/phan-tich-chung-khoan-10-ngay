'use strict';
const parse = id => JSON.parse(document.getElementById(id).textContent);
const {chapters, topics, questions, front, examSets} = window.SAKURA_COURSE || parse('model');
const media = window.SAKURA_IMAGES || parse('media');
const allQuestions = Object.values(questions);
const bankNames = {'12':'Đề cuối kỳ 2022–2023','13':'Bài làm thử 100 câu','14':'Ngân hàng phân tích kỹ thuật'};
const bankIds = Object.keys(bankNames);
const main = document.getElementById('app');
const sidebar = document.getElementById('sidebar');
const key = 'ptck-study-uel-v1';
const emptyState = () => ({topics:{}, questions:{}, lastChapter:'1'});
let state = emptyState();
let activeQuiz = null;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const route = (id, tab = 'learn') => '#c/' + id + '/' + tab;
const sectionOpen = new Set();
const tabIs = (tab, current) => tab === current ? ' aria-current="page"' : '';
const footer = '<footer>Nguồn bài học và đề gốc · Giáo trình tổng hợp Phân tích chứng khoán, UEL, bản tháng 10/2026.</footer>';
const historicalNotice = '<p class="notice small">Phần giao dịch và quy định theo giả định hoặc mốc của giáo trình và đề gốc. Một số câu dùng T+3, lệnh và phương pháp tính ở thời điểm tài liệu. Khi làm bài, dùng dữ kiện của đề.</p>';

function storageWarning() {
  const box = document.getElementById('saveWarning');
  box.textContent = 'Trình duyệt đang chặn lưu tiến độ. Bạn vẫn học được trong phiên này. Hãy mở file bằng trình duyệt thông thường để lưu bài.';
  box.style.display = 'block';
}
try {
  const raw = localStorage.getItem(key);
  if (raw) {
    const saved = JSON.parse(raw);
    if (saved && saved.topics && saved.questions) state = saved;
  }
  localStorage.setItem(key, JSON.stringify(state));
} catch (error) { storageWarning(); }

// Upgrade active sessions from the edition with variable answer counts.
if(state.quiz && state.quiz.format!==2){
  const old=state.quiz;
  for(const [i,item] of old.items.entries()){
    const q=questions[item.id];
    if(!q)continue;
    const before=item.order;
    if(q.original && q.original.choices.length!==4){
      old.responses[i]=null;
      item.order=[0,1,2,3];
    }else if(before.length!==4){
      item.order=[...before,...[0,1,2,3].filter(k=>!before.includes(k))];
    }
  }
  old.format=2;
  save();
}
function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); } catch (error) { storageWarning(); }
}
function topicState(id) { return state.topics[id] || {streak:0, lastQuiz:'', lastAt:0}; }
function done(id) { return topicState(id).streak >= 2; }
function countDone(ids) { return ids.filter(done).length; }
function problem(id) { return state.questions[id]?.wrong === true || state.questions[id]?.uncertain === true; }
function scorable(q) { return q.answer !== null && !q.flagged; }
function adaptive(q) { return scorable(q) && !q.historical; }
const appliedAssessment = q => !q.bank ? (q.applied ? 'Bài vận dụng' : 'Trắc nghiệm theo mục') : bankNames[q.bank] + ' · Câu ' + q.num;
function sourceLabel(q) { if(q.variant)return 'Bài phối hợp · '+q.title; if(q.repair)return 'Luyện sau lỗi sai · '+q.title; if(q.examOnly)return 'Đề tự soạn · '+q.group; return q.drill ? 'Bậc ' + q.level + ' · ' + levels[q.level-1] + ' · ' + q.title : appliedAssessment(q); }
function bankFor(id) { return allQuestions.filter(q => q.bank === id); }
function bankForTopics(ids) { return allQuestions.filter(q => q.bank && q.topics.some(id => ids.includes(id))); }
function nativeForTopics(ids) { return allQuestions.filter(q => !q.examOnly && !q.bank && !q.drill && q.topics.some(id => ids.includes(id))); }
function chapterOf(id) { return chapters.find(c => c.id === id); }
function groupLabel(c) { return Number(c.id) <= 11 ? 'Chương ' + c.id : Number(c.id) <= 14 ? 'Chương ' + c.id + ' · Luyện đề' : 'Phụ lục ' + (c.id === '15' ? 'A' : 'B'); }
function button(label, action, value = '', primary = false) {
  return '<button type="button" class="btn' + (primary ? ' primary' : '') + '" data-action="' + esc(action) + '" data-value="' + esc(value) + '">' + esc(label) + '</button>';
}
function link(label, href, primary = false) {
  return '<a class="btn' + (primary ? ' primary' : '') + '" href="' + esc(href) + '">' + esc(label) + '</a>';
}
function reading(label, html) {
  return '<details class="reading"><summary>' + esc(label) + '</summary><div class="details-body">' + html + '</div></details>';
}
function loadImage(img) {
  const src = media[img.dataset.img];
  if (src && !img.hasAttribute('src')) img.src = src;
}
function hydrate(container) {
  for (const img of container.querySelectorAll('img[data-img]')) if (!img.closest('details:not([open])')) loadImage(img);
}
main.addEventListener('toggle', event => {
  if (event.target.open) hydrate(event.target);
}, true);
function image(ref, alt) {
  return '<img data-img="' + esc(ref) + '" alt="' + esc(alt) + '">';
}
function renderNav(current){ deskNav(current); }
sidebar.addEventListener('toggle', event => {
  if (!event.target.dataset.section) return;
  if (event.target.open) sectionOpen.add(event.target.dataset.section);
  else sectionOpen.delete(event.target.dataset.section);
}, true);

function home(){ deskHome(); }
function header(c) {
  const n = countDone(c.topics);
  return '<section class="hero"><p class="eyebrow">' + groupLabel(c) + '</p><h1>' + esc(c.title) + '</h1>' +
    (c.topics.length ? '<div class="counter">' + n + '/' + c.topics.length + ' mục đạt mốc luyện tập</div><progress value="' + n + '" max="' + c.topics.length + '" aria-label="Tiến độ chương"></progress>' : '') + '</section>';
}
function tabs(c, tab) {
  const list = [['learn','Bài giảng'],['practice','Trắc nghiệm'],['levels','Luyện 9 bậc'],['progress','Tiến độ']];
  if (c.slides.length) list.push(['slides','Slide gốc']);
  list.push(['original','Nguyên văn chương']);
  return '<nav class="tabbar" aria-label="Chế độ học chương">' + list.map(([id,label]) => '<a class="btn" href="' + route(c.id,id) + '"' + tabIs(id,tab) + '>' + label + '</a>').join('') + '</nav>';
}
function nextLinks(c) {
  const index = chapters.indexOf(c);
  return '<div class="actions">' + (index > 0 ? link('Phần trước',route(chapters[index-1].id)) : '') +
    (index < chapters.length-1 ? link('Phần tiếp theo',route(chapters[index+1].id)) : '') + '</div>';
}
function renderChapter(c, tab, target) {
  let content;
  if (c.appendix) {
    content = '<section class="panel">' + c.appendix + '</section>';
  } else if (bankIds.includes(c.id)) {
    content = tab === 'levels' ? levelsPanel(c) : tab === 'original' ? '<section class="panel">' + c.raw + '</section><p>'+link('Về trắc nghiệm',route(c.id))+'</p>' : bankPage(c);
  } else if (tab === 'original') {
    content = '<section class="panel">' + c.raw + '</section>';
  } else if (tab === 'levels') {
    content = levelsPanel(c);
  } else if (tab === 'practice') {
    content = practicePage(c);
  } else if (tab === 'progress') {
    content = progressPage(c);
  } else if (tab === 'slides' && c.slides.length) {
    content = slidesPage(c);
  } else {
    tab = 'learn';
    content = learnPage(c);
  }
  main.innerHTML = header(c) + (c.topics.length ? tabs(c, tab) : '') + content + nextLinks(c) + footer;
  hydrate(main);
  if (target && topics[target]) {
    const anchor = document.getElementById('topic-' + target);
    anchor?.scrollIntoView();
  }
}
function learnPage(c) {
  const intro = c.intro ? '<section class="panel">' + c.intro + '</section>' : '';
  const menu = '<section class="panel"><h2>Mục bài giảng</h2><div class="toc">' + c.topics.map(id => '<a href="' + route(c.id) + '/' + id + '" aria-label="' + esc(id + ' ' + topics[id].title) + '">' + id + ' · ' + esc(topics[id].title) + '</a>').join('') + '</div><div class="actions">' + link('Mở trắc nghiệm chương',route(c.id,'practice'),true) + link('216 câu · 9 bậc',route(c.id,'levels')) + '</div></section>';
  return intro + menu + chartPanel(c) + (['1','9','11'].includes(c.id) ? historicalNotice : '') + c.topics.map(id => {
    const t = topics[id];
    const evidence = bankForTopics([id]).length;
    return '<section class="topic" id="topic-' + id + '"><p class="eyebrow">Mục ' + id + (done(id) ? ' · Đạt mốc' : '') + '</p><h3>' + esc(t.title) + '</h3><p>' +
      esc(t.intro) + '</p>' + reading('Xem nội dung giáo trình, công thức và ví dụ',t.detail) + pad(id) +
      '<div class="actions">' + button('Tự kiểm mục ' + id,'start-topic',id,true) + (evidence ? button('Câu gốc liên quan · ' + evidence,'start-topic-bank',id) : '') + '</div></section>';
  }).join('');
}
function due(c) {
  return c.topics.filter(id => done(id) && Date.now() - topicState(id).lastAt >= 24 * 60 * 60 * 1000);
}
function practicePage(c) {
  const originals = bankForTopics(c.topics);
  const authored = nativeForTopics(c.topics);
  const mistakes = [...authored,...originals].filter(q => problem(q.id));
  return '<section class="panel"><h2>Luyện theo mức độ</h2><p>Ở mỗi lượt, trả lời trước khi xem lời giải. Luyện chỗ yếu ưu tiên mục chưa đạt mốc hoặc đã trả lời sai.</p><div class="actions">' +
    (state.quiz ? link('Tiếp tục lượt đang dở','#quiz') : '') + button('Luyện chỗ yếu','start','adaptive-' + c.id,true) + button('Sinh bài phối hợp mới','mix-new',c.id) + button('Tự kiểm toàn chương · ' + authored.length,'start','authored-' + c.id) +
    (mistakes.length ? button('Làm lại câu sai hoặc chưa chắc · ' + mistakes.length,'start','wrong-' + c.id) : '') +
    (due(c).length ? button('Ôn sau một ngày · ' + due(c).length,'start','due-' + c.id) : '') +
    '</div></section>' +
    (originals.length ? '<section class="panel"><h2>Câu từ đề gốc</h2><p>' + originals.length + ' câu được gắn với các mục trong chương.</p><div class="actions">' + button('Luyện câu gốc theo chương','start','source-' + c.id,true) + '</div></section>' : '');
}
function progressPage(c) {
  const next = due(c);
  return '<section class="panel"><h2>Tiến độ theo mục</h2><p class="muted small">Tiến độ dựa trên hai lượt đúng liên tiếp và được cập nhật khi bạn gửi câu trả lời.</p><ul class="topic-list">' +
    c.topics.map(id => {
      const current = topicState(id);
      const label = next.includes(id) ? 'Đến lượt ôn sau một ngày' : done(id) ? 'Đạt mốc' : current.streak ? 'Đúng 1 lượt' : 'Chưa đạt';
      return '<li><a href="' + route(c.id) + '/' + id + '">' + id + ' ' + esc(topics[id].title) + '</a><span class="stamp">' + label + '</span></li>';
    }).join('') + '</ul><div class="actions">' + link('Qua trắc nghiệm',route(c.id,'practice'),true) + '</div></section>';
}
function slidesPage(c) {
  return '<section class="panel"><h2>Slide bài giảng gốc</h2><div class="slide-pager">' + button('Trang trước','slide-prev') +
    '<label for="slideSelect">Slide</label><select id="slideSelect" class="jump">' + c.slides.map((_,i) => '<option value="' + i + '">' + (i+1) + '/' + c.slides.length + '</option>').join('') +
    '</select>' + button('Trang sau','slide-next') + '</div><figure id="slideFigure">' + image(c.slides[0],'Slide gốc 1 của chương ' + c.id) + '</figure></section>';
}
function showSlide(c, i) {
  const index = Math.max(0,Math.min(i,c.slides.length-1));
  const selector = document.getElementById('slideSelect');
  selector.value = String(index);
  const fig = document.getElementById('slideFigure');
  fig.innerHTML = image(c.slides[index], 'Slide gốc ' + (index+1) + ' của chương ' + c.id);
  hydrate(fig);
}
function bankPage(c) {
  const qs = bankFor(c.id);
  const wrong = qs.filter(q => problem(q.id));
  const reviewed = qs.filter(q => state.questions[q.id]?.tries).length;
  return '<section class="panel"><h2>Luyện đề gốc</h2><p>Đã xem hoặc làm ' + reviewed + '/' + qs.length + ' câu. Bản luyện tiếng Việt có bốn lựa chọn. Mở nguyên văn để xem toàn bộ phương án ban đầu.</p><div class="actions">' +
    (state.quiz ? link('Tiếp tục lượt đang dở','#quiz') : '') + link('216 câu · 9 bậc',route(c.id,'levels')) + button('Làm trọn bộ · ' + qs.length,'start','bank-' + c.id,true) + button('Luyện nhanh 15 câu','start','sample-' + c.id) + (c.id==='12'?button('Thi thử 75 phút','start','mock-12'):'') + link('Mở nguyên văn và ảnh đề',route(c.id,'original')) +
    (wrong.length ? button('Làm lại câu sai · ' + wrong.length,'start','bankwrong-' + c.id) : '') +
    '</div><div class="actions"><label for="bankJump">Bắt đầu từ câu</label><select class="jump" id="bankJump">' +
    qs.map(q => '<option value="' + q.num + '">' + q.num + '</option>').join('') + '</select>' + button('Mở câu','bank-jump',c.id) + '</div></section>' +
    historicalNotice + '<section class="panel"><h2>Chấm điểm và đối chiếu</h2><p>Mỗi câu hiển thị đáp án theo bản giáo trình. Câu thiếu đáp án hoặc có ghi chú bất nhất được giữ để đối chiếu riêng và bỏ qua khi tính điểm. Các hình của đề xuất hiện ngay bên dưới câu hỏi.</p></section>';
}
