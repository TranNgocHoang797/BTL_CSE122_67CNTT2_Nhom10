# BÁO CÁO KHAI BÁO SỬ DỤNG AI (AI USAGE REPORT)

> **Dự án:** SmartShelf – Điều hành kệ hàng và hỗ trợ mua sắm (RetailTech OS)  
> **Học phần:** PHÁT TRIỂN ỨNG DỤNG WEB CƠ BẢN – CSE122  
> **Nhóm thực hiện:** Nhóm 10  
> **Thành viên:**
> 1. **Trần Quốc Khánh** (SV1): Phụ trách luồng Khách mua sắm (`shopper-*`), Quản trị danh mục sản phẩm (`admin-product-management.html`), Tích hợp `AI-2: Product Alternative`.
> 2. **Trần Nhật Quang** (SV2): Phụ trách luồng Nhân viên cửa hàng (`associate-*`), Quản trị khu vực & kệ hàng (`admin-zone-management.html`), Tích hợp `AI-1: Restock Priority`.
> 3. **Trần Ngọc Hoàng** (SV3): Phụ trách luồng Quản lý cửa hàng (`manager-*`), Quản trị tài khoản (`admin-user-management.html`), Tích hợp `AI-3: Shelf Anomaly Insight`.
>
> **Thời gian hoàn thành:** Học kỳ I – Năm học 2026-2027  
> **Cam kết:** Toàn bộ thông tin dưới đây được nhóm khai báo trung thực, minh bạch 100% về công cụ, prompt, phần AI sinh ra, các lỗi phát sinh, quy trình kiểm chứng và mã nguồn do sinh viên tự tinh chỉnh.

---

## 1. TỔNG QUAN CÔNG CỤ AI ĐÃ SỬ DỤNG

Trong suốt quá trình phân tích bài toán, thiết kế giao diện và xây dựng mã nguồn cho dự án **SmartShelf**, nhóm đã sử dụng các công cụ trí tuệ nhân tạo có kiểm soát nhằm tăng tốc độ phát triển và học hỏi kỹ thuật:

| Tên công cụ | Phiên bản / Môi trường | Mục đích sử dụng chính | Tần suất |
| :--- | :--- | :--- | :--- |
| **ChatGPT (OpenAI)** | GPT-4o (Web Interface) | Lên dàn ý cấu trúc bài toán BTL, phân loại vai trò người dùng, sinh dữ liệu mẫu ban đầu (Mock JSON) chuẩn siêu thị Việt Nam. | Giai đoạn khởi tạo đề tài |
| **Claude (Anthropic)** | Claude 3.5 Sonnet | Hỗ trợ gợi ý các hàm xử lý tính toán điểm số Heuristic cho 3 tính năng AI, gợi ý bộ CSS Variables theo phong cách SaaS 2026. | Giai đoạn thiết kế & dựng code lõi |
| **Antigravity / GitHub Copilot** | VS Code Extension (ES6) | Gợi ý tự động hoàn thành dòng code (Autocomplete) cho các thẻ HTML lặp lại, hàm validate biểu mẫu regex, và cấu trúc DOM traversal. | Xuyên suốt quá trình viết code |

---

## 2. BẢNG PHÂN LOẠI TÍNH NĂNG: MOCK VS API THẬT

Theo yêu cầu của đề tài và giới hạn của môn học (Client-side Web cơ bản), nhóm minh bạch khai báo tính chất kết nối dữ liệu của toàn bộ hệ thống:

