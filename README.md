# SmartShelf – Điều hành kệ hàng và hỗ trợ mua sắm (RetailTech OS)

> **Học phần:** PHÁT TRIỂN ỨNG DỤNG WEB CƠ BẢN – CSE122  
> **Lĩnh vực:** Bán lẻ / RetailTech  
> **Ngôn ngữ & Nền tảng:** HTML5, CSS3 (Enterprise SaaS 2026), Vanilla JavaScript ES6+, LocalStorage Database  
> **Ngôn ngữ hiển thị:** 100% Tiếng Việt  

---

## 1. Giới thiệu & Bài toán thực tế

**SmartShelf** là nền tảng quản trị và hỗ trợ vận hành kệ hàng thông minh dành cho các chuỗi siêu thị và trung tâm bán lẻ quy mô lớn (như VinMart, Co.opmart, AEON Mall, Mega Market). Hệ thống giải quyết triệt để 4 vấn đề nhức nhối:
1. **Khách hàng mất thời gian tìm kiếm:** Không biết món hàng nằm ở lối đi nào, kệ số mấy, tầng mấy trên kệ.
2. **Phát hiện kệ trống muộn:** Nhân viên chỉ phát hiện khi khách hỏi hoặc hết ca, gây thất thoát doanh số.
3. **Thiếu điều phối ưu tiên:** Nhân viên đi bổ sung hàng ngẫu nhiên, không biết kệ nào đang cạn kiệt ở khung giờ cao điểm.
4. **Quản lý thiếu tầm nhìn bao quát:** Khó nắm bắt độ phủ kệ hàng (On-shelf availability) theo từng khu vực và phát hiện dị thường kinh doanh.

---

## 2. Hệ thống Design System & Phong cách thiết kế 2026

- **Màu sắc chủ đạo:** Xanh lá Emerald (`#059669`, `#10b981`) kết hợp Xanh Teal (`#0d9488`), nền Trắng (`#ffffff`) và Xám rất nhạt (`#f8fafc`).
- **Màu nội dung:** Charcoal / Slate đậm (`#0f172a`, `#334155`).
- **Màu trạng thái:**
  - Xanh lá (`#16a34a` / `#10b981`): Tốt, thành công, còn hàng trên kệ, hoàn tất.
  - Vàng cam (`#d97706` / `#f59e0b`): Cảnh báo, sắp hết hàng, đang chờ duyệt.
  - Đỏ hồng (`#dc2626` / `#ef4444`): Lỗi, hết hàng trên kệ, dị thường nghiêm trọng, từ chối.
  - Xanh lam (`#0284c7`): Thông tin, đang xử lý.
- **Typography:** Font sans-serif hiện đại *Plus Jakarta Sans* & *Inter*, phân cấp thị giác rõ ràng giữa tiêu đề, số liệu KPI, bảng dữ liệu và nhãn trạng thái.
- **Bố cục (Layout):**
  - **Sidebar bên trái:** Điều hướng theo nhóm vai trò, logo thương hiệu, có nút thu gọn (Collapsible) và tự chuyển thành Drawer trượt trên thiết bị di động.
  - **Header phía trên:** Breadcrumb, thanh tìm kiếm toàn cục (`Ctrl+K`), nhãn trạng thái trực tuyến cửa hàng, bộ chuyển đổi vai trò tức thì (Role Switcher), chuông thông báo có số đếm và avatar người dùng.
- **Thành phần UI tái sử dụng:** Card bo góc mềm (`12px-16px`), shadow tinh tế, button đa biến thể, input validation, badge trạng thái có chấm tròn, modal backdrop blur, toast notification trượt êm và sơ đồ mặt bằng siêu thị tương tác 2D.

---

## 3. Cấu trúc 4 Vai trò & 12 Màn hình nghiệp vụ chính

