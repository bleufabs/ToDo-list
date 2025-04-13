function addTask() {
    const inputBox = document.getElementById("input-box");
    const taskText = inputBox.value.trim();
    const priority = document.getElementById("priority-level").value;

    if (taskText === "") {
        alert("Field cannot be empty");
        return;
    }

    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

    //Left side task added
    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    taskInfo.innerHTML = `<strong>${taskText}</strong><br> <span class="priority ${priority}">Priority: ${priority}</span>`;

    //Right side: task buttons
    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";

    //Complete button
    const completeButton = document.createElement("button");
    completeButton.innerText = "OK";
    completeButton.className = "task-button";

    completeButton.onclick = function () {
        taskItem.classList.toggle("completed");
    };

    //Edit button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.className = "task-button";

    editButton.onclick = function () {
        const newText = prompt("Edit your task:", taskText);
        if (newText) {
            taskInfo.innerHTML = `
              <strong>${newText}</strong><br>
              <span class="priority ${priority}">Priority: ${priority}</span>
            `;
        }
    };

    //Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "task-button";

    deleteButton.onclick = function () {
        taskItem.remove();
    };

    //Buttons
    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(taskButtons);

    //Display
    document.getElementById("task-display").appendChild(taskItem);

    inputBox.value = "";
}

//Enter key
document.getElementById("input-box").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
