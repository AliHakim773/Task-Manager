let count = 1
let task_status = 0
const STATUS_MAP = ["all", "active", "completed"]
const TASKS = []

const add_button = document.getElementById("add-task-btn")
const input_task = document.getElementById("task-input")
const input_task_date = document.getElementById("task-date-input")
const input_label = document.getElementsByClassName("task-input-label")[0]
const task_table = document.getElementsByClassName("task-table")[0]
const task_table_head = document.getElementsByClassName("task-table-head")[0]

input_task_date.valueAsDate = new Date()
// click listner on the add a task button
add_button.addEventListener("click", function () {
    if (input_task.value) {
        const new_task = {
            id: count,
            value: input_task.value,
            date: dateFormat(input_task_date.valueAsDate),
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

function dateFormat(d) {
    const day = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}

function filterTasksByStatus() {
    const NEW_TASKS = []
    TASKS.forEach(function (t) {
        if (t.status == STATUS_MAP[task_status]) {
            NEW_TASKS.push(t)
        }
    })
    return NEW_TASKS
}

// function to refresh the table so it is up-to-date with TASKS array
function refreshTable() {
    let temp_tasks

    if (task_status == 0) {
        temp_tasks = TASKS
    } else {
        temp_tasks = filterTasksByStatus()
    }

    task_table.innerHTML = `<div class="task-table-row task-table-head"> ${task_table_head.innerHTML} </div>`
    addEmptyPlaceholder()
    if (temp_tasks.length != 0) {
        temp_tasks.forEach(function (e) {
            task_table.innerHTML += `<div class="task-table-row" data-row-id="${
                e.id
            }">
                        <div
                        class="task-table-data task-table-priority text-center">
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
                                class="task-table-data task-table-date text-center">
                                ${e.date}
                            </div>
                            <div
                                class="task-table-data task-table-status text-center">
                                <button 
                                    data-button="status" 
                                    data-status-id="${e.id}" 
                                    class="btn ${
                                        e.status == "active"
                                            ? "btn-danger"
                                            : "btn-confirm"
                                    } ">
                                    ${
                                        e.status == "active"
                                            ? "Active"
                                            : "Completed"
                                    }
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
    }
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

function removeObjectWithId(arr, id) {
    const objWithIdIndex = findObjectIndexWithId(arr, id)
    arr.splice(objWithIdIndex, 1)
    return arr
}

function addEmptyPlaceholder() {
    if (TASKS.length == 0) {
        task_table.innerHTML += `
                    <div class="task-table-row task-empty">
                        You have no Tasks
                    </div>`
    }
}

// adds event listners to buttons after created
function addListnersToDeleteButtons() {
    const buttons = document.querySelectorAll('[data-button="delete"]')
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            const id = e.target.getAttribute("data-delete-id")
            const table_row = document.querySelector(`[data-row-id="${id}"]`)
            removeObjectWithId(TASKS, id)
            table_row.remove()
            addEmptyPlaceholder()
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
    const buttons = document.querySelectorAll('[data-button="status"]')
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            const id = e.target.getAttribute("data-status-id")
            const current_obj_index = findObjectIndexWithId(TASKS, id)
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
    names.forEach(function (n) {
        n.addEventListener("change", function (e) {
            const id = e.target.getAttribute("data-name-id")
            console.log(id)
            const current_obj_index = findObjectIndexWithId(TASKS, id)
            TASKS[current_obj_index].value = e.target.value
        })
    })
}

const selectStatus = document.getElementById("task-status-select")
selectStatus.addEventListener("change", function (e) {
    task_status = selectStatus.value
    console.log(selectStatus.value)
    refreshTable()
})