### Vai trò 1: Khách mua sắm (Shopper)
1. **`shopper-product-search.html` (Product Search):**
   - Thanh tìm kiếm trung tâm nổi bật kèm gợi ý từ khóa phổ biến (Dầu Simply, Gạo ST25, Mì Hảo Hảo...).
   - Tab chuyển danh mục nhanh (Thực phẩm khô, Đồ uống, Gia vị, Chăm sóc cá nhân, Gia dụng, Bánh kẹo).
   - Thanh bộ lọc đa năng: Khu vực siêu thị, Tình trạng tồn kho (Còn hàng / Sắp hết / Hết hàng), Thương hiệu, Mức giá và sắp xếp.
   - Danh sách sản phẩm dạng lưới thẻ (Card Grid) hiển thị ảnh chất lượng cao, tên, thương hiệu, giá niêm yết, nhãn vị trí kệ và nút *"Xem vị trí"* / *"Gợi ý thay thế AI"*.
2. **`shopper-product-location.html` (Product Location & 2D Store Map):**
   - Chi tiết tọa độ trưng bày: Khu vực (Khu A), Lối đi (Lối 1-4), Số kệ (Kệ A-02), Tầng kệ (Tầng 2), Vị trí khay đựng (Khay 01-02).
   - **Bản đồ trực quan 2D siêu thị:** Sơ đồ mặt bằng phân khu A, B, C, D, E; đánh dấu điểm nhấp nháy phát sáng (Pulsing Pin 📍) tại kệ chứa món hàng; hướng dẫn tuyến đường di chuyển từ Cửa vào siêu thị; cho phép click vào các kệ khác để xem nhanh mặt hàng tại kệ đó.
3. **`shopper-product-alternatives.html` (Product Alternatives - AI-2):**
   - Tự động kích hoạt khi mặt hàng gốc hết hàng (0 tồn kho).
   - AI gợi ý thông minh các sản phẩm cùng nhóm, chênh lệch giá thấp, có sẵn ngay trên các kệ lân cận.
   - Minh bạch lý do đề xuất (Explainable AI): Cùng phân khúc, chênh lệch giá % cụ thể, khoảng cách đi lại ngắn.

### Vai trò 2: Nhân viên cửa hàng (Associate)
4. **`associate-zone-view.html` (Zone View):**
   - Giám sát 5 khu vực siêu thị: Tên khu vực, quản lý phụ trách, thanh tiến độ độ phủ kệ hàng (On-shelf availability %), số kệ trống (Empty), số kệ sắp hết (Low) và số việc bổ sung đang chờ.
   - Thao tác nhanh: Bắt đầu kiểm kê khu vực, tạo lệnh bổ sung khẩn cấp.
5. **`associate-shelf-check.html` (Shelf Check Audit):**
   - Chọn kệ cần kiểm kê từ danh sách.
   - Bảng so khớp trực quan: Tồn hệ thống POS vs Số lượng thực tế nhân viên đếm (có nút tăng giảm `+`/`-`).
   - Tự động tính chênh lệch (Delta) và ghi nhận tình trạng: *Bình thường, Thiếu hàng, Sắp hết, Hư hỏng/Móp méo, Đặt sai kệ*.
   - Lưu bản nháp hoặc Nộp phiếu kiểm kê chính thức; xem lịch sử các phiếu kiểm kê gần đây.
6. **`associate-restock-task.html` (Restock Tasks - AI-1):**
   - Danh sách nhiệm vụ bổ sung hàng: Mã việc, sản phẩm, kệ đích, số lượng cần lấy từ kho, mức ưu tiên, người phụ trách, hạn xử lý.
   - Tích hợp **AI Restock Priority:** Tự động chấm điểm ưu tiên (0-100) và xếp thứ tự kệ cần bổ sung gấp nhất dựa trên lượng thiếu hụt và tốc độ bán.
   - Thao tác vòng đời nhiệm vụ: *Bắt đầu làm (Đang xử lý) → Hoàn thành (Tự cộng tồn kho kệ) → Báo sự cố/Từ chối → Hủy việc*.

### Vai trò 3: Quản lý cửa hàng (Manager)
7. **`manager-store-dashboard.html` (Store Executive Dashboard):**
   - 7 Thẻ KPI tổng hợp: Tổng sản phẩm, Sản phẩm sắp hết, Sản phẩm hết sạch, Việc đang chạy, Việc hoàn thành, Kệ có vấn đề, Chỉ số sức khỏe kệ hàng %.
   - **Biểu đồ Donut Canvas:** Cơ cấu tồn kho thời gian thực.
   - **Biểu đồ Cột Canvas:** Hoạt động bổ sung hàng theo các khung giờ trong ngày (8h, 10h, 12h, 14h, 16h, 18h, 20h).
   - Bảng theo dõi sức khỏe từng khu vực và Dòng thời gian hoạt động ca trực.