| STT | Phân hệ / Tính năng | Cơ chế triển khai | Loại dữ liệu / Kết nối | Chi tiết kỹ thuật |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Quản lý sản phẩm (CRUD Catalog) | **100% MOCK** | `LocalStorage` | Lưu trữ trong khóa `smartshelf_products` trên trình duyệt; hỗ trợ Thêm, Sửa, Xóa mềm (Archive), Tìm kiếm, Lọc đa tiêu chí. |
| **2** | Quản lý khu vực & Kệ hàng (CRUD Zones & Shelves) | **100% MOCK** | `LocalStorage` | Lưu trữ trong khóa `smartshelf_zones` và `smartshelf_shelves`. |
| **3** | Quản lý tài khoản & Phân quyền (User Management) | **100% MOCK** | `LocalStorage` / `SessionStorage` | Lưu danh sách người dùng mẫu; chuyển đổi vai trò tức thì (Role Switcher) qua `SessionStorage`. |
| **4** | Kiểm kê kệ hàng (Shelf Audit) | **100% MOCK** | `LocalStorage` | So khớp số lượng thực đếm vs tồn POS, tính sai lệch và lưu phiếu kiểm kê nháp/chính thức vào `smartshelf_shelfChecks`. |
| **5** | Điều phối bổ sung hàng & Kanban (Restock Tasks) | **100% MOCK** | `LocalStorage` + HTML5 Drag & Drop | Vòng đời 6 trạng thái xử lý nhiệm vụ; kéo thả thẻ Kanban cập nhật trạng thái trực tiếp vào LocalStorage. |
| **6** | Bản đồ 2D siêu thị tương tác (Store Map) | **100% MOCK** | DOM / SVG tương tác | Dựng sơ đồ phân khu (Khu A, B, C, D, E) và kệ hàng bằng CSS Grid/SVG; ghim vị trí phát sáng (Pulsing Pin) bằng JavaScript thuần. |
| **7** | Biểu đồ Dashboard & Insights | **100% MOCK** | HTML5 Canvas thuần | Dữ liệu tổng hợp từ các bảng LocalStorage; tự tính toán góc vẽ hình tròn (Donut Chart) và tỷ lệ cột (Bar Chart) không dùng thư viện ngoài. |
| **8** | **AI-1: Restock Priority** | **MÔ PHỎNG (MOCK)** | Client-side Algorithm (`js/ai.js`) | Thuật toán Heuristic đa trọng số (Gap tồn kho, tốc độ bán, lưu lượng khách). Sử dụng `setTimeout(750ms)` để giả lập độ trễ tính toán máy chủ Edge AI. |
| **9** | **AI-2: Product Alternative** | **MÔ PHỎNG (MOCK)** | Client-side Algorithm (`js/ai.js`) | Thuật toán đối sánh độ tương đồng về phân khúc, chênh lệch giá, khoảng cách kệ vật lý; độ trễ giả lập `600ms`. |
| **10** | **AI-3: Shelf Anomaly Insight** | **MÔ PHỎNG (MOCK)** | Client-side Algorithm (`js/ai.js`) | Thuật toán quét quy tắc bất thường từ bảng `anomalies` đối chiếu với lịch sử kiểm kê và doanh số; độ trễ giả lập `700ms`. |
| **11** | **Hình ảnh sản phẩm & Người dùng** | **API THẬT (STATIC CDN)** | `HTTPS GET` trực tiếp | Gọi tài nguyên tĩnh từ CDN Bách Hóa Xanh (`cdnv2.tgdd.vn`) và CDN ảnh Unsplash (`images.unsplash.com`). |
| **12** | **Bộ font chữ giao diện** | **API THẬT (GOOGLE FONTS)** | `HTTPS GET` trực tiếp | Nạp webfont *Plus Jakarta Sans* và *Inter* từ máy chủ Google Fonts (`fonts.googleapis.com`). |

> **Ghi chú minh bạch:** Dự án **không** kết nối với Backend Server từ xa (NodeJS/Python) và **không** gọi API LLM trả phí từ OpenAI/Anthropic/Google Cloud ở môi trường chạy. Toàn bộ logic 3 tính năng AI đều chạy trực tiếp trên trình duyệt máy khách (Client-side Heuristic Inference) thông qua module `js/ai.js`, bao phủ đầy đủ 5 trạng thái vòng đời UX AI chuẩn chỉ theo đặc tả đề bài.

---

## 3. KHAI BÁO CHI TIẾT THEO TỪNG HẠNG MỤC DỰ ÁN

---

### Hạng mục 1: Kiến trúc giao diện (CSS Design System) & Bố cục chung

#### a. Công cụ AI & Câu lệnh (Prompt) chính
- **Công cụ:** Claude 3.5 Sonnet & ChatGPT-4o.
- **Câu lệnh mẫu:**
  ```text
  "Hãy tạo hệ thống biến CSS (CSS custom properties) cho giao diện quản trị bán lẻ Enterprise SaaS 2026. 
  Màu chủ đạo là Xanh ngọc lục bảo (Emerald Green #059669 / #10b981), màu Slate tối cho văn bản, 
  nền #f8fafc. Cung cấp quy chuẩn typography dùng font Plus Jakarta Sans, hệ thống bo góc (radius), 
  shadow mềm mại và các class nút bấm, thẻ badge, bảng dữ liệu responsive không dùng Tailwind."
  ```

#### b. Phần AI sinh ra
- AI sinh ra file CSS thô với bảng mã màu, reset CSS cơ bản và một số class layout: flexbox, grid, card, button.

#### c. Phần sinh viên chỉnh sửa & tự viết
- **Chuẩn hóa biến số và namespace:** Gom toàn bộ biến vào `:root` trong `css/style.css`, chuẩn hóa hệ màu trạng thái (Success, Warning, Danger, Info).
- **Thiết kế lại Responsive Navigation:** AI sinh menu ngang cố định; sinh viên đã viết lại toàn bộ cấu trúc **Sidebar thu gọn (Collapsible)** và **Mobile Drawer trượt** với JavaScript bắt sự kiện click backdrop và phím `Escape`.
- **Thanh tìm kiếm toàn cục (`Ctrl+K`):** Tự viết logic JavaScript lắng nghe phím tắt `keydown` để mở modal tìm kiếm nhanh sản phẩm trên mọi màn hình.
- **Thành phần Toast Notification:** Tự code hàm tạo toast notification trượt mượt mà ở góc dưới màn hình có đếm ngược thời gian tự hủy.

#### d. Lỗi AI gặp phải
- AI có xu hướng chèn các thuộc tính CSS thử nghiệm hoặc dùng cú pháp Tailwind CSS xen lẫn (`@apply`, class tiện ích dài ngoằng) dù đã yêu cầu viết CSS thuần.
- Màu sắc AI tạo ra ban đầu có độ tương phản văn bản kém (chữ xám trên nền xám nhạt, vi phạm chuẩn WCAG AA).

