const inputTitulo = document.getElementById("titulo-tarea");
const inputDescripcion = document.getElementById("descripcion-tarea");
const formulario = document.getElementById("formulario-tarea");
const listaTareas = document.getElementById("lista-tareas");
const contador = document.getElementById("contador-tareas");
const botonBorrarTodo = document.getElementById("boton-borrar-todo");
const botonAgregarTarea = document.getElementById("boton-agregar");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

console.log(tareas);

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function limpiarLista() {
  while (listaTareas.firstChild) {
    listaTareas.removeChild(listaTareas.firstChild);
  }
}

function renderizarTareas() {
  limpiarLista();

  console.log("tareas renderizar", tareas);

  tareas.forEach((tarea, i) => {
    const item = document.createElement("li");
    item.className = "tarea-card";

    const titulo = document.createElement("div");
    titulo.className = "titulo-tarea";
    titulo.textContent = tarea.titulo;

    const descripcion = document.createElement("div");
    descripcion.className = "descripcion-tarea";
    descripcion.textContent = tarea.descripcion;

    if (tarea.completada) {
      titulo.classList.add("completada");
      descripcion.classList.add("completada");
    }

    const acciones = document.createElement("div");
    acciones.className = "acciones";

    const btnCompletar = document.createElement("button");
    btnCompletar.className = "boton-completar";
    btnCompletar.textContent = "✅";
    btnCompletar.addEventListener("click", () => {
      tareas[i].completada = !tareas[i].completada;
      guardarTareas();
      renderizarTareas();
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "boton-eliminar";
    btnEliminar.textContent = "🗑";
    btnEliminar.addEventListener("click", () => {
      tareas.splice(i, 1);
      guardarTareas();
      renderizarTareas();
    });

    acciones.appendChild(btnCompletar);
    acciones.appendChild(btnEliminar);

    item.appendChild(titulo);
    item.appendChild(descripcion);
    item.appendChild(acciones);

    listaTareas.appendChild(item);
  });

  actualizarContador();
}

function actualizarContador() {
  const restantes = tareas.filter((t) => !t.completada).length;
  contador.textContent =
    restantes === 0
      ? "🎉 ¡Completaste todas las tareas!"
      : `Tienes ${restantes} tarea${restantes > 1 ? "s" : ""} pendiente${
          restantes > 1 ? "s" : ""
        }`;
}

function agregarTarea(titulo, descripcion) {
  tareas.push({ titulo, descripcion, completada: false });
  guardarTareas();
  renderizarTareas();
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = inputTitulo.value.trim();
  const descripcion = inputDescripcion.value.trim();

  if (titulo === "") {
    alert("El título de la tarea es obligatorio.");
    return;
  }

  agregarTarea(titulo, descripcion);
  inputTitulo.value = "";
  inputDescripcion.value = "";
});

botonBorrarTodo.addEventListener("click", function () {
  const AllTaskCompleted = tareas.every((tarea) => tarea.completada);

  if (AllTaskCompleted) {
    tareas = [];
    guardarTareas();
    renderizarTareas();
  } else {
    const confirmacion = confirm(
      "¿Estás seguro de que quieres eliminar todas las tareas, aún hay tareas sin completar?"
    );

    if (confirmacion) {
      tareas = [];
      guardarTareas();
      renderizarTareas();
    }
  }
});

renderizarTareas();