8. **`manager-restock-board.html` (Restock Kanban Board):**
   - Bảng Kanban 6 cột trực quan:
     1. *Đang chờ (Pending)*
     2. *Ưu tiên cao (High Priority / AI Recommended)*
     3. *Đang xử lý (In Progress)*
     4. *Chờ xử lý (On Hold / Review)*
     5. *Hoàn thành (Completed)*
     6. *Từ chối / Hủy (Rejected / Cancelled)*
   - Hỗ trợ **kéo thả tự nhiên (HTML5 Drag & Drop)** giữa các cột.
   - Click vào card mở Modal chi tiết: Điều chỉnh nhân viên phụ trách, sửa mức ưu tiên, thay đổi số lượng, xem lý do AI.
9. **`manager-retail-insights.html` (Retail Analytics & AI-3):**
   - Bộ lọc đa chiều: Thời gian (Hôm nay, 7 ngày, 30 ngày), Khu vực, Danh mục.
   - KPI chuyên sâu: Tỉ lệ thiếu hàng OOS %, Thời gian bổ sung trung bình (MTTR), Độ chính xác kiểm đếm, Doanh số thất thoát ước tính.
   - Biểu đồ đường (Line chart) xu hướng thiếu hàng 7 ngày; Biểu đồ Donut phân loại nguyên nhân; Bảng Top sản phẩm thiếu hàng nhiều nhất.
   - **AI Shelf Anomaly Insight:** Phát hiện dị thường: Tồn kho giảm bất thường không rõ nguyên nhân (nghi thất thoát POS), Kệ thường xuyên trống vào giờ vàng 17h-19h, Tần suất bổ sung cao bất thường (khay trưng bày quá nhỏ); kèm nút bấm thực thi hành động đề xuất ngay lập tức.

### Vai trò 4: Quản trị viên (Admin)
10. **`admin-product-management.html` (Product Catalog CRUD):**
    - Bảng dữ liệu sản phẩm đầy đủ thuộc tính: Ảnh, Mã SP, Tên, SKU, Danh mục, Thương hiệu, Giá, Tồn kho, Khu vực, Kệ, Trạng thái.
    - Tìm kiếm, lọc danh mục/khu vực/trạng thái, phân trang.
    - Modal Form Thêm / Chỉnh sửa sản phẩm có kiểm tra tính hợp lệ (Validation).
    - Thao tác: Xem chi tiết modal, Chỉnh sửa, Lưu trữ / Vô hiệu hóa.
11. **`admin-zone-management.html` (Zone Management CRUD):**
    - Bảng quản lý khu vực siêu thị: Mã khu, Tên, Lối đi, Mô tả, Quản lý phụ trách, Số kệ, Mặt hàng, Mục tiêu độ phủ %, Trạng thái.
    - Modal Form Thêm / Sửa khu vực; Thống kê danh mục 12 kệ hàng trọng điểm.
12. **`admin-user-management.html` (User Management CRUD):**
    - Bảng quản lý tài khoản: Avatar, Họ tên, Username, Email, Số điện thoại, Vai trò (Khách, Nhân viên, Quản lý, Quản trị), Khu vực ca trực, Trạng thái, Đăng nhập gần nhất.
    - Modal Form Thêm / Sửa người dùng; Khóa / Mở khóa tài khoản 1-click.

### Các trang dùng chung & Tiện ích
- **`index.html`:** Cổng thông tin tổng quan, điều hướng trực tiếp đến toàn bộ 12 màn hình, hiển thị KPI thời gian thực và nút Reset dữ liệu mẫu.
- **`notifications.html`:** Trung tâm thông báo chia tab (Cảnh báo AI, Việc Restock, Kiểm kê kệ, Hệ thống).
- **`settings.html`:** Xem thông tin tài khoản hiện tại, cấu hình trạm và nút *Khôi phục dữ liệu mẫu ban đầu*.
- **`login.html`:** Đăng nhập phong cách SaaS với các nút *Đăng nhập nhanh 1-Click theo từng vai trò* rất thuận tiện cho chấm thi.