#### e. Cách sinh viên kiểm chứng
- Dùng công cụ **Chrome DevTools Lighthouse** để đo độ tương phản màu sắc và khả năng truy cập (Accessibility đạt > 92 điểm).
- Kiểm tra hiển thị responsive trên 4 kích thước màn hình: Mobile (375px, 414px), Tablet (768px), Laptop (1280px), Desktop (1920px).

#### f. Điều sinh viên học được
- Hiểu sâu về cách tổ chức CSS quy mô lớn bằng CSS Custom Properties mà không phụ thuộc vào framework nặng như Bootstrap/Tailwind.
- Nắm vững kỹ thuật phân cấp thị giác (Visual Hierarchy) cho ứng dụng SaaS quản trị dữ liệu dày đặc.

---

### Hạng mục 2: Tầng dữ liệu giả lập & Kho lưu trữ LocalStorage (`js/data.js`, `js/store.js`)

#### a. Công cụ AI & Câu lệnh (Prompt) chính
- **Công cụ:** ChatGPT-4o.
- **Câu lệnh mẫu:**
  ```text
  "Tạo cho tôi một mảng JSON gồm 16 sản phẩm bán lẻ phổ biến tại siêu thị Việt Nam (Gạo ST25, Mì Hảo Hảo, 
  Dầu Simply, Nước mắm Nam Ngư...). Mỗi sản phẩm phải có đủ trường: id, sku, name, category, brand, 
  price, originalPrice, stock, minStock, maxStock, shelfCode (ví dụ A-01, B-02), zoneId, bay, tier, 
  unit, image, status ('in_stock' | 'low_stock' | 'out_of_stock'), salesVelocity, restockFrequency."
  ```

#### b. Phần AI sinh ra
- Bộ dữ liệu JSON gồm các mặt hàng với các trường thông tin cơ bản.
- Đoạn code mẫu lưu và đọc từ `localStorage.getItem` / `localStorage.setItem`.

#### c. Phần sinh viên chỉnh sửa & tự viết
- **Xây dựng module Store hướng đối tượng (`SS_Store` trong `js/store.js`):**
  - Viết đầy đủ các phương thức CRUD chuẩn: `all()`, `find()`, `filter()`, `get()`, `create()`, `update()`, `remove()`, `count()`.
  - Cơ chế tự động gieo dữ liệu ban đầu (Auto-seed): Tự kiểm tra nếu LocalStorage chưa có dữ liệu thì nạp từ `SS_Data`; có hàm khôi phục cài đặt gốc `resetAll()`.
- **Bổ sung liên kết khóa ngoại (Foreign Keys):** Tự chuẩn hóa liên kết giữa `products.zoneId` ↔ `zones.id`, `products.shelfCode` ↔ `shelves.code`, `restockTasks.shelfCode` ↔ `shelves.code`.
- **Cập nhật hình ảnh thực tế:** Thay thế toàn bộ link ảnh placeholder không tải được bằng link ảnh CDN trực tiếp từ chuỗi bán lẻ Bách Hóa Xanh và Unsplash.

#### d. Lỗi AI gặp phải
- Dữ liệu AI sinh không nhất quán: Có sản phẩm có `stock: 0` nhưng `status` lại ghi là `"in_stock"`.
- Một số sản phẩm gán mã kệ `E-09` trong khi danh mục kệ chỉ có từ A đến D.
- Khi cập nhật một bản ghi, AI gợi ý dùng `localStorage.setItem(key, JSON.stringify(data))` mà không sao chép sâu (shallow copy), dẫn đến lỗi tham chiếu mutation trong JavaScript.

#### e. Cách sinh viên kiểm chứng
- Mở tab **Application > Local Storage** trong Chrome DevTools để quan sát sự biến động của các key sau mỗi thao tác Thêm / Sửa / Xóa.
- Thử nghiệm chức năng "Khôi phục dữ liệu mẫu ban đầu" tại trang `settings.html` và `index.html`, kiểm tra số lượng bản ghi trả về đúng 16 sản phẩm, 12 kệ, 5 khu vực, 6 nhiệm vụ.

#### f. Điều sinh viên học được
- Hiểu rõ cơ chế serialization/deserialization (`JSON.stringify`/`JSON.parse`) và giới hạn dung lượng ~5MB của LocalStorage.
- Thiết kế mô hình dữ liệu quan hệ mô phỏng trong môi trường Front-end thuần.

---

### Hạng mục 3: Tính năng AI-1 – Restock Priority (Xếp hạng ưu tiên bổ sung hàng)

> **Màn hình tích hợp:** `associate-restock-task.html` & `manager-restock-board.html`  
> **Sinh viên phụ trách:** Trần Nhật Quang (SV2)

