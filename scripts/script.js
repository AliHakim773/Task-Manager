let count = 1
let task_status = 0
let table_sorting = 0
const STATUS_MAP = ["all", "active", "completed"]
const PRIORITY_MAP = ["low", "medium", "high"]
const TASKS = []

const add_button = document.getElementById("add-task-btn")
const input_task = document.getElementById("task-input")
const input_task_date = document.getElementById("task-date-input")
const input_task_priority = document.getElementById("task-priority-select")
const task_table_sorting = document.getElementById("task-sorting")
const input_label = document.getElementsByClassName("task-input-label")[0]
const task_table = document.getElementsByClassName("drag-sort-enable")[0]

// to set today as a defualt value for date selector
input_task_date.valueAsDate = new Date()
// click listner on the add a task button
add_button.addEventListener("click", function () {
    if (input_task.value && validDate(input_task_date.valueAsDate)) {
        const new_task = {
            id: count,
            value: input_task.value,
            priority: input_task_priority.value,
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
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}
function compareDate(d1, d2) {
    if (d1 > d2) return 1
    else return -1
}
function validDate(d1) {
    return d1 >= new Date()
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

    if (table_sorting == "pa") {
        temp_tasks.sort((a, b) => a.priority - b.priority)
    } else if (table_sorting == "pd") {
        temp_tasks.sort((a, b) => b.priority - a.priority)
    } else if (table_sorting == "da") {
        temp_tasks.sort((a, b) =>
            compareDate(Date.parse(a.date), Date.parse(b.date))
        )
    } else if (table_sorting == "dd") {
        temp_tasks.sort((a, b) =>
            compareDate(Date.parse(b.date), Date.parse(a.date))
        )
    }
    task_table.innerHTML = ``
    addEmptyPlaceholder()
    if (temp_tasks.length != 0) {
        temp_tasks.forEach(function (e) {
            appendTable(e)
        })
    }
    addListnersToDeleteButtons()
    addListnersToStatusButtons()
    addEventListnerToChangeNames()
    enableDragSort("drag-sort-enable")
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
selectStatus.addEventListener("change", function () {
    task_status = selectStatus.value
    console.log(selectStatus.value)
    refreshTable()
})

function appendTable(e) {
    task_table.innerHTML += `<div class="task-table-row" data-row-id="${e.id}">
                        <div
                        class="task-table-data task-table-priority text-center">
                        <p class="priority priority-${
                            PRIORITY_MAP[e.priority]
                        }">${PRIORITY_MAP[e.priority]}</p>
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
}

task_table_sorting.addEventListener("change", function () {
    table_sorting = task_table_sorting.value
    refreshTable()
})

function enableDragSort(listClass) {
    const sortableLists = document.getElementsByClassName(listClass)
    Array.prototype.map.call(sortableLists, (list) => {
        enableDragList(list)
    })
}

function enableDragList(list) {
    Array.prototype.map.call(list.children, (item) => {
        enableDragItem(item)
    })
}

function enableDragItem(item) {
    item.setAttribute("draggable", true)
    item.ondrag = handleDrag
    item.ondragend = handleDrop
}

function handleDrag(item) {
    const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY

    selectedItem.classList.add("drag-sort-active")
    let swapItem =
        document.elementFromPoint(x, y) === null
            ? selectedItem
            : document.elementFromPoint(x, y)

    if (list === swapItem.parentNode) {
        swapItem =
            swapItem !== selectedItem.nextSibling
                ? swapItem
                : swapItem.nextSibling
        list.insertBefore(selectedItem, swapItem)
    }
}

function handleDrop(item) {
    item.target.classList.remove("drag-sort-active")
}
