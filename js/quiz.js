function shuffle(items) {
  const out = [...items];
  for (let i = out.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [out[i],out[j]] = [out[j],out[i]];
  }
  return out;
}
function quizItem(q, focus) {
  const order = q.choices.map((_,i) => i);
  return {id:q.id, focus, order:q.bank ? order : shuffle(order)};
}
function chooseFor(ids, mode) {
  const mix = shuffle(allQuestions.filter(q=>adaptive(q)&&!q.drill&&!q.examOnly));
  return ids.map(id => {
    const prev = topicState(id);
    const pool = mix.filter(q => q.topics.includes(id));
    pool.sort((a,b) => rank(a) - rank(b));
    function rank(q) {
      const track = state.questions[q.id];
      const repeat = q.id === prev.lastQuestion ? 12 : 0;
      const source = q.bank && mode !== 'due' && !prev.streak ? 5 : q.bank ? 1 : 0;
      return repeat + source - (track?.wrong ? 7 : track?.uncertain ? 5 : 0) + Math.min(track?.tries || 0, 4);
    }
    return quizItem(pool[0],id);
  });
}
function openQuiz(items, title, back, timerMinutes = 0) {
  if (!items.length) return;
  activeQuiz = {format:2,items,title,back, token:Date.now().toString(36) + Math.random().toString(36).slice(2),index:0,
    responses:[],blocked:{},marked:{},finished:false, deadline:timerMinutes ? Date.now()+timerMinutes*60000 : 0};
  checkpoint();
  if (location.hash === '#quiz') render();
  else location.hash = 'quiz';
}
function checkpoint() {
  if (activeQuiz && !activeQuiz.finished) state.quiz = activeQuiz;
  else delete state.quiz;
  save();
}
function openList(list,title,back,c = null,timerMinutes = 0) {
  openQuiz(list.map(q => quizItem(q,c ? q.topics.find(id => c.topics.includes(id)) : q.topics[0])),title,back,timerMinutes);
}
function runMode(value) {
  const [mode,id] = value.split('-');
  const c = chapterOf(id);
  if (mode === 'outline' || mode === 'mixed') {
    const isOutline = mode === 'outline';
    const list = balancedMock();
    openList(list,isOutline ? 'Mô phỏng đề cương · 60 phút' : 'Đề trộn 45 câu · 75 phút', isOutline ? '#syllabus' : '#plan/10', null,isOutline?60:75);
    return;
  }
  if (!c) return;
  const back = bankIds.includes(id) ? route(id) : route(id,'practice');
  const original = bankForTopics(c.topics);
  const authored = nativeForTopics(c.topics);
  if (mode === 'bank' || mode === 'mock') {
    openList(bankFor(id),bankNames[id],back,null,mode === 'mock' ? 75 : 0);
  } else if (mode === 'sample') {
    openList(shuffle(bankFor(id).filter(scorable)).slice(0,15),bankNames[id] + ' · Luyện nhanh',back);
  } else if (mode === 'bankwrong') {
    openList(bankFor(id).filter(q => problem(q.id) || state.questions[q.id]?.uncertain),'Làm lại câu sai hoặc chưa chắc',back);
  } else if (mode === 'authored') {
    openList(shuffle(authored),'Tự kiểm chương ' + id,back,c);
  } else if (mode === 'source') {
    openList(original,'Câu gốc theo chương ' + id,back,c);
  } else if (mode === 'wrong') {
    openList([...authored,...original].filter(q => problem(q.id) || state.questions[q.id]?.uncertain),'Làm lại câu sai hoặc chưa chắc',back,c);
  } else if (mode === 'adaptive' || mode === 'due') {
    const pending = c.topics.filter(id => !done(id));
    const ids = mode === 'due' ? due(c) : pending.length ? pending : c.topics;
    openQuiz(chooseFor(shuffle(ids),mode),mode === 'due' ? 'Ôn sau một ngày' : 'Luyện chỗ yếu · Chương ' + id,back);
  }
}
function choicesHTML(q,item,response,mock) {
  return item.order.map((choice,index) => {
    const chosen = response && response.choice === choice;
    const mark = mock ? chosen ? ' good' : '' : response && choice === q.answer ? ' good' : chosen && scorable(q) ? ' bad' : '';
    const letter = String.fromCharCode(65+index);
    return '<button type="button" class="option' + mark + '" data-action="answer" data-value="' + choice + '"' +
      (response && !mock ? ' disabled' : '') + '><span class="choice-letter">' + letter + '</span><span>' + esc(q.choices[choice]) +
      (chosen ? ' <strong>· Đã chọn</strong>' : '') + '</span></button>';
  }).join('');
}
function answerSummary(q,response,focus) {
  const ok = scorable(q) && response.choice === q.answer;
  const title = scorable(q) ? ok ? response.unsure ? 'Đúng, nhưng chưa chắc' : 'Chính xác' : 'Chưa đúng' : 'Câu cần đối chiếu';
  const keyLabel = q.answer === null ? 'Giáo trình chưa có đáp án xác nhận.' :
    (q.bank && !q.original ? 'Đáp án theo giáo trình' : 'Đáp án bản luyện') + ' — ' + (q.letters ? q.letters[q.answer] + '. ' : '') + q.choices[q.answer];
  const notes = q.note ? '<p>' + esc(q.note) + '</p>' : '';
  const recall = q.bank && focus ? '<p class="small"><strong>Ôn khái niệm liên quan</strong> · ' + esc(topics[focus].intro) +
    ' <a href="' + route(focus.split('.')[0]) + '/' + focus + '">Mở mục ' + focus + '</a></p>' : '';
  return '<div class="feedback ' + (scorable(q) ? ok ? 'good' : 'bad' : 'notice') + '" role="status"><p><strong>' + title + '</strong></p>' +
    '<p>' + esc(keyLabel) + '</p>' + notes + recall + originalBox(q) + '</div>';
}
function elapsedTimer() {
  const spot = document.getElementById('quizTimer');
  if (!spot || !activeQuiz?.deadline || activeQuiz.finished) return;
  const seconds = Math.ceil(Math.max(0, activeQuiz.deadline-Date.now())/1000);
  spot.textContent = 'Thời gian còn lại ' + Math.floor(seconds/60) + ':' + String(seconds%60).padStart(2,'0');
  if (!seconds) finish();
}
setInterval(elapsedTimer,1000);