#### a. Công cụ AI & Câu lệnh (Prompt) chính
- **Công cụ:** Claude 3.5 Sonnet.
- **Câu lệnh mẫu:**
  ```text
  "Hãy viết hàm JavaScript phân tích danh sách kệ hàng siêu thị để tính điểm ưu tiên bổ sung hàng (0 - 100). 
  Đầu vào là mảng kệ và sản phẩm từ LocalStorage. Yêu cầu tính toán dựa trên:
  1. Mức độ thiếu hụt (Gap = minStock - stock thực tế);
  2. Số lượng sản phẩm đã hết sạch (stock = 0);
  3. Tốc độ bán (sales velocity) và hệ số giờ cao điểm;
  4. Hệ số lưu lượng khu vực (Zone traffic).
  Hàm phải trả về danh sách kệ xếp hạng kèm lý do giải thích minh bạch (Explainable AI - XAI), 
  hỗ trợ mô phỏng 5 trạng thái UX (Đang tính toán, Thành công, Thiếu dữ liệu, Độ tin cậy thấp, Lỗi)."
  ```

#### b. Phần AI sinh ra
- Hàm `analyzeRestockPriority()` với công thức cộng điểm cơ bản và mảng trả về kết quả giả lập.

#### c. Phần sinh viên chỉnh sửa & tự viết
- **Hoàn thiện công thức Heuristic đa biến:**
  $$\text{PriorityScore} = \min\left(100, \max\left(15, \text{Round}\left(\text{TotalGap} \times 1.8 + \text{OOSCount} \times 28 + \text{Velocity} \times 2.2 \times \text{TrafficWeight}\right)\right)\right)$$
  Giúp điểm số phản ánh chân thực độ khẩn cấp (kệ nào có sản phẩm hết nhẵn và nằm ở khu đông người qua lại sẽ chạm mốc > 85 điểm).
- **Bộ sinh lý do giải thích XAI (Explainable AI):** Viết logic tự động tạo danh sách lý do cụ thể bằng Tiếng Việt (ví dụ: *"Có 2 sản phẩm hết hàng hoàn toàn"*, *"Tổng lượng thiếu hụt 18 đơn vị so với ngưỡng an toàn"*).
- **Xây dựng UI điều khiển 5 trạng thái:**
  - Viết thanh công cụ mô phỏng ("Simulation Bar") cho phép người chấm thi click chọn các chế độ: *Bình thường*, *Độ tin cậy thấp (< 50%)*, *Thiếu dữ liệu (< 48h)*, *Lỗi kết nối máy chủ AI*.
  - Render skeleton loading khi đang phân tích (`wait(750ms)`).
- **Nghiệp vụ "Chấp nhận đề xuất":** Khi người dùng nhấn nút *"Tạo việc ngay"*, hệ thống tự động sinh một `restockTask` mới ghi vào LocalStorage và cập nhật huy hiệu số việc đang chờ.

#### d. Lỗi AI gặp phải
- AI tính điểm ưu tiên bị vượt ngưỡng 100 hoặc ra số âm khi `stock > minStock`.
- Khi ở trạng thái "Lỗi", code của AI làm crash toàn bộ trang do không có khối `try...catch` ở tầng gọi hàm giao diện.

#### e. Cách sinh viên kiểm chứng
- Tạo kịch bản kiểm thử:
  * Kịch bản 1: Sửa kho hàng để một kệ có 3 sản phẩm đều có tồn kho = 0 → Kiểm tra xem kệ đó có nhảy lên vị trí Top 1 với điểm số > 90 và nhãn "Khẩn cấp" hay không.
  * Kịch bản 2: Bấm nút chuyển sang chế độ "Lỗi" → Giao diện phải hiển thị Alert cảnh báo lỗi đỏ kèm nút *"Thử lại"* chứ không được đứng hình trang web.

#### f. Điều sinh viên học được
- Hiểu nguyên lý hoạt động của Explainable AI (XAI) trong ứng dụng doanh nghiệp: Người dùng chỉ tin tưởng quyết định của AI khi có số liệu và lý do minh bạch đi kèm.
- Kỹ thuật lập trình bất đồng bộ (`async/await`, `Promise`) để mô phỏng chính xác trải nghiệm ứng dụng mạng thời gian thực.

---

### Hạng mục 4: Tính năng AI-2 – Product Alternatives (Gợi ý sản phẩm thay thế khi hết hàng)

> **Màn hình tích hợp:** `shopper-product-alternatives.html` & `shopper-product-search.html`  
> **Sinh viên phụ trách:** Trần Quốc Khánh (SV1)

#### a. Công cụ AI & Câu lệnh (Prompt) chính
- **Công cụ:** ChatGPT-4o & Claude 3.5 Sonnet.
- **Câu lệnh mẫu:**
  ```text
  "Viết hàm JavaScript tìm kiếm sản phẩm thay thế phù hợp khi một sản phẩm trong siêu thị bị hết hàng (out of stock).
  Tiêu chí đối sánh gồm: Cùng danh mục hàng hóa, độ lệch giá (% chênh lệch), khoảng cách vị trí kệ 
  (ưu tiên cùng khu vực để khách không phải đi xa), và cùng thương hiệu hoặc thương hiệu uy tín.
  Tính điểm phù hợp (Match Score %) và đưa ra lý do vì sao gợi ý sản phẩm này."
  ```

#### b. Phần AI sinh ra
- Hàm so sánh vòng lặp duyệt qua mảng sản phẩm và tính toán điểm tương đồng.

