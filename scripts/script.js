let count = 0
const TASKS = []

const add_button = document.getElementById("add-task-btn")
const input_task = document.getElementsByClassName("task-input")[0]
const input_label = document.getElementsByClassName("task-input-label")[0]
add_button.addEventListener("click", function () {
    if (input_task.value) {
        TASKS.push(input_task.value)
        input_task.value = ""
        input_label.classList.add("d-none")
    } else {
        input_label.classList.remove("d-none")
    }
})
