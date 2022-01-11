// Get the modal
const modal = document.getElementById("modal");

// Get the button that opens the modal
const addTodoBtn = document.getElementById("addBtn");

// Get the cancel button element that closes the modal
const cancelBtn = document.getElementById("cancel");
// Get the save button element that save the todo
const saveBtn = document.getElementById("save");

// When the user clicks on the Add New Task button, open the modal
addTodoBtn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on Cancel button, close the modal
cancelBtn.onclick = function (event) {
  event.preventDefault();
  modal.style.display = "none";
  document.getElementById("title").value = "";
};

// When the user clicks Save button, close the modal
saveBtn.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
