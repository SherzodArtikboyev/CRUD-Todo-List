const formCreate = document.querySelector("#form-create");
const formEdit = document.querySelector("#form-edit");
const listGroupTodo = document.querySelector("#list-group-todo");
// const messageCreate = document.querySelector('#message-create')
const time = document.querySelector("#time");
const modal = document.querySelector("#modal");
const overlay = document.querySelector("#overlay");
// time elements
const fullDay = document.querySelector("#full-day");
const hourEI = document.querySelector("#hour");
const minuteEI = document.querySelector("#minute");
const secondEI = document.querySelector("#second");
const closeEl = document.querySelector("#close");

let editItemId;

// check
let todos = JSON.parse(localStorage.getItem("list"))
  ? JSON.parse(localStorage.getItem("list"))
  : [];

if (todos.length) showTodos();

// setTodos to localStorage
function setTodos() {
  localStorage.setItem("list", JSON.stringify(todos));
}

// function time
function getTime() {
  const now = new Date();
  const date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  const month = now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth();
  const year = now.getFullYear();
  const hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  const minute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const second = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month_title = now.getMonth();
  fullDay.textContent = `${date} ${months[month_title]}, ${year}`;

  hourEI.textContent = hour;
  minuteEI.textContent = minute;
  secondEI.textContent = second;

  return `${hour}:${minute}, ${date}.${month}.${year}`;
}

setInterval(getTime, 1000);

// show todos
function showTodos() {
  const todos = JSON.parse(localStorage.getItem("list"));
  listGroupTodo.innerHTML = "";
  todos.forEach((item, i) => {
    listGroupTodo.innerHTML += `
    <li ondblclick="setCompleted(${i})" class="list-group-item d-flex justify-content-between ${
      item.completed == true ? "completed" : ""
    }">
      ${item.text}
      <div class="todo-icons">
        <span class="opacity-50 me-2">${item.time}</span>
        <img onClick=(editTodo(${i})) src="img/edit.svg" alt="edit icon" width="25" height="25" style="cursor: pointer;">
        <img onClick=(deleteTodo(${i})) src="img/delete.svg" alt="delete icon" width="25" height="25" style="cursor: pointer;">
      </div>
    </li>
    `;
  });
}

// show error
function showMessage(where, message) {
  document.querySelector(`#${where}`).textContent = message;

  setTimeout(() => {
    document.querySelector(`#${where}`).textContent = "";
  }, 2500);
}

// get Todos
formCreate.addEventListener("click", (e) => {
  e.preventDefault();

  const todoText = formCreate["input-create"].value.trim();

  formCreate.reset();

  if (todoText.length) {
    todos.push({ text: todoText, time: getTime(), completed: false });
    setTodos();
    showTodos();
  } else {
    showMessage("message-create", "Please, enter some input");
  }
});

// delete todo
function deleteTodo(id) {
  const deletedTodos = todos.filter((item, i) => {
    return i !== id;
  });

  todos = deletedTodos;
  setTodos();
  showTodos();
}

// completed todo
function setCompleted(id) {
  const completedTodos = todos.map((item, i) => {
    if (id == i) {
      return { ...item, completed: item.completed == true ? false : true }
    } else {
      return { ...item };
    }
  })
  todos = completedTodos;
  setTodos();
  showTodos();
}

// Edit form
formEdit.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = formEdit["input-edit"].value.trim();

  formEdit.reset();

  if (todoText.length) {
    todos.splice(editItemId, 1, {
      text: todoText,
      time: getTime(),
      completed: false,
    });
    setTodos();
    showTodos();
    close();
  } else {
    showMessage("message-edit", "Please, enter some input");
  }
});

// Edit todo
function editTodo(id) {
  open();
  editItemId = id;
}

overlay.addEventListener("click", close);
closeEl.addEventListener("click", close);

document.addEventListener("keydown", (e) => {
  if (e.which == 27) {
    close();
  }
});

function open() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}
