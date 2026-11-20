const levels=['Nhận biết','Thông hiểu','Vận dụng','Vận dụng cao','Vận dụng siêu cao','Thành thạo','Cực thành thạo','Bậc cao','Bậc thầy'];
const drills=allQuestions.filter(q=>q.drill);
function rankedFor(id,lv) { return drills.filter(q=>q.chapter===id && (!lv || q.level===lv)); }
function solved(q) {
  const p=state.questions[q.id];
  return !!p?.tries && !p.wrong && !p.uncertain;
}
function levelsPanel(c) {
  const all=rankedFor(c.id);
  if(!all.length) return '';
  const ready=all.filter(solved).length;
  const priority=['1','2','3','5','6','7','8','9','11'].includes(c.id);
  return '<section class="panel"><p class="eyebrow">Luyện tập theo mức độ</p><h2>216 câu luyện thêm · 9 bậc</h2><p>Đã trả lời đúng và chắc '+ready+'/'+all.length+' câu. '+(priority?'Ưu tiên trong lộ trình 30 giờ. ':'')+
   'Làm một lượt ngắn trước, rồi mở lại các câu sai hoặc còn phân vân.</p><div class="rank-grid">'+levels.map((title,i)=>{
    const n=i+1, list=rankedFor(c.id,n), correct=list.filter(solved).length;
    return '<article class="rank-card"><p class="eyebrow">Bậc '+n+'</p><h3>'+esc(title)+'</h3><progress value="'+correct+'" max="'+list.length+'" aria-label="'+esc(title)+'"></progress><div class="small muted">'+correct+'/'+list.length+' câu đúng và chắc</div><div class="actions">'+button('Luyện 8 câu','start-rank',c.id+'-'+n,true)+button('Cả bậc','full-rank',c.id+'-'+n)+'</div></article>';
   }).join('')+'</div><div class="actions">'+(all.some(q=>problem(q.id))?button('Ôn câu sai hoặc chưa chắc','rank-mistakes',c.id):'')+button('Sinh bài phối hợp mới','mix-new',c.id)+link('Xem toàn bộ chương',route(c.id))+'</div></section>';
}
function startRank(value,full,onlyMissed=false) {
  const [id,lvl]=value.split('-');
  const back=route(id,'levels');
  const pool=rankedFor(id,Number(lvl));
  const list=shuffle(onlyMissed?pool.filter(q=>problem(q.id)):pool);
  list.sort((a,b)=>{
    const weight=q=>problem(q.id)?0:state.questions[q.id]?.tries?2:1;
    return weight(a)-weight(b);
  });
  const selection=full?list:list.slice(0,8);
  openList(selection,'Chương '+id+' · '+(lvl?levels[Number(lvl)-1]:'Ôn câu sai và chưa chắc'),back);
}
function balancedMock() {
  const quotas={'1':6,'2':4,'3':7,'4':2,'5':3,'6':5,'7':4,'8':4,'9':6,'10':3,'11':1};
  return shuffle(Object.entries(quotas).flatMap(([id,n])=>{
    const easy=shuffle(rankedFor(id,2)).slice(0,Math.max(1,Math.floor(n/3)));
    const hard=shuffle(rankedFor(id).filter(q=>q.level>=4&&q.level<=9)).slice(0,n-easy.length);
    return [...easy,...hard];
  }));
}
