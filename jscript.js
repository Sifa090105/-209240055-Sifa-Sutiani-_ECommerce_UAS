// Inisialisasi keranjang dari localStorage
let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

function simpanKeranjang() {
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
}

// Fungsi navigasi antar halaman
function tampilkan(id) {
  const halaman = document.querySelectorAll("section");
  halaman.forEach((el) => el.style.display = "none");

  const aktif = document.getElementById(id);
  if (aktif) aktif.style.display = "block";

  // Tampilkan keranjang hanya jika halaman 'keranjang' dibuka
  if (id === "keranjang") {
    tampilkanKeranjang();
  }
}

// Fungsi menampilkan isi keranjang
function tampilkanKeranjang() {
  const daftarKeranjang = document.getElementById("daftar-keranjang");
  const totalHargaElement = document.getElementById("total-harga");

  if (!daftarKeranjang || !totalHargaElement) return;

  daftarKeranjang.innerHTML = "";

  let total = 0;

  if (keranjang.length === 0) {
    daftarKeranjang.innerHTML = "<p style='text-align:center;'>Keranjang masih kosong.</p>";
    totalHargaElement.textContent = "0";
    return;
  }

  keranjang.forEach((item, index) => {
    const jumlah = item.jumlah || 1;
    const subtotal = item.harga * jumlah;
    total += subtotal;

    const li = document.createElement("li");
    li.className = "keranjang-item";
    li.innerHTML = `
      <div class="produk-info">
        <span class="nama-produk">${item.nama}</span>
        <span class="harga-satuan">Rp${item.harga.toLocaleString()}</span>
      </div>
      <div class="jumlah-control">
        <button class="jumlah-btn" onclick="kurangiJumlah(${index})">-</button>
        <span class="jumlah">${jumlah}</span>
        <button class="jumlah-btn" onclick="tambahJumlah(${index})">+</button>
      </div>
      <div class="subtotal">
        <span>Rp${subtotal.toLocaleString()}</span>
        <button class="hapus-btn" onclick="hapusProduk(${index})">
          <img src="images/delete-icon.png" alt="Hapus">
        </button>
      </div>
    `;
    daftarKeranjang.appendChild(li);
  });

  totalHargaElement.textContent = total.toLocaleString();
}

// Tambah ke keranjang
function tambahKeKeranjang(nama, harga) {
  const index = keranjang.findIndex(item => item.nama === nama);
  if (index !== -1) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ nama, harga, jumlah: 1 });
  }
  simpanKeranjang();
  alert(`${nama} ditambahkan ke keranjang.`);
}

// Tambah jumlah produk
function tambahJumlah(index) {
  keranjang[index].jumlah += 1;
  simpanKeranjang();
  tampilkanKeranjang();
}

// Kurangi jumlah produk
function kurangiJumlah(index) {
  if (keranjang[index].jumlah > 1) {
    keranjang[index].jumlah -= 1;
  } else {
    if (confirm(`Jumlah hanya 1. Hapus ${keranjang[index].nama} dari keranjang?`)) {
      keranjang.splice(index, 1);
    }
  }
  simpanKeranjang();
  tampilkanKeranjang();
}

// Hapus produk langsung
function hapusProduk(index) {
  if (confirm(`Yakin ingin menghapus ${keranjang[index].nama} dari keranjang?`)) {
    keranjang.splice(index, 1);
    simpanKeranjang();
    tampilkanKeranjang();
  }
}

// Event listener tombol BELI
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("button-beli")) {
    e.preventDefault();
    const artikel = e.target.closest("article");
    if (!artikel) return;

    const namaProduk = artikel.querySelector("h3")?.textContent.trim();
    const hargaText = artikel.querySelector("p:last-of-type")?.textContent.replace(/[^\d]/g, "");
    const harga = parseInt(hargaText || "0");

    if (namaProduk && harga) {
      tambahKeKeranjang(namaProduk, harga);
    }
  }
});

// Tampilkan halaman beranda saat pertama kali
document.addEventListener("DOMContentLoaded", () => {
  tampilkan("beranda");
});

function checkoutWhatsApp() {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  let pesan = "*Order dari Website:*\n\n";
  keranjang.forEach(item => {
    const jumlah = item.jumlah || 1;
    pesan += `• ${item.nama} x ${jumlah} = Rp${(item.harga * jumlah).toLocaleString()}\n`;
  });

  const total = keranjang.reduce((acc, item) => acc + item.harga * (item.jumlah || 1), 0);
  pesan += `\n*Total: Rp${total.toLocaleString()}*`;

  const noWA = "6282210234339"; // Ganti dengan nomor WhatsApp kamu (tanpa +)
  const url = `https://wa.me/6282210234339?text=Halo%20saya%20ingin%20order`;

  window.open(url, "_blank");
}