function quizView() {
  if (activeQuiz.finished) { finishView(); return; }
  const {items,index,responses,title,back} = activeQuiz;
  const item = items[index];
  const q = questionFor(item);
  const response = responses[index];
  const mock = !!activeQuiz.deadline;
  const meta = item.focus ? item.focus + ' ' + topics[item.focus].title : 'Trắc nghiệm';
  main.innerHTML = '<section class="quiz"><div class="actions">' + link('Tạm dừng và quay lại',back) +
    '<span class="muted small">' + esc(title) + '</span><strong class="small" id="quizTimer"></strong></div><progress value="' + (index+Number(!!response)) +
    '" max="' + items.length + '" aria-label="Tiến độ lượt làm"></progress><div class="counter muted">Câu ' + (index+1) + '/' + items.length +
    ' · ' + (q.repair?'Luyện bù '+item.slot+'/5 · ':'') + esc(sourceLabel(q)) + '</div><p class="small muted">' + esc(meta) + '</p><h2 id="questionTitle" tabindex="-1">' + esc(q.prompt) + '</h2>' +
    quizPlot(q) + (q.images || []).map((ref,i) => '<div class="review-image">' + image(ref,'Đồ thị đi kèm câu ' + q.num + ', hình ' + (i+1)) + '</div>').join('') +
    (q.flagged ? '<p class="notice small">Câu này có đáp án thiếu hoặc cần đối chiếu. Bạn có thể chọn để xem ghi chú của tài liệu.</p>' : '') +
    (q.historical ? '<p class="muted small">Dữ kiện theo mốc hoặc giả định của đề gốc.</p>' : '') +
    ((mock || !response) && scorable(q) ? '<label class="muted small"><input type="checkbox" id="unsure"' + ((activeQuiz.marked[index]||response?.unsure)?' checked':'') + '> Mình chưa chắc · Đánh dấu để ôn lại</label>' : '') +
    '<div class="answers">' + choicesHTML(q,item,response,mock) + '</div>' +
    (response && !mock ? answerSummary(q,response,item.focus) : '') + (response?.added ? '<div role="status" class="repair-msg"><b>Đã tạo 5 câu cùng dạng.</b> Bắt đầu ngay bên dưới, rồi tiếp tục bài đang học.</div>' : '') + '<div class="actions">' +
    (mock ? mockNavigation(items,index,responses) : (!response ? button('Bỏ qua','skip') : button(response.added ? 'Luyện ngay · câu 1/5 →' : index === items.length-1 ? 'Xem kết quả' : 'Câu tiếp theo →','next','',true))) + '</div></section>';
  hydrate(main);
  elapsedTimer();
}
function answer(choice) {
  const {index,items,responses} = activeQuiz;
  if (responses[index] && !activeQuiz.deadline) return;
  if (activeQuiz.deadline && activeQuiz.deadline <= Date.now()) { finish(); return; }
  const item = items[index];
  if (!item.order.includes(choice)) return;
  const unsure = !!document.getElementById('unsure')?.checked;
  responses[index] = {choice,unsure};
  if (!activeQuiz.deadline) {
    recordAttempt(item,responses[index]);
    const q=questionFor(item);
    if(scorable(q)&&q.answer!==choice){
      const batch=makeFive(item,choice,activeQuiz);
      items.splice(index+1,0,...batch);
      if(responses.length>index+1)responses.splice(index+1,0,...Array(5).fill(null));
      responses[index].added=true;
    }
  }
  checkpoint();
  quizView();
  main.querySelector('[data-action="next"]')?.focus({preventScroll:true});
}
function recordAttempt(item,response) {
  const {token,blocked}=activeQuiz;
  const {choice,unsure}=response;
  const q=questionFor(item);
  const ok = q.answer === choice;
  if(q.repair){state.repairStats||={right:0,total:0};state.repairStats.total++;if(ok)state.repairStats.right++;return;}
  const old = state.questions[q.id] || {tries:0};
  state.questions[q.id] = {tries:old.tries+1,wrong:scorable(q) && !ok,uncertain:scorable(q) && ok && unsure};
  if (item.focus && adaptive(q)) {
    const prev = topicState(item.focus);
    if (!ok || unsure) {
      blocked[item.focus] = true;
      state.topics[item.focus] = {streak:0,lastQuiz:token,lastAt:Date.now(),lastQuestion:q.id};
    } else if (!blocked[item.focus] && prev.lastQuiz !== token) {
      state.topics[item.focus] = {streak:Math.min(2,prev.streak+1),lastQuiz:token,lastAt:Date.now(),lastQuestion:q.id};
    }
  }
}
function mockNavigation(items,index,responses) {
  return (index ? button('Câu trước','mock-prev') : '') +
    (index+1 < items.length ? button('Câu tiếp theo','next','',true) : '') +
    '<label for="mockJump">Chuyển câu</label><select class="jump" id="mockJump">'+items.map((_,i)=>'<option value="'+i+'"'+(i===index?' selected':'')+'>'+(i+1)+(activeQuiz.marked[i]?' · Đánh dấu':responses[i]?' · Đã trả lời':' · Chưa làm')+'</option>').join('')+'</select>' +
    button('Nộp bài','mock-submit');
}
function moveMock(index) {
  if (index<0 || index>=activeQuiz.items.length) return;
  activeQuiz.index=index;
  checkpoint();
  quizView();
  window.scrollTo(0,0);
  document.getElementById('questionTitle')?.focus({preventScroll:true});
}
function nextQuestion() {
  if (activeQuiz.index === activeQuiz.items.length-1) { finish(); return; }
  activeQuiz.index++;
  checkpoint();
  quizView();
  window.scrollTo(0,0);
  document.getElementById('questionTitle')?.focus({preventScroll:true});
}
function finish() {
  if (activeQuiz.finished) return;
  if (activeQuiz.deadline) activeQuiz.items.forEach((item,i)=>{
    const response=activeQuiz.responses[i];
    if (response) recordAttempt(item,response);
  });
  if(activeQuiz.deadline){
    activeQuiz.postReview=activeQuiz.items.flatMap((item,i)=>{
      const q=questionFor(item),r=activeQuiz.responses[i];
      return r&&scorable(q)&&r.choice!==q.answer ? makeFive(item,r.choice,activeQuiz) : [];
    });
    if(Number.isInteger(activeQuiz.examIndex)){
      const right=activeQuiz.items.filter((it,i)=>activeQuiz.responses[i]?.choice===questionFor(it).answer).length;
      state.examScores||={};state.examScores[activeQuiz.examIndex]={right,total:activeQuiz.items.length};
    }
    state.lastMock=activeQuiz;
  }
  activeQuiz.finished = true;
  checkpoint();
  finishView();
  window.scrollTo(0,0);
}
function finishView() {
  const {items,responses,title,back} = activeQuiz;
  const checks = items.map((item,index) => ({item,q:questionFor(item),response:responses[index]}));
  const originals=checks.filter(({q})=>!q.repair);
  const base=originals.length?originals:checks;
  const repairs=checks.filter(({q})=>q.repair);
  const scored=base.filter(({q})=>scorable(q));
  const right = scored.filter(({q,response}) => response?.choice === q.answer).length;
  const revisit = scored.filter(({q,response}) => !response || response.choice !== q.answer || response.unsure);
  const unanswered = scored.filter(({response}) => !response).length;
  main.innerHTML = '<section class="quiz"><p class="eyebrow">' + esc(title) + '</p><h1>Kết quả lượt làm</h1><p><strong>' + right + '/' + scored.length +
    ' câu đúng</strong>' + (scored.length ? ' · ' + numberVi.format(10*right/scored.length) + '/10' : '') + ' · ' + unanswered + ' câu tính điểm chưa trả lời</p>' +
    (base.length > scored.length ? '<p class="muted small">' + (base.length-scored.length) + ' câu cần đối chiếu được loại khỏi điểm.</p>' : '') +
    (repairs.length&&originals.length?'<p>Luyện bù · '+repairs.filter(({q,response})=>response?.choice===q.answer).length+'/'+repairs.length+' câu đúng.</p>':'')+
    '<div class="actions">' + (activeQuiz.postReview?.length?button('Luyện bù '+activeQuiz.postReview.length+' câu','post-review','',true):'') + (revisit.length ? button('Làm lại câu cần ôn · ' + revisit.length,'retry-session','',true) : '') + link('Về bài học',back) + link('Lộ trình 10 ngày','#plan/1') +
    '</div>' + (activeQuiz.deadline ? '<details class="reading"><summary>Xem đáp án và lời giải từng câu</summary>'+checks.map(({q,response,item},i)=>'<article class="topic"><h3>Câu '+(i+1)+'</h3><p>'+esc(q.prompt)+'</p>'+quizPlot(q)+(q.images||[]).map(ref=>image(ref,'Hình của đề')).join('')+answerSummary(q,response||{choice:-1},item.focus)+'</article>').join('')+'</details>':'') + (revisit.length ? '<h2>Câu cần luyện lại</h2><ul class="topic-list">' + revisit.map(({item,q,response}) => '<li><span>' +
      esc(sourceLabel(q)) + (item.focus ? ' · Mục ' + item.focus : '') + ' · ' + esc(q.prompt) + '</span><span class="stamp">' +
      (!response ? 'Bỏ qua' : response.choice !== q.answer ? 'Sai' : 'Đúng nhưng chưa chắc') + '</span></li>').join('') + '</ul>' :
      '<p>Hãy giải thích các câu vừa làm bằng lời của mình, rồi quay lại kiểm tra sau một ngày.</p>') + '</section>';
}
