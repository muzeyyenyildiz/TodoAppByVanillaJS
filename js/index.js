/// Initial data
const App = {
  currentUser: null,
  todos: [],
  getUserModel: function (username) {
    return {
      username: username,
      list: [],
    };
  },
};

///***User Operations***///

//Get current User
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

//Check if current user is logged in
function checkUser() {
  if (App.currentUser) {
    renderUsername();
  } else {
    alert("Please login first");
    window.location.href = "login.html";
  }
}

//Render Username on html page
function renderUsername() {
  if (App.currentUser) {
    document.getElementById(
      "user-write"
    ).innerHTML = `Hello ${App.currentUser.username}!`;
  }
}

// Logout Click Event Handler
function onLogoutClick(event) {
  event.preventDefault();
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

///***Data Operations ***///

//Get data from local storage
function getData() {
  return JSON.parse(localStorage.getItem("data")) || [];
}

//Add new user to local storage
function addUserData() {
  const data = getData();
  const existingUser = data.find(
    (user) => user.username === App.currentUser.username
  );

  if (!data.length || !existingUser) {
    localStorage.setItem(
      "data",
      JSON.stringify([...data, App.getUserModel(App.currentUser.username)])
    );
  }
}

//Get todos from local storage
function getTodos() {
  const data = getData();
  if (data.length) {
    const existingUser = data.find(
      (user) => user.username === App.currentUser.username
    );
    if (existingUser) {
      return existingUser.list;
    }
  }
  return [];
}

//Categorize todos by date
function categorizeTodos(todos) {
  let data = todos;
  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  //Group by date as key to the todos array
  const filteredData = groupBy(data, "date");
  //Order by date
  const orderedData = Object.keys(filteredData)
    .sort()
    .reduce((obj, key) => {
      obj[key] = filteredData[key];
      return obj;
    }, {});
  return orderedData;
}

// Updated Local Storage data
function updateLSData(todos) {
  let data = getData();
  let index = data.findIndex(
    (user) => user.username === App.currentUser.username
  );
  data[index].list = todos;
  localStorage.setItem("data", JSON.stringify(data));
}

///*** Creating Todolist Operations ***///

//onSubmit event handler
function onAddTodoFormSubmit(event) {
  event.preventDefault();

  const title = event.target.elements.title.value.trim();
  const date = event.target.elements.date.value.trim();

  if (title === "" || date === "") {
    alert("Please fill all the fields");
    return;
  }

  addTodo({
    text: title,
    date: date,
    completed: false,
    id: new Date().getTime(),
  });

  event.target.elements.title.value = "";
}

// Add todo to the list of data and DOM
function addTodo(todo) {
  App.todos.push(todo);
  updateLSData(App.todos);

  const catTodos = categorizeTodos(App.todos);

  const existingId = Object.keys(catTodos).find((key) => {
    return key === todo.date;
  });

  if (document.getElementById(existingId)) {
    document.getElementById(existingId).children[1].appendChild(getTodoTmp(todo));
  } else {
    getTodoListContainer().appendChild(listTodo(catTodos, existingId));
  }
}

//Create todolist head element
function getTodoHeadTmp(date) {
  // Create div element
  const div = document.createElement("div");
  div.className = "todo-head";

  // create img element
  const img = document.createElement("img");
  img.src = "vektor/date.png";
  img.alt = "Date";

  //format date to Weekday, month day
  formatDate = new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  //create h2 element
  const h2 = document.createElement("h2");
  h2.className = "date-head";
  h2.innerHTML = formatDate;

  div.appendChild(img);
  div.appendChild(h2);

  return div;
}

//Create todolist li element
function getTodoTmp(todo) {
  //create li element
  const todoLi = document.createElement("li");
  todoLi.className = `todo-list-item ${todo.completed ? "completed" : ""}`; //Add completed class if todo is completed
  todoLi.id = todo.id;

  //create checkbox element
  const label = document.createElement("label");
  label.className = "todo-check";

  //create input
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = todo.completed; //Add checked attribute if todo is completed
  input.addEventListener("change", onCheckboxChange); //Add event listener to checkbox

  //create span
  const span = document.createElement("span");
  span.className = "checkmark";

  //append input span to label
  label.appendChild(input);
  label.appendChild(span);

  //append label to li
  todoLi.appendChild(label);

  //create text input
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "todo-input";
  textInput.value = todo.text;
  textInput.autocomplete = false;
  textInput.addEventListener("keyup", onEditClickEnter); //add keyup event (enter)
  //append text input to li
  todoLi.appendChild(textInput);

  //create textSpan
  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.innerHTML = todo.text;
  //append textSpan to li
  todoLi.appendChild(textSpan);

  //create edit button
  const editBtn = document.createElement("button");
  editBtn.className = "todo-edit";
  editBtn.addEventListener("click", onEditClick); //add event listener to edit button
  //append edit button to li
  todoLi.appendChild(editBtn);

  // create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "todo-delete";
  deleteBtn.addEventListener("click", onDeleteClick); //add event listener to delete button
  // append delete button to li
  todoLi.appendChild(deleteBtn);

  return todoLi;
}

// Return Head and List element
function getCategorizedTodoItemTmp(key, todos) {
  const head = getTodoHeadTmp(key);

  //Create ul element
  const todoul = document.createElement("ul");
  todoul.className = "todo-list";

  todos.forEach((todo) => {
    //append li to ul
    todoul.appendChild(getTodoTmp(todo));
  });

  return {
    head, //head element
    list: todoul, //ul element
  };
}

//Get todolist container element
function getTodoListContainer() {
  return document.getElementById("todoListContainer");
}

//Get todolist template by date
function listTodo(catTodos, key) {
  const currentList = catTodos[key];
  const { head, list } = getCategorizedTodoItemTmp(key, currentList);
  const div = document.createElement("div");
  div.className = "categorized-todo-list-container";
  div.id = key;
  div.appendChild(head);
  div.appendChild(list);
  return div;
}

//Render todos by date
function listTodos(data) {
  const catTodos = categorizeTodos(data);
  Object.keys(catTodos).forEach((key) => {
    getTodoListContainer().appendChild(listTodo(catTodos, key));
  });
}

//*** Editing Todo Operations ***

//Update todo by Id
function updateTodoById(todos, id, todo) {
  todos = todos.map((todoItem) => {
    if (todoItem.id === id) {
      return {
        ...todoItem,
        ...todo,
      };
    }
    return todoItem;
  });
  updateLSData(todos);
}

// Checkbox event
function onCheckboxChange(event) {
  const todoId = Number(event.target.parentElement.parentElement.id);

  updateTodoById(App.todos, todoId, { completed: event.target.checked });

  event.target.parentElement.parentElement.classList.toggle("completed");
}

// Edit todo
function onEditClick(event) {
  event.preventDefault();
  const parentElement = event.target.parentElement
  const isEditMode = parentElement.classList
    .toString()
    .split(" ")
    .find((item) => item === "edit-mode");

  parentElement.classList.add("edit-mode");
  parentElement.childNodes[1].focus();

  if (isEditMode) {
    const inputval = parentElement.children[1].value.trim();
    const todoId = Number(parentElement.id);
    if (inputval.length === 0) {
      alert("Todo cannot be empty");
    } else {
      updateTodoById(App.todos, todoId, { text: inputval });
      document.getElementById(todoId).children[2].innerHTML = inputval;
      parentElement.classList.remove("edit-mode");
    }
  }
}

// Edit todo (enter) keyup event
function onEditClickEnter(event) {
  if (event.keyCode === 13) {
    //Enter key
    const val = event.target.value;
    const todoId = Number(event.target.parentElement.id);
    if (val.length === 0) {
      alert("Todo cannot be empty!");
    } else {
      updateTodoById(App.todos, todoId, { text: val });
      document.getElementById(todoId).children[2].innerHTML = val;
    }
    event.target.parentElement.classList.toggle("edit-mode");
  }
}

//Delete Todo event
function onDeleteClick(event) {
  event.preventDefault();
  const todoId = Number(event.target.parentElement.id);
  deleteTodo(todoId);
}

//Delete todo by id
function deleteTodo(id) {
  App.todos = App.todos.filter((todo) => todo.id !== id);
  updateLSData(App.todos);
  if (document.getElementById(id).parentNode.children.length === 1) {
    document.getElementById(id).parentNode.parentNode.remove();
  } else {
    document
      .getElementById(id)
      .parentNode.removeChild(document.getElementById(id));
  }
}

//*** Initialization ***

//Starting functions on load of the page
function initialize() {
  App.currentUser = getCurrentUser();

  checkUser();

  App.todos = getTodos();

  addUserData();

  document.getElementById("form").addEventListener("submit", onAddTodoFormSubmit);

  document.getElementById("logout").addEventListener("click", onLogoutClick);

  document.getElementById("date").defaultValue = new Date()
    .toISOString()
    .substring(0, 10);

  

  listTodos(App.todos);
}

window.onload = initialize;