---

## 4. Tích hợp 3 Trải nghiệm AI & Bao phủ 5 Trạng thái

| Tính năng AI | Vị trí màn hình | Nghiệp vụ giải quyết |
|---|---|---|
| **AI-1: Restock Priority** | `associate-restock-task.html`, `manager-restock-board.html` | Phân tích chênh lệch thiếu hụt (Gap), tốc độ bán (Velocity) và giờ cao điểm để xếp hạng thứ tự ưu tiên kệ cần bổ sung trước. |
| **AI-2: Product Alternative** | `shopper-product-alternatives.html`, `shopper-product-search.html` | Tự động đề xuất các sản phẩm thay thế phù hợp khi hết hàng dựa trên phân khúc, chênh lệch giá, vị trí kệ gần và thói quen tiêu dùng. |
| **AI-3: Shelf Anomaly Insight** | `manager-retail-insights.html`, `manager-store-dashboard.html` | Quét dữ liệu giao dịch POS và camera để phát hiện dị thường: tụt tồn kho không hóa đơn, kệ thường xuyên trống giờ tan tầm, tần suất bổ sung quá tải. |

### Đầy đủ 5 trạng thái vòng đời AI (Có nút mô phỏng chuyển trạng thái):
1. **Đang phân tích (Analyzing):** Hiệu ứng Skeleton loading và thông báo tiến trình đối chiếu dữ liệu.
2. **Kết quả (Result):** Hiển thị thẻ kết quả có Điểm tin cậy (Confidence Score %), Điểm ưu tiên/khớp (Score), và **Lý do đề xuất minh bạch (Explainable AI - XAI)**.
3. **Không đủ dữ liệu (Insufficient Data):** Khi khu vực/kệ mới vận hành dưới 48 giờ, thông báo rõ nguyên nhân và cung cấp phương án thủ công.
4. **Độ tin cậy thấp (Low Confidence):** Khi dữ liệu biến động mạnh, cảnh báo vàng kèm khuyến nghị con người kiểm tra thực tế (Human-in-the-loop).
5. **Lỗi (Error):** Thông báo lỗi kết nối mô hình kèm nút *Thử lại ngay*.

**Quyền kiểm soát của người dùng:** Người dùng có đầy đủ các nút **Chấp nhận**, **Chỉnh sửa**, **Từ chối**, **Thử lại** và **Lưu kết quả**.

---

## 5. Cấu trúc thư mục mã nguồn

```
BTL
├── index.html                           # Cổng tổng quan hệ thống & Switcher
├── shopper-product-search.html          # Khách: Tìm kiếm sản phẩm
├── shopper-product-location.html        # Khách: Vị trí & Bản đồ siêu thị 2D
├── shopper-product-alternatives.html    # Khách: Gợi ý thay thế AI (AI-2)
├── associate-zone-view.html             # Nhân viên: Giám sát khu vực
├── associate-shelf-check.html           # Nhân viên: Kiểm kê kệ hàng thực tế
├── associate-restock-task.html          # Nhân viên: Nhiệm vụ bổ sung (AI-1)
├── manager-store-dashboard.html         # Quản lý: Bảng điều hành & Biểu đồ
├── manager-restock-board.html           # Quản lý: Kanban điều phối 6 cột
├── manager-retail-insights.html         # Quản lý: Phân tích & AI Dị thường (AI-3)
├── admin-product-management.html        # Quản trị: Quản lý sản phẩm (CRUD)
├── admin-zone-management.html           # Quản trị: Quản lý khu vực (CRUD)
├── admin-user-management.html           # Quản trị: Quản lý người dùng (CRUD)
├── notifications.html                   # Trung tâm thông báo hệ thống
├── settings.html                        # Cài đặt & Khôi phục dữ liệu mẫu
├── login.html                           # Đăng nhập 1-Click theo 4 vai trò
├── README.md                            # Tài liệu hướng dẫn & Báo cáo kỹ thuật
├── css/
│   ├── style.css                        # Hệ thống Design Tokens Enterprise 2026
│   └── responsive.css                   # Quy chuẩn Responsive Desktop/Tablet/Mobile
└── js/
    ├── data.js                          # Dữ liệu hạt giống (Seed Data) chuẩn siêu thị Việt Nam
    ├── store.js                         # Quản lý trạng thái LocalStorage & Nghiệp vụ CRUD
    ├── ai.js                            # Thuật toán trí tuệ nhân tạo mô phỏng 5 trạng thái
    ├── app.js                           # Điều khiển Layout toàn cục, Sidebar, Header, Modals, Toasts
    └── charts.js                        # Trình vẽ biểu đồ Canvas 2D độ nét cao (Donut, Bar, Line)
```

