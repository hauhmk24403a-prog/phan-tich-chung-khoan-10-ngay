const chapterIcons=['◈','◒','▦','✧','↗','≈','▥','△','⇄','∿','◎','◷','▤','⌁','✎','▧'];
const palette=['lav','peach','mint','sky'];
const studyBrand='<a class="brand-new" href="#home"><span class="flower" aria-hidden="true">🌸</span><span><b class="logo-caption">Sakura Study</b><small class="logo-meta">Phân tích chứng khoán</small></span></a>';
function deskNav(current){
  const nav=[['home','⌂','Bàn học','#home'],['plan','◷','Lộ trình 10 ngày','#plan/1'],['exams','▤','Phòng thi thử','#exams'],['notes','✎','Sổ tay của mình','#notes'],['syllabus','◎','Đề cương BFF4029','#syllabus'],['source','▧','Giáo trình gốc','#source']];
  const g=[['Bài giảng',chapters.slice(0,11)],['Bộ đề trong giáo trình',chapters.slice(11,14)],['Phụ lục',chapters.slice(14)]];
  sidebar.innerHTML='<div class="mobile-head">'+studyBrand+'<button type="button" class="mobile-menu" aria-expanded="false" aria-controls="deskNav" id="deskMenu">☰ &nbsp; Mục lục</button></div>'+studyBrand+'<nav id="deskNav" aria-label="Điều hướng chính">'+nav.map(([key,icon,name,url])=>'<a class="navlink" href="'+url+'"'+tabIs(key,current)+'><span class="navicon" aria-hidden="true">'+icon+'</span>'+name+'</a>').join('')+'<p>Thư mục học phần</p>'+g.map(([name,list])=>'<details data-section="'+name+'"'+(sectionOpen.has(name)||list.some(c=>current===c.id)?' open':'')+'><summary>'+name+'</summary>'+list.map(c=>'<a class="navlink" href="'+route(c.id)+'"'+tabIs(c.id,current)+'><span class="navnum">'+(Number(c.id)<15?c.id:c.id==='15'?'A':'B')+'</span>'+esc(c.title)+'</a>').join('')+'</details>').join('')+'</nav>';
}
sidebar.addEventListener('click',e=>{
  if(e.target.closest('#deskMenu')){const nav=document.getElementById('deskNav');const open=nav.classList.toggle('mobile-open');document.getElementById('deskMenu').setAttribute('aria-expanded',String(open));}
  if(e.target.closest('a')){document.getElementById('deskNav')?.classList.remove('mobile-open');document.getElementById('deskMenu')?.setAttribute('aria-expanded','false');}
});
function candlesFigure(){
  const rows=[[12,19,10,17],[17,19,12,14],[14,22,13,20],[20,24,17,19],[19,26,18,24],[24,25,19,21],[21,28,20,26],[26,32,25,30],[30,32,25,27],[27,33,26,31],[31,37,30,35],[35,38,31,33]];
  return '<figure class="lab-figure" aria-label="Minh họa xu hướng bằng nến giá giả lập"><figcaption>Đồ thị nến <small>12 phiên</small></figcaption><div class="candles" aria-hidden="true">'+rows.map(([o,h,l,c])=>'<i class="candle" style="--top:'+((40-h)*3)+'%;--wick:'+((h-l)*3)+'%;--body:'+((40-Math.max(o,c))*3)+'%;--height:'+Math.max(4,Math.abs(c-o)*3)+'%;--tone:'+(c>=o?'#93efd0':'#ffa8be')+'"></i>').join('')+'</div><div class="lab-key"><span>● Tăng &nbsp; ○ Giảm</span><span>Minh họa</span></div></figure>';
}
function deskHome(){
  const ch=chapterOf(state.lastChapter)||chapters[0], ids=Object.keys(topics), day=Array.from({length:10},(_,i)=>i+1).find(i=>!state.plan?.[i])||10;
  const cards=list=>list.map(c=>'<a class="panel course-card" href="'+route(c.id)+'"><span class="tile-icon '+palette[(Number(c.id)-1)%4]+'" aria-hidden="true">'+chapterIcons[Number(c.id)-1]+'</span><span><span class="eyebrow">'+groupLabel(c)+'</span><h3>'+esc(c.title)+'</h3><small class="muted">'+(c.topics.length?c.topics.length+' mục nhỏ · '+countDone(c.topics)+' đạt mốc':bankFor(c.id).length+' câu trong tài liệu')+'</small></span><b class="arrow" aria-hidden="true">›</b></a>').join('');
  const tile=(icon,color,title,sub,href)=>'<a class="study-tile" href="'+href+'"><b class="tile-icon '+color+'" aria-hidden="true">'+icon+'</b><span><strong>'+title+'</strong><small>'+sub+'</small></span></a>';
  main.innerHTML='<header class="desk-head"><div><p>BFF4029 · Bàn học cá nhân</p><h1>Chào Hậu, mình học nhé!</h1></div><span class="course-pill">UEL · Sakura Study</span></header><section class="welcome"><div><p class="eyebrow">Ngày '+day+' trong lộ trình 10 ngày</p><h2>Phân tích<br>chứng khoán</h2><p>Từ đọc một cây nến đến tự tay định giá. Chọn bài học hôm nay hoặc quay lại câu đang làm.</p><div class="actions">'+(state.quiz?link('Tiếp tục lượt làm →','#quiz',true):link('Vào học ngày '+day+' →','#plan/'+day,true))+link('Mở chương '+ch.id,route(ch.id))+'</div></div>'+candlesFigure()+'</section><div class="stats-row">'+tile('▤','lav','10 đề cuối kỳ','45 câu mỗi đề · 60 phút','#exams')+tile('✎','peach','Sổ tay của mình',Object.values(state.notes||{}).filter(s=>s.trim()).length+' mục đã ghi','#notes')+tile('◎','mint','Tiến độ học',countDone(ids)+' / '+ids.length+' mục đạt mốc',route(ch.id,'progress'))+'</div><section class="panel"><div class="section-head" style="margin-top:0"><h2>Lịch học 10 ngày</h2><small class="muted">3 giờ mỗi ngày</small></div><div class="day-strip">'+Array.from({length:10},(_,i)=>'<a class="'+(i+1===day?'today':'')+'" href="#plan/'+(i+1)+'" aria-label="Ngày '+(i+1)+'"><span>Ngày</span><b>'+(i+1)+(state.plan?.[i+1]?' ✓':'')+'</b></a>').join('')+'</div></section><div class="section-head"><h2>Bài giảng theo chương</h2><span class="muted small">11 chương lý thuyết</span></div><div class="cols">'+cards(chapters.slice(0,11))+'</div><div class="section-head"><h2>Đề gốc trong giáo trình</h2></div><div class="cols">'+cards(chapters.slice(11,14))+'</div><div class="actions">'+link('Mở mục lục và phụ lục','#source')+'</div>'+footer;
}
function pad(id){
  const t=topics[id],g=t.gap, n=state.notes?.[id]||'', gap=state.gaps?.[id]||{};
  return '<details class="notepad"'+(n||gap.value?' open':'')+'><summary>✎ &nbsp; Tự tóm tắt &amp; điền khuyết</summary><label for="note-'+id+'">Nếu phải giảng mục '+id+' cho một người bạn, Hậu sẽ nói gì?</label><textarea rows="3" id="note-'+id+'" data-note="'+id+'" placeholder="Mình giải thích thế này… Chỗ còn vướng là… Đổi ví dụ thì…">'+esc(n)+'</textarea><output id="saved-'+id+'">'+(n?'Đã lưu trên trình duyệt này.':'Ghi chú được lưu khi nhập.')+'</output><fieldset><legend>Điền khuyết từ trí nhớ</legend><p class="gaptext" id="gaptext-'+id+'">'+esc(g[0])+'<b>［…］</b>'+esc(g[2])+'</p><div class="gap-row"><input aria-label="Từ còn thiếu, mục '+id+'" aria-describedby="gaptext-'+id+'" data-gap="'+id+'" id="gap-'+id+'" value="'+esc(gap.value||'')+'" autocomplete="off">'+button('Kiểm tra','gap-check',id,true)+button('Xem đáp án','gap-show',id)+'</div><output aria-live="polite" id="gapout-'+id+'">'+esc(gap.message||'')+'</output></fieldset></details>';
}
function foldText(v){return v.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim();}
function updatePad(action,id){
  const v=document.getElementById('gap-'+id).value.trim(), solution=topics[id].gap[1];
  const ok=foldText(v)===foldText(solution);
  const msg=action==='gap-show'?'Đáp án gợi ý · '+solution:ok?'Chính xác! '+solution:!v?'Hậu nhập một từ hoặc cụm từ trước nhé.':'Chưa khớp từ khóa. Đọc lại câu và thử lần nữa.';
  state.gaps||={};state.gaps[id]={value:v,message:msg};save();document.getElementById('gapout-'+id).textContent=msg;
}
function notebook(selected){
  const valid=chapterOf(selected), list=valid?.topics.length?valid.topics:Object.keys(topics);
  main.innerHTML='<section class="hero"><p class="eyebrow">Góc tự học</p><h1>Sổ tay của mình</h1><p>Giảng lại bằng lời của Hậu, chỉ ra chỗ còn vướng rồi thử một ví dụ mới. Mở từng mục để ghi hoặc điền khuyết.</p></section><section class="panel"><label for="noteChapter">Chọn chương &nbsp;</label><select id="noteChapter"><option value="">Tất cả chương</option>'+chapters.slice(0,11).map(c=>'<option value="'+c.id+'"'+(c.id===selected?' selected':'')+'>Chương '+c.id+' · '+esc(c.title)+'</option>').join('')+'</select></section>'+list.map(id=>'<section class="topic"><p class="eyebrow">Mục '+id+'</p><h3>'+esc(topics[id].title)+'</h3>'+pad(id)+link('Đọc bài giảng',route(id.split('.')[0])+'/'+id)+'</section>').join('');
}
function examRoom(){
  main.innerHTML='<section class="hero"><p class="eyebrow">Phòng thi thử</p><h1>10 đề cuối kỳ</h1><p>45 câu mỗi đề · 60 phút · Thang điểm 10. Có thể đánh dấu câu phân vân và quay lại trước khi nộp.</p></section>'+resumeLink()+'<div class="exam-grid">'+examSets.map((set,i)=>{const score=state.examScores?.[i];const code=String(i+1).padStart(2,'0');return '<article class="exam-card"><span class="tile-icon '+palette[i%4]+'" aria-hidden="true">▤</span><h3>Đề số '+code+'</h3><p class="small">'+(score?'Lần gần nhất · '+numberVi.format(score.right/score.total*10)+'/10':'45 câu · 7 nhóm đề cương')+'</p>'+button(score?'Làm lại đề':'Vào phòng thi','exam',String(i),true)+'</article>';}).join('')+'</div><p class="muted small">Đề tự soạn để luyện. Thời gian 60 phút theo đề cương BFF4029. Số câu và phân bổ chủ đề do bộ học thiết kế.</p>';
}
function startExam(index){const set=examSets[index];if(!set)return;openList(set.map(id=>questions[id]),'Đề cuối kỳ tự soạn '+String(index+1).padStart(2,'0'),'#exams',null,60);activeQuiz.examIndex=index;checkpoint();}
main.addEventListener('input',e=>{
  if(e.target.dataset.note){const id=e.target.dataset.note;state.notes||={};state.notes[id]=e.target.value;save();document.getElementById('saved-'+id).textContent='Đã ghi trên trình duyệt này.';}
  if(e.target.dataset.gap){const id=e.target.dataset.gap;state.gaps||={};state.gaps[id]={value:e.target.value};document.getElementById('gapout-'+id).textContent='';save();}
});
main.addEventListener('change',e=>{if(e.target.id==='noteChapter')location.hash='notes/'+e.target.value;});
main.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.gap){e.preventDefault();updatePad('gap-check',e.target.dataset.gap);}});

