// assets/js/script.js

// Konstanta dan Elemen DOM
// ATUR TANGGAL DAN WAKTU PENGUMUMAN DI SINI!
// Contoh: new Date("Month Day, Year HH:MM:SS GMT+TIMEZONE")
// WITA: GMT+0800, WIT: GMT+0900, WIB: GMT+0700
// Untuk pengujian: Set ke waktu yang sudah lewat, tapi belum 1 jam dari sekarang
const ANNOUNCEMENT_DATE = new Date("June 02, 2025 16:00:00 GMT+0900"); // Ganti dengan tanggal dan waktu aktual Anda
const ACCESS_LIMIT_HOURS = 5; // Batas akses pengumuman dalam JAM setelah tanggal pengumuman
const DEFAULT_PASSWORD = "smppb25"; // Password umum

const countdownSection = document.getElementById('countdown-section');
const loginSection = document.getElementById('login-section');
const resultSection = document.getElementById('result-section');
const loginForm = document.getElementById('login-form');
const nisnInput = document.getElementById('nisn');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

const displayNisn = document.getElementById('display-nisn');
const displayNomorPeserta = document.getElementById('display-nomor-peserta');
const displayNamaPeserta = document.getElementById('display-nama-peserta');
const displayStatusKelulusan = document.getElementById('display-status-kelulusan');

const printButton = document.getElementById('print-button');
const logoutButton = document.getElementById('logout-button');

// Elemen baru untuk countdown
const daysSpan = document.getElementById('days');
const hoursSpan = document.getElementById('hours');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const accessLimitDisplay = document.getElementById('access-limit-display');

let accessLimitCountdownInterval; // Variabel untuk menyimpan interval batas waktu akses

// Fungsi Countdown (untuk sebelum pengumuman)
function updateCountdown() {
    const now = new Date().getTime();
    const distance = ANNOUNCEMENT_DATE - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysSpan.innerHTML = String(days).padStart(2, '0');
    hoursSpan.innerHTML = String(hours).padStart(2, '0');
    minutesSpan.innerHTML = String(minutes).padStart(2, '0');
    secondsSpan.innerHTML = String(seconds).padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownInterval); // Hentikan countdown utama
        countdownSection.classList.add('hidden'); // Sembunyikan countdown utama
        checkAccessTime(); // Langsung periksa batas waktu akses
    }
}

