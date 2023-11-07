let count = 1
const TASKS = []

const add_button = document.getElementById("add-task-btn")
const input_task = document.getElementsByClassName("task-input")[0]
const input_label = document.getElementsByClassName("task-input-label")[0]
const task_table = document.getElementsByClassName("task-table")[0]
const task_table_head = document.getElementsByClassName("task-table-head")[0]

// click listner on the add a task button
add_button.addEventListener("click", function () {
    if (input_task.value) {
        new_task = {
            id: count,
            value: input_task.value,
            status: "active",
        }
        count++
        TASKS.push(new_task)
        input_task.value = ""
        input_label.classList.add("d-none")
        refreshTable()
    } else {
        input_label.classList.remove("d-none")
    }
})

// function to refresh the table so it is up-to-date with TASKS array
function refreshTable() {
    task_table.innerHTML = `<div class="task-table-row task-table-head"> ${task_table_head.innerHTML} </div>`
    TASKS.forEach(function (e) {
        task_table.innerHTML += `<div class="task-table-row" data-row-id="${e.id}">
                        <div
                            class="task-table-data task-table-number text-center">
                            ${e.id}
                            </div>
                        <div
                            class="task-table-data task-table-name">
                            <input
                            data-name-id=${e.id}
                            type="text"
                            class="task-table-name-input"
                            value="${e.value}" />
                            </div>
                            <div
                            class="task-table-data task-table-status text-center">
                            <button 
                            data-button="status" 
                            data-status-id="${e.id}" 
                            class="btn btn-danger">
                            Active
                                </button>
                        </div>
                        <div
                            class="task-table-data task-table-action text-center">
                            <button 
                            data-delete-id="${e.id}" 
                            data-button="delete" 
                            class="btn btn-danger-outline">
                            Delete
                            </button>
                        </div>`
    })
    addListnersToDeleteButtons()
    addListnersToStatusButtons()
    addEventListnerToChangeNames()
}

// finds an object with an id
function findObjectIndexWithId(arr, id) {
    return arr.findIndex(function (obj) {
        return obj.id == id
    })
}

// removes thhe object with a specific id
function removeObjectWithId(arr, id) {
    const objWithIdIndex = findObjectIndexWithId(arr, id)
    arr.splice(objWithIdIndex, 1)
    return arr
}

// adds event listners to buttons after created
function addListnersToDeleteButtons() {
    let buttons = document.querySelectorAll('[data-button="delete"]')
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            let id = e.target.getAttribute("data-delete-id")
            let table_row = document.querySelector(`[data-row-id="${id}"]`)
            removeObjectWithId(TASKS, id)
            table_row.remove()
            if (TASKS.length == 0) {
                task_table.innerHTML += `
                    <div class="task-table-row task-empty">
                        You have no Tasks
                    </div>`
            }
        })
    })
}

// remove and add elements from array
function addAndRemove(element, add, remove) {
    element.remove(remove)
    element.add(add)
}

// adds event listners to all the status buttons
function addListnersToStatusButtons() {
    let buttons = document.querySelectorAll('[data-button="status"]')
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            let id = e.target.getAttribute("data-status-id")
            let current_obj_index = findObjectIndexWithId(TASKS, id)
            if (e.target.classList.contains("btn-danger")) {
                addAndRemove(e.target.classList, "btn-confirm", "btn-danger")
                e.target.innerHTML = "Completed"
                TASKS[current_obj_index].status = "completed"
            } else {
                addAndRemove(e.target.classList, "btn-danger", "btn-confirm")
                e.target.innerHTML = "Active"
                TASKS[current_obj_index].status = "active"
            }
        })
    })
}

// adds event listners to all the name inputs
function addEventListnerToChangeNames() {
    let names = document.querySelectorAll(".task-table-name-input")
    console.log(names)
    names.forEach(function (n) {
        n.addEventListener("change", function (e) {
            let id = e.target.getAttribute("data-name-id")
            console.log(id)
            let current_obj_index = findObjectIndexWithId(TASKS, id)
            TASKS[current_obj_index].value = e.target.value
        })
    })
}
