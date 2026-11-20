function questionFor(item){return item.generated||questions[item.id];}
function rawFor(q){return q.original||q;}
function originalBox(q){
  if(!q.original)return '';
  const raw=q.original;
  return '<details class="small-src"><summary>Đối chiếu nguyên văn trong giáo trình</summary><p>'+esc(raw.prompt)+'</p><ol type="A">'+raw.choices.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol></details>';
}
function remedialSource(q){return q.root?questions[q.root]:q;}
const computationalCases={
  market:(r)=>{const p=r.randint(15,75),n=r.randint(2,24);return ['Công ty có '+n+' triệu cổ phiếu lưu hành ở thị giá '+p+' nghìn đồng/cp. Vốn hóa là bao nhiêu?',n*p,'tỷ đồng',n+' × '+p];},
  pe:(r)=>{const eps=r.randint(2,8),k=r.randint(7,23);return ['Thị giá là '+(eps*k)+'.000 đồng/cp, EPS là '+eps+'.000 đồng. P/E bằng bao nhiêu?',k,'lần',(eps*k)+' / '+eps];},
  eps:(r)=>{const a=r.randint(22,90),d=r.randint(1,5),n=r.randint(3,15);return ['Lợi nhuận sau thuế '+a+' tỷ, cổ tức ưu đãi '+d+' tỷ và số cổ phiếu phổ thông bình quân '+n+' triệu. EPS cơ bản là bao nhiêu?',(a-d)*1000/n,'đồng/cp','('+a+' − '+d+') × 1.000 / '+n];},
  roe:(r)=>{const m=r.randint(3,13),v=r.randint(1,4),e=r.randint(12,25)/10;return ['Biên ròng '+m+'%, vòng quay tài sản '+v+' lần và hệ số nhân vốn chủ '+numberVi.format(e)+' lần. ROE theo DuPont là bao nhiêu?',m*v*e,'%',m+' × '+v+' × '+numberVi.format(e)];},
  macd:(r)=>{const s=r.randint(20,65),f=s+r.choice([-8,-6,-3,2,4,7]);return ['EMA nhanh bằng '+f+', EMA chậm bằng '+s+'. Tính giá trị đường MACD.',f-s,'điểm',f+' − '+s];},
  capm:(r)=>{const rf=r.randint(2,7),premium=r.randint(3,9),b=r.randint(4,18)/10;return ['Lãi suất phi rủi ro '+rf+'%, lợi suất thị trường kỳ vọng '+(rf+premium)+'%, beta '+numberVi.format(b)+'. Theo CAPM, lợi suất kỳ vọng là bao nhiêu?',rf+b*premium,'%',rf+' + '+numberVi.format(b)+' × ('+(rf+premium)+' − '+rf+')'];},
  fcf:(r)=>{const a=r.randint(45,125),b=r.randint(32,110);return ['Dòng tiền kinh doanh '+a+' tỷ, chi đầu tư tài sản cố định '+b+' tỷ. Theo FCF = CFO − Capex, dòng tiền tự do là bao nhiêu?',a-b,'tỷ đồng',a+' − '+b];},
  bod:(r)=>{const l=r.randint(15,45),v=r.randint(1,8),b=r.randint(1,7),u=r.randint(1,7),up=r.choice([true,false]);const o=l+v+(up?0:b),c=l+v+(up?b:0),h=l+v+b+u;return ['Một nến có giá mở '+o+', đóng '+c+', cao '+h+' và thấp '+l+'. Bóng dưới dài bao nhiêu?',v,'đơn vị','min('+o+', '+c+') − '+l];},
  upper:(r)=>{const l=r.randint(12,60),o=l+r.randint(1,6),c=o+r.randint(1,12),h=c+r.randint(1,9);return ['Một nến có O='+o+', H='+h+', L='+l+', C='+c+'. Bóng trên dài bao nhiêu?',h-c,'đơn vị',h+' − max('+o+', '+c+')'];},
  ratio:(r)=>{const debt=r.randint(4,19)*10,k=r.randint(6,27)/10;return ['Tài sản ngắn hạn '+numberVi.format(debt*k)+' tỷ, nợ ngắn hạn '+debt+' tỷ. Hệ số thanh toán hiện hành là bao nhiêu?',k,'lần',numberVi.format(debt*k)+' / '+debt];},
  margin:(r)=>{const v=r.randint(7,17)*10,d=r.randint(2,6)*10;return ['Vị thế hiện trị giá '+v+' triệu, dư nợ '+d+' triệu. Tỷ lệ ký quỹ hiện tại là bao nhiêu?',100*(v-d)/v,'%','('+v+' − '+d+') / '+v+' × 100'];},
  holding:(r)=>{const n=r.randint(1,6)*100,b=r.randint(12,33),s=b+r.choice([-4,2,5,7]),d=r.randint(1,4);return ['Mua '+n+' cổ phiếu ở '+b+' nghìn đồng, bán ở '+s+' nghìn và nhận cổ tức '+d+' nghìn/cp. Bỏ qua phí, tổng thu nhập là bao nhiêu?',n*(s+d-b),'nghìn đồng',n+' × ('+s+' + '+d+' − '+b+')'];},
  gross:(r)=>{const a=r.randint(110,260),b=r.randint(38,104);return ['Doanh thu thuần '+a+' tỷ và giá vốn '+b+' tỷ. Lợi nhuận gộp là bao nhiêu?',a-b,'tỷ đồng',a+' − '+b];},
  buy:(r)=>{const p=r.randint(12,55),n=r.randint(1,9)*100,fee=r.choice([.2,.3,.5]);return ['Mua '+n+' cổ phiếu giá '+p+'.000 đồng/cp. Phí mua '+numberVi.format(fee)+'% giá trị giao dịch. Tổng tiền thực chi là bao nhiêu?',n*p*(1+fee/100),'nghìn đồng',n+' × '+p+' × (1 + '+numberVi.format(fee)+'%)'];}
};
function microKind(q){
  const s=q.prompt.toLowerCase(),k=q.id;if(q.family)return null;
  if(k==='L3.1')return 'gross';
  if(k==='L7.3')return 'bod';
  if(k.startsWith('A7.3-'))return 'upper';
  if(k==='L3.3')return 'roe';
  if(k==='L3.5')return 'ratio';
  if(k==='L3.7')return 'pe';
  if(k==='L11.6')return 'capm';
  if(k==='L9.8'||k.startsWith('A9.8-'))return 'margin';
  if(k.startsWith('A6.4-'))return 'macd';
  if(k.startsWith('A1.4-'))return 'market';
  if(k.startsWith('A3.8-')||k.startsWith('A11.4-'))return 'fcf';
  if(['13-62','13-75'].includes(k))return 'holding';
  if(['13-3','13-73'].includes(k))return 'buy';
  if(/eps.{0,18}(là|bằng|bao nhiêu)/i.test(s)&&/\d/.test(s))return 'eps';
  return null;
}
function microQuestion(q,type){
  const [prompt,n,unit,formula]=computationalCases[type](caseRandom);
  const m=field('Kết quả',n,unit,formula,-n,Math.abs(n)*.5,n*2);
  return {prompt,choices:m.alternatives.map(x=>m.text(x)),answer:0,note:formula+' = '+m.text()+'.',topics:q.topics,title:topics[q.topics[0]].title};
}
function anchorEvidence(q){
  // Resolve compound answers against the displayed source list. Preserve associated chart when present.
  return 'Bài cần xét: '+q.prompt;
}
const verdicts=['Cả I và II đúng','Chỉ I đúng','Chỉ II đúng','Cả I và II sai'];
function conceptualVariant(root,wrong,step){
  const focus=root.topics[step%root.topics.length],t=topics[focus],source=root;
  const stem=source.prompt.toLowerCase(),words=new Set(stem.match(/[\p{L}\d]{4,}/gu)||[]);
  const nearby=allQuestions.filter(q=>q.id!==root.id&&!q.examOnly&&!q.drill&&adaptive(q)&&q.topics.includes(focus)&&!q.original&&!q.images?.length&&!/[abcd] (&|và|hoặc) [abcd]/i.test(q.choices.join(' ')));
  const overlap=q=>(q.prompt.toLowerCase().match(/[\p{L}\d]{4,}/gu)||[]).reduce((n,x)=>n+Number(words.has(x)),0);
  const pool=shuffle(nearby).sort((a,b)=>overlap(b)-overlap(a));
  const strong=pool.filter(q=>overlap(q)>=2).slice(0,8);
  const other=strong.length?caseRandom.choice(strong):null;
  const a=step%3===0?false:caseRandom.choice([true,false]),b=caseRandom.choice([true,false]);
  const inverse=step===3||step===4, choose=(x,yes)=>yes?x.answer:caseRandom.choice(x.choices.map((_,i)=>i).filter(i=>i!==x.answer));
  const rejected=Number.isInteger(wrong)&&wrong!==root.answer?wrong:choose(root,false);
  const first=a?root.answer:step===0?rejected:choose(root,false);
  let intro, second,note2;
  if(other&&step%2===1){
    intro=anchorEvidence(source)+'\n\nBài đối chiếu: '+other.prompt;
    second='Với bài đối chiếu, chọn “'+other.choices[choose(other,b)]+'”.';
    note2='Bài đối chiếu có đáp án “'+other.choices[other.answer]+'”. '+(other.note||'');
  }else{
    intro=anchorEvidence(source);
    second=t.facts[b?0:1];
    note2=t.facts[0];
  }
  const firstLine='Với bài cần xét, chọn “'+source.choices[first]+'”.';
  const swap=caseRandom.choice([false,true]),u=swap?b:a,v=swap?a:b;
  const prompts=['Kiểm tra lại kết luận và nguyên tắc áp dụng.','Đối chiếu hai kết luận dưới đây.','Kiểm tra từng bước suy luận.','Nhận diện lỗi trong lời giải của nhóm.','Rà lại các kết luận trước khi nộp bài.'];
  const prompt=intro+'\n\n'+prompts[step]+'\nI. '+(swap?second:firstLine)+'\nII. '+(swap?firstLine:second)+'\n'+(inverse?'Nhận định nào sai?':'Nhận định nào đúng?');
  const yes=inverse?!u:u,no=inverse?!v:v;
  return {prompt,choices:inverse?['Cả I và II sai','Chỉ I sai','Chỉ II sai','Cả I và II đúng']:verdicts.slice(),answer:(yes?0:2)+(no?0:1),note:'Bài cần xét có đáp án “'+source.choices[source.answer]+'”. '+(source.note||'')+'\n'+note2,topics:root.topics,images:source.images||[],title:t.title};
}
function groupAudit(root, step){
  const picks=shuffle(root.choices.map((_,i)=>i));
  const counts=picks.map(()=>caseRandom.randint(2,19));
  const right=counts[picks.indexOf(root.answer)], total=counts.reduce((a,b)=>a+b,0);
  const which=step%2===0;
  const measure=which?right:total-right;
  const tally=picks.map((k,i)=>'• '+counts[i]+' bạn chọn “'+root.choices[k]+'”.').join('\n');
  const prompt=root.prompt+'\n\nMột nhóm học thử giải đúng tình huống trên. Kết quả chọn phương án:\n'+tally+'\nCó bao nhiêu bạn '+(which?'đã trả lời đúng':'cần sửa lại lời giải')+'?';
  const numbers=[measure,...new Set([which?total-right:right,total,...counts,measure+1].filter(n=>n!==measure))].slice(0,4);
  return {prompt,choices:numbers.map(n=>n+' bạn'),answer:0,topics:root.topics,images:root.images||[],title:topics[root.topics[0]].title,note:'Phương án đúng là “'+root.choices[root.answer]+'”. Có '+right+' trong '+total+' bạn chọn đúng, '+(total-right)+' bạn chọn sai. '+(root.note||'')};
}

