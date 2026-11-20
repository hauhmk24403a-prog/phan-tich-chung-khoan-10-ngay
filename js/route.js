function resumeLink() {
  return state.quiz ? '<div class="actions">' + link('Tiếp tục lượt làm đang dở','#quiz') + '</div>' : state.lastMock?'<div class="actions">'+link('Kết quả đề gần nhất','#result')+'</div>':'';
}
function render() {
  const [part,id,tab,target] = (location.hash.slice(1)||'home').split('/');
  if (part === 'quiz') {
    activeQuiz = state.quiz || activeQuiz || state.lastMock;
    if (activeQuiz) {
      renderNav(activeQuiz.back.split('/')[1] || '');
      quizView();
      return;
    }
    location.replace('#home');
    return;
  }
  window.scrollTo(0,0);
  if (part === 'plan') {
    renderNav('plan');
    planView(id);
  } else if (part === 'syllabus') {
    renderNav('syllabus');
    syllabusView();
  } else if (part === 'source') {
    renderNav('source');
    main.innerHTML='<section class="hero"><h1>Giáo trình gốc</h1></section><section class="panel"><h2>Mở nguyên văn</h2><div class="toc">'+chapters.map(c=>link(groupLabel(c)+' · '+c.title,route(c.id,'original'))).join('')+'</div></section><section class="panel">'+front+'</section>'+footer;
    hydrate(main);
  } else if(part==='notes'||part==='ai'){renderNav('notes');notebook(id);
  } else if(part==='exams'){renderNav('exams');examRoom();
  } else if(part==='result'&&state.lastMock){renderNav('exams');activeQuiz=state.lastMock;finishView();
  } else if (part === 'c' && chapterOf(id)) {
    if (Number(id)<=11 && state.lastChapter!==id) {
      state.lastChapter=id;
      save();
    }
    renderNav(id);
    renderChapter(chapterOf(id),tab||'learn',target);
    drawChart();
  } else {
    renderNav('home');
    home();
  }
}
window.addEventListener('hashchange',render);
main.addEventListener('click',event=>{
  const btn=event.target.closest('[data-action]');
  if (!btn || btn.disabled) return;
  const {action,value}=btn.dataset;
  if(action==='mix-new')mixedChapter(value);
  if(action==='exam') startExam(Number(value));
  if(action==='post-review')startPostReview();
  if(action==='gap-show'||action==='gap-check')updatePad(action,value);
  if (action==='start') runMode(value);
  if (action==='start-rank' || action==='full-rank' || action==='rank-mistakes') startRank(value,action!=='start-rank',action==='rank-mistakes');
  if (action==='start-topic') {
    const options = nativeForTopics([value]);
    openQuiz(shuffle(options).map(q=>quizItem(q,value)),'Tự kiểm mục ' + value,route(value.split('.')[0])+'/'+value);
  }
  if (action==='start-topic-bank') openQuiz(bankForTopics([value]).map(q=>quizItem(q,value)),'Câu gốc · Mục ' + value,route(value.split('.')[0])+'/'+value);
  if (action==='bank-jump') {
    const n=Number(document.getElementById('bankJump').value);
    openList(bankFor(value).slice(n-1),bankNames[value] + ' · Từ câu ' + n,route(value));
  }
  if (action==='answer') answer(Number(value));
  if (action==='next'||action==='skip') nextQuestion();
  if (action==='mock-prev') moveMock(activeQuiz.index-1);
  if (action==='mock-submit') {
    if (activeQuiz.responses.filter(Boolean).length===activeQuiz.items.length || confirm('Nộp bài ngay? Các câu chưa trả lời sẽ tính là chưa đúng.')) finish();
  }
  if (action==='retry-session') {
    const {items,responses,back}=activeQuiz;
    const retry = items.filter((item,i)=>{
      const q=questionFor(item), response=responses[i];
      return scorable(q) && (!response || response.choice!==q.answer || response.unsure);
    });
    openQuiz(retry.map(item=>item.generated?{...item,order:shuffle([0,1,2,3])}:quizItem(questionFor(item),item.focus)),'Làm lại câu cần ôn',back);
  }
  if (action==='slide-prev'||action==='slide-next') {
    const c=chapterOf(location.hash.split('/')[1]);
    showSlide(c,Number(document.getElementById('slideSelect').value)+(action==='slide-next'?1:-1));
  }
  if (action==='day-done') {
    state.plan ||= {};
    state.plan[value]=!state.plan[value];
    save();
    planView(value);
  }
});
main.addEventListener('change',event=>{
  if (event.target.id==='slideSelect') showSlide(chapterOf(location.hash.split('/')[1]),Number(event.target.value));
  if (event.target.id==='mockJump') moveMock(Number(event.target.value));
  if (event.target.id==='unsure' && activeQuiz?.deadline) {
    const index=activeQuiz.index;
    activeQuiz.marked[index]=event.target.checked;
    if (activeQuiz.responses[index]) activeQuiz.responses[index].unsure=event.target.checked;
    checkpoint();
    const list=document.getElementById('mockJump');
    list.options[index].textContent=(index+1)+(event.target.checked?' · Đánh dấu':activeQuiz.responses[index]?' · Đã trả lời':' · Chưa làm');
  }
  if (['chartMode','chartMA'].includes(event.target.id)) drawChart();
});
main.addEventListener('input',event=>{
  if (event.target.id==='chartBar') drawChart();
});
document.addEventListener('keydown',event=>{
  if (location.hash!=='#quiz' || activeQuiz?.finished || event.ctrlKey || event.metaKey || event.altKey || /^(INPUT|BUTTON|TEXTAREA|SELECT|A)$/.test(event.target.tagName)) return;
  const item=activeQuiz.items[activeQuiz.index];
  if (/^[1-4]$/.test(event.key) && item.order[Number(event.key)-1]!==undefined) {
    event.preventDefault();
    answer(item.order[Number(event.key)-1]);
  }
});
render();
