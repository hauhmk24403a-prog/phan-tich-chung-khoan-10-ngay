const fraction=(a,b=1)=>a/b;
const sumNumbers=a=>a.reduce((x,y)=>x+Number(y),0);
const rangeOf=n=>Array.from({length:n},(_,i)=>i);
function roundEven(x){const f=Math.floor(x);return x-f===0.5 ? f+(f%2) : Math.round(x);}
const caseRandom={
  randint:(a,b)=>Math.floor(Math.random()*(b-a+1))+a,
  choice:a=>a[Math.floor(Math.random()*a.length)],
  randrange:(a,b,step)=>a+step*Math.floor(Math.random()*Math.ceil((b-a)/step))
};
const numberVi=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2});
function field(label,value,unit,formula,...traps){
  const text=(x=value)=>numberVi.format(Math.abs(x)<.005?0:x)+(unit?' '+unit:'');
  const offsets=[Math.max(.1,Math.abs(value)/10),Math.max(.2,Math.abs(value)/5),1,-1,2];
  const alternatives=[];
  for(const v of [value,...traps,...offsets.map(x=>value+x)]){
    if(Number.isFinite(v)&&!alternatives.some(w=>text(w)===text(v))) alternatives.push(v);
  }
  return {label,value,unit,formula,text,alternatives:alternatives.slice(0,4)};
}
function buildCase(topic,title,story,termQuestion,term,wrongTerms,reason,mistake,fields,question,verdict,wrongVerdicts){
  return {topic,title,story,termQuestion,term,wrongTerms,reason,mistake,fields,question,verdict,wrongVerdicts};
}
function shortCase(topic,title,story,term,wrong,reason,mistake,metrics,verdict,wrongVerdicts,question='Kết luận nào phù hợp với dữ kiện?'){
  return buildCase(topic,title,story,'Nguyên tắc nào áp dụng đúng cho tình huống này?',term,wrong,reason,mistake,metrics.map(m=>field(...m)),question,verdict,wrongVerdicts);
}
function liveCase(family,level,index){
  const c=caseFactories[family](caseRandom);
  const fs=c.fields, values=fs.map(m=>m.value);
  let prompt=c.story, choices, note=c.reason;
  const work=fs.map(m=>m.label+' = '+m.formula+' = '+m.text()+'.').join('\n');
  function ask(s){prompt+='\n\n'+s;}
  const packed=(fields,vs)=>fields.map((m,j)=>m.label+' = '+m.text(vs[j])).join(' · ');
  if(level===1){ask(c.termQuestion);choices=[c.term,...c.wrongTerms];}
  else if(level===2){ask('Lập luận nào đúng khi giải tình huống?');choices=[c.reason,c.mistake,...c.wrongVerdicts.slice(0,2)];}
  else if(level===3||level===4){const m=fs[level-3];ask(m.label+' bằng bao nhiêu?');choices=m.alternatives.map(n=>m.text(n));note=m.formula+' = '+m.text()+'. '+c.reason;}
  else if(level===5||level===7){
    const fields=level===5?fs.slice(1):fs, vs=fields.map(m=>m.value);
    ask('Tính '+fields.map(m=>m.label.toLocaleLowerCase('vi')).join(', ')+'. Bộ kết quả nào đúng?');
    choices=[packed(fields,vs)];
    for(let j=0;j<3;j++){
      const alt=vs.slice();
      const indices=fields.length===3?[j,(j+1)%3]:j===2?[0,1]:[j];
      for(const k of indices)alt[k]=fields[k].alternatives[1+(index+j+k)%3];
      choices.push(packed(fields,alt));
    }
    note=work;
  }else if(level===6){ask(c.question);choices=[c.verdict,...c.wrongVerdicts];note=c.verdict+'.\n'+work+'\n'+c.reason;}
  else if(level===8){
    const k=caseRandom.randint(0,2); const alt=values.slice();alt[k]=fs[k].alternatives[1+index%3];
    ask('Kiểm tra ba dòng dưới đây. Dòng nào có kết quả sai?\n'+fs.map((m,i)=>(i+1)+'. '+m.label+' = '+m.text(alt[i])).join('\n'));
    choices=['Dòng '+(k+1),...fs.flatMap((_,j)=>j===k?[]:['Dòng '+(j+1)]),'Cả ba dòng đều đúng'];note=work;
  }else{
    const other=caseFactories[family](caseRandom), a=fs[2],b=other.fields[2];
    prompt='Hồ sơ A. '+c.story+'\nHồ sơ B. '+other.story;
    ask('So sánh '+a.label.toLowerCase()+' của hai hồ sơ. Chọn cặp giá trị đúng.');
    const pair=(u,v)=>'A = '+a.text(u)+' · B = '+b.text(v);
    choices=[pair(a.value,b.value),pair(a.alternatives[1],b.value),pair(a.value,b.alternatives[1]),pair(a.alternatives[1],b.alternatives[1])];note='A: '+a.formula+' = '+a.text()+'.\nB: '+b.formula+' = '+b.text()+'.';
  }
  return {prompt,choices,answer:0,note,topics:[c.topic],title:c.title,level,family};
}
