const inputElement = document.querySelector(".todo__input");
const todoTasksElement = document.querySelector(".todo__tasks");
const footerElement = document.querySelector(".todo__footer");
const clearCompletedElement = document.querySelector(".link__clear-completed");
const realCountOfTasks = document.querySelector(".todo__count");
const arrowElement = document.querySelector(".todo__arrow");

let realTodoTasks = [];
let currentButton = "link__all";

inputElement.addEventListener("keydown", function(event) {
    if (event.code != "Enter" || !inputElement.value.trim()) {
        return;
    }

    createNewTask(inputElement.value);

    inputElement.value = "";
})

footerElement.addEventListener("click", function(event) {
    const target = event.target;

    if (target.tagName != "A") {
        return;
    }    

    currentButton = target.className;

    filterTasks(currentButton);
})

arrowElement.addEventListener("click", function() {
    if (realTodoTasks.length != getAllCompletedTasks().length) {
        realTodoTasks = realTodoTasks.map((task) => {
            task.querySelector(".task__label").classList.add("task__label_checked");
            task.querySelector(".task__toggle").classList.add("task__toggle_checked");
            return task;
        });
    } else {
        realTodoTasks = realTodoTasks.map((task) => {
            task.querySelector(".task__label").classList.remove("task__label_checked");
            task.querySelector(".task__toggle").classList.remove("task__toggle_checked");
            return task;
        });
    }

    changeVisibilityButtonClear();

    checkVisibilityArrow();

    changeArrowStatus();

    filterTasks(currentButton);
});

function createNewTask(text) {
    const todoTask = document.createElement("div");
    todoTask.classList.add("todo__task");

    todoTask.addEventListener("mouseenter", function () {
        const crossElement = todoTask.querySelector(".task__cross");

        crossElement.classList.add("task__cross_hovered");
    });

    todoTask.addEventListener("mouseleave", function() {
        const crossElement = todoTask.querySelector(".task__cross");

        crossElement.classList.remove("task__cross_hovered");
    })

    todoTask.addEventListener("click", function(event) {
        const target = event.target;
        
        if (target.className.includes("task__cross")) {
            removeTask(target)
        }
        
        if (target.className.includes("task__toggle")) {
            changeTaskStatus(target);
        }
    })

    todoTask.addEventListener("dblclick", function(event) {
        if (!event.target.closest(".task__center")) {
            return;
        }

        const currentTodoTask = event.target.closest(".todo__task");
        const editingInputElement = document.createElement("input");
        editingInputElement.className = "todo__task_editing";
        editingInputElement.value = currentTodoTask.querySelector(".task__label").textContent;
        
        currentTodoTask.replaceWith(editingInputElement);
        
        editingInputElement.focus();

        editingInputElement.addEventListener("blur", function() {
            if (!editingInputElement.value.trim()) {
                return;
            }

            currentTodoTask.querySelector(".task__label").textContent = editingInputElement.value;
            editingInputElement.replaceWith(currentTodoTask);
        })
    })

    todoTask.innerHTML = `
        <div class="task__left">
            <span class="task__toggle"></span>
        </div>
        <div class="task__center">
            <label class="task__label">${text}</label>
        </div>
        <div class="task__right">
            <span class="task__cross"></span>
        </div>
    `;

    todoTasksElement.append(todoTask);

    realTodoTasks.push(todoTask);

    checkVisibilityFooter();

    updateCountOfActiveTodoTasks();
    
    filterTasks(currentButton);
    
    changeVisibilityButtonClear();

    checkVisibilityArrow();

    changeArrowStatus();
}

function removeTask(target) {
    const todoTask = target.closest(".todo__task");

    realTodoTasks = realTodoTasks.filter((task) => task != todoTask);

    todoTask.remove();

    checkVisibilityFooter();

    updateCountOfActiveTodoTasks();

    changeVisibilityButtonClear();

    checkVisibilityArrow();

    changeArrowStatus();
}

function changeTaskStatus(target) {
    const todoTask = target.closest(".todo__task");

    realTodoTasks = realTodoTasks.map((task) => {
        if (task == todoTask) {
            task.querySelector(".task__label").classList.toggle("task__label_checked");
            task.querySelector(".task__toggle").classList.toggle("task__toggle_checked");
        }
        return task;
    })

    updateCountOfActiveTodoTasks();

    changeVisibilityButtonClear();

    changeArrowStatus();

    filterTasks(currentButton);
}

function changeArrowStatus() {
    if (realTodoTasks.length == getAllCompletedTasks().length) {
        arrowElement.classList.add("todo__arrow_actived");
    }
    else {
        arrowElement.classList.remove("todo__arrow_actived")
    }
}

function updateCountOfActiveTodoTasks() {
    realCountOfTasks.textContent = getAllActiveTasks().length;
}

function getAllActiveTasks() {
    return (
        realTodoTasks.filter((task) => {
            return !task.querySelector(".task__toggle").className.includes("checked");
        })
    )
}

function getAllCompletedTasks() {
    return (
        realTodoTasks.filter((task) => {
            return task.querySelector(".task__toggle").className.includes("checked");
        })
    )
}

function clearAllCompletedTasks() {
    realTodoTasks = [...getAllActiveTasks()];

    checkVisibilityFooter();
    checkVisibilityArrow();

    currentButton = "link__all";

    footerElement.querySelector(".link__all").closest(".todo__link").classList.add("todo__link_choised");

    return realTodoTasks;
}

function checkVisibilityFooter() {
    if (realTodoTasks.length > 0) {
        footerElement.style.display = "block";
    }
    else {
        footerElement.style.display = "none";
    }
}

function checkVisibilityArrow() {
    if (realTodoTasks.length > 0) {
        arrowElement.style.display = "block";
    }
    else {
        arrowElement.style.display = "none";
    }
}

function filterTasks(button) {
    const buttons = Array.from(document.querySelector(".todo__links").children).slice(0, 3);
    
    buttons.forEach((item) => {
        if (item.querySelector(`.${button}`)) {
            item.classList.add("todo__link_choised");
        }
        else {
            item.classList.remove("todo__link_choised");
        }
    })
    
    switch (button) {
        case "link__all":
            todoTasksElement.innerHTML = "";
            todoTasksElement.append(...realTodoTasks);
            break;
        case "link__actived":
            todoTasksElement.innerHTML = "";
            todoTasksElement.append(...getAllActiveTasks());
            break;
        case "link__completed":
            todoTasksElement.innerHTML = "";
            todoTasksElement.append(...getAllCompletedTasks());
            break;
        case "link__clear-completed":
            todoTasksElement.innerHTML = "";
            todoTasksElement.append(...clearAllCompletedTasks());
            break;
    }

    changeVisibilityButtonClear();
}

function changeVisibilityButtonClear() {

    if (getAllCompletedTasks().length) {
        clearCompletedElement.classList.remove("todo__link_display_none");
    } else {
        clearCompletedElement.classList.add("todo__link_display_none");
    }
}