function makeFive(item,wrong,quiz){
  const parent=questionFor(item),root=remedialSource(parent), family=root.family, kind=microKind(root);
  const seen=new Set([root.prompt,...quiz.items.filter(it=>it.generated?.root===root.id).map(it=>it.generated.prompt)]);
  quiz.serial=quiz.serial||0;
  const batch=++quiz.serial;
  return Array.from({length:5},(_,step)=>{
    let q;
    for(let tries=0;tries<50;tries++){
      q=Number.isInteger(root.chartKind)?newChart(root.chartKind):family?liveCase(family,root.level||3,step):kind?microQuestion(root,kind):conceptualVariant(root,parent.root?null:wrong,step);
      if(!seen.has(q.prompt)&&q.choices.length===4&&new Set(q.choices).size===4)break;
    }
    while(seen.has(q.prompt)||q.choices.length!==4||new Set(q.choices).size!==4){ q=Number.isInteger(root.chartKind)?newChart(root.chartKind):family?liveCase(family,root.level||3,step):kind?microQuestion(root,kind):groupAudit(root,step); }
    seen.add(q.prompt);
    q={...q,id:'R'+quiz.token+'-'+batch+'-'+step,root:root.id,repair:true,historical:!!root.historical};
    return {...quizItem(q,item.focus||root.topics[0]),generated:q,batch,slot:step+1};
  });
}
function startPostReview(){
  if(!activeQuiz?.postReview?.length)return;
  const items=activeQuiz.postReview,back=activeQuiz.back;
  openQuiz(items,'Luyện bù sau khi nộp đề',back);
}