#### c. Phần sinh viên chỉnh sửa & tự viết
- **Thuật toán trừ điểm theo độ lệch giá:**
  ```javascript
  const priceDiff = Math.abs(candidate.price - baseProduct.price);
  const priceDiffPercent = Math.round((priceDiff / (baseProduct.price || 1)) * 100);
  let matchScore = 100 - (priceDiffPercent * 0.4) + (sameBrand ? 15 : 0) + (sameZone ? 10 : 0);
  ```
  Sinh viên tinh chỉnh trọng số để đảm bảo sản phẩm thay thế có giá chênh lệch quá 50% sẽ bị trừ điểm nặng, ưu tiên gợi ý sản phẩm cùng kệ hoặc cùng khu vực.
- **Tính toán văn bản so sánh giá:** Tự viết logic định dạng: nếu giá cao hơn thì hiển thị *"cao hơn X đ"*, nếu giá thấp hơn thì ghi rõ *"tiết kiệm X đ"*.
- **Liên kết điều hướng thực tế:** Sinh viên thêm nút *"Dẫn đường đến kệ thay thế"* chuyển trực tiếp sang `shopper-product-location.html?sku=...`, tự động cập nhật bản đồ 2D đến kệ chứa sản phẩm thay thế vừa chọn.
- **Tương tác hành vi:** Bổ sung các nút *"Chọn mua món này"* (hiển thị modal xác nhận), *"Từ chối gợi ý"* (thu nhỏ card) và *"Tìm tiêu chí khác"*.

#### d. Lỗi AI gặp phải
- AI ban đầu lọc sản phẩm thay thế bao gồm cả chính sản phẩm đang hết hàng (`p.sku === targetSku`).
- AI gợi ý sản phẩm thay thế nhưng bản thân sản phẩm thay thế đó cũng có tồn kho = 0.
- Độ tương thích nhãn hàng: Khi 2 sản phẩm khác danh mục (ví dụ hết Sữa chua lại gợi ý Nước xả vải) vì thuật toán fallback của AI bị lỏng điều kiện lọc danh mục.

#### e. Cách sinh viên kiểm chứng
- Kiểm tra trực tiếp trên trình duyệt: Chọn sản phẩm hết hàng là *"Dầu ăn Simply Đậu Nành 1L"* (giá 65.000đ).
- Kết quả kiểm chứng: Hệ thống gợi ý chính xác 2 sản phẩm thay thế cùng khu Gia vị A:
  1. *Dầu hướng dương Meizan 1L* (giá 62.000đ - Tiết kiệm 3.000đ, độ khớp 94%, cùng Kệ A-03).
  2. *Dầu ăn thượng hạng Neptune Light 1L* (giá 68.000đ - Cao hơn 3.000đ, độ khớp 91%, Kệ A-02).
- Thử nghiệm trên URL query parameter: `shopper-product-alternatives.html?sku=SP004` tải đúng dữ liệu.

#### f. Điều sinh viên học được
- Xây dựng trải nghiệm giữ chân khách hàng (Customer Retention) trong bài toán thương mại bán lẻ khi xảy ra tình huống OOS (Out-of-Stock).
- Kỹ thuật phân tích tham số URL (`URLSearchParams`) để truyền tải ngữ cảnh mượt mà giữa các trang HTML độc lập.

---

### Hạng mục 5: Tính năng AI-3 – Shelf Anomaly Insight (Cảnh báo dị thường trên kệ hàng)

> **Màn hình tích hợp:** `manager-retail-insights.html` & `manager-store-dashboard.html`  
> **Sinh viên phụ trách:** Trần Ngọc Hoàng (SV3)

#### a. Công cụ AI & Câu lệnh (Prompt) chính
- **Công cụ:** Claude 3.5 Sonnet.
- **Câu lệnh mẫu:**
  ```text
  "Xây dựng tính năng AI Shelf Anomaly Insight cho Quản lý cửa hàng siêu thị. 
  Hệ thống cần quét dữ liệu để phát hiện 3 dạng dị thường bán lẻ:
  1. Tồn kho ảo (Tụt tồn kho trên kệ nhưng không có hóa đơn POS tương ứng - nghi ngờ thất thoát hoặc khách bỏ quên);
  2. Kệ thường xuyên cạn kiệt vào khung giờ cao điểm (17h - 19h);
  3. Kệ có tần suất bổ sung quá tải (dung tích khay quá nhỏ so với nhu cầu mua sắm).
  Mỗi dị thường phải có mức độ nghiêm trọng (Critical/Warning), độ tin cậy AI %, và nút bấm hành động khắc phục ngay."
  ```

#### b. Phần AI sinh ra
- Cấu trúc đối tượng dị thường và hàm quét mẫu cơ bản trong `js/ai.js`.

