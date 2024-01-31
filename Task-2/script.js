document.addEventListener("DOMContentLoaded", function () {
  const taskItems = document.querySelectorAll("li");

  taskItems.forEach((item) => {
    const menuIcon = item.querySelector(".menu");
    const menuOptions = item.querySelector(".menu-options");

    menuIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      menuOptions.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        !menuIcon.contains(event.target) &&
        !menuOptions.contains(event.target)
      ) {
        menuOptions.classList.remove("active");
      }
    });
  });

  updateClock();
  setInterval(updateClock, 1000);

  const taskInput = document.getElementById("task-input");
  taskInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
});

function updateClock() {
  const now = new Date();
  const clockElement = document.getElementById("clock");
  clockElement.innerHTML = now.toLocaleTimeString();
}

function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  if (taskInput.value.trim() !== "") {
    const timestamp = new Date().toLocaleString();
    const taskItem = document.createElement("li");
    taskItem.setAttribute("data-created-timestamp", timestamp);
    taskItem.innerHTML = `<span>${taskInput.value} </span>
            <div class="menu">⋮
                <div class="menu-options">
                    <a href="#" onclick="detailsOption(this)">ℹ️</a>
                    <a href="#" onclick="editOption(this)">✏️</a>
                    <a href="#" onclick="removeOption(this)">🗑️</a>
                </div>
            </div>`;
    taskList.insertBefore(taskItem, taskList.firstChild);
    taskInput.value = "";
  }
}

function detailsOption(option) {
  const taskItem = option.closest("li");
  const createdTimestamp = taskItem.getAttribute("data-created-timestamp");
  const editedTimestamp = taskItem.getAttribute("data-edited-timestamp");

  if (!taskItem.querySelector(".details")) {
    const taskDetails = document.createElement("div");
    taskDetails.innerHTML = `<p>Task: ${taskItem.firstChild.textContent}</p>
            <p>Created at: ${createdTimestamp}</p>
            ${
              editedTimestamp ? `<p>Last edited at: ${editedTimestamp}</p>` : ""
            }`;
    taskDetails.classList.add("details");
    taskItem.appendChild(taskDetails);
  }
}

function editOption(option) {
  const taskItem = option.closest("li");
  const span = taskItem.querySelector("span");
  const text = span.textContent;

  const detailsElement = taskItem.querySelector(".details");
  if (detailsElement) {
    detailsElement.remove();
  }

  span.innerHTML = `<input type="text" value="${text}" onblur="updateTask(this)">`;

  taskItem.setAttribute("data-edited-timestamp", new Date().toLocaleString());
}

function updateTask(input) {
  const taskItem = input.closest("li");
  const span = taskItem.querySelector("span");
  const newValue = input.value;
  span.textContent = newValue;

  if (!taskItem.querySelector(".edited-tag")) {
    const editedTag = document.createElement("span");
    editedTag.textContent = " (edited)";
    editedTag.classList.add("edited-tag");
    taskItem.appendChild(editedTag);
  }

  taskItem.setAttribute("data-edited-timestamp", new Date().toLocaleString());
}

function removeOption(option) {
  const taskItem = option.closest("li");
  taskItem.remove();
}
