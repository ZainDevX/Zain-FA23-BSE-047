// ============================================
//  SQLite — Frontend CRUD Logic
// ============================================

const API = "/api/sqlite/users";

// ---- Toast Notification ----
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---- Fetch & Render All Users ----
async function loadUsers() {
  try {
    const res = await fetch(API);
    const json = await res.json();
    const users = json.data || [];
    const tbody = document.getElementById("userTableBody");
    const count = document.getElementById("userCount");

    count.textContent = `${users.length} user${users.length !== 1 ? "s" : ""}`;

    if (users.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>No users found. Add one above!</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = users
      .map(
        (u) => `
        <tr>
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.phone}</td>
          <td>
            <div class="actions">
              <button class="btn btn-success btn-sm" onclick="openEdit(${u.id},'${u.name}','${u.email}','${u.phone}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join("");
  } catch (err) {
    showToast("Failed to load users", "error");
  }
}

// ---- Create User ----
document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    const json = await res.json();
    if (json.success) {
      showToast("User added successfully!");
      e.target.reset();
      loadUsers();
    } else {
      showToast(json.message, "error");
    }
  } catch (err) {
    showToast("Error adding user", "error");
  }
});

// ---- Open Edit Modal ----
function openEdit(id, name, email, phone) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
  document.getElementById("editModal").classList.add("active");
}

function closeModal() {
  document.getElementById("editModal").classList.remove("active");
}

// ---- Update User ----
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    const json = await res.json();
    if (json.success) {
      showToast("User updated successfully!");
      closeModal();
      loadUsers();
    } else {
      showToast(json.message, "error");
    }
  } catch (err) {
    showToast("Error updating user", "error");
  }
});

// ---- Delete User ----
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      showToast("User deleted successfully!");
      loadUsers();
    } else {
      showToast(json.message, "error");
    }
  } catch (err) {
    showToast("Error deleting user", "error");
  }
}

// ---- Initial Load ----
loadUsers();