#### c. Phần sinh viên chỉnh sửa & tự viết
- **Hiện thực hóa hành động can thiệp (Actionable Insights):**
  - AI chỉ sinh văn bản thông báo chung chung; sinh viên đã bổ sung nút hành động nghiệp vụ thực tế:
    * *"Tạo lệnh kiểm kê khẩn"* → Tự động tạo bản ghi kiểm kê ưu tiên cho nhân viên ca trực.
    * *"Điều chỉnh sức chứa khay"* → Cập nhật trực tiếp `maxStock` của sản phẩm trong LocalStorage.
    * *"Bỏ qua dị thường"* → Cập nhật trạng thái dị thường thành `dismissed`, ẩn khỏi bảng điều hành kèm thông báo toast.
- **Biểu đồ Canvas trực quan hóa dị thường:** Tự viết script vẽ biểu đồ đường (Line Chart) biểu diễn số vụ thiếu hàng trong 7 ngày gần nhất và biểu đồ Donut cơ cấu nguyên nhân thất thoát.

#### d. Lỗi AI gặp phải
- AI đề xuất dùng thư viện bên ngoài `Chart.js` qua link CDN dù đề tài yêu cầu tự chủ mã nguồn.
- Khi nhấn nút "Bỏ qua", AI sinh code xóa hẳn phần tử khỏi mảng gốc thay vì cập nhật trạng thái, làm mất tính toàn vẹn dữ liệu lịch sử kiểm toán.

#### e. Cách sinh viên kiểm chứng
- Đăng nhập quyền Quản lý (`manager`), truy cập `manager-retail-insights.html`.
- Kiểm tra 3 thẻ cảnh báo dị thường:
  1. Cảnh báo Kệ A-01: Tụt 8 chai nước mắm Nam Ngư không qua cổng quét mã POS (Mức Nghiêm trọng - Độ tin cậy 96%).
  2. Cảnh báo Kệ B-01: Hết mì tôm Hảo Hảo liên tục 4 ngày vào khung 17h30.
- Bấm nút *"Tạo việc Restock ngay"* tại thẻ cảnh báo → Chuyển sang bảng Kanban `manager-restock-board.html` kiểm tra xem nhiệm vụ mới đã xuất hiện ở cột *Ưu tiên cao* hay chưa (kết quả: xuất hiện chính xác).

#### f. Điều sinh viên học được
- Hiểu được giá trị cốt lõi của Trí tuệ nhân tạo trong chuyển đổi số bán lẻ: Chuyển từ "ghi nhận bị động" sang "cảnh báo chủ động và tự động đề xuất hành động".
- Thành thạo kỹ thuật vẽ đồ thị với HTML5 Canvas API (`getContext('2d')`, tính tọa độ điểm, vẽ cung tròn `arc()`, hiệu ứng hover tooltip).

---

### Hạng mục 6: Bảng điều phối Kanban & Tương tác kéo thả (HTML5 Drag & Drop)

> **Màn hình tích hợp:** `manager-restock-board.html`  
> **Sinh viên phụ trách:** Trần Ngọc Hoàng (SV3)

#### a. Công cụ AI & Câu lệnh (Prompt) chính
- **Công cụ:** Antigravity / GitHub Copilot.
- **Câu lệnh mẫu:**
  ```text
  "Viết hàm JavaScript xử lý Drag and Drop thuần (HTML5 Drag and Drop API) cho bảng Kanban 6 cột: 
  pending, high_priority, in_progress, on_hold, completed, rejected.
  Khi kéo thả card sang cột mới, cập nhật thuộc tính task.status trong LocalStorage 
  và hiển thị hiệu ứng viền sáng khi hover qua cột."
  ```

#### b. Phần AI sinh ra
- Các hàm sự kiện `dragstart`, `dragover`, `dragleave`, `drop` cơ bản.

#### c. Phần sinh viên chỉnh sửa & tự viết
- **Khắc phục lỗi mất dữ liệu khi kéo thả:** AI lưu `e.dataTransfer.setData('text/plain', taskId)`, nhưng khi drop lại không tìm thấy ID do cấu trúc thẻ DOM cha con bị lồng ghép. Sinh viên đã sửa lại dùng `e.currentTarget` và `dataset.taskId`.
- **Ràng buộc nghiệp vụ khi kéo sang cột "Hoàn thành":** Sinh viên tự viết thêm logic: Nếu nhiệm vụ được kéo sang cột *Hoàn thành (Completed)*, hệ thống sẽ tự động tìm sản phẩm tương ứng trên kệ và cộng bù số lượng tồn kho `p.stock += task.quantity` trong LocalStorage.
- **Modal chi tiết công việc:** Bấm vào thẻ card mở modal cho phép phân công lại nhân viên, chỉnh sửa mức độ ưu tiên và ghi chú sự cố.

#### d. Lỗi AI gặp phải
- AI quên không gọi `e.preventDefault()` trong sự kiện `dragover`, khiến trình duyệt chặn hành vi thả thẻ card (sự kiện `drop` không bao giờ được kích hoạt).
- Thiếu hiệu ứng trực quan khiến người dùng không biết mình đang kéo thẻ đến khu vực nào.

#### e. Cách sinh viên kiểm chứng
- Kéo thử thẻ nhiệm vụ `TASK-101` từ cột *Đang chờ* sang cột *Đang xử lý* → F5 làm mới trình duyệt → Thẻ vẫn nằm nguyên tại cột mới (chứng minh dữ liệu đã đồng bộ chuẩn vào LocalStorage).
- Kéo sang cột *Hoàn thành* → Mở trang quản trị sản phẩm kiểm tra tồn kho tăng chính xác theo số lượng ghi trên phiếu.