---

## 6. Hướng dẫn chạy & Kiểm thử

1. **Chạy trực tiếp:**
   - Mở tệp `index.html` hoặc bất kỳ tệp HTML nào trực tiếp bằng trình duyệt web (Google Chrome, Microsoft Edge, Firefox).
   - Không yêu cầu cài đặt máy chủ Node.js hay cơ sở dữ liệu bên ngoài; toàn bộ dữ liệu mẫu đã được tích hợp tự động qua `localStorage`.
2. **Khôi phục dữ liệu kiểm thử (Reset Seed Data):**
   - Nếu bạn chỉnh sửa, xóa bớt dữ liệu và muốn đưa về trạng thái chuẩn ban đầu của bài thuyết trình, hãy vào **Cài đặt & Dữ liệu** (`settings.html`) hoặc bấm nút **"Reset Dữ liệu mẫu"** ngay tại đầu trang `index.html`.
3. **Chuyển đổi vai trò:**
   - Dùng nút dropdown **"Chuyển vai trò"** ở góc phải Header trên mọi trang, hoặc vào trang `login.html` để đăng nhập nhanh với 1 cú click chuột.
4. **Kiểm tra 5 trạng thái AI:**
   - Tại các màn hình `shopper-product-alternatives.html`, `associate-restock-task.html`, `manager-retail-insights.html`, sử dụng menu dropdown *"Trạng thái kiểm thử AI"* ở góc trên để xem trực quan các trạng thái: *Bình thường, Độ tin cậy thấp, Không đủ dữ liệu, Lỗi mô phỏng*.
5. **Ảnh sản phẩm mẫu:**
   - Ảnh catalog được lấy từ CDN sản phẩm của Bách Hóa Xanh và cần kết nối Internet để tải.
   - Với mặt hàng không có ảnh phù hợp, dữ liệu mẫu dùng sản phẩm thay thế và đồng bộ lại tên/ảnh trong các nhiệm vụ bổ sung; LocalStorage cũng chỉ tự cập nhật những ảnh và tên mẫu cũ đã nhận diện.

## THÀNH VIÊN VÀ PHÂN CÔNG VAI TRÒ

| Thành viên | Họ và tên | Mã sinh viên | Lớp | Phân công màn hình |
|---|---|---|---|---|
| SV1 | Trần Quốc Khánh | 2551060637 | 67CNTT2 | Khách mua sắm: Tìm kiếm sản phẩm, Vị trí sản phẩm & Bản đồ kệ, Gợi ý sản phẩm thay thế AI. Quản trị viên: Quản lý sản phẩm. |
| SV2 | Trần Nhật Quang | 2451271154 | 66ANM1 | Nhân viên cửa hàng: Khu vực & Kệ hàng, Kiểm kê kệ hàng, Nhiệm vụ bổ sung hàng. Quản trị viên: Quản lý khu vực & Kệ hàng. |
| SV3 | Trần Ngọc Hoàng | 2451271119 | 66ANM1 | Quản lý cửa hàng: Bảng điều hành trung tâm, Kanban điều phối bổ sung hàng, Phân tích bán lẻ & AI Insights. Quản trị viên: Quản lý người dùng. |

Chi tiết mục tiêu, nhiệm vụ, CRUD/trạng thái, tính năng AI và công việc dự kiến của từng màn hình xem tại [Bảng kiểm kê màn hình SmartShelf](./BANG_KIEM_KE_MAN_HINH.md).
