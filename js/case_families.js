const caseFactories = {
  auction: function(v_r) {
    let v_a, v_b, v_d, v_high, v_p;
    v_p = v_r.randint(21, 60);
    v_a = v_r.randrange(100, 500, 10);
    v_d = v_r.randrange(500, 800, 10);
    v_high = v_r.randrange(30, 90, 10);
    v_b = v_r.randrange(500, 900, 10);
    return shortCase("9.3", "Sổ lệnh khớp định kỳ", ("Chỉ xét giá " + String((v_p - 1)) + ", " + String(v_p) + ", " + String((v_p + 1)) + ". Lượng mua chấp nhận các mức lần lượt " + String(v_b) + ", " + String(v_d) + ", " + String(v_high) + "; lượng bán lần lượt " + String(v_a) + ", " + String((v_a + 300)) + ", " + String((v_a + 600)) + " cổ phiếu. Ưu tiên mức cho khối lượng khớp lớn nhất."), "Lượng khớp tại mỗi giá bằng số nhỏ hơn giữa mua và bán chấp nhận giá đó", ["Cộng cả mua và bán", "Dùng riêng số lượng mua", "Lấy chênh lệch mua trừ bán"], "Tính min ở từng hàng trước rồi so kết quả. Hai phía đều phải có đối ứng.", "Chọn giá có tổng cung và cầu lớn nhất mặc dù chưa tính được số khớp.", [["Khớp tại mức giá thấp", Math.min(v_b, v_a), "cp", ("min(" + String(v_b) + "," + String(v_a) + ")"), (v_a + v_b), v_b], ["Khớp tại mức giá giữa", Math.min(v_d, (v_a + 300)), "cp", ("min(" + String(v_d) + "," + String((v_a + 300)) + ")"), ((v_d + v_a) + 300)], ["Khớp tại mức giá cao", v_high, "cp", ("min(" + String(v_high) + "," + String((v_a + 600)) + ")"), (v_a + 600)]], ("Chọn giá " + String(v_p)), [("Chọn giá " + String((v_p - 1))), ("Chọn giá " + String((v_p + 1))), "Cả ba cho cùng lượng khớp"]);
  },
  bands: function(v_r) {
    let v_m, v_p, v_s2, v_sd, v_width;
    v_m = v_r.randint(41, 106);
    v_sd = v_r.randint(3, 16);
    v_s2 = v_r.randint(2, 14);
    v_p = (v_m + v_r.randint((-31), 33));
    v_width = fraction((400 * v_sd), v_m);
    return shortCase("6.6", "Bollinger và độ rộng", ("SMA=" + String(v_m) + ", độ lệch chuẩn hiện tại " + String(v_sd) + " và kỳ trước " + String(v_s2) + ". Dùng hai dải SMA ± 2 độ lệch chuẩn. Giá đóng hiện tại " + String(v_p) + ". Độ rộng chuẩn hóa chia SMA."), "Độ rộng phản ánh biến động trong cửa sổ", ["Độ rộng xác định hướng giá phiên sau", "Độ rộng là khối lượng giao dịch", "Độ rộng bằng đường MACD"], "Đặt hai dải ở hai bên SMA. Độ rộng là dải trên trừ dải dưới. Tách hướng phá khỏi mức biến động.", "Dùng khoảng cách từ SMA đến dải trên làm khoảng cách giữa hai dải.", [["Dải trên", (v_m + (2 * v_sd)), "đv", (String(v_m) + "+2×" + String(v_sd)), (v_m + v_sd), (v_m + (2 * v_s2))], ["Dải dưới", (v_m - (2 * v_sd)), "đv", (String(v_m) + "−2×" + String(v_sd)), (v_m - v_sd), (v_m - (2 * v_s2))], ["Độ rộng chuẩn hóa", v_width, "%", ("4×" + String(v_sd) + "/" + String(v_m) + "×100"), (v_width / 2)]], "Cần thêm dữ kiện để suy luận hướng giá tiếp theo", ["Chạm dải trên bảo đảm phiên sau tăng", "Giá luôn bằng SMA sau một phiên", "Có thể lấy độ rộng làm EPS"]);
  },
  blend: function(v_r) {
    let v_b, v_c, v_h, v_h1, v_h2, v_l, v_l1, v_l2, v_o;
    v_o = v_r.randint(30, 70);
    v_b = (v_o + v_r.randint(1, 5));
    v_c = (v_b + v_r.choice([(-7), (-3), 2, 5]));
    v_h1 = (v_b + v_r.randint(2, 9));
    v_l1 = (v_o - v_r.randint(2, 9));
    v_h2 = (Math.max(v_b, v_c) + v_r.randint(2, 8));
    v_l2 = (Math.min(v_b, v_c) - v_r.randint(2, 8));
    v_h = Math.max(v_h1, v_h2);
    v_l = Math.min(v_l1, v_l2);
    return shortCase("7.10", "Nến gộp hai phiên", ("OHLC phiên 1 (" + String(v_o) + ", " + String(v_h1) + ", " + String(v_l1) + ", " + String(v_b) + "); phiên 2 (" + String(v_b) + ", " + String(v_h2) + ", " + String(v_l2) + ", " + String(v_c) + ")."), "Nến gộp lấy O đầu, C cuối, H cao nhất, L thấp nhất", ["Dùng tất cả số của phiên cuối", "Dùng trung bình bốn thông số", "Dùng H của phiên đầu và L của phiên cuối theo mặc định"], "So các cực trị trước, rồi đọc thân và bóng theo O của phiên đầu và C của phiên cuối.", "Một nến gộp giữ được chính xác diễn biến và thứ tự từng nến thành phần.", [["H gộp", v_h, "đv", ("max(" + String(v_h1) + "," + String(v_h2) + ")"), v_h1, v_h2, fraction((v_h1 + v_h2), 2)], ["L gộp", v_l, "đv", ("min(" + String(v_l1) + "," + String(v_l2) + ")"), v_l1, v_l2, fraction((v_l1 + v_l2), 2)], ["Thân gộp", Math.abs((v_c - v_o)), "đv", ("|" + String(v_c) + "−" + String(v_o) + "|"), Math.abs((v_c - v_b)), (v_h - v_l)]], "OHLC gộp làm mất thứ tự biến động bên trong khoảng gộp", ["Nến gộp luôn có độ dài thân bằng tổng các thân", "Không suy ra được giá mở của cụm", "H gộp là số trung bình tùy ý"]);
  },
  breakout: function(v_r) {
    let v_close, v_diff, v_high, v_passed, v_rel, v_v, v_vavg;
    v_high = v_r.randint(45, 110);
    v_close = (v_high + v_r.choice([(-3), (-1), 1, 2, 3, 5, 7]));
    v_vavg = v_r.randint(45, 140);
    v_v = v_r.randint(50, 245);
    v_diff = (fraction((v_close - v_high), v_high) * 100);
    v_rel = fraction(v_v, v_vavg);
    v_passed = ((v_diff >= 2) && (v_rel >= fraction(3, 2)));
    return buildCase("5.5", "Phá kháng cự và xác nhận khối lượng", ("Biên kháng cự " + String(v_high) + ", đóng cửa " + String(v_close) + ", khối lượng phiên " + String(v_v) + " nghìn, bình quân 20 phiên " + String(v_vavg) + " nghìn. Quy tắc giả định xác nhận khi đóng cao hơn biên ít nhất 2% và khối lượng ≥1,5 lần bình quân."), "Khi kiểm tra phá kháng cự theo quy tắc giá đóng, mức quan trọng là gì?", "Giá đóng cửa đối chiếu vùng cản", ["Biên lợi nhuận gộp", "Giá lịch sử đã điều chỉnh thuế", "Màu nền đồ thị"], "Tách điều kiện phần trăm chênh giá và tỷ số khối lượng. Cả hai phải đồng thời đạt theo quy tắc bài.", "Giá vượt biên trong phiên đủ xác nhận khi quy tắc yêu cầu giá đóng trên biên.", [field("Chênh lệch giá đóng so với cản", (v_close - v_high), "đv", (String(v_close) + " − " + String(v_high)), (v_high - v_close)), field("Tỷ lệ giá đóng vượt cản", v_diff, "%", ("(" + String(v_close) + " / " + String(v_high) + " − 1) × 100"), (fraction((v_close - v_high), v_close) * 100)), field("Khối lượng so với bình quân", v_rel, "lần", (String(v_v) + " / " + String(v_vavg)), fraction(v_vavg, v_v))], "Tình huống đạt cả hai điều kiện xác nhận của bài không?", (v_passed ? "Đạt cả hai điều kiện" : "Thiếu ít nhất một điều kiện"), [(v_passed ? "Thiếu ít nhất một điều kiện" : "Đạt cả hai điều kiện"), "Có vì khối lượng dương", "Chắc chắn đảo chiều giảm ngay"]);
  },
  buffett: function(v_r) {
    let v_conclusion, v_f1, v_f2, v_k, v_price, v_pv, v_pv1, v_pv2, v_rate, v_safe, v_tv;
    v_f1 = v_r.randint(22, 53);
    v_f2 = v_r.randint(22, 59);
    v_tv = v_r.randint(60, 130);
    v_k = v_r.randint(7, 13);
    v_rate = (1 + fraction(v_k, 100));
    v_pv1 = (v_f1 / v_rate);
    v_pv2 = ((v_f2 + v_tv) / (v_rate * v_rate));
    v_pv = (v_pv1 + v_pv2);
    v_price = roundEven((Number(v_pv) * v_r.choice([0.58, 0.67, 0.73, 0.78, 0.84, 0.93, 1.04])));
    v_safe = ((1 - (fraction(v_price) / v_pv)) * 100);
    v_conclusion = ((v_safe >= 25) ? "Đạt ngưỡng" : "Chưa đạt ngưỡng");
    return buildCase("4.1", "Biên an toàn dựa trên giá trị nội tại", ("Một doanh nghiệp dễ hiểu có dòng tiền dự báo năm 1 là " + String(v_f1) + ", năm 2 là " + String(v_f2) + ", giá trị thu hồi cuối năm 2 là " + String(v_tv) + ". Suất chiết khấu " + String(v_k) + "%, thị giá " + String(v_price) + ", cùng đơn vị theo mỗi cổ phiếu. Bộ lọc giả định yêu cầu biên an toàn ít nhất 25%."), "Vì sao so giá với giá trị nội tại ước tính?", "Để đo mức đệm trước sai số định giá", ["Để bảo đảm lợi nhuận mỗi quý", "Để thay thế kiểm tra sức khỏe tài chính", "Để tính giá đóng cửa chính xác"], "Giá trị nội tại là giá trị hiện tại ước tính của dòng tiền. Giá thấp hơn giá trị giúp tạo đệm, còn độ tin cậy phụ thuộc giả định.", "Chiết khấu tất cả khoản tiền cùng một kỳ dù dòng tiền xảy ra ở hai kỳ khác nhau.", [field("Hiện giá dòng tiền năm 1", v_pv1, "đv/cp", (String(v_f1) + " / (1 + " + String(v_k) + "%)"), v_f1), field("Hiện giá phần nhận ở cuối năm 2", v_pv2, "đv/cp", ("(" + String(v_f2) + " + " + String(v_tv) + ") / (1 + " + String(v_k) + "%)²"), ((v_f2 + v_tv) / v_rate), (v_f2 + v_tv)), field("Biên an toàn tính trên giá trị nội tại", v_safe, "%", ("[1 − " + String(v_price) + " / (hiện giá năm 1 + hiện giá năm 2)] × 100"), (((v_pv - v_price) / v_price) * 100))], "Doanh nghiệp có vượt ngưỡng biên an toàn của bài không?", (v_conclusion + " 25%"), [((v_conclusion === "Đạt ngưỡng") ? "Chưa đạt ngưỡng 25%" : "Đạt ngưỡng 25%"), "Đạt vì giá khác 0", "Không thể tính khi đã có đủ dòng tiền, suất chiết khấu và thị giá"]);
  },
  candle: function(v_r) {
    let v_c, v_dn, v_h, v_l, v_o, v_side, v_up;
    v_o = v_r.randint(25, 75);
    v_c = (v_o + v_r.choice([(-6), (-4), (-2), 1, 2, 4, 6]));
    v_up = v_r.randint(1, 8);
    v_dn = v_r.randint(2, 12);
    v_h = (Math.max(v_o, v_c) + v_up);
    v_l = (Math.min(v_o, v_c) - v_dn);
    v_side = ((v_c > v_o) ? "tăng" : "giảm");
    return shortCase("7.3", "Giải phẫu nến OHLC", ("Một phiên có O = " + String(v_o) + ", H = " + String(v_h) + ", L = " + String(v_l) + ", C = " + String(v_c) + "."), "Thân nối giá mở và giá đóng", ["Thân nối hai mức cực trị", "Thân nối thấp nhất với mở cửa", "Thân chỉ đo giá đóng phiên sau"], "Thân = |C − O|. Bóng trên tính từ mép trên của thân và bóng dưới tính từ mép dưới.", "Lấy H − O cho bóng trên dù C lớn hơn O.", [["Thân nến", Math.abs((v_c - v_o)), "đv", "Giá trị tuyệt đối của C − O", (v_h - v_l)], ["Bóng trên", v_up, "đv", (String(v_h) + "−max(" + String(v_o) + "," + String(v_c) + ")"), (v_h - v_o), (v_h - v_c)], ["Bóng dưới", v_dn, "đv", ("min(" + String(v_o) + "," + String(v_c) + ")−" + String(v_l)), (v_o - v_l), (v_c - v_l)]], (("Nến " + v_side) + " và chưa biết thứ tự các cực trị trong phiên"), ["Đây là Doji vì có hai bóng", "Nến nào có bóng dài cũng giảm giá", "Cực trị cao luôn hình thành sau cực trị thấp"]);
  },
  canslim: function(v_r) {
    let v_annual, v_ca, v_cap, v_cq, v_gap, v_new, v_newa, v_ok, v_q, v_relative;
    v_q = v_r.randint(12, 33);
    v_new = (v_q + v_r.randint(2, 16));
    v_annual = v_r.randint(25, 95);
    v_newa = (v_annual + v_r.randint(5, 27));
    v_relative = v_r.randint(1, 22);
    v_cap = v_r.randint(3, 17);
    v_cq = (fraction((v_new - v_q), v_q) * 100);
    v_ca = (fraction((v_newa - v_annual), v_annual) * 100);
    v_gap = (v_relative - v_cap);
    v_ok = ((v_cq >= 20) && (v_ca >= 15) && (v_gap > 0));
    return buildCase("4.3", "CANSLIM và lọc tăng trưởng", ("EPS quý cùng kỳ từ " + String(v_q) + " lên " + String(v_new) + ", EPS năm từ " + String(v_annual) + " lên " + String(v_newa) + ". Trong kỳ quan sát, mã tăng " + String(v_relative) + "% và chỉ số nhóm tăng " + String(v_cap) + "%. Bài quy ước C đạt khi tăng quý ≥20%, A đạt khi tăng năm ≥15%, L đạt nếu mã tăng nhiều hơn nhóm."), "Trong CANSLIM, chữ L đề cập điều gì?", "Dẫn đầu hay tụt hậu so với nhóm", ["Lợi nhuận ròng của quý hiện tại", "Thanh khoản ngắn hạn trên BCTC", "Lãi suất chính sách"], "C xét lợi nhuận quý, A xét lợi nhuận năm, L theo dõi cổ phiếu dẫn đầu hay tụt hậu. Vượt C, A, L vẫn chỉ là một phần của CANSLIM.", "Mã có mức tăng dương luôn thuộc nhóm dẫn đầu, bất kể chỉ số nhóm tăng bao nhiêu.", [field("Tăng EPS quý", v_cq, "%", ("(" + String(v_new) + " − " + String(v_q) + ") / " + String(v_q) + " × 100"), (v_new - v_q)), field("Tăng EPS năm", v_ca, "%", ("(" + String(v_newa) + " − " + String(v_annual) + ") / " + String(v_annual) + " × 100"), (v_newa - v_annual), v_cq), field("Mức vượt nhóm", v_gap, "điểm %", (String(v_relative) + "% − " + String(v_cap) + "%"), v_relative, (-v_gap))], "Theo ngưỡng bài này, mã có đồng thời đạt cả C, A và L không?", (v_ok ? "Có, cả ba đều đạt" : "Chưa, ít nhất một trong ba điều kiện không đạt"), [(v_ok ? "Chưa, ít nhất một trong ba điều kiện không đạt" : "Có, cả ba đều đạt"), "Có vì EPS quý và năm đều dương", "Không thể kiểm tra được bất kỳ điều kiện nào"]);
  },
  cap: function(v_r) {
    let v_extra, v_prev, v_price, v_sale, v_treasury;
    v_prev = v_r.randint(3, 12);
    v_extra = v_r.randint(2, 9);
    v_price = v_r.randrange(12, 46, 2);
    v_sale = (v_price - v_r.randrange(2, 11, 2));
    v_treasury = v_r.randint(1, (v_prev - 1));
    return buildCase("1.4", "Cổ phiếu lưu hành và vốn hóa", ("Doanh nghiệp đã phát hành " + String(v_prev) + " triệu cổ phiếu và đang nắm " + String(v_treasury) + " triệu cổ phiếu quỹ. Phát hành thêm " + String(v_extra) + " triệu cổ phiếu mới với giá " + String(v_sale) + " nghìn đồng/cp. Sau phát hành, thị giá là " + String(v_price) + " nghìn đồng/cp."), "Chỉ tiêu nào định giá toàn bộ cổ phiếu đang lưu hành ở thị giá?", "Vốn hóa thị trường", ["Vốn điều lệ", "Lợi nhuận giữ lại", "Doanh thu thuần"], "Vốn hóa dùng thị giá và số cổ phiếu lưu hành. Tiền huy động dùng giá phát hành và số phát hành mới.", "Cổ phiếu quỹ là một phần của lượng đang lưu hành để tính vốn hóa.", [field("Số cổ phiếu lưu hành sau phát hành", ((v_prev + v_extra) - v_treasury), "triệu cp", (String(v_prev) + " + " + String(v_extra) + " − " + String(v_treasury)), (v_prev + v_extra), (v_prev - v_treasury)), field("Tiền huy động trước phí", (v_extra * v_sale), "tỷ đồng", (String(v_extra) + " × " + String(v_sale)), (v_extra * v_price), (((v_prev + v_extra) - v_treasury) * v_sale)), field("Vốn hóa sau phát hành", (((v_prev + v_extra) - v_treasury) * v_price), "tỷ đồng", ("(" + String(v_prev) + " + " + String(v_extra) + " − " + String(v_treasury) + ") × " + String(v_price)), ((v_prev + v_extra) * v_price), (v_extra * v_sale))], "Cổ đông hiện hữu không mua thêm. Ảnh hưởng nào phù hợp nhất nếu các điều kiện khác giữ nguyên?", "Tỷ lệ sở hữu của cổ đông giảm khi số cổ phiếu lưu hành tăng", ["Tỷ lệ sở hữu giữ nguyên chỉ vì số cổ phiếu cá nhân giữ nguyên", "Toàn bộ vốn hóa được công ty thu về bằng tiền", "Vốn hóa phải bằng tiền huy động"]);
  },
  capm: function(v_r) {
    let v_b2, v_beta, v_k, v_prem, v_req, v_revised, v_rf, v_rm;
    v_rf = v_r.randint(2, 6);
    v_rm = (v_rf + v_r.randint(4, 11));
    v_beta = fraction(v_r.randint(6, 17), 10);
    v_b2 = (v_beta + fraction(v_r.randint(1, 5), 10));
    v_k = v_r.randint(8, 19);
    v_prem = (v_rm - v_rf);
    v_req = (v_rf + (v_beta * v_prem));
    v_revised = (v_rf + (v_b2 * v_prem));
    return shortCase("11.6", "CAPM, beta và lợi suất yêu cầu", ("Lãi suất phi rủi ro " + String(v_rf) + "%, lợi suất thị trường kỳ vọng " + String(v_rm) + "%, beta " + String(Number(v_beta)) + "; trường hợp sau beta " + String(Number(v_b2)) + ". Ước tính riêng của nhà phân tích về lợi suất cổ phiếu ở trường hợp đầu là " + String(v_k) + "%."), "Beta đo mức nhạy của lợi suất cổ phiếu với lợi suất thị trường", ["Beta đo tiền mặt trên nợ ngắn hạn", "Beta là lợi nhuận ròng trên doanh thu", "Beta là chênh lệch giá mua và giá bán"], "Phần bù thị trường là Rm − Rf. Nhân phần bù này với beta, cộng Rf. Đối chiếu con số yêu cầu với con số dự báo.", "Nhân beta với toàn bộ lợi suất thị trường rồi cộng tiếp lãi suất phi rủi ro.", [["Phần bù rủi ro thị trường", v_prem, "điểm %", (String(v_rm) + "−" + String(v_rf)), v_rm, (v_rf + v_rm)], ["Lợi suất yêu cầu beta ban đầu", v_req, "%", (String(v_rf) + "+" + String(Number(v_beta)) + "×" + String(v_prem)), (v_rf + (v_beta * v_rm))], ["Lợi suất yêu cầu beta mới", v_revised, "%", (String(v_rf) + "+" + String(Number(v_b2)) + "×" + String(v_prem)), v_req, (v_b2 * v_rm)]], "Khi phần bù dương, beta tăng làm lợi suất yêu cầu tăng", ["Beta tăng làm lợi suất yêu cầu giảm trong trường hợp này", "Lợi suất yêu cầu cố định bằng Rf", "Beta cao bảo đảm lợi suất thực tế bằng CAPM"]);
  },
  continuous: function(v_r) {
    let v_a, v_b, v_buy, v_extra, v_p;
    v_p = v_r.randint(15, 53);
    v_a = v_r.randrange(100, 400, 10);
    v_b = v_r.randrange(150, 450, 10);
    v_extra = v_r.randrange(20, 100, 10);
    v_buy = ((v_a + v_b) + v_extra);
    return shortCase("9.5", "Khớp LO qua nhiều mức", ("Sổ đang có bán " + String(v_a) + " cp tại " + String(v_p) + " nghìn, " + String(v_b) + " cp tại " + String((v_p + 1)) + " nghìn, và " + String((v_extra + 100)) + " cp tại " + String((v_p + 2)) + " nghìn. LO mua " + String(v_buy) + " cp với giá giới hạn " + String((v_p + 1)) + " nghìn mới nhập. Mỗi lệnh khớp theo giá đang chờ, bỏ qua phí."), "Lệnh mua LO chỉ chấp nhận giá bằng hoặc thấp hơn giá giới hạn", ["LO chấp nhận mọi giá nếu lượng lớn", "LO mua đặt giá cao nhất chấp nhận bỏ qua ưu tiên giá", "LO mua luôn thanh toán bằng giá giới hạn cho mọi khối lượng"], "Khớp các mức bán đủ điều kiện theo giá tăng dần. Tính tổng tiền theo từng mức, phần mua chưa khớp còn chờ tại giá giới hạn.", "Khớp luôn mức giá bán cao hơn giới hạn để mua đủ khối lượng.", [["Lượng mua khớp ngay", (v_a + v_b), "cp", (String(v_a) + "+" + String(v_b)), v_buy], ["Tiền mua đã khớp", ((v_a * v_p) + (v_b * (v_p + 1))), "nghìn đồng", (String(v_a) + "×" + String(v_p) + "+" + String(v_b) + "×" + String((v_p + 1))), ((v_a + v_b) * (v_p + 1)), (v_buy * (v_p + 1))], ["Lượng LO còn lại", v_extra, "cp", (String(v_buy) + "−" + String((v_a + v_b))), v_a, v_b]], ("Còn lệnh mua chờ ở mức " + String((v_p + 1)) + " nghìn"), ["Phần dư khớp hết ở mức thấp nhất", "Phần dư buộc hủy vì mọi lệnh LO đều khớp hoặc hủy", "Giá khớp đã thực hiện phải chỉnh lên mức bán cao nhất"]);
  },
  cycle_cash: function(v_r) {
    let v_ap, v_ar, v_cost, v_days, v_dio, v_dpo, v_dso, v_inv, v_sale;
    v_sale = (v_r.randint(15, 30) * 12);
    v_cost = (v_r.randint(8, 14) * 12);
    v_inv = v_r.randint(18, 60);
    v_ar = v_r.randint(15, 55);
    v_ap = v_r.randint(10, 28);
    v_days = v_r.choice([360, 365]);
    v_dio = fraction((v_inv * v_days), v_cost);
    v_dso = fraction((v_ar * v_days), v_sale);
    v_dpo = fraction((v_ap * v_days), v_cost);
    return buildCase("3.6", "Chu kỳ chuyển đổi tiền", ("Doanh thu bán chịu " + String(v_sale) + " tỷ, giá vốn " + String(v_cost) + " tỷ, hàng tồn kho, phải thu và phải trả bình quân lần lượt " + String(v_inv) + ", " + String(v_ar) + ", " + String(v_ap) + " tỷ. Giả định giá trị mua hàng bằng giá vốn, năm có " + String(v_days) + " ngày."), "Số ngày tồn kho dùng giá vốn hay doanh thu?", "Giá vốn", ["Doanh thu bán chịu", "LNST", "Thị giá"], "Chu kỳ chuyển đổi tiền = ngày tồn kho + ngày phải thu − ngày phải trả. Công thức đặt đúng chỉ tiêu dòng ở mẫu.", "Số ngày phải trả càng dài thì chu kỳ tiền tăng đúng bằng số ngày đó, nếu các yếu tố khác giữ nguyên.", [field("Số ngày tồn kho", v_dio, "ngày", (String(v_inv) + " / " + String(v_cost) + " × " + String(v_days)), fraction((v_inv * v_days), v_sale)), field("Số ngày phải thu", v_dso, "ngày", (String(v_ar) + " / " + String(v_sale) + " × " + String(v_days)), fraction((v_ar * v_days), v_cost)), field("Chu kỳ chuyển đổi tiền", ((v_dio + v_dso) - v_dpo), "ngày", "Ngày tồn kho + ngày phải thu − ngày phải trả", ((v_dio + v_dso) + v_dpo), (v_dio + v_dso))], "Nếu thời gian thu tiền giảm 5 ngày, mọi yếu tố còn lại cố định, chu kỳ tiền đổi thế nào?", "Ngắn hơn 5 ngày", ["Dài hơn 5 ngày", "Giữ nguyên", "Ngắn hơn 10 ngày"]);
  },
  discount: function(v_r) {
    let v_a, v_b, v_c, v_coupon, v_face, v_new, v_old;
    v_face = (v_r.randint(7, 14) * 100);
    v_c = v_r.randint(4, 9);
    v_a = v_r.randint(4, 9);
    v_b = (v_a + v_r.randint(2, 5));
    v_coupon = fraction((v_face * v_c), 100);
    v_old = ((v_face + v_coupon) / (1 + fraction(v_a, 100)));
    v_new = ((v_face + v_coupon) / (1 + fraction(v_b, 100)));
    return buildCase("2.8", "Lãi suất và định giá trái phiếu một năm", ("Trái phiếu còn đúng một kỳ 1 năm, mệnh giá " + String(v_face) + ", coupon năm " + String(v_c) + "% trả cùng gốc cuối kỳ. Lợi suất yêu cầu tăng từ " + String(v_a) + "% lên " + String(v_b) + "%. Bỏ qua rủi ro vỡ nợ."), "Khi lợi suất yêu cầu tăng và dòng tiền cố định, giá trái phiếu thường đi theo hướng nào?", "Giảm", ["Tăng", "Luôn về đúng mệnh giá", "Tăng đúng bằng số phần trăm lợi suất"], "Lợi suất yêu cầu là suất chiết khấu. Coupon là dòng tiền theo điều khoản trái phiếu và vẫn giữ nguyên.", "Coupon tự tăng cùng mức lợi suất yêu cầu dù hợp đồng cố định.", [field("Tiền coupon cuối kỳ", v_coupon, "đv tiền", (String(v_face) + " × " + String(v_c) + "%"), v_face, fraction((v_face * v_a), 100)), field("Giá theo lợi suất cũ", v_old, "đv tiền", ("(" + String(v_face) + " + coupon) / (1 + " + String(v_a) + "%)"), v_face, (v_face + v_coupon)), field("Giá theo lợi suất mới", v_new, "đv tiền", ("(" + String(v_face) + " + coupon) / (1 + " + String(v_b) + "%)"), v_old, (v_face + v_coupon))], "Mức thiệt theo giá là bao nhiêu và giá thay đổi thế nào?", ("Giá giảm khoảng " + field("", (v_old - v_new), "đv tiền", "").text()), [("Giá tăng khoảng " + field("", (v_old - v_new), "đv tiền", "").text()), "Giá bằng đúng giá cũ", "Lợi suất cao hơn làm coupon hợp đồng tăng"]);
  },
  dupont: function(v_r) {
    let v_assets, v_equity, v_margin, v_ni, v_roe, v_sales, v_turn;
    v_sales = (v_r.randint(12, 36) * 10);
    v_ni = v_r.randint(12, 35);
    v_assets = (v_r.randint(10, 38) * 10);
    v_equity = (v_r.randint(4, 9) * 10);
    v_margin = (fraction(v_ni, v_sales) * 100);
    v_turn = fraction(v_sales, v_assets);
    v_roe = (fraction(v_ni, v_equity) * 100);
    return buildCase("3.3", "Phân rã ROE theo DuPont", ("Doanh thu thuần " + String(v_sales) + " tỷ, lợi nhuận ròng " + String(v_ni) + " tỷ, tài sản bình quân " + String(v_assets) + " tỷ, vốn chủ bình quân " + String(v_equity) + " tỷ. Dùng mô hình DuPont ba nhân tố."), "Tích của biên lợi nhuận ròng, vòng quay tổng tài sản và hệ số nhân vốn chủ cho chỉ tiêu nào?", "ROE", ["P/E", "Current ratio", "Biên lợi nhuận gộp"], "DuPont phân biệt hiệu quả lợi nhuận, sử dụng tài sản và cấu trúc tài trợ. Dùng cùng kỳ và đúng đơn vị.", "ROE cao đồng nghĩa tỷ suất trên toàn bộ tài sản cao bằng ROE.", [field("Biên lợi nhuận ròng", v_margin, "%", (String(v_ni) + " / " + String(v_sales) + " × 100"), (fraction(v_ni, v_assets) * 100), v_roe), field("Vòng quay tổng tài sản", v_turn, "lần", (String(v_sales) + " / " + String(v_assets)), fraction(v_assets, v_sales), fraction(v_sales, v_equity)), field("ROE theo DuPont", v_roe, "%", ("Biên × vòng quay × (" + String(v_assets) + " / " + String(v_equity) + ")"), (fraction(v_ni, v_assets) * 100), v_margin)], "Nếu các yếu tố còn lại không đổi, hệ số nhân vốn chủ tăng có tác động gì trong phương trình DuPont?", "ROE tính theo mô hình tăng khi biên dương và vòng quay dương", ["Biên ròng nhất định tự giảm về 0", "Vòng quay buộc tăng đúng gấp đôi", "ROE không đổi vì vốn chủ đã xuất hiện ở ROA"]);
  },
  fcf: function(v_r) {
    let v_ap, v_ar, v_cap, v_cfo, v_ex, v_inv, v_ni, v_non;
    v_ni = v_r.randint(45, 160);
    v_non = v_r.randint(12, 35);
    v_ar = v_r.randint(4, 33);
    v_inv = v_r.randint(8, 35);
    v_ap = v_r.randint(7, 30);
    v_cap = v_r.randint(45, 140);
    v_ex = ((v_ap - v_ar) - v_inv);
    v_cfo = ((v_ni + v_non) + v_ex);
    return buildCase("3.8", "Từ lợi nhuận tới dòng tiền tự do", ("LNST " + String(v_ni) + " tỷ, khấu hao " + String(v_non) + " tỷ, phải thu tăng " + String(v_ar) + " tỷ, tồn kho tăng " + String(v_inv) + " tỷ, phải trả hoạt động tăng " + String(v_ap) + " tỷ, Capex " + String(v_cap) + " tỷ. Chỉ xét các điều chỉnh này và quy ước FCF = CFO − Capex."), "Theo phương pháp gián tiếp, tăng phải thu được xử lý thế nào khi tính CFO?", "Trừ khỏi LNST khi đối chiếu với CFO", ["Cộng vào LNST", "Cộng thẳng vào Capex", "Ghi là vốn cổ phần mới"], "CFO từ LNST cộng phi tiền mặt và điều chỉnh vốn lưu động. FCF theo đề là tiền hoạt động sau đầu tư tài sản.", "Khấu hao là tiền ra trong kỳ nên bị trừ một lần nữa khỏi LNST khi tính CFO.", [field("Điều chỉnh vốn lưu động", v_ex, "tỷ", ("+" + String(v_ap) + " − " + String(v_ar) + " − " + String(v_inv)), ((v_ar + v_inv) - v_ap), (v_ap - v_ar)), field("CFO", v_cfo, "tỷ", (String(v_ni) + " + " + String(v_non) + " + (" + String(v_ex) + ")"), ((v_ni + v_non) - v_ex), (v_ni + v_ex)), field("FCF", (v_cfo - v_cap), "tỷ", ("CFO − " + String(v_cap)), (v_ni - v_cap), (v_cfo + v_cap))], "Nếu Capex tăng 10 tỷ và CFO giữ nguyên, FCF đổi thế nào?", "FCF giảm 10 tỷ", ["FCF tăng 10 tỷ", "FCF giữ nguyên", "CFO giảm và FCF giữ nguyên"]);
  },
  fib: function(v_r) {
    let v_a, v_b, v_hi, v_lo, v_w;
    v_lo = v_r.randint(20, 84);
    v_hi = (v_lo + v_r.randint(14, 48));
    v_w = (v_hi - v_lo);
    v_a = fraction(382, 1000);
    v_b = fraction(618, 1000);
    return shortCase("6.7", "Đo nhịp hồi Fibonacci", ("Một nhịp tăng từ " + String(v_lo) + " đến " + String(v_hi) + ". Hồi 38,2% và 61,8% đều đo từ đỉnh xuống. Giữ nguyên hai đầu mút."), "Mức hồi = đỉnh − tỷ lệ × biên nhịp", ["Mức hồi = đỉnh × tỷ lệ", "Mức hồi = đáy − đỉnh × tỷ lệ", "Mức hồi = đỉnh + tỷ lệ × biên"], "Biên nhịp bằng đỉnh trừ đáy. Phần hồi càng lớn thì mức giá sau hồi càng thấp trong nhịp tăng.", "Mức hồi 61,8% nằm cao hơn 38,2% khi cả hai cùng đo từ đỉnh.", [["Mức hồi 38,2%", (v_hi - (v_w * v_a)), "đv", (String(v_hi) + "−" + String(v_w) + "×0,382"), (v_hi * v_a)], ["Mức hồi 61,8%", (v_hi - (v_w * v_b)), "đv", (String(v_hi) + "−" + String(v_w) + "×0,618"), (v_hi * v_b)], ["Khoảng cách giữa hai mức", (v_w * (v_b - v_a)), "đv", (String(v_w) + "×(0,618−0,382)"), (v_w * (v_a + v_b))]], "Mốc Fibonacci là vùng tham khảo để đối chiếu với giá", ["Mọi điểm giá đều đảo chiều ở đúng một mốc", "Mốc thứ hai là giá trần giao dịch", "Hai mốc luôn trùng nhau"]);
  },
  flag: function(v_r) {
    let v_a, v_av, v_br, v_end, v_side, v_v, v_vol;
    v_v = v_r.randint(35, 70);
    v_a = v_r.randint(7, 21);
    v_side = v_r.choice([(-1), 1]);
    v_end = (v_v + (v_side * v_a));
    v_br = (v_end - (v_side * v_r.randint(1, 4)));
    v_av = v_r.randint(37, 98);
    v_vol = v_r.randint(66, 172);
    return shortCase("8.3", "Cờ chữ nhật và cột cờ", ("Nhịp mạnh từ " + String(v_v) + " đến " + String(v_end) + ", tạo vùng lá cờ rồi phá cùng chiều tại " + String(v_br) + ". Khối lượng điểm phá " + String(v_vol) + " nghìn, bình quân " + String(v_av) + " nghìn. Mục tiêu chiếu chiều dài cột cờ từ điểm phá."), "Cột cờ là nhịp mạnh trước khi lá cờ hình thành", ["Cột cờ là giá đóng cuối ngày", "Cột cờ là neckline mọi mẫu", "Cột cờ là đường RSI"], "Đo độ dài cột cờ rồi chiếu theo hướng thoát. Dùng khối lượng tương đối để đọc mức tham gia.", "Dùng chiều rộng của lá cờ thay cho độ dài cột cờ dù đề yêu cầu đo cột cờ.", [["Độ dài cột cờ", v_a, "đv", ("|" + String(v_end) + "−" + String(v_v) + "|"), Math.abs((v_end - v_br))], ["Tỷ lệ khối lượng điểm phá", fraction(v_vol, v_av), "lần", (String(v_vol) + "/" + String(v_av)), fraction(v_av, v_vol)], ["Mục tiêu theo cột cờ", (v_br + (v_side * v_a)), "đv", (String(v_br) + "+(" + String(v_side) + "×" + String(v_a) + ")"), (v_br - (v_side * v_a)), (v_end + (v_side * v_a))]], "Mục tiêu là mức ước lượng có điều kiện", ["Mục tiêu là giá chắc chắn chạm", "Mục tiêu là giá trị nội tại đã chiết khấu", "Mục tiêu bằng thanh khoản bình quân"]);
  },
  futures: function(v_r) {
    let v_k, v_m, v_n, v_p, v_side, v_total;
    v_k = (v_r.randint(18, 53) * 20);
    v_p = (v_k + v_r.choice([(-45), (-35), (-20), 15, 25, 45]));
    v_n = v_r.randint(2, 8);
    v_m = v_r.choice([10, 15, 20, 25]);
    v_total = ((v_n * v_m) * (v_p - v_k));
    v_side = ((v_total > 0) ? "lãi" : "lỗ");
    return shortCase("1.3", "Lãi lỗ hợp đồng tương lai", ("Nhà đầu tư mở vị thế mua " + String(v_n) + " hợp đồng tương lai ở " + String(v_k) + " điểm, đóng ở " + String(v_p) + " điểm. Hệ số nhân giả định " + String(v_m) + " nghìn đồng/điểm cho mỗi hợp đồng. Bỏ qua phí và giả sử đóng hết vị thế."), "Vị thế mua hưởng chênh lệch dương khi giá đóng vị thế cao hơn giá mở", ["Vị thế mua có lãi khi giá giảm", "Hợp đồng tương lai là quyền có thể hủy nghĩa vụ bất kỳ lúc nào", "Lãi lỗ luôn bằng giá danh nghĩa toàn hợp đồng"], "Tính chênh lệch điểm rồi nhân hệ số và số hợp đồng. Hai phía mua bán có dấu kết quả ngược nhau trước phí.", "Nhân giá đóng với hệ số rồi gọi toàn bộ giá trị danh nghĩa là tiền lãi.", [["Chênh lệch điểm đóng so với mở", (v_p - v_k), "điểm", (String(v_p) + "−" + String(v_k)), (v_k - v_p)], ["Lãi/lỗ mỗi hợp đồng mua", ((v_p - v_k) * v_m), "nghìn đồng", ("(" + String(v_p) + "−" + String(v_k) + ")×" + String(v_m)), ((v_k - v_p) * v_m)], ["Lãi/lỗ cả vị thế mua", v_total, "nghìn đồng", ("(" + String(v_p) + "−" + String(v_k) + ")×" + String(v_m) + "×" + String(v_n)), (-v_total), ((v_p - v_k) * v_m)]], ("Vị thế mua " + v_side), [("Vị thế mua " + ((v_side === "lãi") ? "lỗ" : "lãi")), "Lãi hoặc lỗ không phụ thuộc hệ số hợp đồng", "Vị thế bán cùng số hợp đồng có kết quả cùng dấu"]);
  },
  fx: function(v_r) {
    let v_delta, v_effect, v_net, v_new, v_old, v_usd_in, v_usd_out;
    v_usd_in = v_r.randint(8, 25);
    v_usd_out = v_r.randint(3, 22);
    if ((v_usd_in === v_usd_out)) { v_usd_out += 2; }
    v_old = (v_r.randint(225, 255) * 100);
    v_delta = v_r.choice([(-1700), (-1300), (-900), 800, 1200, 1600]);
    v_new = (v_old + v_delta);
    v_net = (v_usd_in - v_usd_out);
    v_effect = (v_delta * v_net);
    return buildCase("2.9", "Phơi nhiễm tỷ giá ròng", ("Doanh nghiệp thu " + String(v_usd_in) + " nghìn USD và chi " + String(v_usd_out) + " nghìn USD trong cùng kỳ. So tỷ giá VND/USD cũ " + (v_old).toLocaleString("en-US") + " với mới " + (v_new).toLocaleString("en-US") + ". Khối lượng USD cố định, chưa phòng hộ. Kết quả tiền tính theo nghìn đồng."), "Tỷ giá được yết theo VND/USD. Số yết giá tăng có nghĩa là gì?", "Một USD đổi được nhiều VND hơn", ["Một USD đổi được ít VND hơn", "USD/VND tự giữ nguyên theo cả hai cách yết", "VND lên giá so với tất cả ngoại tệ"], "Xác định phơi nhiễm ròng bằng thu USD trừ chi USD. Tác động quy đổi còn phụ thuộc dấu của vị thế và dấu của biến động tỷ giá.", "Chỉ cần biết doanh nghiệp có doanh thu USD là đủ kết luận tỷ giá tăng sẽ có lợi.", [field("Phơi nhiễm ngoại tệ ròng", v_net, "nghìn USD", (String(v_usd_in) + " − " + String(v_usd_out)), v_usd_in, v_usd_out), field("Giá trị dòng tiền ròng theo tỷ giá cũ", (v_net * v_old), "nghìn đồng", ("(" + String(v_usd_in) + " − " + String(v_usd_out) + ") × " + String(v_old)), (v_usd_in * v_old), (v_net * v_new)), field("Thay đổi VND của dòng tiền ròng", v_effect, "nghìn đồng", ("(" + String(v_usd_in) + " − " + String(v_usd_out) + ") × (" + String(v_new) + " − " + String(v_old) + ")"), (v_delta * v_usd_in), (-v_effect))], "Cùng khối lượng USD, phòng hộ đúng bằng khoản phơi nhiễm ròng có tác động trực tiếp nào?", "Giảm độ nhạy của dòng tiền ròng VND với tỷ giá", ["Làm tỷ giá thị trường ngừng biến động", "Làm doanh thu USD gấp đôi", "Đổi toàn bộ chi phí trong nước thành chi phí USD"]);
  },
  gap: function(v_r) {
    let v_c0, v_c1, v_h0, v_lo2, v_low, v_ret;
    v_c0 = v_r.randint(35, 60);
    v_h0 = (v_c0 + v_r.randint(1, 6));
    v_low = (v_h0 + v_r.randint(2, 8));
    v_c1 = (v_low + v_r.randint(1, 6));
    v_ret = v_r.randint(2, 13);
    v_lo2 = (v_low - v_ret);
    return shortCase("10.3", "Gap tăng và kiểm tra lấp khoảng trống", ("Phiên trước giá cao " + String(v_h0) + ", đóng " + String(v_c0) + "; phiên tạo gap có thấp " + String(v_low) + ", đóng " + String(v_c1) + ". Phiên kiểm tra tiếp theo có thấp " + String(v_lo2) + ". Bài cho gap lấp hoàn toàn nếu giá chạm " + String(v_h0) + " hoặc thấp hơn."), "Gap tăng giữa hai nến xảy ra khi L mới cao hơn H cũ", ["Chỉ cần C mới cao hơn C cũ", "Chỉ cần khối lượng bình quân tăng", "Chỉ cần màu nến đổi"], "Độ rộng gap dùng L mới − H cũ. Phân biệt đã đi vào vùng gap và đã đi xuyên đầy đủ vùng.", "Dùng chênh hai giá đóng để đo độ rộng vùng không có giao dịch giữa hai nến.", [["Độ rộng gap tăng", (v_low - v_h0), "đv", (String(v_low) + "−" + String(v_h0)), (v_c1 - v_c0)], ["Khoảng giá đã đi vào gap, tối đa bằng độ rộng", Math.min(v_ret, (v_low - v_h0)), "đv", ("min(" + String(v_ret) + "," + String((v_low - v_h0)) + ")"), v_ret], ["Khoảng còn lại chưa lấp", Math.max(0, (v_lo2 - v_h0)), "đv", ("max(0," + String(v_lo2) + "−" + String(v_h0) + ")"), Math.abs((v_lo2 - v_h0)), (v_low - v_h0)]], ((v_lo2 <= v_h0) ? "Gap đã lấp hết theo quy tắc bài" : "Gap vẫn còn một đoạn chưa lấp"), [((v_lo2 <= v_h0) ? "Gap vẫn còn một đoạn chưa lấp" : "Gap đã lấp hết theo quy tắc bài"), "Cứ có gap là không bao giờ lấp", "Không đủ giá thấp để kiểm tra dù bài đã cho giá này"]);
  },
  gdp: function(v_r) {
    let v_c, v_g, v_i, v_last, v_m, v_nominal, v_p, v_real, v_x;
    v_c = v_r.randint(65, 160);
    v_i = v_r.randint(20, 55);
    v_g = v_r.randint(14, 40);
    v_x = v_r.randint(25, 62);
    v_m = v_r.randint(25, 62);
    v_p = v_r.randint(101, 122);
    v_nominal = ((((v_c + v_i) + v_g) + v_x) - v_m);
    v_real = fraction((100 * v_nominal), v_p);
    v_last = v_r.randint(85, 160);
    return buildCase("2.4", "GDP danh nghĩa và GDP thực", ("Chi tiêu theo giá hiện hành: C=" + String(v_c) + ", I=" + String(v_i) + ", G=" + String(v_g) + ", X=" + String(v_x) + ", M=" + String(v_m) + " tỷ. Chỉ số giảm phát GDP là " + String(v_p) + " với năm gốc bằng 100. GDP thực năm trước là " + String(v_last) + " tỷ."), "Khi tính GDP theo phương pháp chi tiêu, nhập khẩu được đối xử thế nào?", "Trừ khỏi xuất khẩu trong xuất khẩu ròng", ["Cộng thêm cùng với xuất khẩu", "Trừ vào đầu tư rồi cộng lại vào chính phủ", "Bỏ qua cả xuất khẩu và nhập khẩu"], "GDP đo sản lượng tạo ra trong nước. Nhập khẩu được trừ khỏi tổng chi tiêu, sau đó chỉ số giảm phát dùng để quy ra giá năm gốc.", "GDP danh nghĩa tăng so với GDP thực cùng kỳ chứng minh sản lượng thực đã tăng qua năm.", [field("GDP danh nghĩa", v_nominal, "tỷ", (String(v_c) + " + " + String(v_i) + " + " + String(v_g) + " + " + String(v_x) + " − " + String(v_m)), ((((v_c + v_i) + v_g) + v_x) + v_m), ((v_c + v_i) + v_g)), field("GDP thực", v_real, "tỷ", (String(v_nominal) + " / (" + String(v_p) + "/100)"), fraction((v_nominal * v_p), 100), v_nominal), field("Tăng trưởng GDP thực so với năm trước", (((v_real / v_last) - 1) * 100), "%", ("(GDP thực / " + String(v_last) + " − 1) × 100"), (fraction((v_nominal - v_last), v_last) * 100))], "Chỉ số giảm phát lớn hơn 100. Kết luận chắc chắn nào đúng trong phạm vi dữ kiện?", "GDP danh nghĩa lớn hơn GDP thực của cùng kỳ", ["GDP thực nhất định giảm so với năm trước", "GDP thực lớn hơn GDP danh nghĩa của cùng kỳ", "Xuất khẩu ròng chắc chắn dương"]);
  },
  graham: function(v_r) {
    let v_am, v_base, v_bm, v_grow, v_n, v_passed, v_post, v_pre, v_revenue;
    v_base = v_r.randint(70, 135);
    v_revenue = (v_base + v_r.randint(12, 57));
    v_pre = v_r.randint(13, 32);
    v_post = (v_pre - v_r.randint(3, 9));
    v_grow = (fraction((v_revenue - v_base), v_base) * 100);
    v_bm = (fraction(v_pre, v_revenue) * 100);
    v_am = (fraction(v_post, v_revenue) * 100);
    v_passed = sumNumbers([(v_grow >= 25), (v_bm >= 18), (v_am >= 10)]);
    return buildCase("4.2", "Bộ lọc tỷ số theo bài Graham", ("Doanh thu tăng từ " + String(v_base) + " lên " + String(v_revenue) + " tỷ. LNTT " + String(v_pre) + " tỷ và LNST " + String(v_post) + " tỷ. Với bài này, thử 3 điều kiện trong bộ lọc: tăng trưởng doanh thu ≥25%, biên trước thuế ≥18%, biên sau thuế ≥10%."), "Biên trước thuế đo bằng tử và mẫu nào?", "LNTT chia doanh thu", ["LNST chia doanh thu", "Doanh thu chia LNTT", "Giá thị trường chia lợi nhuận trước thuế"], "Đây là các ngưỡng của bài tập. Lần lượt tính tăng trưởng theo kỳ gốc, biên trước thuế và biên sau thuế theo kỳ phân tích.", "Tính tăng trưởng doanh thu bằng chênh lệch chia doanh thu kỳ mới.", [field("Tăng trưởng doanh thu", v_grow, "%", ("(" + String(v_revenue) + " − " + String(v_base) + ") / " + String(v_base) + " × 100"), (fraction((v_revenue - v_base), v_revenue) * 100)), field("Biên trước thuế", v_bm, "%", (String(v_pre) + " / " + String(v_revenue) + " × 100"), v_am), field("Biên sau thuế", v_am, "%", (String(v_post) + " / " + String(v_revenue) + " × 100"), v_bm)], "Doanh nghiệp đáp ứng bao nhiêu trong ba điều kiện đã cho?", (String(v_passed) + " tiêu chí"), Array.from(rangeOf(4).filter((v_n) => (v_n !== v_passed)).map((v_n) => (String(v_n) + " tiêu chí"))));
  },
  hammer: function(v_r) {
    let v_b, v_c, v_h, v_l, v_move, v_name, v_o;
    v_o = v_r.randint(31, 85);
    v_b = v_r.randint(1, 5);
    v_c = (v_o + v_b);
    v_h = (v_c + v_r.randint(0, 2));
    v_l = (v_o - (v_b * v_r.randint(2, 5)));
    v_move = v_r.choice(["tăng", "giảm"]);
    v_name = ((v_move === "giảm") ? "Hammer" : "Hanging man");
    return shortCase("7.9", "Nhận diện nến có bóng dưới dài", ("Sau nhịp giá " + String(v_move) + ", nến có O=" + String(v_o) + ", H=" + String(v_h) + ", L=" + String(v_l) + ", C=" + String(v_c) + ", thân ở gần phần trên của biên. Xét mẫu tiềm năng."), "Tên mẫu phụ thuộc xu hướng trước", ["Tên mẫu chỉ phụ thuộc màu thân", "Tên mẫu từ khối lượng phiên sau dù chưa quan sát", "Mọi nến bóng dưới đều là Doji"], "Hammer thường xét sau nhịp giảm. Hanging man tương tự về hình dáng nhưng xét sau nhịp tăng.", "Màu thân đủ để phân biệt Hammer và Hanging man.", [["Thân", v_b, "đv", (String(v_c) + "−" + String(v_o)), (v_h - v_l)], ["Bóng dưới", (v_o - v_l), "đv", (String(v_o) + "−" + String(v_l)), (v_c - v_l)], ["Bóng dưới trên thân", fraction((v_o - v_l), v_b), "lần", "Độ dài bóng dưới / thân", fraction(v_b, (v_o - v_l))]], v_name, [((v_name === "Hammer") ? "Hanging man" : "Hammer"), "Shooting Star", "Bearish Engulfing"], "Tên mẫu tiềm năng nào hợp nhất với bối cảnh?");
  },
  inflation: function(v_r) {
    let v_dec, v_end, v_inc, v_mid, v_nom, v_rate, v_real, v_start, v_trend;
    v_start = v_r.randint(95, 125);
    v_inc = v_r.randint(3, 13);
    v_dec = (v_r.randint((-5), 12) || 2);
    v_mid = (v_start + v_inc);
    v_end = (v_mid + v_dec);
    v_nom = v_r.randint(3, 15);
    v_rate = (fraction((v_end - v_mid), v_mid) * 100);
    v_real = (((fraction((100 + v_nom), 100) / fraction(v_end, v_mid)) - 1) * 100);
    v_trend = ((v_end > v_mid) ? "tăng" : "giảm");
    return buildCase("2.7", "CPI và sức mua", ("CPI ở ba kỳ liên tiếp là " + String(v_start) + ", " + String(v_mid) + ", " + String(v_end) + ". Thu nhập danh nghĩa từ kỳ giữa đến kỳ cuối tăng " + String(v_nom) + "%. Dùng công thức thay đổi sức mua chính xác theo tỷ số."), "Chỉ tiêu nào theo dõi biến động giá của giỏ hàng tiêu dùng?", "CPI", ["GDP thực", "Số nhân tiền tệ", "PMI"], "Tỷ lệ lạm phát so CPI của hai kỳ liên tiếp. Thay đổi thu nhập thực tính bằng tỷ số giữa chỉ số thu nhập danh nghĩa và chỉ số giá.", "Tốc độ tăng CPI thấp hơn kỳ trước đồng nghĩa mức giá chung đã giảm.", [field("Biến động CPI từ kỳ đầu sang kỳ giữa", (fraction(v_inc, v_start) * 100), "%", ("(" + String(v_mid) + " / " + String(v_start) + " − 1) × 100"), v_inc), field("Biến động CPI từ kỳ giữa sang kỳ cuối", v_rate, "%", ("(" + String(v_end) + " / " + String(v_mid) + " − 1) × 100"), v_dec, (fraction((v_end - v_start), v_start) * 100)), field("Thay đổi thu nhập thực kỳ cuối", v_real, "%", ("[(1 + " + String(v_nom) + "%) / (" + String(v_end) + "/" + String(v_mid) + ") − 1] × 100"), (fraction(v_nom) - v_rate), (v_nom + v_rate))], "Mức giá của giỏ CPI đi theo hướng nào từ kỳ giữa đến kỳ cuối?", ("Mức giá " + v_trend), [("Mức giá " + ((v_trend === "tăng") ? "giảm" : "tăng")), "Mức giá giữ nguyên", "Chỉ CPI danh nghĩa đổi, giá không thay đổi"]);
  },
  issue: function(v_r) {
    let v_cost, v_newly, v_p, v_secondary, v_total;
    v_newly = v_r.randint(2, 12);
    v_secondary = v_r.randint(1, 7);
    v_p = v_r.randint(15, 38);
    v_cost = v_r.randint(1, 5);
    v_total = (v_newly + v_secondary);
    return buildCase("1.6", "Chào bán sơ cấp và bán lại", ("Trong một đợt chào bán hỗn hợp, công ty phát hành mới " + String(v_newly) + " triệu cổ phiếu và cổ đông cũ bán " + String(v_secondary) + " triệu cổ phiếu. Mọi cổ phiếu bán với giá " + String(v_p) + " nghìn đồng/cp. Công ty chịu phí " + String(v_cost) + " tỷ đồng, cổ đông cũ không chịu phí trong bài."), "Cổ phiếu bán lần đầu bởi doanh nghiệp thuộc thị trường nào?", "Thị trường sơ cấp", ["Thị trường thứ cấp", "Thị trường tiền tệ", "Thị trường liên ngân hàng"], "Cần tách tiền của công ty với tiền của cổ đông bán lại, dù được chào bán cùng lúc.", "Doanh nghiệp nhận toàn bộ số tiền công chúng thanh toán trong mọi chào bán hỗn hợp.", [field("Tổng tiền người mua bỏ ra", (v_total * v_p), "tỷ đồng", ("(" + String(v_newly) + " + " + String(v_secondary) + ") × " + String(v_p)), (v_newly * v_p)), field("Tiền công ty nhận sau phí", ((v_newly * v_p) - v_cost), "tỷ đồng", (String(v_newly) + " × " + String(v_p) + " − " + String(v_cost)), ((v_total * v_p) - v_cost), (v_newly * v_p)), field("Tỷ trọng tiền công ty nhận trên tổng tiền người mua chi", (fraction(((v_newly * v_p) - v_cost), (v_total * v_p)) * 100), "%", "Tiền công ty nhận sau phí chia tổng tiền người mua trả", (fraction(v_newly, v_total) * 100), (fraction(v_secondary, v_total) * 100))], "Nếu cổ đông cũ bán gấp đôi nhưng lượng phát hành mới, phí và giá giữ nguyên, điều gì xảy ra?", "Tổng tiền người mua tăng, tiền ròng công ty nhận giữ nguyên", ["Tổng tiền người mua giữ nguyên", "Tiền ròng công ty tự động tăng gấp đôi", "Tiền ròng công ty bằng tiền cổ đông cũ thu"]);
  },
  liquidity: function(v_r) {
    let v_a, v_ar, v_cash, v_current, v_stock;
    v_cash = v_r.randint(14, 51);
    v_ar = v_r.randint(20, 60);
    v_stock = v_r.randint(25, 85);
    v_current = v_r.randint(41, 92);
    v_a = ((v_cash + v_ar) + v_stock);
    return buildCase("3.5", "Thanh khoản và cơ cấu tài sản", ("Tài sản ngắn hạn gồm tiền " + String(v_cash) + ", phải thu " + String(v_ar) + ", tồn kho " + String(v_stock) + " tỷ. Nợ ngắn hạn " + String(v_current) + " tỷ. Giả định trả trước bằng 0."), "Chỉ số thanh toán nhanh loại khoản mục nào trong ba khoản tài sản được nêu?", "Hàng tồn kho", ["Tiền", "Nợ ngắn hạn ở mẫu số", "Phải thu theo giả định của bài"], "Current ratio dùng toàn bộ tài sản ngắn hạn. Quick ratio dùng tiền và phải thu trong giả định bài.", "Chỉ cần nhìn hệ số 1 kỳ là chắc chắn biết mọi khoản nợ đều thanh toán đúng hạn.", [field("Vốn lưu động ròng", (v_a - v_current), "tỷ", (String(v_cash) + " + " + String(v_ar) + " + " + String(v_stock) + " − " + String(v_current)), v_a, (v_current - v_a)), field("Hệ số thanh toán hiện hành", fraction(v_a, v_current), "lần", (String(v_a) + " / " + String(v_current)), fraction((v_cash + v_ar), v_current), fraction(v_current, v_a)), field("Hệ số thanh toán nhanh", fraction((v_cash + v_ar), v_current), "lần", ("(" + String(v_cash) + " + " + String(v_ar) + ") / " + String(v_current)), fraction(v_cash, v_current), fraction(v_a, v_current))], "Nếu mua thêm tồn kho bằng tiền mặt cùng giá trị, các chỉ số đổi thế nào?", "Thanh toán hiện hành giữ nguyên, thanh toán nhanh giảm", ["Cả hai tỷ số tăng", "Cả hai tỷ số giữ nguyên", "Thanh toán nhanh tăng, thanh toán hiện hành giảm"]);
  },
  logchart: function(v_r) {
    let v_a, v_alternatives, v_answer, v_b, v_base, v_more, v_next_, v_top, v_x;
    v_base = v_r.randint(10, 50);
    v_top = (v_base + v_r.randint(6, 23));
    v_next_ = (v_top + v_r.randint(6, 25));
    v_a = (fraction((v_top - v_base), v_base) * 100);
    v_b = (fraction((v_next_ - v_top), v_top) * 100);
    v_more = ((v_a > v_b) ? "nhịp đầu" : ((v_b > v_a) ? "nhịp sau" : "hai nhịp bằng nhau"));
    v_answer = ((v_a === v_b) ? "Hai nhịp bằng nhau" : ("Nhịp có phần trăm tăng lớn hơn là " + v_more));
    v_alternatives = ["Hai nhịp bằng nhau", "Nhịp có phần trăm tăng lớn hơn là nhịp đầu", "Nhịp có phần trăm tăng lớn hơn là nhịp sau", "Số điểm tăng luôn bằng phần trăm tăng"];
    return buildCase("5.8", "Đọc biến động tương đối trên đồ thị", ("Một tài sản tăng từ " + String(v_base) + " lên " + String(v_top) + ", rồi từ " + String(v_top) + " lên " + String(v_next_) + ". So sánh theo phần trăm của từng nhịp. Không xét cổ tức hay phí."), "Khi cùng khoảng dọc thể hiện cùng tỷ lệ thay đổi giá, đồ thị dùng thang gì?", "Thang logarithm", ["Thang tuyến tính theo giá", "Thang thời gian đều", "Thang khối lượng danh nghĩa"], "Tỷ lệ nhịp thứ hai dùng giá ở đầu nhịp hai. Lợi suất toàn giai đoạn ghép bằng tích các hệ số tăng.", "Cộng thẳng hai tỷ suất của các nhịp liên tiếp luôn bằng tỷ suất gộp.", [field("Tỷ lệ tăng nhịp đầu", v_a, "%", ("(" + String(v_top) + " / " + String(v_base) + " − 1) × 100"), (v_top - v_base)), field("Tỷ lệ tăng nhịp sau", v_b, "%", ("(" + String(v_next_) + " / " + String(v_top) + " − 1) × 100"), (fraction((v_next_ - v_top), v_base) * 100)), field("Tỷ lệ tăng cả hai nhịp", (fraction((v_next_ - v_base), v_base) * 100), "%", ("(" + String(v_next_) + " / " + String(v_base) + " − 1) × 100"), (v_a + v_b), v_b)], "Nhịp nào cao hơn theo phần trăm?", v_answer, Array.from(v_alternatives.filter((v_x) => (v_x !== v_answer)).map((v_x) => v_x)));
  },
  macd: function(v_r) {
    let v_a, v_b, v_fast, v_hist, v_line, v_n, v_p, v_s, v_slow, v_x;
    v_a = v_r.randint(48, 86);
    v_b = (v_a + v_r.choice([(-4), (-2), 2, 4]));
    v_p = v_r.randint((v_a - 9), (v_a + 9));
    v_s = v_r.choice([(-4), (-2), 1, 3, 5]);
    v_fast = fraction(((2 * v_a) + v_p), 3);
    v_slow = fraction(((8 * v_b) + v_p), 9);
    v_line = (v_fast - v_slow);
    v_hist = (v_line - v_s);
    return shortCase("6.4", "EMA và MACD", ("EMA nhanh cũ " + String(v_a) + ", EMA chậm cũ " + String(v_b) + ", giá đóng mới " + String(v_p) + ". EMA nhanh dùng α=1/3, chậm dùng α=1/9. Signal mới bằng " + String(v_s) + "."), "MACD = EMA nhanh − EMA chậm", ["MACD = Signal − EMA nhanh", "MACD = EMA nhanh + EMA chậm", "MACD = giá đóng − giá mở"], "EMA cập nhật bằng α × giá mới + (1 − α) × EMA cũ. Histogram = MACD − Signal.", "Histogram dương đủ chứng minh giá sẽ tăng ở phiên tiếp theo.", [["EMA nhanh mới", v_fast, "đv", ("(" + String(v_a) + "×2 + " + String(v_p) + ")/3"), v_a, fraction((v_a + v_p), 2)], ["MACD mới", v_line, "đv", ("EMA nhanh mới − (" + String(v_b) + "×8 + " + String(v_p) + ")/9"), (v_a - v_b), (-v_line)], ["Histogram", v_hist, "đv", ("MACD mới − (" + String(v_s) + ")"), (v_line + v_s), (-v_hist)]], ((v_hist > 0) ? "MACD ở trên Signal" : ((v_hist < 0) ? "MACD ở dưới Signal" : "MACD bằng Signal")), Array.from([["MACD ở trên Signal", 1], ["MACD ở dưới Signal", (-1)], ["MACD bằng Signal", 0]].filter(([v_x, v_n]) => (v_n !== ((v_hist > 0) - (v_hist < 0)))).map(([v_x, v_n]) => v_x)).concat(["Signal bằng giá đóng trong mọi trường hợp"]), "MACD và Signal hiện có quan hệ gì?");
  },
  margin: function(v_r) {
    let v_a, v_call, v_debt, v_fall, v_interest, v_start, v_threshold, v_tot, v_v;
    v_start = v_r.randint(90, 145);
    v_debt = v_r.randint(28, 57);
    v_fall = v_r.randint(10, 38);
    v_interest = v_r.randint(1, 6);
    v_v = (v_start - v_fall);
    v_tot = (v_debt + v_interest);
    v_threshold = v_r.choice([25, 35, 40]);
    v_a = (fraction((v_v - v_tot), v_v) * 100);
    v_call = (v_a < v_threshold);
    return shortCase("9.8", "Ký quỹ sau khi giá giảm", ("Giá trị vị thế ban đầu " + String(v_start) + " triệu, nợ gốc " + String(v_debt) + " triệu. Giá trị giảm " + String(v_fall) + " triệu và lãi nhập nợ " + String(v_interest) + " triệu. Bài quy định cần bổ sung tài sản nếu tỷ lệ ký quỹ dưới " + String(v_threshold) + "%."), "Tỷ lệ ký quỹ dùng phần vốn chủ trên giá trị vị thế hiện tại", ["Tỷ lệ ký quỹ bằng dư nợ trên vốn ban đầu", "Tỷ lệ ký quỹ là lãi vay trên doanh thu", "Chia vốn chủ mới cho giá trị vị thế ban đầu trong mọi kỳ"], "Tính giá trị mới, cập nhật dư nợ gồm lãi, lấy chênh làm vốn chủ rồi chia giá trị hiện tại.", "Giữ nguyên giá trị ban đầu làm mẫu số sau khi giá chứng khoán giảm.", [["Giá trị vị thế mới", v_v, "triệu", (String(v_start) + "−" + String(v_fall)), v_start], ["Vốn chủ hiện tại", (v_v - v_tot), "triệu", (String(v_v) + "−(" + String(v_debt) + "+" + String(v_interest) + ")"), (v_v - v_debt), (v_start - v_tot)], ["Tỷ lệ ký quỹ hiện tại", v_a, "%", ("(" + String(v_v) + "−" + String(v_tot) + ")/" + String(v_v) + "×100"), (fraction((v_v - v_tot), v_start) * 100), (fraction(v_tot, v_v) * 100)]], (v_call ? "Cần bổ sung tài sản theo ngưỡng bài" : "Tỷ lệ hiện chưa thấp hơn ngưỡng bài"), [(v_call ? "Tỷ lệ hiện chưa thấp hơn ngưỡng bài" : "Cần bổ sung tài sản theo ngưỡng bài"), "Luôn buộc đóng vị thế dù tỷ lệ bao nhiêu", "Dư nợ tự giảm cùng giá nên không cần kiểm tra"]);
  },
  obv: function(v_r) {
    let v_a, v_b, v_c, v_init;
    v_init = v_r.randrange(300, 700, 10);
    v_a = v_r.randrange(70, 160, 10);
    v_b = v_r.randrange(60, 135, 10);
    v_c = v_r.randrange(80, 170, 10);
    return shortCase("10.4", "OBV qua chuỗi phiên", ("OBV trước chuỗi " + String(v_init) + " nghìn. Phiên A đóng tăng, khối lượng " + String(v_a) + " nghìn; B đóng giảm, " + String(v_b) + " nghìn; C đóng ngang, " + String(v_c) + " nghìn."), "Cộng volume khi giá đóng tăng và trừ khi giảm", ["Cộng volume mọi phiên", "Trừ volume mọi phiên", "Dùng giá mở để thay toàn bộ volume"], "Nếu đóng bằng phiên trước, giữ nguyên OBV. Tập trung vào hướng và xác nhận thay vì giá trị tuyệt đối của gốc OBV.", "Cộng khối lượng phiên C vào OBV dù giá đóng bằng phiên trước.", [["OBV sau phiên A", (v_init + v_a), "nghìn", (String(v_init) + "+" + String(v_a)), (v_init - v_a)], ["OBV sau phiên B", ((v_init + v_a) - v_b), "nghìn", (String(v_init) + "+" + String(v_a) + "−" + String(v_b)), ((v_init + v_a) + v_b)], ["OBV sau phiên C", ((v_init + v_a) - v_b), "nghìn", "Giữ nguyên OBV sau B", (((v_init + v_a) - v_b) + v_c), (((v_init + v_a) - v_b) - v_c)]], "Khối lượng cao trong phiên đóng ngang không tự làm OBV nhảy", ["Phiên C tăng OBV bằng volume", "Phiên C giảm OBV bằng volume", "OBV luôn bằng khối lượng phiên cuối"]);
  },
  option: function(v_r) {
    let v_call, v_k, v_p, v_premium, v_profit, v_qty, v_typ, v_value;
    v_k = v_r.randint(24, 75);
    v_p = (v_k + v_r.choice([(-13), (-8), (-3), 2, 5, 8, 13]));
    v_premium = v_r.randint(3, 11);
    v_qty = v_r.choice([10, 20, 30, 50]);
    v_call = v_r.choice([true, false]);
    v_typ = (v_call ? "mua (call)" : "bán (put)");
    v_value = Math.max((v_call ? (v_p - v_k) : (v_k - v_p)), 0);
    v_profit = (v_value - v_premium);
    return shortCase("1.3", "Quyền chọn, giá trị nội tại và điểm hòa vốn", ("Mua " + String(v_qty) + " quyền chọn " + String(v_typ) + ", giá thực hiện " + String(v_k) + ", phí mỗi quyền " + String(v_premium) + ". Đến đáo hạn, tài sản cơ sở giá " + String(v_p) + ". Mỗi quyền trên 1 đơn vị. Bỏ qua chiết khấu và phí khác."), "Giá trị nội tại tại đáo hạn được chặn dưới ở 0 cho người mua quyền", ["Giá trị nội tại là số âm nếu thực hiện bất lợi", "Lợi nhuận bằng ngay nội tại trước phí", "Người mua quyền bắt buộc thực hiện khi bất lợi"], "Chọn mức hưởng theo chiều call/put nhưng ít nhất là 0, rồi trừ phí đã trả. Quyết định thực hiện dựa vào giá trị nội tại, lợi nhuận ròng còn xét phí.", "Nếu thực hiện quyền tạo tiền vào dương thì vị thế chắc chắn đã có lãi sau phí.", [["Giá trị nội tại mỗi quyền", v_value, "đv", (v_call ? ("max(0, " + String(v_p) + "−" + String(v_k) + ")") : ("max(0, " + String(v_k) + "−" + String(v_p) + ")")), Math.abs((v_p - v_k)), v_premium], ["Lãi/lỗ ròng mỗi quyền", v_profit, "đv", (String(v_value) + "−" + String(v_premium)), v_value, (v_value + v_premium)], ["Lãi/lỗ ròng toàn vị thế", (v_profit * v_qty), "đv", ("(" + String(v_value) + "−" + String(v_premium) + ")×" + String(v_qty)), (v_value * v_qty), ((v_value + v_premium) * v_qty)]], (v_value ? "Thực hiện quyền có lợi về khoản thanh toán lúc đáo hạn" : "Không có khoản thanh toán dương từ thực hiện quyền"), [(v_value ? "Không có khoản thanh toán dương từ thực hiện quyền" : "Thực hiện quyền có lợi về khoản thanh toán lúc đáo hạn"), "Giá trị nội tại luôn bằng phí", "Phí đã trả làm đổi giá tài sản cơ sở"], "Chỉ xét khoản thanh toán từ thực hiện quyền tại đáo hạn, kết luận nào đúng?");
  },
  reversal: function(v_r) {
    let v_a, v_close, v_ex, v_n, v_side;
    v_n = v_r.randint(33, 88);
    v_a = v_r.randint(6, 18);
    v_side = v_r.choice([(-1), 1]);
    v_ex = (v_n - (v_side * v_a));
    v_close = (v_n + (v_side * v_r.randint(1, 4)));
    return shortCase("8.2", "Neckline và mục tiêu đảo chiều", ("Mẫu " + String(((v_side === 1) ? "hai đáy" : "hai đỉnh")) + " có cực trị " + String(v_ex) + ", neckline ngang " + String(v_n) + ", đóng xác nhận " + String(v_close) + ". Chiếu mục tiêu từ neckline theo hướng phá."), "Mẫu hai đỉnh xác nhận khi phá xuống neckline", ["Hai đỉnh xác nhận khi vượt đỉnh cao hơn", "Hai đỉnh chỉ cần hai cây nến cùng màu", "Breakout luôn đồng nghĩa đạt mục tiêu"], "Chiều cao là khoảng cách tuyệt đối từ cực trị đến neckline. Chiếu chiều cao về phía phá vỡ từ giá nằm trên neckline.", "Luôn chiếu lên từ neckline dù giá phá xuống.", [["Chiều cao mẫu", v_a, "đv", ("|" + String(v_ex) + "−" + String(v_n) + "|"), Math.abs((v_ex - v_close))], ["Khoảng cách giá đóng tới neckline", Math.abs((v_close - v_n)), "đv", ("|" + String(v_close) + "−" + String(v_n) + "|"), v_a], ["Mục tiêu đo", (v_n + (v_side * v_a)), "đv", (String(v_n) + " + (" + String(v_side) + "×" + String(v_a) + ")"), (v_close + (v_side * v_a)), v_ex]], "Nếu giá quay qua neckline, cần xem dấu hiệu phá vỡ thất bại", ["Neckline hết liên quan sau khi vẽ", "Giá phải đạt đích dù vượt ngược neckline", "Mục tiêu chắc chắn tự tăng gấp đôi"]);
  },
  rights: function(v_r) {
    let v_I, v_bonus, v_cash, v_ex, v_issue, v_num, v_price, v_ratio, v_subscription;
    v_price = v_r.randrange(40, 80, 2);
    v_cash = v_r.randint(1, 5);
    v_issue = v_r.randrange(12, 28, 2);
    v_bonus = v_r.choice([10, 20, 25, 30]);
    v_subscription = v_r.choice([10, 20, 25, 30]);
    v_ratio = fraction((v_bonus + v_subscription), 100);
    v_I = fraction(v_subscription, 100);
    v_num = ((v_price - v_cash) + (v_I * v_issue));
    v_ex = (v_num / (1 + v_ratio));
    return shortCase("9.7", "Cổ tức và quyền mua đồng thời", ("Đóng cửa trước quyền " + String(v_price) + " nghìn/cp. Cổ tức tiền " + String(v_cash) + " nghìn/cp, cổ tức cổ phiếu " + String(v_bonus) + "%, quyền mua thêm tỷ lệ " + String(v_subscription) + "% ở giá " + String(v_issue) + " nghìn/cp. Giả sử các quyền cùng ngày, mọi cổ đông thực hiện đủ, bỏ qua bước giá."), "Giá lý thuyết điều chỉnh cả dòng tiền quyền và số cổ phiếu tăng", ["Chỉ trừ cổ tức tiền rồi giữ nguyên mẫu số", "Chỉ tăng giá theo cổ tức cổ phiếu", "Luôn lấy giá đăng ký mua làm tham chiếu"], "Lập giá trị sau quyền trên một cổ phiếu cũ: giá cũ trừ cổ tức tiền, cộng tiền nộp cho quyền mua. Chia tổng số cổ phiếu trên một cổ phiếu cũ.", "Cộng tiền quyền mua vào tử số rồi giữ nguyên số cổ phiếu ở mẫu số.", [["Số cổ phiếu sau quyền trên một cổ phiếu cũ", (1 + v_ratio), "cp", ("1+" + String(v_bonus) + "%+" + String(v_subscription) + "%"), (1 + v_I)], ["Tử số giá trị theo một cổ phiếu cũ", v_num, "nghìn", (String(v_price) + "−" + String(v_cash) + "+" + String(v_subscription) + "%×" + String(v_issue)), (v_price - v_cash), ((v_price + v_cash) + (v_I * v_issue))], ["Giá sau quyền lý thuyết", v_ex, "nghìn/cp", "Tử số sau quyền / số cổ phiếu sau quyền", v_num, (v_price - v_cash)]], "Cổ đông cùng thực hiện theo tỷ lệ thì tỷ lệ sở hữu tương đối giữ nguyên", ["Số cổ phiếu cá nhân bắt buộc giữ nguyên", "Giá cũ và giá mới luôn bằng nhau", "Vốn hóa sau quyền bằng tiền mặt nhận được"]);
  },
  trading_return: function(v_r) {
    let v_buy, v_buy_cost, v_div, v_fee, v_gap, v_net, v_qty, v_relation, v_result, v_sell, v_x;
    v_qty = (v_r.randint(3, 20) * 100);
    v_buy = v_r.randint(12, 40);
    v_gap = (v_r.randint((-5), 9) || 3);
    v_sell = (v_buy + v_gap);
    v_fee = fraction(v_r.choice([2, 3, 4, 5]), 1000);
    v_div = v_r.randint(1, 4);
    v_buy_cost = ((v_qty * v_buy) * (1 + v_fee));
    v_net = (v_qty * ((v_sell * (1 - v_fee)) + v_div));
    v_result = (((v_net / v_buy_cost) - 1) * 100);
    v_relation = ((v_result < 0) ? "âm" : ((v_result > 0) ? "dương" : "bằng 0"));
    return buildCase("1.11", "Lợi nhuận sau phí", ("Mua " + String(v_qty) + " cổ phiếu giá " + String(v_buy) + " nghìn đồng/cp, bán giá " + String(v_sell) + " nghìn đồng/cp và đã nhận cổ tức " + String(v_div) + " nghìn đồng/cp. Phí mỗi chiều là " + String(Number((v_fee * 100))) + "% giá trị giao dịch. Bỏ qua thuế."), "Phần chênh lệch giá sau khi cộng cổ tức thuộc chỉ tiêu nào?", "Lợi nhuận nắm giữ", ["Giá tham chiếu", "Vốn điều lệ", "Hệ số thanh toán nhanh"], "Khi tính lợi nhuận nắm giữ, phí mua làm tăng tiền vốn và phí bán làm giảm tiền thu.", "Cả phí mua và phí bán đều cộng vào tiền thu cuối kỳ.", [field("Tổng vốn thực chi", v_buy_cost, "nghìn đồng", (String(v_qty) + " × " + String(v_buy) + " × (1 + phí)"), (v_qty * v_buy)), field("Tổng thu ròng cuối kỳ", v_net, "nghìn đồng", (String(v_qty) + " × [" + String(v_sell) + " × (1 − phí) + " + String(v_div) + "]"), (v_qty * (v_sell + v_div)), ((v_qty * v_sell) * (1 - v_fee))), field("Tỷ suất sinh lời ròng", v_result, "%", "(Tổng thu ròng / tổng vốn thực chi − 1) × 100", (fraction(v_gap, v_buy) * 100), ((v_net / v_buy_cost) * 100))], "Dựa trên toàn bộ dòng tiền, tỷ suất ròng có dấu gì?", ("Tỷ suất ròng " + v_relation), Array.from(["dương", "âm", "bằng 0"].filter((v_x) => (v_x !== v_relation)).map((v_x) => ("Tỷ suất ròng " + v_x))).concat(["Không thể xác định khi đã biết các dòng tiền"]));
  },
  trendline: function(v_r) {
    let v_close, v_direction, v_expected, v_p, v_p2, v_slope, v_x1, v_x2, v_x3;
    v_p = v_r.randint(18, 41);
    v_slope = v_r.randint(1, 7);
    v_x1 = v_r.choice([1, 2, 3]);
    v_x2 = (v_x1 + v_r.randint(2, 5));
    v_x3 = (v_x2 + v_r.randint(1, 5));
    v_p2 = (v_p + ((v_x2 - v_x1) * v_slope));
    v_expected = (v_p + ((v_x3 - v_x1) * v_slope));
    v_close = (v_expected + v_r.choice([(-6), (-4), (-2), 2, 4, 6]));
    v_direction = ((v_close > v_expected) ? "phía trên" : "phía dưới");
    return buildCase("5.7", "Trendline tăng và kiểm định hỗ trợ", ("Đáy thứ nhất ở phiên " + String(v_x1) + " giá " + String(v_p) + ", đáy thứ hai ở phiên " + String(v_x2) + " giá " + String(v_p2) + ". Đường hỗ trợ được kéo dài tuyến tính theo số phiên. Phiên " + String(v_x3) + " đóng cửa " + String(v_close) + "."), "Trong cách vẽ cơ bản, đường hỗ trợ của xu hướng tăng nối các điểm nào?", "Các đáy cao dần", ["Các đỉnh giảm dần", "Các giá mở cửa bất kỳ", "Các mức giá đóng giống nhau"], "Độ dốc là thay đổi giá chia thay đổi số phiên. Dùng giao điểm trên chính phiên cần so sánh.", "Dùng đúng giá đáy gần nhất làm giá nằm trên trendline cho mọi phiên tiếp theo.", [field("Độ dốc đường hỗ trợ", v_slope, "đv/phiên", ("(" + String(v_p2) + " − " + String(v_p) + ") / (" + String(v_x2) + " − " + String(v_x1) + ")"), (v_p2 - v_p), (-v_slope)), field("Mức hỗ trợ chiếu tới phiên cuối", v_expected, "đv", (String(v_p2) + " + " + String(v_slope) + " × (" + String(v_x3) + " − " + String(v_x2) + ")"), v_p2, v_close), field("Chênh lệch đóng cửa so với trendline", (v_close - v_expected), "đv", (String(v_close) + " − " + String(v_expected)), (v_expected - v_close), (v_close - v_p2))], "Vị trí giá đóng cửa phiên cuối đối với đường hỗ trợ là gì?", ("Đóng cửa ở " + String(v_direction) + " trendline"), [(("Đóng cửa ở " + ((v_direction === "phía trên") ? "phía dưới" : "phía trên")) + " trendline"), "Đóng đúng trên đường theo nghĩa bằng nhau", "Không thể so với đường vì hai đáy không trùng giá"]);
  },
  triangle: function(v_r) {
    let v_a, v_b, v_br, v_normal, v_shrink, v_vol, v_w;
    v_a = v_r.randint(20, 70);
    v_w = v_r.randint(9, 26);
    v_b = (v_a + v_w);
    v_br = (v_b + v_r.randint(1, 6));
    v_normal = v_r.randint(64, 120);
    v_shrink = v_r.randint(29, 60);
    v_vol = v_r.randint(85, 220);
    return shortCase("8.4", "Tam giác thoát biên và khối lượng", ("Miệng tam giác từ " + String(v_a) + " đến " + String(v_b) + ", phá lên tại " + String(v_br) + ". Bình quân trước co hẹp " + String(v_normal) + " nghìn, trong co hẹp " + String(v_shrink) + " nghìn, tại phiên phá " + String(v_vol) + " nghìn."), "Khối lượng phối hợp với giá khi phá biên", ["Khối lượng thay thế hoàn toàn dữ kiện giá", "Khối lượng luôn tăng trong co hẹp", "Tam giác xác định chắc hướng trước khi phá"], "So khối lượng theo đúng nền cần dùng. Mục tiêu chiếu độ rộng miệng tam giác từ điểm phá.", "Muốn tính tỷ lệ so với giai đoạn co thì dùng mẫu số của thời kỳ trước co.", [["Khối lượng co trên nền trước", fraction(v_shrink, v_normal), "lần", (String(v_shrink) + "/" + String(v_normal)), fraction(v_normal, v_shrink)], ["Khối lượng phá trên nền co", fraction(v_vol, v_shrink), "lần", (String(v_vol) + "/" + String(v_shrink)), fraction(v_vol, v_normal)], ["Mục tiêu đo đơn giản", (v_br + v_w), "đv", (String(v_br) + "+(" + String(v_b) + "−" + String(v_a) + ")"), (v_b + v_w), (v_br - v_w)]], "Đọc thêm giá đóng và điều kiện vô hiệu để đánh giá phá vỡ", ["Bỏ qua giá vì khối lượng dương", "Bắt buộc mẫu quay về đáy sau khi phá", "Khoảng cách giá trùng mọi tỷ lệ khối lượng"]);
  },
  trin: function(v_r) {
    let v_a, v_down, v_t, v_up, v_v, v_vd, v_vu;
    v_up = v_r.randrange(60, 120, 5);
    v_down = v_r.randrange(40, 95, 5);
    v_vu = v_r.randrange(110, 250, 10);
    v_vd = v_r.randrange(85, 210, 10);
    v_a = fraction(v_up, v_down);
    v_v = fraction(v_vu, v_vd);
    v_t = (v_a / v_v);
    return shortCase("10.5", "Độ rộng và chỉ số Arms", ("Có " + String(v_up) + " mã tăng, " + String(v_down) + " mã giảm. Khối lượng nhóm tăng " + String(v_vu) + " triệu cp, nhóm giảm " + String(v_vd) + " triệu cp. Arms/TRIN bằng tỷ lệ mã tăng/giảm chia tỷ lệ khối lượng phía tăng/giảm."), "TRIN kết hợp độ rộng và tỷ lệ khối lượng", ["TRIN dựa trên doanh thu của mã tăng", "TRIN chỉ dựa trên số mã", "TRIN bằng khoảng cách giữa hai đường MACD"], "Tính hai tỷ số theo cùng chiều tăng chia giảm. Sau đó chia tỷ số số mã cho tỷ số volume.", "Nhân hai tỷ số để tính TRIN dù công thức yêu cầu chia.", [["Tỷ lệ số mã tăng/giảm", v_a, "lần", (String(v_up) + "/" + String(v_down)), (1 / v_a)], ["Tỷ lệ khối lượng tăng/giảm", v_v, "lần", (String(v_vu) + "/" + String(v_vd)), (1 / v_v)], ["Arms/TRIN", v_t, "lần", "Tỷ lệ số mã / tỷ lệ khối lượng", (v_a * v_v), (v_v / v_a)]], "Cần bối cảnh và chuỗi quan sát để phân tích thị trường", ["Một giá trị luôn bảo đảm thị trường ngày mai đi lên", "TRIN đúng bằng phần trăm sinh lời", "Không thể dùng hai loại dữ kiện cùng một chỉ số"]);
  },
  valuation: function(v_r) {
    let v_book, v_eps, v_pref, v_price, v_profit, v_shares;
    v_shares = v_r.randint(3, 14);
    v_profit = v_r.randint(34, 125);
    v_pref = v_r.randint(1, 7);
    v_price = v_r.randint(25, 65);
    v_book = v_r.randint(75, 240);
    v_eps = fraction((v_profit - v_pref), v_shares);
    return buildCase("3.7", "EPS, P/E và P/B", ("Công ty có LNST " + String(v_profit) + " tỷ, cổ tức cổ phần ưu đãi " + String(v_pref) + " tỷ, " + String(v_shares) + " triệu cổ phần phổ thông bình quân và cuối kỳ. Thị giá " + String(v_price) + " nghìn đồng/cp. Giá trị sổ sách vốn chủ thuộc cổ đông phổ thông cuối kỳ " + String(v_book) + " tỷ."), "Để tính EPS phổ thông, tử số nào phù hợp với dữ kiện đề?", "LNST trừ cổ tức cổ phần ưu đãi", ["Tổng doanh thu", "Vốn chủ chia cổ tức phổ thông", "LNST cộng cổ tức cổ phần ưu đãi"], "P/E đối chiếu thị giá với lợi nhuận mỗi cổ phiếu. P/B đối chiếu thị giá với giá trị sổ sách trên mỗi cổ phiếu.", "Dùng lợi nhuận tổng của công ty làm mẫu số trực tiếp của giá một cổ phiếu.", [field("EPS phổ thông", v_eps, "nghìn đồng/cp", ("(" + String(v_profit) + " − " + String(v_pref) + ") / " + String(v_shares)), fraction(v_profit, v_shares), (v_profit - v_pref)), field("P/E", (fraction(v_price, 1) / v_eps), "lần", (String(v_price) + " / EPS"), fraction((v_price * v_shares), v_profit), (v_eps / v_price)), field("P/B", fraction((v_price * v_shares), v_book), "lần", (String(v_price) + " / (" + String(v_book) + " / " + String(v_shares) + ")"), fraction(v_price, v_book), fraction(v_book, (v_price * v_shares)))], "Nếu EPS chuyển sang âm và thị giá vẫn dương, cách đọc P/E nào phù hợp?", "Hạn chế so P/E với doanh nghiệp có EPS dương và kiểm tra nguyên nhân lợi nhuận âm", ["Xếp P/E âm là cổ phiếu rẻ nhất bằng cách xếp tăng dần", "Chuyển mọi P/E âm thành P/E bằng 0", "Đọc P/E âm là cổ tức tiền đã trả"]);
  }
};