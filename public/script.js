let allEvents = [];
const API = {
  createSession: "/api/events",
  listSessions: "/api/events",
  updateSession: "/api/events",
  deleteSession: "/api/events",
  reserveSeat: "/api/events/book",
  toggleStar: "/api/events/favorite",
  setStatus: "/api/events/rsvp"
};

window.onload = () => {
  const user = localStorage.getItem("user") || "User";
  const nameEl = document.getElementById("welcomeUser");
  if (nameEl) nameEl.innerText = "Hi, " + user;
  loadEvents();
};

/* Modal */
function openModal() {
  document.getElementById("eventModal").style.display = "flex";

  // Prevent selecting past dates
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").setAttribute("min", today);
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
  clearForm();
}

function clearForm() {
  document.getElementById("editId").value = "";
  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
  document.getElementById("location").value = "";
  document.getElementById("description").value = "";

  const c = document.getElementById("category");
  const i = document.getElementById("image");
  const s = document.getElementById("totalSeats");

  if (c) c.value = "Tech";
  if (i) i.value = "";
  if (s) s.value = 50;
}

/* Save Add/Edit */
async function saveEvent() {
  const id = document.getElementById("editId").value;

  const payload = {
    title: document.getElementById("title").value.trim(),
    date: document.getElementById("date").value,
    location: document.getElementById("location").value.trim(),
    category: document.getElementById("category")?.value || "Tech",
    image: document.getElementById("image")?.value || "",
    description: document.getElementById("description").value.trim(),
    totalSeats: Number(document.getElementById("totalSeats")?.value || 50)
  };

  const today = new Date().toISOString().split("T")[0];

  // Block past event creation
  if (payload.date < today) {
    showToast("Cannot create events in the past");
    return;
  }

  if (!payload.title || !payload.date || !payload.location || !payload.description) {
    showToast("Fill all fields including description");
    return;
  }

  const url = id ? API.updateSession + "/" + id : API.createSession;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(async () => ({
    message: await res.text()
  }));
  showToast(data.message || "Success");
  closeModal();
  loadEvents();
}

/* Load Events */
async function loadEvents() {
  const res = await fetch(API.listSessions);
  allEvents = await res.json();

  renderEvents(allEvents);
  updateStats();
  loadLocations();
}

/* Render Cards */
function renderEvents(events) {
  const grid = document.getElementById("eventGrid");
  grid.innerHTML = "";

  events.forEach(e => {
    const days = getDaysLeft(e.date);

    grid.innerHTML += `
      <div class="event-card">
        ${e.image ? `<img src="${e.image}" class="event-img">` : ""}

        <h3>${e.favorite ? "❤️ " : ""}${e.title}</h3>

        <p>📅 ${e.date}</p>
        <p>📍 ${e.location}</p>
        <p>🏷️ ${e.category || "General"}</p>
        <p>⏳ ${days}</p>

        <p class="desc">${e.description || ""}</p>

        <p>🎟️ Seats Left: <strong>${e.seatsLeft}</strong> / ${e.totalSeats}</p>
        <p class="status">Audience Status: <strong>${e.rsvp}</strong></p>

        <button onclick="bookEvent('${e._id}')">Reserve</button>

        <button onclick='editEvent(
          "${e._id}",
          ${JSON.stringify(e.title || "")},
          ${JSON.stringify(e.date || "")},
          ${JSON.stringify(e.location || "")},
          ${JSON.stringify(e.category || "")},
          ${JSON.stringify(e.image || "")},
          ${JSON.stringify(e.description || "")},
          "${e.totalSeats || 50}"
        )'>Modify</button>

        <button onclick="toggleFavorite('${e._id}')">Star</button>
        <button onclick="setRSVP('${e._id}','Going')">Confirmed</button>
        <button onclick="setRSVP('${e._id}','Interested')">Interested</button>
        <button class="delete-btn" onclick="deleteEvent('${e._id}')">Remove</button>
      </div>
    `;
  });
}

/* Edit */
function editEvent(id, title, date, location, category, image, description, totalSeats) {
  openModal();

  document.getElementById("editId").value = id;
  document.getElementById("title").value = title || "";
  document.getElementById("date").value = date || "";
  document.getElementById("location").value = location || "";
  document.getElementById("description").value = description || "";

  document.getElementById("category").value = category || "";
  document.getElementById("image").value = image || "";
  document.getElementById("totalSeats").value = totalSeats || 50;
}

/* Delete */
async function deleteEvent(id) {
  await fetch(API.deleteSession + "/" + id, { method: "DELETE" });
  showToast("Session removed");
  loadEvents();
}

/* Book */
async function bookEvent(id) {
  const res = await fetch(API.reserveSeat + "?id=" + id, { method: "PUT" });
  const data = await res.json().catch(async () => ({
    message: await res.text()
  }));
  showToast(data.message || "Success");
  loadEvents();
}

/* Favorite */
async function toggleFavorite(id) {
  const res = await fetch(API.toggleStar + "?id=" + id, { method: "PUT" });
  const data = await res.json().catch(async () => ({
    message: await res.text()
  }));
  showToast(data.message || "Success");
  loadEvents();
}

/* RSVP */
async function setRSVP(id, status) {
  const res = await fetch(API.setStatus + "?id=" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rsvp: status })
  });

  const data = await res.json().catch(async () => ({
    message: await res.text()
  }));
  showToast(data.message || "Success");
  loadEvents();
}

/* Sort */
function sortByDate() {
  const sorted = [...allEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  renderEvents(sorted);
  showToast("Sorted by session date");
}

/* Search */
function filterEvents() {
  const text = document.getElementById("searchInput").value.toLowerCase();
  const loc = document.getElementById("locationFilter").value;

  const filtered = allEvents.filter(e => {
    const matchText =
      e.title.toLowerCase().includes(text) ||
      e.location.toLowerCase().includes(text);

    const matchLoc = loc === "" || e.location === loc;
    return matchText && matchLoc;
  });

  renderEvents(filtered);
}

/* Locations */
function loadLocations() {
  const select = document.getElementById("locationFilter");
  if (!select) return;

  const unique = [...new Set(allEvents.map(e => e.location))];
  select.innerHTML = `<option value="">All Locations</option>`;

  unique.forEach(loc => {
    select.innerHTML += `<option value="${loc}">${loc}</option>`;
  });
}

/* Stats */
function updateStats() {
  document.getElementById("totalEvents").innerText = allEvents.length;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("upcomingEvents").innerText =
    allEvents.filter(e => e.date >= today).length;

  document.getElementById("locationsCount").innerText =
    [...new Set(allEvents.map(e => e.location))].length;
}

/* Helpers */
function getDaysLeft(date) {
  const today = new Date();
  const eventDate = new Date(date);
  const diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return "Completed";
  if (diff === 0) return "Today";
  return diff + " days left";
}

function toggleDarkMode() {
  document.body.classList.toggle("light");
}

function logout() {
  localStorage.removeItem("user");
  location.href = "/studio/login";
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}