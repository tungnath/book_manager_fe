let books = [];
let selectedRow = null;
let currentUser = null;
let userRole = null;

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log("control flow")
  fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.authenticated) {
      currentUser = data.username;
      userRole = data.role;
      showBookSection();
      loadBooks();
    } else {
      showError("Invalid credentials");
    }
  });
}

function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("http://127.0.0.1:5000/api/signup", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      currentUser = data.username;
      userRole = data.role;
      showBookSection();
      loadBooks();
    } else {
      showError("Username already exists");
    }
  });
}

function showBookSection() {
  document.getElementById("loginSection").classList.add("d-none");
  document.getElementById("bookSection").classList.remove("d-none");
}

function showError(msg) {
  const err = document.getElementById("authError");
  err.textContent = msg;
  err.classList.remove("d-none");
}

function loadBooks() {
  fetch("http://127.0.0.1:5000/api/books", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username: currentUser, role: userRole })
  })
  .then(res => res.json())
  .then(data => {
    books = data;
    renderTable();
  });
}

function renderTable() {
  const table = document.getElementById("bookTable");
  table.innerHTML = "";
  books.forEach((book, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${book.bid}</td><td>${book.title}</td><td>${book.author}</td>`;
    row.onclick = () => {
      selectedRow = i;
      document.getElementById("title").value = book.title;
      document.getElementById("author").value = book.author;
    };
    table.appendChild(row);
  });
}

function addOrUpdateBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  if (!title || !author) return;

  if (selectedRow !== null) {
    const book = books[selectedRow];
    fetch(`http://127.0.0.1:5000/api/books/${book.bid}`, {
      method: "PUT",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title, author, username: currentUser })
    }).then(loadBooks);
  } else {
    fetch(`http://127.0.0.1:5000/api/books`, {
      method: "PUT",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title, author, username: currentUser })
    }).then(loadBooks);
  }

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  selectedRow = null;
}

function deleteSelectedBook() {
  if (selectedRow === null) return;
  const book = books[selectedRow];
  fetch(`http://127.0.0.1:5000/api/books/${book.bid}`, {
    method: "DELETE"
  }).then(loadBooks);
  selectedRow = null;
}
