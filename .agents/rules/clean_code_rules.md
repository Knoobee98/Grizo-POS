# Standard Clean Code & Architecture Rules (Grizo-POS)

Setiap pengkodean (fitur baru, perbaikan bug, atau refactoring) pada proyek Grizo-POS WAJIB menerapkan prinsip-prinsip Clean Code berikut:

1. **Modular & Single Responsibility Principle (SRP)**:
   - Setiap komponen, helper, atau custom hook hanya bertanggung jawab atas 1 tugas spesifik.
   - Hindari membuat file monolithic/terlalu panjang (>300 baris). Pisahkan sub-komponen UI, jenis utilitas, dan logic handler ke dalam berkas tersendiri di folder `src/components/`, `src/utils/`, atau `src/hooks/`.

2. **Simple & Readable (KISS - Keep It Simple, Stupid)**:
   - Tulis kode yang sederhana, intuitif, dan mudah dibaca oleh developer lain.
   - Hindari over-engineering atau abstraksi berlebihan yang tidak diperlukan.
   - Gunakan nama variabel, fungsi, dan komponen yang deskriptif dan mencerminkan tujuannya (misal: `isCashierActive`, `calculateCartSubtotal`, `handleCheckIn`).

3. **Mudah Dipelihara & Tepat Sasaran (DRY - Don't Repeat Yourself)**:
   - Ekstrak kode yang berulang (*duplicated logic*) menjadi fungsi pembantu (*helper utility*) atau custom React hook.
   - Modifikasi kode harus tepat sasaran sesuai permintaan tanpa merusak modul atau fitur lain yang tidak relevan.

4. **Tipe Data Ketat (Strict TypeScript)**:
   - Selalu definisikan `interface` atau `type` secara eksplisit. Hindari penggunaan tipe `any`.
