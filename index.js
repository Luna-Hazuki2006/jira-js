const actividades = []
const agregar = document.getElementById('agregar')
const forma = document.querySelector('form')
const pendiente = document.getElementById('pendiente')
const ejecutando = document.getElementById('ejecutando')
const realizada = document.getElementById('realizada')

class Actividad {
    constructor(nombre, tiempoEstimado) {
        this.id = actividades.length + 1
        this.nombre = nombre
        this.tiempoEstimado = tiempoEstimado
        this.fechaCreacion = new Date()
        this.fechaFin = null
        this.categoria = 'Pendiente'
        this.estatus = 'A'
    }

    mostrarDias() {
        const Dia = 24 * 60 * 60 * 1000
        return Math.round(Math.abs((this.fechaCreacion - this.tiempoEstimado) / Dia))
    }
}

function pendientes() {
    const data = new FormData(forma)
    let nombre = data.get('nombre')
    let tiempo = data.get('tiempo')
    tiempo = new Date(tiempo)
    const nuevo = new Actividad(nombre, tiempo)
    actividades.push(nuevo)
    llenarListas()
}

function borrar(boton) {
    const id = boton.parentElement.id
    for (const este of actividades) {
        if (este.id == id) {
            este.estatus = 'I'
        }
    }
    llenarListas()
    // const lista = document.getElementById(id)
    // document.removeChild(lista)
}

function enEjecucion(evento) {
    evento.preventDefault();
    let id = evento.dataTransfer.getData("text");
    for (const este of actividades) {
        if (este.id == id && este.estatus == 'A') {
            este.categoria = "En ejecución"
        }
    }
    llenarListas()
}


function llenarListas() {
    pendiente.innerHTML = ''
    ejecutando.innerHTML = ''
    realizada.innerHTML = ''
    for (const esto of actividades) {
        if (!(esto.estatus == 'A' && esto.categoria == 'Pendiente')) {
            continue
        }
        pendiente.innerHTML += `
        <div class="medio" id="${esto.id}" draggable="true" ondragstart="drag(event)">
            <div class="info">
                <p>Creada: ${esto.fechaCreacion}</p> <!-- Fecha de creación de la actividad (en formato fecha)-->
                <p>Actividad: ${esto.nombre}</p> <!-- Actividad ingresada en el formulario -->
                <p>Tiempo estimado: ${esto.mostrarDias()} días</p> <!-- Tiempo estimado ingresado en el formulario (en formato fecha) -->
            </div>
            <button type="button" onclick="borrar(this)">Borrar</button> <!--botón para borrar la actividad-->
        </div>
        `
    }
    for (const esto of actividades) {
        if (!(esto.estatus == 'A' && esto.categoria == 'En ejecución')) {
            continue
        }
        ejecutando.innerHTML += `
        <div class="medio" id="${esto.id}" draggable="true" ondragstart="drag(event)">
            <div class="info">
                <p>Desde: ${esto.fechaCreacion}</p><!-- Fecha desde que se esta ejecutando la actividad de la actividad (en formato fecha)-->
                <p>Actividad: ${esto.nombre}</p>
                <p>Tiempo estimado: ${esto.mostrarDias()} días</p>
            </div>
            <button type="button" onclick="borrar(this)">Borrar</button>
        </div>
        `
    }
    for (const esto of actividades) {
        if (!(esto.estatus == 'A' && esto.categoria == 'Realizada')) {
            continue
        }
        realizada.innerHTML += `
        <div class="medio" id="${esto.id}">
            <div class="info">
                <p>Creada: ${esto.fechaCreacion}</p><!-- Fecha de creación de la actividad (en formato fecha)-->
                <p>Fecha fin: ${esto.fechaFin}</p><!-- Fecha en la culmino la actividad de la actividad (en formato fecha)-->
                <p>Actividad: ${esto.nombre}</p>
                <p>Tiempo estimado: ${esto.mostrarDias()} días</p>
            </div>
        </div>
        `
    }
    actividades.forEach((e) => console.log(e))
}

agregar.addEventListener('click', pendientes)
agregar.addEventListener('click', enEjecucion)

function allowDrop(evento) {
    evento.preventDefault();
}
  
function drag(evento) {
    evento.dataTransfer.setData("text", evento.target.id);
}
  
function dejarPendiente(evento) {
    // evento.preventDefault();
    // var data = evento.dataTransfer.getData("text");
    // evento.target.appendChild(document.getElementById(data));
    evento.preventDefault();
    let id = evento.dataTransfer.getData("text");
    // let tarea = document.getElementById(id)
    for (const este of actividades) {
        if (este.id == id && este.estatus == 'A') {
            este.categoria = "Pendiente"
        }
    }
    llenarListas()
}

function finalizar(evento) {
    evento.preventDefault();
    let id = evento.dataTransfer.getData("text");
    // let tarea = document.getElementById(id)
    for (const este of actividades) {
        if (este.id == id && este.estatus == 'A') {
            este.fechaFin = new Date()
            este.categoria = "Realizada"
        }
    }
    // tarea.removeAttribute('draggable')
    // tarea.removeAttribute('ondragstart')
    // evento.target.appendChild(tarea);
    llenarListas()
}