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
                        <div class="task-table-data task-table-name">
                            ${e.value}
                        </div>
                        <div
                            class="task-table-data task-table-status text-center">
                            <button class="btn btn-danger">Active</button>
                        </div>
                        <div
                            class="task-table-data task-table-action text-center">
                            <button data-id="${e.id}" data-button="delete" class="btn btn-danger-outline">
                                Delete
                            </button>
                        </div>`
    })
    addListnersToDeleteButtons()
}

// finds and removes thhe object with a specific id
function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex(function (obj) {
        return obj.id == id
    })
    arr.splice(objWithIdIndex, 1)
    return arr
}

// adds event listners to buttons after created
function addListnersToDeleteButtons() {
    let buttons = document.querySelectorAll('[data-button="delete"]')
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            let id = e.target.getAttribute("data-id")
            let table_row = document.querySelector(`[data-row-id="${id}"]`)
            removeObjectWithId(TASKS, id)
            table_row.remove()
        })
    })
}
