// logic to make sure only future date get select to do the task
const currentDate = new Date().toISOString().split("T")[0]; 
const currentTime = new Date().toISOString().split("T")[1].split(".")[0]; 

document.getElementById('new-due-date').min = `${currentDate}T${currentTime}`;

// logic for Adding task
function addTask() {
    const taskText = document.getElementById('new-task').value;
    const priority = document.getElementById('new-priority').value;
    const dueDateTime = document.getElementById('new-due-date').value; 

    if (taskText.trim() !== '') {
        const taskList = document.getElementById('task-list');
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="checkbox">
                <input type="checkbox" onchange="toggleTaskCompletion(this)">
            </div>
            <div class="task-text">${taskText}</div>
            <div class="priority">${priority}</div>
            
            <div class="due-date"><i class="ri-notification-line"></i>: ${dueDateTime}</div> 
            <div class="actions">
                <button class="edit" onclick="openModal()"><i class="ri-edit-line"></i></button>
                <button class="delete" onclick="deleteTask(this)"><i class="ri-delete-bin-2-line"></i></button>
            </div>
        `;

        taskList.appendChild(li);
        document.getElementById('new-task').value = '';
        document.getElementById('new-priority').value = 'low';
        document.getElementById('new-due-date').value = ''; 
        filterTasks(document.querySelector('.filter-btn.active').id.replace('-btn', ''));

        // Set a reminder
        if (dueDateTime !== '') {
            const now = new Date();
            const dueDateTimeObject = new Date(dueDateTime);
            if (dueDateTimeObject > now) {
                const timeDifference = dueDateTimeObject - now;
                setTimeout(() => {
                    alert(`Reminder: ${taskText} is due now!`);
                }, timeDifference);
            }
        }
        saveTasksToLocalStorage()
    }
}

// show data of local storage on reload
window.onload = function() {
    loadTasksFromLocalStorage();
}

//save data on local storage
function saveTasksToLocalStorage() {
    const taskList = document.getElementById('task-list');
    const tasks = [...taskList.querySelectorAll('li')];
    
    const serializedTasks = tasks.map(task => {
        const taskText = task.querySelector('.task-text').innerText;
        const priority = task.querySelector('.priority').innerText;
        const isCompleted = task.querySelector('.checkbox input').checked;
        const dueDateTime = task.querySelector('.due-date').innerText;

        return { taskText, priority, isCompleted, dueDateTime };
    });
    
    localStorage.setItem('tasks', JSON.stringify(serializedTasks));
}

//show data from local storage
function loadTasksFromLocalStorage() {
    const taskList = document.getElementById('task-list');
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    savedTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
        <div class="group">
            <div class="checkbox">
                <input type="checkbox" onchange="toggleTaskCompletion(this)" ${task.isCompleted ? 'checked' : ''}>
            </div>
            <div class="task-text ${task.isCompleted ? 'completed' : ''}">${task.taskText}</div>
            <div class="priority">${task.priority}</div>
            </div>
            <div class="due-date"><i class="ri-notification-line"></i> ${task.dueDateTime}</div>
            <div class="actions">
                <button class="edit" onclick="openModal()"><i class="ri-edit-line"></i></button>
                <button class="delete" onclick="deleteTask(this)"><i class="ri-delete-bin-2-line"></i></button>
            </div>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// logic for sorting task asper priority
function sortTasksByPriority() {
    const taskList = document.getElementById('task-list');
    const tasks = [...taskList.querySelectorAll('li')];

    tasks.sort((a, b) => {
        const priorityOrder = {
            'low': 1,
            'medium': 2,
            'high': 3
        };

        const priorityA = priorityOrder[a.querySelector('.priority').innerText];
        const priorityB = priorityOrder[b.querySelector('.priority').innerText];

        return priorityB - priorityA;
    });
    console.log("Sorted Tasks:");
    tasks.forEach(task => {
        const taskText = task.querySelector('.task-text').innerText;
        const taskPriority = task.querySelector('.priority').innerText;
        console.log(`Task: ${taskText}, Priority: ${taskPriority}`);
    });
    taskList.innerHTML = '';
    tasks.forEach(task => taskList.appendChild(task));
}


// logic for filtering task as per status

function filterTasks(status) {
    const taskList = document.getElementById('task-list');
    const tasks = taskList.querySelectorAll('li');

    tasks.forEach(task => {
        const checkbox = task.querySelector('.checkbox input');
        const isCompleted = checkbox.checked;
        const taskPriority = task.querySelector('.priority').innerText;

        if ((status === 'all') ||
            (status === 'completed' && isCompleted) ||
            (status === 'pending' && !isCompleted)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}


// logic for deletion of task
function deleteTask(button) {
    const li = button.parentElement.parentElement;
    li.remove();
    saveTasksToLocalStorage();
}
function editTask(button) {
    const li = button.parentElement.parentElement;
    const taskText = li.querySelector('.task-text').innerText.trim();
    const editedText = prompt('Edit Task', taskText);

    if (editedText !== null && editedText.trim() !== '') {
        li.querySelector('.task-text').innerText = editedText;
    }
}

// logic for opening modal for editng the task
function openModal() {
    document.getElementById('edit-modal').style.display = 'block';
    document.getElementById('edited-task').value = document.querySelector('.task-text').innerText;
}

// logic for closing modal for editng the task
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// logic  for editng the task
function saveEditedTask() {
    const editedText = document.getElementById('edited-task').value;
    const editedPriority = document.getElementById('edited-priority').value;
    if (editedText.trim() !== '') {
        document.querySelector('.task-text').innerText = editedText;
        document.querySelector('.priority').innerText = editedPriority;
        closeModal();
    }
    saveTasksToLocalStorage();
}

// cut-the-completed-task
function toggleTaskCompletion(checkbox) {
    const taskText = checkbox.parentElement.nextElementSibling; 
    if (checkbox.checked) {
        taskText.classList.add('completed');
    } else {
        taskText.classList.remove('completed');
    }
    saveTasksToLocalStorage()
}



// athentication-for-login-signup
function showSignupForm() {
    document.querySelector('.login-box').style.display = 'none';
    document.querySelector('.signup-box').style.display = 'block';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
}

function showLoginForm() {
    document.querySelector('.login-box').style.display = 'block';
    document.querySelector('.signup-box').style.display = 'none';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (email === storedEmail && password === storedPassword) {
        alert('Login successful!');
        window.location.href = 'todo.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function signup() {
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;

    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmail)) {
        alert('Invalid email format. Please enter a valid email address.');
        return;
    }
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    localStorage.setItem('email', newEmail);
    localStorage.setItem('password', newPassword);

    alert('Sign up successful! You can now login.'); 
    showLoginForm(); 
}