// Fungsi untuk menampilkan dan mengupdate batas waktu akses (setelah pengumuman dibuka)
function updateAccessLimitCountdown() {
    const now = new Date().getTime();
    const accessEndDate = new Date(ANNOUNCEMENT_DATE);
    // Tambahkan jam ke tanggal pengumuman
    accessEndDate.setHours(ANNOUNCEMENT_DATE.getHours() + ACCESS_LIMIT_HOURS);
    const distance = accessEndDate.getTime() - now;

    if (distance < 0) {
        clearInterval(accessLimitCountdownInterval); // Hentikan countdown batas waktu akses
        accessLimitDisplay.textContent = "Masa akses pengumuman telah berakhir. Pengumuman tidak dapat diakses lagi.";
        errorMessage.textContent = "Masa akses pengumuman telah berakhir. Silakan hubungi sekolah untuk informasi lebih lanjut.";
        errorMessage.classList.remove('hidden');
        loginSection.classList.add('hidden'); // Sembunyikan form login
        resultSection.classList.add('hidden'); // Sembunyikan hasil jika sedang tampil
        countdownSection.classList.remove('hidden'); // Tampilkan kembali bagian countdown untuk pesan akhir
        document.querySelector('.countdown-timer').style.display = 'none'; // Sembunyikan timer, hanya tampilkan pesan
        document.querySelector('.countdown-section p').style.display = 'none'; // Sembunyikan teks "Pengumuman akan tersedia dalam:"
        return;
    }

    const totalSeconds = Math.floor(distance / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    accessLimitDisplay.textContent = `Akses akan ditutup dalam: ${String(hours).padStart(2, '0')} jam, ${String(minutes).padStart(2, '0')} menit, ${String(seconds).padStart(2, '0')} detik.`;
}

// Fungsi Cek Batas Waktu Akses
function checkAccessTime() {
    const now = new Date().getTime();
    const accessEndDate = new Date(ANNOUNCEMENT_DATE);
    // Tambahkan jam ke tanggal pengumuman
    accessEndDate.setHours(ANNOUNCEMENT_DATE.getHours() + ACCESS_LIMIT_HOURS);

    if (now > accessEndDate.getTime()) {
        // Jika sudah melewati batas akhir akses
        loginSection.classList.add('hidden'); // Sembunyikan form login
        resultSection.classList.add('hidden'); // Sembunyikan hasil kelulusan
        countdownSection.classList.remove('hidden'); // Tampilkan kembali bagian countdown untuk pesan akhir
        document.querySelector('.countdown-timer').style.display = 'none'; // Sembunyikan timer
        document.querySelector('.countdown-section p').style.display = 'none'; // Sembunyikan teks "Pengumuman akan tersedia dalam:"

        accessLimitDisplay.textContent = "Masa akses pengumuman telah berakhir. Pengumuman tidak dapat diakses lagi.";
        errorMessage.textContent = "Masa akses pengumuman telah berakhir. Silakan hubungi sekolah untuk informasi lebih lanjut.";
        errorMessage.classList.remove('hidden'); // Pastikan pesan error terlihat
        accessLimitDisplay.classList.remove('hidden'); // Pastikan pesan batas akses terlihat
    } else if (now >= ANNOUNCEMENT_DATE.getTime()) {
        // Jika pengumuman sudah dimulai tapi belum melewati batas akhir akses
        countdownSection.classList.add('hidden'); // Sembunyikan countdown awal
        loginSection.classList.remove('hidden'); // Tampilkan form login
        errorMessage.textContent = ""; // Kosongkan pesan error
        errorMessage.classList.add('hidden'); // Sembunyikan pesan error

        if (!accessLimitCountdownInterval) { // Pastikan hanya dijalankan sekali
            accessLimitCountdownInterval = setInterval(updateAccessLimitCountdown, 1000);
            updateAccessLimitCountdown(); // Panggil sekali untuk menghindari jeda awal
        }
        accessLimitDisplay.classList.remove('hidden'); // Pastikan tulisan batas waktu akses terlihat
    } else {
        // Jika pengumuman belum dimulai
        countdownSection.classList.remove('hidden'); // Tampilkan countdown awal
        loginSection.classList.add('hidden'); // Sembunyikan form login
        resultSection.classList.add('hidden'); // Sembunyikan hasil kelulusan
        accessLimitDisplay.classList.add('hidden'); // Sembunyikan batas waktu akses
        errorMessage.textContent = ""; // Kosongkan pesan error
        errorMessage.classList.add('hidden'); // Sembunyikan pesan error
    }
}

// Inisialisasi Countdown utama
let countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Panggil sekali untuk menghindari jeda awal

// Panggil checkAccessTime saat halaman dimuat
// Ini akan menentukan tampilan awal berdasarkan waktu saat ini
checkAccessTime();


// Event Listener untuk Form Login
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form dari refresh halaman

    const nisn = nisnInput.value.trim();
    const password = passwordInput.value.trim();

    // Pastikan masa akses belum berakhir sebelum memproses login
    const now = new Date().getTime();
    const accessEndDate = new Date(ANNOUNCEMENT_DATE);
    accessEndDate.setHours(ANNOUNCEMENT_DATE.getHours() + ACCESS_LIMIT_HOURS); // Gunakan ACCESS_LIMIT_HOURS di sini

    if (now > accessEndDate.getTime()) {
        errorMessage.textContent = "Masa akses pengumuman telah berakhir. Pengumuman tidak dapat diakses lagi.";
        errorMessage.classList.remove('hidden');
        loginSection.classList.add('hidden');
        resultSection.classList.add('hidden');
        // Pastikan juga tampilan batas waktu akses diperbarui
        updateAccessLimitCountdown();
        return; // Hentikan proses login
    }

    if (password !== DEFAULT_PASSWORD) {
        errorMessage.textContent = "Password salah!";
        errorMessage.classList.remove('hidden');
        return;
    }

    const student = studentsData.find(s => s.nisn === nisn);

    if (student) {
        displayStudentData(student);
        loginSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        accessLimitDisplay.classList.add('hidden'); // Sembunyikan batas waktu akses saat data siswa tampil
    } else {
        errorMessage.textContent = "NISN tidak ditemukan. Pastikan NISN yang Anda masukkan benar.";
        errorMessage.classList.remove('hidden');
    }
});

