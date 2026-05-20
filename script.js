const form = document.getElementById("registrationForm");
const namaInput = document.getElementById("nama");
const icInput = document.getElementById("ic");
const statusMessage = document.getElementById("statusMessage");
const registrationList = document.getElementById("registrationList");
const clearButton = document.getElementById("clearButton");
const totalCount = document.getElementById("totalCount");
const openPasswordModalButton = document.getElementById("openPasswordModal");
const passwordModal = document.getElementById("passwordModal");
const listModal = document.getElementById("listModal");
const passwordForm = document.getElementById("passwordForm");
const listPasswordInput = document.getElementById("listPassword");
const passwordStatus = document.getElementById("passwordStatus");

const STORAGE_KEY = "briswalk-registrations";
const LIST_PASSWORD = "briswalk@123";

function getRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRegistrations(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatIc(value) {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const parts = [];

  if (digits.length > 0) {
    parts.push(digits.slice(0, 6));
  }

  if (digits.length > 6) {
    parts.push(digits.slice(6, 8));
  }

  if (digits.length > 8) {
    parts.push(digits.slice(8, 12));
  }

  return parts.join("-");
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setPasswordStatus(message, isError = false) {
  passwordStatus.textContent = message;
  passwordStatus.classList.toggle("error", isError);
}

function openModal(modal) {
  modal.hidden = false;
}

function closeModal(modal) {
  modal.hidden = true;
}

function renderRegistrations() {
  const entries = getRegistrations();
  totalCount.textContent = entries.length;

  if (entries.length === 0) {
    registrationList.innerHTML = `
      <tr class="empty-row">
        <td colspan="3">Belum ada pendaftaran.</td>
      </tr>
    `;
    return;
  }

  registrationList.innerHTML = entries
    .map((entry, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.nama}</td>
        <td>${entry.ic}</td>
      </tr>
    `)
    .join("");
}

icInput.addEventListener("input", () => {
  icInput.value = formatIc(icInput.value);
});

openPasswordModalButton.addEventListener("click", () => {
  passwordForm.reset();
  setPasswordStatus("");
  openModal(passwordModal);
  listPasswordInput.focus();
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (listPasswordInput.value !== LIST_PASSWORD) {
    setPasswordStatus("Password salah. Sila cuba lagi.", true);
    listPasswordInput.focus();
    listPasswordInput.select();
    return;
  }

  setPasswordStatus("");
  closeModal(passwordModal);
  openModal(listModal);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nama = namaInput.value.trim();
  const ic = formatIc(icInput.value);
  const digitIc = ic.replace(/\D/g, "");

  if (!nama) {
    setStatus("Sila isi nama peserta.", true);
    namaInput.focus();
    return;
  }

  if (digitIc.length !== 12) {
    setStatus("Sila masukkan nombor IC yang lengkap.", true);
    icInput.focus();
    return;
  }

  const entries = getRegistrations();

  entries.unshift({ nama, ic });
  saveRegistrations(entries);
  renderRegistrations();

  form.reset();
  setStatus("Pendaftaran berjaya disimpan.");
  namaInput.focus();
});

clearButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderRegistrations();
  setStatus("Senarai pendaftaran telah dikosongkan.");
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", () => {
    const modalId = element.getAttribute("data-close-modal");
    const modal = document.getElementById(modalId);

    if (modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(passwordModal);
    closeModal(listModal);
  }
});

renderRegistrations();
