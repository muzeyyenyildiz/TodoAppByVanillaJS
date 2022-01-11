//Get element submit form by Id
const submitForm = document.getElementById("login-form");
submitForm.addEventListener("submit", onAddUser);

//Add user to local storage
function onAddUser(event) {
  event.preventDefault();
  const username = event.target.elements.username.value.trim();
  if (username === "") {
    alert("Please enter a valid username");
    return;
  }
  //Add current user to local storage
  let userObj = { username };
  localStorage.setItem("currentUser", JSON.stringify(userObj));

  let users = JSON.parse(localStorage.getItem("users"));
  const userExists = users && users.find((user) => user.username === username);

  if (!users) {
    localStorage.setItem("users", JSON.stringify([userObj]));
  } else if (!userExists) {
    users.push(userObj);
    localStorage.setItem("users", JSON.stringify(users));
  }
  window.location.href = "index.html";
}