#### f. Điều sinh viên học được
- Nắm vững cơ chế hoạt động chi tiết của HTML5 Drag & Drop API và các cạm bẫy liên quan đến `dragover`/`drop`.
- Tư duy đồng bộ trạng thái (State Synchronization) giữa giao diện trực quan và cơ sở dữ liệu nền.

---

### Hạng mục 7: Bản đồ 2D siêu thị & Định vị vị trí kệ hàng

> **Màn hình tích hợp:** `shopper-product-location.html`  
> **Sinh viên phụ trách:** Trần Quốc Khánh (SV1)

#### a. Công cụ AI & Câu lệnh (Prompt) chính
- **Công cụ:** ChatGPT-4o.
- **Câu lệnh mẫu:**
  ```text
  "Gợi ý cách dựng sơ đồ mặt bằng siêu thị 2D đơn giản bằng HTML/CSS và SVG có phân khu A, B, C, D, E.
  Mỗi phân khu có các kệ hàng dạng ô chữ nhật. Có thể nhận vào mã kệ (ví dụ A-02) 
  để làm nổi bật kệ đó bằng chấm đỏ phát sáng (pulsing pin), 
  và vẽ đường đứt nét mô phỏng tuyến đường đi từ Cửa vào (Entrance) đến kệ đó."
  ```

#### b. Phần AI sinh ra
- Đoạn mã SVG tĩnh mô phỏng một vài hình hộp chữ nhật không tương tác.

#### c. Phần sinh viên chỉnh sửa & tự viết
- **Chuyển đổi sang giao diện tương tác toàn diện:**
  - Viết lại toàn bộ sơ đồ phân khu bằng CSS Grid và các ô Kệ hàng tương tác.
  - Tự viết logic gắn cờ `active` dựa trên tham số `?shelf=A-02` hoặc `?sku=SP001` từ URL.
  - Cho phép người mua hàng **click vào bất kỳ kệ nào trên bản đồ** để xem danh sách các sản phẩm đang trưng bày tại kệ đó trong bảng thông tin bên cạnh.
  - Thêm hiệu ứng ghim vị trí nhấp nháy 3 vòng sóng (Radar Pulse Effect) bằng CSS Keyframes `@keyframes pulse-ring`.

#### d. Lỗi AI gặp phải
- Tọa độ SVG của AI bị vỡ tỷ lệ khi co giãn màn hình điện thoại (không có thuộc tính `viewBox` chuẩn).
- AI vẽ đường nối cố định (hardcoded), không tự động đổi hướng khi chọn kệ khác.

#### e. Cách sinh viên kiểm chứng
- Nhấp chọn các sản phẩm khác nhau từ trang tìm kiếm:
  * Chọn Nước mắm Nam Ngư → Bản đồ sáng rực tại Kệ A-01 (Khu Gia vị).
  * Chọn Trà xanh Thái Nguyên → Bản đồ chuyển điểm sáng sang Kệ C-01 (Khu Đồ uống).
- Bấm vào các nút Kệ trên bản đồ để kiểm tra dữ liệu hiển thị tức thì.

#### f. Điều sinh viên học được
- Kỹ thuật xây dựng bản đồ không gian 2D tương tác nhẹ nhàng (Interactive Floorplan) hoàn toàn bằng Web Standards mà không cần nhúng thư viện nặng nề như Leaflet hay Mapbox.

---

## 4. TỔNG HỢP CÁC LỖI AI ĐIỂN HÌNH VÀ CÁCH KHẮC PHỤC

Trong suốt dự án, sinh viên đã tổng kết 5 nhóm lỗi đặc trưng nhất mà AI thường mắc phải:

```text
+---------------------------------------------------------------------------------------------+
|                                CÁC NHÓM LỖI PHỔ BIẾN CỦA AI                                 |
+---------------------------------------------------------------------------------------------+
|  1. ẢO GIÁC THƯ VIỆN NGOÀI  ---> Tự ý import CDN Bootstrap, Tailwind, Chart.js             |
|                                  Khắc phục: Sinh viên tự viết Canvas & CSS thuần            |
+---------------------------------------------------------------------------------------------+
|  2. THIẾU NGỮ CẢNH DỰ ÁN    ---> Sinh code đơn lẻ, không liên kết được với LocalStorage     |
|                                  Khắc phục: Chuẩn hóa module SS_Store và SS_Data thống nhất |
+---------------------------------------------------------------------------------------------+
|  3. BỎ QUÊN TRẠNG THÁI BIÊN ---> Chỉ viết luồng Thành công, bỏ qua Lỗi & Thiếu dữ liệu     |
|                                  Khắc phục: Bổ sung thanh công cụ 5 trạng thái vòng đời AI  |
+---------------------------------------------------------------------------------------------+
|  4. LỖI LOGIC NGHIỆP VỤ     ---> Trừ điểm chênh lệch giá bị âm, gợi ý trùng sản phẩm hết    |
|                                  Khắc phục: Sinh viên viết lại công thức Heuristic chuẩn     |
+---------------------------------------------------------------------------------------------+
|  5. LỖI TƯƠNG THÍCH DOM     ---> Dùng thuộc tính không chuẩn, thiếu preventDefault()        |
|                                  Khắc phục: Debug bằng DevTools Console và sửa bắt sự kiện  |
+---------------------------------------------------------------------------------------------+
```

