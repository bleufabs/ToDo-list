let badge = 0;
let badgeDisplayElement ="Badges: "+badge;
document.addEventListener("DOMContentLoaded", function(){
    initComponent();
});
function initComponent(){
    const element = document.getElementById("badge");
    element.textContent = badgeDisplayElement;

}
function updateBadge(){
    let element = document.getElementById("badge");
    element.textContent = "Badge: "+badge;
}
function addBadge(priority, completed){
    if (completed){
        if(priority == "high"){
            badge +=3;
        
        }else if (priority == "medium"){
            badge +=2;
        }else{
            badge++;
        }
    }
    if (badgeDisplayElement) {
            badgeDisplayElement.textContent = "Badge: " + badge;
        }
}

function addTask() {
    const inputBox = document.getElementById("input-box");
    const taskText = inputBox.value.trim();
    const priority = document.getElementById("priority-level").value;
  
    const errorBox = document.getElementById("error-message");
  
  
    // Field check
  if (taskText === "") {
    errorBox.innerText = "Task cannot be empty.";
    return;
  } else {
    errorBox.innerText = "";
  }
  
    // Create task item container
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
  
    // Create left-side task info
    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    taskInfo.innerHTML = `<strong>${taskText}</strong><br> <span class="priority ${priority}">Priority: ${priority}</span>`;
  
    // Create right-side task buttons
    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";
  
    /* ===== UPDATED: Complete button toggles completed state & persists to JSON Server ===== */
    const completeButton = document.createElement("button");
    completeButton.innerText = "OK";
    completeButton.className = "task-button";
    completeButton.onclick = function () {

       
        // Toggle completed class for immediate UI update
        taskItem.classList.toggle("completed");

        addBadge(priority,taskItem.classList.contains("completed"));
        updateBadge();


        // Fetch task id to update the task status in the backend
        const id = taskItem.dataset.id;
        if (!id) return;
  
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completed: taskItem.classList.contains("completed")
            })
        })
        .catch(err => console.error("Error updating completion:", err));
    };
    /* ===== END UPDATED SECTION ===== */
  
  // Edit button
  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.className = "task-button";
  
  // Modal popup
  editButton.onclick = function () {
    const modal = document.createElement("div");
    modal.className = "modal-position";
  
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
  
    const currentText = taskInfo.querySelector("strong").innerText;
  
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "modal-input";
  
    setTimeout(() => {
        input.focus();
        input.select();
    }, 0);
  
    const modalSaveButton = document.createElement("button");
    modalSaveButton.innerText = "Save";
    modalSaveButton.className = "modal-save-button";
  
    const ModalCancelButton = document.createElement("button");
    ModalCancelButton.innerText = "Cancel";
    ModalCancelButton.className = "modal-cancel-button";
  
    modalSaveButton.onclick = function () {
        const newText = input.value.trim();
        if (newText !== "") {
            const priorityText = taskInfo.querySelector("span").innerText.split(": ")[1];
            taskInfo.innerHTML = `
                <strong>${newText}</strong><br>
                <span class="priority ${priorityText.toLowerCase()}">Priority: ${priorityText}</span>
            `;
  
            const id = taskItem.dataset.id;
            if (id) {
                fetch(`http://localhost:3000/tasks/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: newText,
                        priority: priorityText.toLowerCase(),
                        completed: taskItem.classList.contains("completed")
                    })
                }).catch(err => console.error("Error updating task:", err));
            }
        }
        document.body.removeChild(modal);
    };
  
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            modalSaveButton.click();
        }
    });
  
    ModalCancelButton.onclick = function () {
        document.body.removeChild(modal);
    };
  
    modalContent.appendChild(input);
    modalContent.appendChild(modalSaveButton);
    modalContent.appendChild(ModalCancelButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  };
  
  
    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "task-button";
    deleteButton.onclick = function () {
        const id = taskItem.dataset.id;
        if (!id) {
            taskItem.remove();
            return;
        }
  
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) taskItem.remove();
            else console.error("Failed to delete task");
        })
        .catch(err => console.error("Error deleting task:", err));
    };
  
    // Append buttons and task to DOM
    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);
  
    taskItem.appendChild(taskInfo);
    taskItem.appendChild(taskButtons);
    document.getElementById("task-display").appendChild(taskItem);
  
    inputBox.value = "";
  
    // Create task object to send to backend
    const task = {
        title: taskText,
        priority: priority,
        completed: false
    };
  
    // POST request to JSON Server
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Saved to JSON server:', data);
        taskItem.dataset.id = data.id;
    })
    .catch(err => console.error('Error saving to JSON server:', err));
  }
  
  // Enable Enter key to add task
  document.getElementById("input-box").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
  });
  
  // Load tasks from db.json and render them
  function showTaskFromJsonServer(task) {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.dataset.id = task.id;
  
    if (task.completed) {
        taskItem.classList.add("completed");
    }
  
    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    taskInfo.innerHTML = `<strong>${task.title}</strong><br> 
        <span class="priority ${task.priority || 'low'}">Priority: ${task.priority || 'low'}</span>`;
  
    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";
  
    //Reapplies and updates completed state on click
    const completeButton = document.createElement("button");
    completeButton.innerText = "OK";
    completeButton.className = "task-button";
    completeButton.onclick = function () {
       addBadge(task);
        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completed: taskItem.classList.contains("completed")
            })
        })
        .catch(err => console.error("Error updating completion:", err));
    };
  
    // Edit button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.className = "task-button";
    editButton.onclick = function () {
        const newText = prompt("Edit your task:", task.title);
        if (newText) {
            task.title = newText;
            taskInfo.innerHTML = `<strong>${newText}</strong><br> 
                <span class="priority ${task.priority}">Priority: ${task.priority}</span>`;
            fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
        }
    };
  
    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "task-button";
    deleteButton.onclick = function () {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) taskItem.remove();
            else console.error("Failed to delete task");
        })
        .catch(err => console.error("Error deleting task:", err));
    };
  
    // Append all
    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);
  
    taskItem.appendChild(taskInfo);
    taskItem.appendChild(taskButtons);
    document.getElementById("task-display").appendChild(taskItem);
  }
  
  //Allows for saved changes
  document.getElementById("save-completed").addEventListener("click", () => {
    const taskItems = document.querySelectorAll(".task-item.completed");
  
    taskItems.forEach(taskItem => {
        const id = taskItem.dataset.id;
        if (!id) return;
  
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok) {
                taskItem.remove();
                console.log(`Deleted completed task with ID: ${id}`);
            } else {
                console.error(`Failed to delete task ID: ${id}`);
            }
        })
        .catch(err => console.error("Error deleting task:", err));
    });
  });