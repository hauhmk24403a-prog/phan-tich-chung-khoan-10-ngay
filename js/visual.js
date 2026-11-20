function chartPanel(c) {
  if (!['5','6','7','8','9'].includes(c.id)) return '';
  return '<section class="panel"><p class="eyebrow">Thực hành dữ liệu</p><h2>Đọc đồ thị bằng tay</h2><label for="chartMode">Kịch bản</label> <select id="chartMode" class="jump">' +
    '<option value="up">Xu hướng tăng</option><option value="down">Xu hướng giảm</option><option value="range">Tích lũy và phá vỡ</option></select> ' +
    '<label><input type="checkbox" id="chartMA" checked> SMA 5</label><canvas class="plot" id="pricePlot" width="880" height="360" aria-label="Đồ thị tượng trưng gồm 16 cây nến, đường SMA 5 và khối lượng"></canvas>' +
    '<label for="chartBar">Chọn phiên</label> <input type="range" id="chartBar" min="1" max="16" value="16"><output id="chartReadout" class="plot-readout"></output>' +
    '<p class="small muted">Di chuyển thanh để đọc OHLC, thân và bóng của từng nến. Thử che đường SMA rồi xác định hướng giá trước. Dữ liệu giả lập phục vụ bài học.</p></section>';
}
function drawChart() {
  const canvas = document.getElementById('pricePlot');
  if (!canvas) return;
  const g = canvas.getContext('2d');
  if (!g) return;
  const mode = document.getElementById('chartMode').value;
  const selected = Number(document.getElementById('chartBar').value) - 1;
  const showMA = document.getElementById('chartMA').checked;
  const sequences = {
    up:[92,95,98,96,101,103,100,102,105,109,106,110,112,110,114,118],
    down:[118,115,116,112,110,107,111,105,102,99,101,98,95,99,94,91],
    range:[98,101,104,100,98,102,104,101,99,100,103,102,104,107,112,110]
  };
  const rows = sequences[mode].map((close,i,array) => {
    const open = i ? array[i-1] + i%3-1 : close-2;
    return {open,close,high:Math.max(open,close)+1+(i%3),low:Math.min(open,close)-1-(i%2),vol:28+(i*17)%45+(mode==='range' && i>12 ? 34 : 0)};
  });
  const x = i => 68+i*49;
  const min = Math.min(...rows.map(d=>d.low))-2;
  const max = Math.max(...rows.map(d=>d.high))+2;
  const y = price => 18 + (max-price)/(max-min)*239;
  g.clearRect(0,0,880,360);
  g.fillStyle = '#fbfcf7';
  g.fillRect(0,0,880,360);
  g.fillStyle = '#e7f2e9';
  g.fillRect(x(selected)-24,9,48,320);
  g.font = '14px Segoe UI, sans-serif';
  for (let i=0;i<5;i++) {
    const price = min + i*(max-min)/4, level = y(price);
    g.strokeStyle = '#d6e0db';
    g.beginPath();g.moveTo(49,level);g.lineTo(852,level);g.stroke();
    g.fillStyle = '#4c625c'; g.fillText(price.toFixed(0),14,level+5);
  }
  rows.forEach((d,i) => {
    const center = x(i);
    g.fillStyle = g.strokeStyle = d.close >= d.open ? '#167960' : '#bf4949';
    g.beginPath();g.moveTo(center,y(d.high));g.lineTo(center,y(d.low));g.stroke();
    g.fillRect(center-9,Math.min(y(d.open),y(d.close)),18,Math.max(2,Math.abs(y(d.open)-y(d.close))));
    g.globalAlpha=.35;g.fillRect(center-9,330-d.vol*.52,18,d.vol*.52);g.globalAlpha=1;
    g.fillStyle='#4c625c';g.fillText(String(i+1),center-5,351);
  });
  if(showMA) {
    g.strokeStyle='#976614';g.lineWidth=2.6;g.beginPath();
    for(let i=4;i<rows.length;i++) {
      const avg=rows.slice(i-4,i+1).reduce((sum,d)=>sum+d.close,0)/5;
      if(i===4) g.moveTo(x(i),y(avg));
      else g.lineTo(x(i),y(avg));
    }
    g.stroke();g.lineWidth=1;
  }
  const d=rows[selected];
  document.getElementById('chartReadout').textContent='Phiên ' + (selected+1) + ' · O ' + d.open + ' · H ' + d.high + ' · L ' + d.low + ' · C ' + d.close +
    ' · Thân ' + Math.abs(d.close-d.open) + ' · Bóng trên ' + (d.high-Math.max(d.open,d.close)) + ' · Bóng dưới ' + (Math.min(d.open,d.close)-d.low);
}
