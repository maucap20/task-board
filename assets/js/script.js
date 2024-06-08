// Retrieve tasks and nextId from localStorage
let taskList = []
taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = 1
nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard = $(
        `<div class="card mb-3" data-id="${task.id}">
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><small class="text-muted">${task.deadline}</small></p>
            <button class="btn btn-danger btn-sm delete-task">Delete</button>
          </div>
        </div>`
      );
    
      let deadline = dayjs(task.deadline);
      // day.js said to use .isAfter for deadlines
      // if statement checks if late or nearing deadline
      if (dayjs().isAfter(deadline, 'day')) {
        taskCard.addClass('bg-danger text-white');
      } else if (dayjs().isAfter(deadline.subtract(3, 'day'))) {
        taskCard.addClass('bg-warning');
      }
    
      return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    ['todo', 'in-progress', 'done'].forEach(status => {
        $(`#${status}-cards`).empty();
      });
    
      taskList.forEach(task => {
        let card = createTaskCard(task);
        $(`#${task.status}-cards`).append(card);
      });
    
      $(".card").draggable({
        revert: "invalid",
        start: function() {
          $(this).addClass("dragging");
        },
        stop: function() {
          $(this).removeClass("dragging");
        }
      });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    let title = $("#task-title").val();
    let description = $("#task-description").val();
    let deadline = $("#task-deadline").val();
    let id = generateTaskId();
  
    let newTask = {
      id: id,
      title: title,
      description: description,
      deadline: deadline,
      status: 'todo'
    };
  
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    renderTaskList();
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let id = $(event.target).closest('.card').data('id');
    taskList = taskList.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let dropTarget = $(event.target);
    let id = ui.draggable.data('id');
    let newStatus = dropTarget.attr('id').replace('-cards', '');
  
    let task = taskList.find(task => task.id === id);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList()

    $("#add-task-form").submit(handleAddTask)
    $(document).on('click', '.delete-task', handleDeleteTask)
  
    $(".card-body").droppable({
      accept: ".card",
      drop: handleDrop
    });
  
    $("#task-deadline").datepicker({
        changeMonth: true,
        changeYear: true,
    })

});
