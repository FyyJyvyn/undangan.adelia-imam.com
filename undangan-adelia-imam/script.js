// ==========================================
// KONFIGURASI
// ==========================================

const WEDDING_DATE = new Date("2026-11-29T08:00:00+07:00");

const FORMSPREE_URL = "https://formspree.io/f/xaeeayev";

const GUESTBOOK_URL =
  "https://script.google.com/macros/s/AKfycbxb-8hVGAW2kCpatf1ZEJgylvCFv21mOeyvvm6oHQwIXTb_EqvVJhF6ERF0soTuKhty/exec";


// ==========================================
// NAMA TAMU DARI LINK
// Contoh: index.html?to=Rafi
// ==========================================

const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");

const guestNameElement = document.getElementById("guestName");

if (guestName && guestNameElement) {
  guestNameElement.textContent = guestName.replace(/\+/g, " ");
}


// ==========================================
// BUKA UNDANGAN
// ==========================================

const openingScreen = document.getElementById("openingScreen");
const openInvitation = document.getElementById("openInvitation");
const weddingMusic = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");

let musicPlaying = false;

openInvitation.addEventListener("click", async () => {
  openingScreen.classList.add("hidden");

  try {
    await weddingMusic.play();
    musicPlaying = true;
    musicButton.classList.add("playing");
    musicIcon.textContent = "♫";
  } catch (error) {
    console.log("Musik belum dapat diputar:", error);
  }

  setTimeout(() => {
    document.getElementById("home").scrollIntoView({
      behavior: "smooth"
    });
  }, 400);
});


// ==========================================
// KONTROL MUSIK
// ==========================================

musicButton.addEventListener("click", async () => {
  if (musicPlaying) {
    weddingMusic.pause();
    musicPlaying = false;
    musicButton.classList.remove("playing");
    musicIcon.textContent = "♫";
  } else {
    try {
      await weddingMusic.play();
      musicPlaying = true;
      musicButton.classList.add("playing");
      musicIcon.textContent = "♫";
    } catch (error) {
      alert("Musik belum dapat diputar. Silakan coba lagi.");
    }
  }
});


// ==========================================
// NAVIGASI MOBILE
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");

  menuToggle.setAttribute("aria-expanded", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});


// ==========================================
// COUNTDOWN
// ==========================================

function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE.getTime() - now;

  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (distance <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    return;
  }

  days.textContent = String(
    Math.floor(distance / (1000 * 60 * 60 * 24))
  ).padStart(2, "0");

  hours.textContent = String(
    Math.floor((distance / (1000 * 60 * 60)) % 24)
  ).padStart(2, "0");

  minutes.textContent = String(
    Math.floor((distance / (1000 * 60)) % 60)
  ).padStart(2, "0");

  seconds.textContent = String(
    Math.floor((distance / 1000) % 60)
  ).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================
// ANIMASI SCROLL
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


// ==========================================
// SALIN NOMOR REKENING
// ==========================================

const copyAccount = document.getElementById("copyAccount");
const accountNumber = document.getElementById("accountNumber");
const copyStatus = document.getElementById("copyStatus");

copyAccount.addEventListener("click", async () => {
  const number = accountNumber.textContent.trim();

  try {
    await navigator.clipboard.writeText(number);
    copyStatus.textContent = "Nomor rekening berhasil disalin.";
  } catch (error) {
    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = number;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    document.execCommand("copy");
    temporaryInput.remove();

    copyStatus.textContent = "Nomor rekening berhasil disalin.";
  }

  setTimeout(() => {
    copyStatus.textContent = "";
  }, 3000);
});


// ==========================================
// FORM RSVP - FORMSPREE
// ==========================================

