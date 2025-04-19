function addTask() {
    const inputBox = document.getElementById("input-box");
    const taskText = inputBox.value.trim();
    const priority = document.getElementById("priority-level").value;

    // Field check
    if (taskText === "") {
        alert("Field cannot be empty");
        return;
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
        taskItem.classList.toggle("completed");
        // add log to test function
        const id = taskItem.dataset.id;
        if (!id) return;

        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completed: taskItem.classList.contains("completed")
            })
            .then(() => {
                taskItem.remove();
            })
        })
        .catch(err => console.error("Error updating completion:", err));
    };
    /* ===== END UPDATED SECTION ===== */

    // Edit button
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
            const id = taskItem.dataset.id;
            if (!id) return;
            fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newText,
                    priority: priority,
                    completed: taskItem.classList.contains("completed")
                })
            });
        }
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

    
    // OK button deletes task immediately
    const completeButton = document.createElement("button");
    completeButton.innerText = "OK";
    completeButton.className = "task-button";
    completeButton.onclick = function () {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completed: !task.completed
            })
        })
        .then(() => {
            taskItem.classList.toggle("completed");
            if (taskItem.classList.contains("completed")) {
                taskItem.remove();
                console.log(`Task ${task.id} completed and deleted.`);
            }
        })
        .catch(err => console.error("Error updating task:", err));
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

window.addEventListener("load", () => {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => tasks.forEach(showTaskFromJsonServer))
        .catch(err => console.error("Error loading tasks:", err));
});

/*Allows for saved changes
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
}); */
