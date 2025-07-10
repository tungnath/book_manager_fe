const api = 'https://bookmanager-production-12c4.up.railway.app/api/';//'http://localhost:5000/api/';
let books = [];
let selectedRow = null;
let currentUser = null;
let userRole = null;

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) return showError("Enter credentials");

  fetch(`${api}login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  })
    .then(res => res.json())
    .then(res => {
      if (res.authenticated) {
        currentUser = res.username;
        userRole = res.role;

        localStorage.setItem('user', currentUser);
        localStorage.setItem('role', userRole);

        history.pushState(null, '', '/book');
        showMainApp();
      } else {
        showError("Invalid username or password");
      }
    })
    .catch(() => showError("Server error"));
}

function signup() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) return showError("Enter credentials");

  fetch(`${api}signup`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        currentUser = res.username;
        userRole = res.role;
        history.pushState(null, '', '/book');
        showMainApp();
      } else {
        showError("Signup failed");
      }
    })
    .catch(() => showError("Server error"));
}

function showError(msg) {
  const el = document.getElementById('authError');
  el.innerText = msg;
  el.style.display = 'block';
}

function showMainApp() {
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('mainContent').classList.remove('d-none');
  fetchBooks();
}

function logout() {
  currentUser = null;
  userRole = null;
  selectedRow = null;

  localStorage.removeItem('user');
  localStorage.removeItem('role');

  document.getElementById('mainContent').classList.add('d-none');
  document.getElementById('authModal').style.display = 'flex';

  document.getElementById('mainContent').classList.add('d-none');
  document.getElementById('authModal').style.display = 'flex';
  history.pushState(null, '', '/');
}

function fetchBooks() {
  fetch(`${api}books/get`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: currentUser, role: userRole})
  })
    .then(res => res.json())
    .then(data => {
      books = data;
      renderTable();
    });
}

function selectRow(row, i) {
  console.log("selected " + i);
  document.querySelectorAll('#bookTable tbody tr').forEach(r => r.classList.remove('table-primary'));
  row.classList.add('table-primary');
  selectedRow = i;

  const book = books[i];
  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;

  const favBtn = document.getElementById('favBtn');
  if (book.favourite == 1) {
    favBtn.innerText = "⭐ Remove from Favourites";
    favBtn.classList.remove('btn-warning');
    favBtn.classList.add('btn-secondary');
  } else {
    favBtn.innerText = "⭐ Add to Favourites";
    favBtn.classList.remove('btn-secondary');
    favBtn.classList.add('btn-warning');
  }
}

function renderTable() {
  const tbody = document.querySelector('#bookTable tbody');
  tbody.innerHTML = '';
  books.forEach((book, i) => {
    const star = book.favourite == 1
      ? '<i class="fas fa-star text-warning me-2"></i>'
      : '';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${star}${book.title}</td>
      <td>${book.author}</td>
    `;
    row.onclick = () => selectRow(row, i);
    tbody.appendChild(row);
  });
}


function addOrUpdateBook() {
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !author) return alert("Fill both fields");

  const data = {title, author, username: currentUser, role: userRole};

  if (selectedRow !== null) {
    const book = books[selectedRow];
    fetch(`${api}books/${book.bid}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(() => {
      fetchBooks();

      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      selectedRow = null;
    });
  } else {
    fetch(`${api}books`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(() => {
      fetchBooks();

      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
    });
  }
}

function deleteSelectedBook() {
  if (selectedRow === null) return alert("Select a book first");

  const book = books[selectedRow];

  fetch(`${api}books/${book.bid}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: currentUser, role: userRole})
  }).then(() => {
    fetchBooks();

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';

    selectedRow = null;
  });
}

function addFavourite() {
  if (selectedRow === null) return alert("Select a book first");

  const book = books[selectedRow];

  fetch(`${api}books/favourite/${book.bid}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: currentUser})
  })
    .then(response => response.json())
    .then(data => {
      fetchBooks();
      selectedRow = null;
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('favBtn').innerText = "⭐ Add to Favourites";
      document.getElementById('favBtn').classList.remove('btn-secondary');
      document.getElementById('favBtn').classList.add('btn-warning');
    })
    .catch(() => alert("Failed to toggle favourite"));
}

function favourites() {

}

function about() {
  window.location.href = 'about.html';
}