const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = rsvpForm.querySelector("button[type='submit']");

  const formData = {
    nama: document.getElementById("rsvpName").value.trim(),
    kehadiran: document.getElementById("rsvpAttendance").value,
    jumlah_tamu: document.getElementById("rsvpGuests").value
  };

  if (!formData.nama || !formData.kehadiran) {
    rsvpStatus.textContent = "Mohon lengkapi formulir terlebih dahulu.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Mengirim...";
  rsvpStatus.textContent = "";

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Gagal mengirim RSVP.");
    }

    rsvpStatus.textContent = "Terima kasih! Konfirmasi kehadiran berhasil dikirim.";
    rsvpForm.reset();

  } catch (error) {
    console.error(error);
    rsvpStatus.textContent =
      "Konfirmasi gagal dikirim. Silakan coba beberapa saat lagi.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Kirim Konfirmasi";
  }
});


// ==========================================
// BUKU TAMU - GOOGLE APPS SCRIPT
// ==========================================

const guestbookForm = document.getElementById("guestbookForm");
const guestbookStatus = document.getElementById("guestbookStatus");
const guestbookList = document.getElementById("guestbookList");


// Membuat elemen teks dengan aman
function createTextElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  element.textContent = text || "";

  return element;
}


// Menampilkan ucapan
function displayGuestbook(data) {
  guestbookList.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    guestbookList.appendChild(
      createTextElement(
        "p",
        "guestbook-empty",
        "Belum ada ucapan. Jadilah yang pertama memberikan doa!"
      )
    );

    return;
  }

  const entries = data.slice().reverse();

  entries.forEach((item) => {
    const entry = document.createElement("article");
    entry.className = "guestbook-entry";

    const top = document.createElement("div");
    top.className = "guestbook-entry-top";

    const name = createTextElement(
      "h4",
      "",
      item.nama || item.Nama || "Tamu Undangan"
    );

    const attendance = createTextElement(
      "span",
      "attendance-badge",
      item.kehadiran || item.Kehadiran || "Belum Konfirmasi"
    );

    const message = createTextElement(
      "p",
      "",
      item.ucapan || item.Ucapan || ""
    );

    top.appendChild(name);
    top.appendChild(attendance);

    entry.appendChild(top);
    entry.appendChild(message);

    guestbookList.appendChild(entry);
  });
}


// Mengambil data buku tamu menggunakan JSONP
function loadGuestbook() {
  const callbackName =
    "guestbookCallback_" + Date.now() + "_" +
    Math.floor(Math.random() * 10000);

  const script = document.createElement("script");

  window[callbackName] = function (response) {
    displayGuestbook(response);

    delete window[callbackName];
    script.remove();
  };

  script.src =
    GUESTBOOK_URL +
    "?callback=" +
    callbackName +
    "&_=" +
    Date.now();

  script.onerror = function () {
    guestbookList.innerHTML = "";

    guestbookList.appendChild(
      createTextElement(
        "p",
        "guestbook-empty",
        "Ucapan belum dapat dimuat. Silakan coba muat ulang halaman."
      )
    );

    delete window[callbackName];
    script.remove();
  };

  document.body.appendChild(script);
}


// Mengirim ucapan ke Google Apps Script
guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = guestbookForm.querySelector("button[type='submit']");

  const nama = document.getElementById("guestbookName").value.trim();
  const kehadiran = document.getElementById("guestbookAttendance").value;
  const ucapan = document.getElementById("guestbookMessage").value.trim();

  if (!nama || !kehadiran || !ucapan) {
    guestbookStatus.textContent = "Mohon lengkapi semua kolom.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Mengirim...";
  guestbookStatus.textContent = "";

  const formData = {
    nama: nama,
    kehadiran: kehadiran,
    ucapan: ucapan
  };

  try {
    await fetch(GUESTBOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(formData)
    });

    guestbookStatus.textContent =
      "Ucapan telah dikirim. Terima kasih atas doa dan harapannya!";

    guestbookForm.reset();

    setTimeout(loadGuestbook, 2000);

  } catch (error) {
    console.error(error);

    guestbookStatus.textContent =
      "Ucapan gagal dikirim. Silakan coba kembali.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Kirim Ucapan";
  }
});


// ==========================================
// MUAT BUKU TAMU SAAT HALAMAN DIBUKA
// ==========================================

loadGuestbook();