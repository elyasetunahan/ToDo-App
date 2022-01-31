const todoList = document.querySelector("ul.todoList");
const addBtn = document.querySelector(".btnAdd");
const textValue = document.querySelector(".todoInput");
const updateText = document.getElementById("updateText");
const editBtn = document.querySelectorAll(".editBtn");
const popupCloseBtn = document.querySelector(".popupCloseBtn");
const popupUpdateBtn = document.querySelector(".popupUpdateBtn");
const spinner = document.querySelector(".spinner");

async function getTodos() { //todo listesini çekiyoruz
  try {
    todoList.innerHTML = "";
    textValue.value = "";
    const response = await axios.get(
      "https://61c4be5ef1af4a0017d99789.mockapi.io/todos"
    );
    response.data.forEach((element) => {
      createTodoRow(element);
    });
  } catch (error) {
    console.log(error);
  }
}

function createTodoRow(todo) { //todo html elementlerini ekliyoruz
  let todoElement = document.createElement("li");
  todoElement.classList.add("todoItem");
  const todoText = createTodoText(todo.checked, todo.id);
  const todoEditBtn = createTodoEditBtn(todo.id);
  const todoDeleteBtn = createTodoDeleteBtn(todo.id);
  todoText.appendChild(document.createTextNode(todo.content));
  todoElement.appendChild(todoText);
  todoElement.appendChild(todoEditBtn);
  todoElement.appendChild(todoDeleteBtn);
  todoList.appendChild(todoElement);
}

function createTodoText(checked, id) { //todo tasklerinin text elementlerini dolduruyoruz ve tasklerin tamamlanıp tamamlanmadığı kontrolünü sağlıyoruz
  let todoText = document.createElement("div");
  todoText.classList = "text";
  todoText.addEventListener("click", async (event) => {
    const updatedValue = await toggleIsCompleted(!checked, id);
    event.target.classList.toggle("checked");
  });
  if (checked == true) {
    todoText.classList.add("checked");
  }
  return todoText;
}

function createTodoEditBtn(id) { //todo tasklerinin düzenlenmesi
  let todoEditBtn = document.createElement("div");
  todoEditBtn.classList.add("editBtn");
  todoEditBtn.addEventListener("click", function () {
    let parent = popupCloseBtn.parentElement.parentElement;
    let oldText = todoEditBtn.previousElementSibling;
    updateText.value = oldText.innerHTML;
    parent.style.display = "flex";
    updateText.setAttribute("data-id", id);
  });
  todoEditBtn.innerHTML = '<i class="fas fa-pen"></i>';
  return todoEditBtn;
}

function createTodoDeleteBtn(id) { //todo tasklerinin silinmesi
  let todoDeleteBtn = document.createElement("div");
  todoDeleteBtn.setAttribute("data-id", id);
  todoDeleteBtn.classList.add("deleteBtn");
  todoDeleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  todoDeleteBtn.addEventListener("click", async (event) => {
    let parent = event.currentTarget.parentElement;
    await deleteTodo(parent, id);
  });
  return todoDeleteBtn;
}

async function createTodo(content) { //todo taskini api tarafına ekleme
  spinner.classList.add("active");
  try {
    const { data } = await axios.post(
      "https://61c4be5ef1af4a0017d99789.mockapi.io/todos",
      {
        content,
      }
    );
    spinner.classList.remove("active");
    createTodoRow(data);
  } catch (error) {
    spinner.classList.remove("active");
    console.log(error);
  }
}

async function deleteTodo(parent, id) { // todo taskini api tarafından silme
  spinner.classList.add("active");
  try {
    await axios.delete(
      "https://61c4be5ef1af4a0017d99789.mockapi.io/todos/" + id
    );
    spinner.classList.remove("active");
    parent.remove();
  } catch (error) {
    spinner.classList.remove("active");
    console.log(error);
  }
}

async function toggleIsCompleted(isCompleted, id) { // todo taskinin tamamlanmasını apiye iletme işlemi
  spinner.classList.add("active");
  try {
    const { data } = await axios.put(
      "https://61c4be5ef1af4a0017d99789.mockapi.io/todos/" + id,
      {
        isCompleted,
      }
    );
    spinner.classList.remove("active");
    return data.isCompleted;
  } catch (error) {
    spinner.classList.remove("active");
    console.log(error);
  }
}

async function updateElement(updatedContent, id) { //todo taskinin api tarafında güncellenmesi
  spinner.classList.add("active");
  try {
    const { data } = await axios.put(
      "https://61c4be5ef1af4a0017d99789.mockapi.io/todos/" + id,
      {
        content: updatedContent,
      }
    );
    spinner.classList.remove("active");
    return data;
  } catch (error) {
    spinner.classList.remove("active");
    console.log(error);
  }
}

addBtn.addEventListener("click", async () => {
  if (textValue.value.length < 3) {
    alert("Girdiğiniz değer minimum 3 karakterden oluşmalıdır.");
  } else {
    await createTodo(textValue.value);
  }
});

popupCloseBtn.addEventListener("click", function (event) {
  let parent = event.target.parentElement.parentElement;
  parent.style.display = "none";
});

popupUpdateBtn.addEventListener("click", async function (event) {
  const updatedTodo = await updateElement(
    updateText.value,
    updateText.getAttribute("data-id")
  );
  const todoItems = todoList.childNodes;
  todoItems.forEach((item) => {
    const updatedId = item.querySelector("[data-id]");
    if (
      updatedId.getAttribute("data-id") === updateText.getAttribute("data-id")
    ) {
      const todoTextElement = item.querySelector(".text");
      todoTextElement.innerText = updatedTodo.content;
      if (updatedTodo.checked == true) {
        todoTextElement.classList.add("checked");
      } else {
        todoTextElement.classList.remove("checked");
      }
    }
  });
  let parent = event.target.parentElement.parentElement;
  parent.style.display = "none";
});

window.addEventListener("load", () => {
  const lsUsername = localStorage.getItem("username");
  if (!lsUsername || username === "null") {
    while (true) {
      const username = prompt("Adınızı giriniz.", "");
      if (!!username) {
        localStorage.setItem("username", username);
        break;
      } else {
        alert("Lütfen adınızı boş girmeyiniz.");
      }
    }
  }
  getTodos();
});

const options = {
  label: "🌓",
};

const darkMode = new Darkmode(options);

function addDarkmodeWidget() {
  darkMode.showWidget();
  console.log(darkMode.isActivated());
}

window.addEventListener("load", addDarkmodeWidget);