// Fungsi untuk Menampilkan Data Siswa
function displayStudentData(student) {
    displayNisn.textContent = student.nisn;
    displayNomorPeserta.textContent = student.nomorPeserta;
    displayNamaPeserta.textContent = student.namaPeserta;
    displayStatusKelulusan.textContent = student.statusKelulusan;

    // Menambahkan kelas CSS berdasarkan status kelulusan
    displayStatusKelulusan.classList.remove('status-lulus', 'status-tidak-lulus', 'status-tidak-ikut');
    if (student.statusKelulusan.toLowerCase() === 'lulus') {
        displayStatusKelulusan.classList.add('status-lulus');
    } else if (student.statusKelulusan.toLowerCase().includes('tidak lulus')) {
        displayStatusKelulusan.classList.add('status-tidak-lulus');
    } else if (student.statusKelulusan.toLowerCase().includes('tidak ikut')) {
        displayStatusKelulusan.classList.add('status-tidak-ikut');
    }
}

// Event Listener untuk Tombol Logout
logoutButton.addEventListener('click', function() {
    resultSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    nisnInput.value = '';
    passwordInput.value = '';
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    checkAccessTime(); // Periksa kembali waktu akses saat logout
});

// Event Listener untuk Tombol Cetak (PDF)
printButton.addEventListener('click', function() {
    const student = studentsData.find(s => s.nisn === displayNisn.textContent);
    if (student) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Bukti Kelulusan - ${student.namaPeserta}</title>
                <style>
                    body { font-family: 'Poppins', sans-serif; margin: 30px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .header img { width: 100px; margin-bottom: 10px; }
                    .header h1 { color: #28a745; font-size: 1.8em; margin: 0; }
                    .header h2 { color: #007bff; font-size: 1.2em; margin: 5px 0; }
                    .content { border: 2px solid #ccc; padding: 25px; border-radius: 10px; }
                    .content p { font-size: 1.1em; margin-bottom: 10px; }
                    .content strong { color: #28a745; }
                    .status-kelulusan {
                        font-size: 2em;
                        font-weight: bold;
                        text-align: center;
                        margin-top: 30px;
                        padding: 15px;
                        border-radius: 8px;
                        background-color: #e9ecef;
                    }
                    .status-lulus { color: #28a745; }
                    .status-tidak-lulus { color: #dc3545; }
                    .status-tidak-ikut { color: #ffc107; }
                    .footer { text-align: center; margin-top: 40px; font-size: 0.8em; color: #777; }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="assets/images/logo-smp-al-quran.png" alt="Logo Sekolah">
                    <h1>BUKTI KELULUSAN SISWA</h1>
                    <h2>SMP AL-QUR'AN PUTRA BAHARI TERNATE</h2>
                    <p>Tahun Pelajaran 2024/2025</p>
                </div>
                <div class="content">
                    <p>Dengan hormat,</p>
                    <p>Berdasarkan hasil rapat Dewan Guru SMP Al-Qur'an Putra Bahari Ternate pada tanggal ${new Date(ANNOUNCEMENT_DATE).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}, dengan ini kami sampaikan bahwa:</p>
                    <p><strong>NISN:</strong> ${student.nisn}</p>
                    <p><strong>Nomor Peserta:</strong> ${student.nomorPeserta}</p>
                    <p><strong>Nama Peserta:</strong> ${student.namaPeserta}</p>
                    <div class="status-kelulusan ${student.statusKelulusan.toLowerCase().replace(/\s/g, '-') /* untuk menyesuaikan kelas CSS */}">
                        STATUS: ${student.statusKelulusan.toUpperCase()}
                    </div>
                    <p style="margin-top: 20px;">Demikian pengumuman kelulusan ini disampaikan untuk dapat dipergunakan sebagaimana mestinya.</p>
                    <p>Ternate, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p style="margin-top: 30px;">Kepala Sekolah,</p>
                    <p style="margin-top: 60px;">(Hj. RISTINA HUSAIN, SE.MM)</p>
                </div>
                <div class="footer">
                    <p>Dokumen ini adalah bukti kelulusan sah dan dapat dicetak.</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
});
