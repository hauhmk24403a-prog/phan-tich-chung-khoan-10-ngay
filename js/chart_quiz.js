function quizPlot(q){
  if(!q.chart)return '';
  const rows=q.chart, low=Math.min(...rows.map(r=>r[2]))-1,high=Math.max(...rows.map(r=>r[1]))+1,span=high-low;
  return '<figure class="exam-plot"><figcaption><b>Đồ thị nến · 6 phiên</b><small>Đơn vị điểm · dữ liệu bài tập</small></figcaption><div class="plot-area"><div class="y-axis"><span>'+high+'</span><span>'+((high+low)/2)+'</span><span>'+low+'</span></div><div class="candles" role="img" aria-label="Đồ thị sáu phiên, bảng số liệu bên dưới">'+rows.map(([o,h,l,c],i)=>'<i title="Phiên '+(i+1)+': O '+o+', H '+h+', L '+l+', C '+c+'" class="candle" style="--top:'+(100*(high-h)/span)+'%;--wick:'+(100*(h-l)/span)+'%;--body:'+(100*(high-Math.max(o,c))/span)+'%;--height:'+Math.max(1.8,100*Math.abs(c-o)/span)+'%;--tone:'+(c>=o?'#84e0c4':'#ffa5bb')+'"></i>').join('')+'</div></div><div class="plot-ticks">'+rows.map((_,i)=>'<span>P'+(i+1)+'</span>').join('')+'</div><details><summary>Bảng giá mở, cao, thấp, đóng</summary><div class="table-scroll"><table><thead><tr><th>Phiên</th><th>Mở</th><th>Cao</th><th>Thấp</th><th>Đóng</th></tr></thead><tbody>'+rows.map((v,i)=>'<tr><th>'+(i+1)+'</th>'+v.map(n=>'<td>'+n+'</td>').join('')+'</tr>').join('')+'</tbody></table></div></details></figure>';
}
function newChart(kind){
  const r=caseRandom;let last=r.randint(24,96);
  const rows=Array.from({length:6},()=>{const o=last+r.randint(-2,2),c=o+r.choice([-4,-3,-1,1,2,3,5]),h=Math.max(o,c)+r.randint(1,5),l=Math.min(o,c)-r.randint(1,5);last=c;return [o,h,l,c];});
  const [o,h,l,c]=rows[5],p=rows[4][3];
  const aims=['Độ dài thân nến cuối','Độ dài bóng trên cuối','Độ dài bóng dưới cuối','SMA(3) cuối chuỗi','Thay đổi giá đóng từ phiên 5 đến phiên 6'];
  const calc=[Math.abs(c-o),h-Math.max(o,c),Math.min(o,c)-l,(rows[3][3]+p+c)/3,c-p][kind];
  const m=field(aims[kind],calc,'điểm',['|'+c+' − '+o+'|',h+' − max('+o+', '+c+')','min('+o+', '+c+') − '+l,'('+rows[3][3]+' + '+p+' + '+c+') / 3',c+' − '+p][kind],h-l,p-c,calc+2);
  return {prompt:'Chuỗi đóng cửa là '+rows.map(x=>x[3]).join(' → ')+' điểm. '+aims[kind]+' bằng bao nhiêu? Dùng đồ thị hoặc bảng OHLC dưới đây.',choices:m.alternatives.map(x=>m.text(x)),answer:0,note:m.formula+' = '+m.text()+'.',chart:rows,chartKind:kind,topics:[kind<3?'7.3':kind===3?'6.4':'5.8'],title:aims[kind]};
}
function mixedChapter(id){
  const ch=chapterOf(id);if(!ch)return;
  const list=[],seen=new Set();
  const eligible=shuffle(rankedFor(id)).filter(q=>q.family);
  for(const root of eligible){
    if(seen.has(root.family))continue;
    seen.add(root.family);
    const sample=liveCase(root.family,root.level,list.length);
    Object.assign(sample,{id:'V'+Date.now().toString(36)+'-'+list.length,root:root.id,variant:true});
    list.push({...quizItem(sample,root.topics[0]),generated:sample});
    if(list.length===6)break;
  }
  for(const root of shuffle(nativeForTopics(ch.topics)).slice(0,3)){
    const sample=conceptualVariant(root,null,list.length%5);
    Object.assign(sample,{id:'V'+Date.now().toString(36)+'-'+list.length,root:root.id,variant:true});
    list.push({...quizItem(sample,root.topics[0]),generated:sample});
  }
  openQuiz(shuffle(list),'Bài phối hợp mới · Chương '+id,route(id,ch.topics.length?'practice':'levels'));
}

