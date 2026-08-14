# Aturan Wajib Git Workflow & Branching (Grizo-POS)

Kapan pun user memberikan instruksi untuk menambah fitur, memperbaiki bug, refactoring, atau melakukan perubahan kode pada proyek Grizo-POS, Anda WAJIB mematuhi alur kerja berikut tanpa kecuali:

1. **SELAU CEK & SYNC REPO TERBARU TERLEBIH DAHULU**:
   - Sebelum menyentuh kode apa pun, jalankan `git fetch origin` dan `git pull origin main` untuk memastikan kode lokal 100% up-to-date dengan repositori remote.

2. **WAJIB BUAT BRANCH BARU SEBELUM PENGERJAAN**:
   - DILARANG keras melakukan pengkodean/perubahan langsung di branch `main`.
   - WAJIB selalu membuat dan berpindah ke branch baru dari `main` SEBELUM melakukan pengerjaan apa pun:
     - `feat/deskripsi-singkat-fitur` (untuk fitur baru)
     - `fix/deskripsi-singkat-bug` (untuk perbaikan bug)
     - `refactor/deskripsi-singkat` (untuk pembersihan kode)

3. **PENUTUPAN & PULL REQUEST (PR)**:
   - Setelah pekerjaan selesai dan terverifikasi (`npm run build` lulus 100%), push branch baru tersebut ke remote repository: `git push -u origin <nama-branch-baru>`.
   - Buat Pull Request (PR) dari branch baru ke `main` untuk direview dan di-merge.
