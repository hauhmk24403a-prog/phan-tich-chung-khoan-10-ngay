function syllabusView(){
  const cross=[
    ['1. Mô hình hoạt động TTCK',[1,11],'Chủ thể, nguyên tắc, phân loại và luồng vốn.'],
    ['2. Hàng hóa cơ bản',[1,9,12],'So cổ phiếu, trái phiếu và phái sinh. Ôn coupon, lợi suất, quyền và nghĩa vụ.'],
    ['3. Phát hành chứng khoán',[1,13],'Sơ cấp, phân loại phát hành, vai trò và hình thức bảo lãnh, tiền huy động ròng.'],
    ['4. Giao dịch thứ cấp',[1,9,13],'Sở giao dịch, OTC, khớp định kỳ, liên tục, lệnh, quyền và ký quỹ.'],
    ['5. Chứng khoán phái sinh',[1,12],'Phân biệt công cụ, mục đích sử dụng và tính khoản thanh toán.'],
    ['6. Phân tích cơ bản',[2,3,4,11],'Top-down, bottom-up, ngành, BCTC, chỉ số, định giá và đối chiếu doanh nghiệp.'],
    ['7. Phân tích kỹ thuật',[5,6,7,8,10,14],'Dow, Fibonacci, Elliott, đồ thị, nến, khối lượng, mẫu hình và chỉ báo.']
  ];
  main.innerHTML='<section class="hero"><p class="eyebrow">BFF4029 · Đề cương năm 2023</p><h1>Phạm vi ôn theo đề cương</h1><p>Đề cương có 7 nhóm. Giáo trình chia thành 14 chương. Dùng bảng dưới để tìm đúng bài và bộ luyện.</p></section>'+
    '<section class="panel"><h2>Hình thức đánh giá trong đề cương đã gửi</h2><p>Quá trình 30% gồm nhiệm vụ cá nhân 10% và thuyết trình 20%. Giữa kỳ 20% và cuối kỳ 50%, đều ghi trắc nghiệm 60 phút. Đề gốc 2022–2023 đi kèm giáo trình dùng 75 phút.</p>'+
    '<div class="actions">'+button('Thi mô phỏng 60 phút','start','outline-0',true)+button('Thi thử đề gốc 75 phút','start','mock-12')+'</div></section>'+
    '<section class="panel"><h2>Đối chiếu 7 nhóm nội dung</h2><div class="table-scroll"><table><thead><tr><th>Nhóm trong đề cương</th><th>Trọng tâm</th><th>Chương giáo trình</th></tr></thead><tbody>'+
    cross.map(([name,chapters,note])=>'<tr><th>'+esc(name)+'</th><td>'+esc(note)+'</td><td>'+chapters.map(id=>link('Ch. '+id,route(id))).join(' ')+'</td></tr>').join('')+
    '</tbody></table></div></section>'+extraLessons()+
    '<footer>Nguồn đối chiếu · BFF4029_ĐCCT_Phân tích chứng khoán_2023_404.doc.</footer>';
}
function extraLessons(){
  return '<section class="panel"><h2>Ôn bổ sung các mục dễ sót</h2>'+
    '<h3>Phát hành và bảo lãnh</h3><p>Phân loại theo người mua, thời điểm và cấu trúc chào bán. Chào bán lần đầu ra công chúng (IPO) khác đợt chào bán tiếp theo. Đợt hỗn hợp có thể vừa phát hành mới vừa bán lại cổ phiếu cũ. Cần tách người nhận tiền, chi phí phát hành và tiền thu ròng.</p>'+
    '<p>Khung quy trình để nhớ: quyết định và chuẩn bị hồ sơ, công bố/chào bán theo cơ chế áp dụng, phân phối, thanh toán và báo cáo kết quả. Bảo lãnh cam kết chắc chắn chuyển thêm rủi ro phân phối cho bên bảo lãnh. Cố gắng tối đa hỗ trợ bán theo cam kết nỗ lực. Điều khoản tất cả hoặc không hủy đợt nếu không đạt đủ lượng theo cam kết.</p>'+
    '<h3>Trái phiếu và phái sinh</h3><p>Coupon là khoản lãi theo điều khoản. Lợi suất đến đáo hạn là suất chiết khấu làm giá hiện tại bằng hiện giá dòng tiền theo giả định nắm đến đáo hạn. Trái phiếu zero coupon không trả coupon định kỳ. Duration cao thường làm giá nhạy hơn với biến động lợi suất.</p>'+
    '<p>Hợp đồng kỳ hạn thường do hai bên thỏa thuận. Hợp đồng tương lai được chuẩn hóa, có cơ chế ký quỹ và thanh toán theo quy định áp dụng. Quyền chọn cho bên mua quyền mua hoặc bán với giá thực hiện, sau khi trả phí. Hoán đổi trao đổi các dòng tiền theo công thức thỏa thuận. Dùng vị thế ngược phơi nhiễm để phòng ngừa. Đầu cơ chủ động nhận rủi ro. Kinh doanh chênh lệch giá so các giao dịch tương đương sau phí và ràng buộc.</p>'+
    '<p>Ôn tổ chức thị trường theo vai trò: Sở tổ chức giao dịch, thành viên đưa lệnh vào hệ thống, đơn vị bù trừ và thanh toán quản lý nghĩa vụ. Khi đọc phần khung pháp lý trong đề cương năm 2023, phân biệt quy định được nêu trong đề với giả định của bài tập.</p>'+
    '<h3>Đọc dữ liệu trên phần mềm PTKT</h3><p>Với MetaStock hoặc AmiBroker, luyện cùng một quy trình: kiểm tra mã, khung thời gian và dữ liệu điều chỉnh, đọc OHLC và khối lượng, thêm chỉ báo, xác nhận tham số và diễn giải tín hiệu. Dùng phần mô phỏng trong Chương 5–9 để thực hành những thao tác đọc đồ thị này.</p></section>';
}
