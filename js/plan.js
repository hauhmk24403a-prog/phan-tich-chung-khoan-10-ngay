const days = [
  ['Nền thị trường và giao dịch',[1,9],'Tách sơ cấp/thứ cấp, phân loại chứng khoán và làm đúng bài khớp lệnh, giá trần/sàn.','90 phút học Ch. 1 và 9. 45 phút làm lại sổ lệnh, cổ tức và margin. 30 phút trắc nghiệm. 15 phút ghi câu sai.','Ai nhận tiền ở sơ cấp và thứ cấp? Giải thích bằng một IPO và một giao dịch bán lại.'],
  ['Vĩ mô và đầu tư',[2],'Đọc được PMI tăng/giảm quanh 50, GDP, CPI, tỷ giá và tác động có điều kiện của lãi suất.','25 phút tự nhớ bài ngày 1. 75 phút học Ch. 2. 60 phút luyện bài vĩ mô và câu gốc. 20 phút dạy lại và ghi lỗi.','PMI từ 45 lên 48. Vì sao cải thiện của chỉ số vẫn có thể đi cùng thu hẹp?'],
  ['Báo cáo tài chính và định giá',[3],'Tự tính biên, ROA, ROE, DuPont, vòng quay, EPS và P/E. Phân biệt lợi nhuận với tiền.','20 phút ôn ngày 1–2. 75 phút học Ch. 3. 65 phút tính lại các tỷ số không nhìn công thức. 20 phút sửa bài.','ROE tăng nhưng CFO giảm. Nêu hai kiểm tra giúp hiểu nguyên nhân.'],
  ['Chiến lược và đồ thị nền',[4,5],'So Buffett, Graham, CANSLIM. Vẽ đúng xu hướng, hỗ trợ, kháng cự và đọc vai trò khối lượng.','25 phút ôn DuPont và tỷ giá. 75 phút học Ch. 4–5. 60 phút làm câu gốc và vẽ đồ thị. 20 phút tự giải thích bẫy.','Một lần giá xuyên kháng cự trong phiên đã đủ kết luận phá vỡ chưa? Nêu dữ kiện cần thêm.'],
  ['Chỉ báo kỹ thuật',[6],'Tách hướng, độ mạnh, xung lượng và biến động. Đọc MACD, ADX, RSI, Bollinger Bands và Fibonacci.','25 phút ôn Ch. 2–5. 70 phút học Ch. 6. 65 phút luyện phân kỳ, ADX và MACD. 20 phút dạy lại.','ADX 35 và tăng. Bạn biết được gì và còn cần dữ liệu gì để biết hướng?'],
  ['Nến Nhật và mẫu hình giá',[7,8],'Nhìn OHLC, phân biệt hammer/hanging man, nhận ra neckline và tính mục tiêu đo.','20 phút ôn ngày 5. 70 phút học Ch. 7–8 và chạy mô phỏng nến. 70 phút làm câu hình. 20 phút chữa.','Một hammer gần đáy thứ hai xuất hiện. Còn thiếu gì để xác nhận mô hình hai đáy?'],
  ['Kỹ thuật mở rộng và tổng ôn',[10,11],'Ôn gap, OBV, TRIN, Elliott, EMH, CAPM và rủi ro theo nhóm câu.','30 phút ôn ngày 3 và 5. 75 phút học Ch. 10–11. 55 phút luyện trộn có đồ thị. 20 phút lập bảng lỗi.','Chỉ rõ một rủi ro có thể giảm nhờ đa dạng hóa và một rủi ro vẫn còn.'],
  ['Thi thử đề 2022–2023',[12],'Làm đủ 45 câu trong 75 phút. Đọc câu tiếng Anh theo động từ và từ phủ định trước khi nhìn đáp án.','15 phút khởi động. 75 phút thi thử. 65 phút phân loại lỗi và làm lại. 25 phút chữa công thức.','Chọn ba câu sai. Với mỗi câu, nói đáp án đúng vì sao và phương án nhiễu hấp dẫn ở đâu.'],
  ['Bài làm thử và ngân hàng PTKT',[13,14],'Rà các bẫy số liệu, quy định cũ và diễn giải đồ thị. Ưu tiên câu sai hoặc đúng mà chưa chắc.','30 phút tự nhớ công thức. 60 phút luyện chọn lọc bộ 100 câu. 60 phút luyện đồ thị và chỉ báo. 30 phút chữa lỗi.','Từ một biểu đồ, nêu xu hướng, tín hiệu xác nhận và điều kiện khiến kết luận mất hiệu lực.'],
  ['Tổng duyệt và vá lỗ hổng',[11,12,14],'Làm đề trộn 45 câu. Nhắm đúng hết câu tính điểm và giải thích được các câu từng đoán.','20 phút khởi động. 60 phút làm đề theo đề cương. 75 phút vá lỗi. 25 phút nói lại công thức, bẫy và chiến thuật phân bổ giờ.','Nêu ba lỗi bạn dễ mắc nhất và câu tự nhắc dùng để chặn từng lỗi.']
];
function planView(number) {
  const n = Math.max(1,Math.min(days.length,Number(number)||1));
  const [title, ids, goal, schedule, drill] = days[n-1];
  const completions = state.plan || {};
  const finished = Object.values(completions).filter(Boolean).length;
  main.innerHTML = '<section class="hero"><p class="eyebrow">30 giờ ôn tập</p><h1>Lộ trình 10 ngày</h1><p>Mục tiêu 10 điểm · Chữa cả câu sai và câu đúng do đoán. Dùng kết quả đề gốc 75 phút và mô phỏng đề cương 60 phút làm hai mốc tự kiểm.</p><progress value="' +
    finished + '" max="10" aria-label="Tiến độ lộ trình"></progress><div class="counter">' + finished + '/10 ngày hoàn thành</div></section>' +
    '<nav class="day-nav" aria-label="Các ngày học">' + days.map((_,i) => '<a href="#plan/' + (i+1) + '"' + tabIs(i+1,n) + '><span>Ngày</span><strong>' +
    (i+1) + (completions[i+1] ? ' ✓' : '') + '</strong></a>').join('') + '</nav><section class="panel"><p class="eyebrow">Ngày ' + n + '</p><h2>' + esc(title) +
    '</h2><p><strong>Mục tiêu</strong> · ' + esc(goal) + '</p><p>' + esc(schedule) + '</p><div class="actions">' +
    ids.map(id => link('Chương ' + id,route(String(id))) + link('Luyện 9 bậc · Ch. '+id,route(String(id),'levels'))).join('') +
    (n === 8 ? button('Bắt đầu đề 75 phút','start','mock-12',true) : '') +
    (n === 10 ? button('Mô phỏng đề cương 60 phút','start','outline-0',true) + button('Đề trộn 75 phút','start','mixed-0') : '') + '</div>' +
    '<h3>Tự giảng lại</h3><p>' + esc(drill) + '</p><div class="actions">' + link('Viết vào sổ tay','#notes/' + ids[0]) +
    button(completions[n] ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã học xong', 'day-done',n,true) + '</div></section>' +
    '<section class="panel"><h2>Thói quen để bớt mất điểm</h2><div class="cols"><div><h3>Nhớ trước, xem sau</h3><p>Đóng phần bài giảng và nói công thức, ý nghĩa, một ví dụ. Mở lại để sửa đúng chỗ vấp. Ôn lỗi vào hôm sau và trộn với câu cũ sau vài ngày.</p></div>' +
    '<div><h3>Khoanh đúng do đoán vẫn phải học lại</h3><p>Đánh dấu “Mình chưa chắc” trước khi chọn. Nếu sai khi rất chắc, ghi ngay một câu “Nếu thấy dấu hiệu này, mình sẽ kiểm tra lại điều kia”.</p></div>' +
    '<div><h3>Hai vòng khi mô phỏng đề</h3><p>Với 60 phút, chia khoảng 40 phút câu chắc, 15 phút quay lại câu đánh dấu, 5 phút rà lỗi. Với đề 75 phút, dùng 50–20–5. Nếu đứng hình, đánh dấu rồi đổi câu.</p></div>' +
    '<div><h3>Rà từ khóa trước khi nộp</h3><p>Nhìn lại KHÔNG, NGOẠI TRỪ, đúng/sai, tỷ lệ hay điểm phần trăm, mẫu số bình quân, quy ước bước giá, xu hướng trước nến và điểm phá neckline.</p></div></div></section>' +
    '<footer>Tham khảo phương pháp <a href="https://github.com/THU-MAIC/OpenMAIC/blob/main/skills/agent-runtime/feynman-learning/SKILL.md">OpenMAIC</a> và <a href="https://github.com/Stefan0219/study-with-feynman">Study with Feynman</a>.</footer>';
}