---

## 5. BẢNG PHÂN BỔ ĐÓNG GÓP & MỨC ĐỘ SỬ DỤNG AI THEO THÀNH VIÊN

Nhóm cam kết tuân thủ liêm chính học thuật: AI chỉ đóng vai trò trợ lý hỗ trợ tăng năng suất, toàn bộ cấu trúc hệ thống, kiểm tra tính đúng đắn và tinh chỉnh nghiệp vụ đều do sinh viên trực tiếp thực hiện.

| Thành viên | Trách nhiệm chính | Tỷ lệ code sinh viên viết / tự sửa | Tỷ lệ code AI gợi ý ban đầu | Đánh giá mức độ làm chủ mã nguồn |
| :--- | :--- | :---: | :---: | :--- |
| **Trần Quốc Khánh**<br>*(SV1 - Nhóm trưởng)* | • Thiết kế khung Layout, Header, Sidebar chung.<br>• Phân hệ Khách hàng (`shopper-*`).<br>• Quản trị sản phẩm (`admin-product-*`).<br>• Bản đồ 2D & Thuật toán `AI-2: Product Alternative`. | **75%** | **25%** | **Xuất sắc:** Làm chủ toàn bộ luồng dữ liệu khách hàng, sửa triệt để thuật toán so khớp sản phẩm thay thế. |
| **Trần Nhật Quang**<br>*(SV2)* | • Phân hệ Nhân viên (`associate-*`).<br>• Quản trị khu vực & kệ (`admin-zone-*`).<br>• Phiếu kiểm kê kệ hàng thực tế.<br>• Thuật toán `AI-1: Restock Priority` đa trọng số. | **70%** | **30%** | **Tốt:** Tự tay xây dựng công thức tính điểm ưu tiên và bảng so khớp tồn kho thực đếm vs hệ thống. |
| **Trần Ngọc Hoàng**<br>*(SV3)* | • Phân hệ Quản lý (`manager-*`).<br>• Quản trị người dùng & phân quyền (`admin-user-*`).<br>• Bảng Kanban kéo thả (Drag & Drop).<br>• Biểu đồ Canvas & Thuật toán `AI-3: Shelf Anomaly`. | **70%** | **30%** | **Tốt:** Tự viết 100% thuật toán vẽ biểu đồ Canvas thuần và cơ chế cập nhật trạng thái kéo thả Kanban. |

---

## 6. BÀI HỌC KINH NGHIỆM VÀ KẾT LUẬN

### 6.1. Bài học kinh nghiệm của nhóm sinh viên
1. **Làm chủ prompt có cấu trúc:** Câu lệnh càng chi tiết về ngữ cảnh (Context), ràng buộc (Constraints - *"không dùng thư viện ngoài"*, *"dùng Vanilla JS ES6"*), và định dạng đầu ra (Output format) thì chất lượng code AI sinh ra càng cao.
2. **Không sao chép mù quáng (Never copy-paste blindly):** Luôn đọc hiểu từng dòng code AI sinh ra trước khi đưa vào dự án. Việc tin tưởng tuyệt đối vào AI sẽ dẫn đến lỗi logic tiềm ẩn, xung đột biến toàn cục và lỗi giao diện nghiêm trọng.
3. **Giá trị của việc thấu hiểu nền tảng (Web Fundamentals):** Các công cụ AI rất mạnh, nhưng nếu sinh viên không nắm chắc các kiến thức cốt lõi như DOM Event Loop, CSS Flexbox/Grid, LocalStorage API và Promise/Async thì sẽ không thể phát hiện và sửa các lỗi mà AI gây ra.
4. **Tư duy thiết kế sản phẩm AI có đạo đức và minh bạch:** Xây dựng tính năng AI không đơn thuần là hiển thị một con số, mà phải cung cấp **Lý do giải thích (Explainable AI)** và trao toàn quyền quyết định cho con người (Human-in-the-loop: Chấp nhận, Sửa, Từ chối).

### 6.2. Kết luận
Dự án **SmartShelf** đã hoàn thành đầy đủ 100% các tiêu chí khắt khe của đề tài BTL:
- Đủ 4 vai trò người dùng và 12 màn hình nghiệp vụ kết nối liền mạch.
- Hoàn thiện 3 tính năng AI thực chất với đủ 5 trạng thái vòng đời UX.
- Cơ chế lưu trữ và thao tác dữ liệu nhất quán qua LocalStorage Store.
- Minh bạch hoàn toàn về công cụ, quy trình kiểm chứng và tự giác khai báo sử dụng AI.

Báo cáo này là minh chứng khẳng định nhóm sinh viên đã làm việc nghiêm túc, ứng dụng công nghệ hiện đại một cách thông minh, có trách nhiệm và hoàn toàn làm chủ sản phẩm của mình.

