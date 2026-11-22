# CLAUDE.md: shorekeeper-site

## Dự án này là gì

- Trang fan về Shorekeeper (Wuthering Waves), mô phỏng trang chính thức của Kuro Games (wutheringwaves.kurogames.com).
- Người viết repo đang học web từ con số không, theo bộ bài học "Tài liệu học Shorekeeper" do Claude soạn trong một cuộc trò chuyện riêng trên claude.ai. Bài học là nguồn chính; repo này là code anh tự gõ theo bài.
- Chỉ dùng HTML, CSS và JavaScript thuần. Trang được mở bằng Live Server (địa chỉ `http://127.0.0.1:...`), vì `script.js` dùng `fetch()` để đọc `skills.json`.

## Cách nói chuyện

- Gọi người dùng là "anh", xưng "em". Trả lời bằng tiếng Việt, giữ nguyên thuật ngữ tiếng Anh (selector, event, fetch, ...).
- Với mỗi thay đổi, nói rõ sửa file nào, chỗ nào, và vì sao, bằng câu đầy đủ. Anh đang học, nên lý do quan trọng hơn code.
- Khi anh hỏi về một lỗi, chỉ ra nguyên nhân trước, rồi mới đưa cách sửa.

## Tiến độ (anh cập nhật khi xong mỗi bài)

- Đã xong: Bài 30, sáu thẻ kỹ năng dựng từ `skills.json`.
- Chưa gõ: Bài 31 (băng chuyền ở màn Gallery) và Bài 32 (chữ tô vàng, danh sách và hộp chú thích). File `terms.json` của Bài 32 đã có sẵn.

## Quy tắc khi sửa code

1. **Không viết trước bài học.** Nếu việc anh nhờ thuộc một bài sau, nói rõ là bài nào và hỏi anh trước khi làm. Các bài đã lên kế hoạch:
   - Bài 31: băng chuyền tranh ở màn Gallery.
   - Bài 32: chữ có định dạng (`*...*` tô vàng, `[...]` là thuật ngữ) và hộp chú thích đọc từ `terms.json`.
   - Bài 33: mở và đóng phần chi tiết kỹ năng.
   - Bài 34: chuyển kỹ năng và chiêu con (đổi video, dùng poster).
   - Bài 37: hiệu ứng bướm cho hộp chú thích.
   - Bài 42: chuyển cảnh bằng mặt nạ.
2. **Giữ nguyên các tên mà bài học dùng:** class, id, tên hàm (`twoDigits`, `updateCurrentLink`, `buildCard`, `showSkill`, `openSkill`, `loadSkills`) và tên thuộc tính trong JSON (`type`, `name`, `image`, `short`, `what`, `related`, `moves`, `video`, `poster`). Các bài sau dựa vào những tên này.
3. **Không đổi cấu trúc.** Giữ `index.html`, `style.css`, `script.js`, `skills.json`, `terms.json` ở thư mục gốc, cùng ba thư mục `images/`, `videos/`, `fonts/`. Không thêm thư viện, framework, npm, công cụ build hay TypeScript.
4. **Sửa ít nhất có thể.** Không định dạng lại cả file, không đổi kiểu viết của anh (ví dụ `class = "x"` có dấu cách vẫn là HTML đúng), không sắp xếp lại các khối CSS.
5. **Comment theo kiểu của anh.** Trong HTML, anh dùng comment ngắn bằng tiếng Anh, dạng `<!--Stage 3: Replicate Skills page-->`; `script.js` không có comment. Không tự thêm comment, trừ khi anh nhờ.
6. **Tên file ảnh và video theo file thật** trong `images/` và `videos/`, không theo tên trong bài học (ví dụ anh dùng `videos/basic-attack.mp4` thay cho `normal-basic.mp4` của bài). Khi `skills.json` trỏ tới một file không có, báo cho anh; không tự đổi tên file.
7. **Thiết kế** (màu, bố cục, hiệu ứng, chữ trên trang) do bên bài học đề xuất và anh duyệt. Ở đây chỉ đề xuất, không tự quyết; ghi lại đề xuất để anh mang sang cuộc trò chuyện bài học.
8. **Nội dung kỹ năng** trong `skills.json` và `terms.json` được chép từ wiki của game; không tự viết lại hay rút gọn.

## Git

- Không tự commit hay push. Anh tự Commit và Sync Changes.
- Khi đề xuất lời commit cho thay đổi do Claude Code làm, bắt đầu bằng `[Claude Code]`, ví dụ `[Claude Code] Fix video path for End Loop`. Bên bài học nhìn tiền tố này để biết phần nào không đến từ bài.

## An toàn máy

- Chỉ làm việc trong thư mục dự án này.
- Không cài phần mềm, không tạo máy ảo, container hay WSL, không xóa file ngoài thư mục dự án.
- Trước khi chạy một lệnh terminal, hỏi anh và nói lệnh đó làm gì.
