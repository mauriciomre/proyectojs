let turnosArray = [];
let servicios = [];
let turnos = [];
let turnosF = [];

fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
        servicios = data;
        start();
    });

class Turno {
    constructor(id, nombreCliente, apellidoCliente, servicio, horario, dia) {
        this.id = id;
        this.nombreCliente = nombreCliente;
        this.apellidoCliente = apellidoCliente;
        this.servicio = Number(servicio);
        this.horario = horario;
        this.dia = dia;
    }
}

class Servicio {
    constructor(id, nombreServicio, duracion, costo, descripcion) {
        this.id = Number(id);
        this.nombreServicio = nombreServicio;
        this.duracion = Number(duracion);
        this.costo = Number(costo);
        this.descripcion = descripcion;
    }
}

// servicios.push(new Servicio(0, "Semi", "2", "1500"));
// servicios.push(new Servicio(1, "Service", "3", "2500"));
// servicios.push(new Servicio(2, "Esculpido", "4", "3500"));

function verListaServicios() {
    let servicioDisponible = document.querySelector("#servicio");

    servicioDisponible.innerHTML = `<option value="" disabled selected>Servicio</option>`;

    for (let i = 0; i < servicios.length; i++) {
        servicioDisponible.innerHTML += `<option value="${i}">${servicios[i].nombreServicio} (duración: ${servicios[i].duracion}hs)</option>`;
    }
}

function verHorariosDisponibles() {
    selectHorario.innerHTML = `<option value="" disabled selected>Horario</option>`;
    let estaDisponible = true;
    if (selectServicio.value == "") {
        selectHorario.setAttribute("disabled", "disabled");
        btnAgregarTurno.setAttribute("disabled", "disabled");
    }
    if (selectServicio.value !== "") {
        selectHorario.removeAttribute("disabled");
        selectHorario.setAttribute("class", "form-select mb-3");
        for (let i = 8; i <= 18; i++) {
            estaDisponible = true;
            if (turnosF.length) {
                for (let j = 0; j < turnosF.length; j++) {
                    if (turnosF[j] !== undefined && turnosF[j] !== null) {
                        let duracionServicioSeleccionado = servicios[Number(selectServicio.value)].duracion;

                        let duracionTurnoAgendado = servicios[turnosF[j].servicio].duracion;
                        let horarioTurnosAgendado = turnosF[j].horario;
                        let finTurnoAgendado = horarioTurnosAgendado + duracionTurnoAgendado;
                        if (i < finTurnoAgendado && i + duracionServicioSeleccionado > horarioTurnosAgendado) {
                            estaDisponible = false;
                        }
                    }
                }
            }

            if (estaDisponible == true) {
                selectHorario.innerHTML += `<option value="${i}">${i}:00hs</option>`;
            }
        }
    }
}

function obtenerTurnos() {
    if (JSON.parse(localStorage.getItem("misTurnos"))) {
        turnos = JSON.parse(localStorage.getItem("misTurnos"));
    }
}

function mostrarTurnos() {
    let tbodyTurnos = document.querySelector("#tbodyTurnos");
    tbodyTurnos.innerHTML = "";

    let fechaSeleccionada = document.querySelector("#fechaTurno");
    turnosF = turnos.filter((turno) => turno.dia == fechaSeleccionada.value);

    turnosF.sort(function (a, b) {
        a = a || 0;
        b = b || 0;
        return a.horario - b.horario;
    });

    if (turnosF.length) {
        for (let i = 0; i < turnosF.length; i++) {
            if (turnosF[i] !== undefined && turnosF[i] !== null) {
                tbodyTurnos.innerHTML +=
                    // prettier-ignore
                    `<tr>
                        <td>${turnosF[i].horario}:00hs a ${turnosF[i].horario + servicios[turnosF[i].servicio].duracion}:00hs</td>
                        <td>${servicios[turnosF[i].servicio].nombreServicio}</td>
                        <td>${turnosF[i].nombreCliente}</td>
                        <td>${turnosF[i].apellidoCliente}</td>
                        <td>
                        <i id="borrarTurno${turnosF[i].id}" class="clickTurno fa-solid fa-trash btn text-danger btn-borrar-turno"></i>
                        </td>
                    </tr>`;
            }
        }
    }
    eliminarTurno();
}

function eliminarTurno() {
    document.querySelectorAll(".clickTurno").forEach((el) => {
        el.addEventListener("click", (e) => {
            const id = e.target.getAttribute("id");

            element = e.target.parentElement;

            element.parentElement.remove();

            let substringID = Number(id.substring(11));

            console.log(substringID);

            let indiceTurno = turnos.findIndex((element) => element.id === substringID);

            turnos.splice(indiceTurno, 1);

            msjToastify("Turno eliminado!", "right", "top", "linear-gradient(to right, #db3a6e, #de3075)");

            selectServicio.value = "";
            verHorariosDisponibles();
            guardarTurnosLS();
            mostrarTurnos();
        });
    });
}

function guardarTurnosLS() {
    const turnosStr = JSON.stringify(turnos);
    localStorage.setItem("misTurnos", turnosStr);
}

function guardarServiciosLS() {
    const serviciosStr = JSON.stringify(servicios);
    localStorage.setItem("misServicios", serviciosStr);
}

function agregarTurno() {
    let turno = new Turno();

    turno.nombreCliente = document.querySelector("#nombreCliente").value;

    turno.apellidoCliente = document.querySelector("#apellidoCliente").value;

    turno.servicio = Number(document.querySelector("#servicio").value);

    turno.horario = Number(document.querySelector("#horario").value);

    turno.dia = document.querySelector("#fechaTurno").value;

    let nuevoID = 0;

    (function generarNuevoID() {
        if (turnos.findIndex((ElTurno) => ElTurno.id === nuevoID) === -1) {
            turno.id = nuevoID;
        } else {
            nuevoID++;
            generarNuevoID();
        }
    })();

    turnos.push(turno);

    msjToastify("Nuevo turno agregado!", "right", "top", "linear-gradient(to right, #00b09b, #96c93d)");

    guardarTurnosLS();
    mostrarTurnos();
    verListaServicios();
    verHorariosDisponibles();
}

function msjToastify(msj, position, gravity, background) {
    Toastify({
        text: msj,
        className: "info",
        duration: 1500,
        position: position,
        gravity: gravity,
        style: {
            background: background,
        },
    }).showToast();
}

// function crearCalendario() {
//     let calendarEl = document.getElementById("calendar");
//     let calendar = new FullCalendar.Calendar(calendarEl, {
//         initialView: "dayGridMonth",
//     });
//     calendar.render();
// }

function configMostrarServicios() {
    let mensajeError = "No hay descripción";
    let configListaServicios = document.querySelector("#configListaServicios");
    configListaServicios.innerHTML = "";

    if (servicios) {
        for (let i = 0; i < servicios.length; i++) {
            configListaServicios.innerHTML += `
            <div class="col-sm-12 col-md-6 col-lg-4">
                <div class="card border-secondary mb-3">
                    <div class="card-header-servicios card-header d-flex justify-content-between">
                        <span class="align-self-center mx-2">${servicios[i].nombreServicio.toUpperCase()}</span>
                    
                        <i id="borrarServicio${
                            servicios.id
                        }" class="clickServicio fa-solid fa-trash btn text-danger btn-borrar-servicio"></i>
                    </div>
                    <div class="card-body">
                        <h4 class="card-title">Duración: ${servicios[i].duracion}hs </h4>
                        <h4 class="card-title">Precio: $${servicios[i].costo} </h4>
                        <p class="card-text">${servicios[i].descripcion ? servicios[i].descripcion : mensajeError}</p>
                    </div>
                </div>
            </div>
            `;
        }
    }
    eliminarServicio();
}

function eliminarServicio() {
    document.querySelectorAll(".clickServicio").forEach((el) => {
        el.addEventListener("click", (e) => {
            const id = e.target.getAttribute("id");

            element = e.target.parentElement;

            element.parentElement.remove();

            let substringID = Number(id.substring(11));

            console.log(substringID);

            let indiceServicio = servicios.findIndex((element) => element.id === substringID);

            servicios.splice(indiceServicio, 1);

            msjToastify("Servicio eliminado!", "right", "top", "linear-gradient(to right, #db3a6e, #de3075)");

            selectServicio.value = "";

            guardarServiciosLS();
            configMostrarServicios();
            verListaServicios();
            verHorariosDisponibles();
        });
    });
}

function agregarServicio() {
    let servicio = new Servicio();

    servicio.nombreServicio = document.querySelector("#nombreServicio").value;

    servicio.duracion = Number(document.querySelector("#duracionServicio").value);

    servicio.costo = Number(document.querySelector("#costoServicio").value);

    servicio.descripcion = document.querySelector("#descTextarea").value;

    let nuevoID = 0;

    (function generarNuevoID() {
        if (servicios.findIndex((ElServicio) => ElServicio.id === nuevoID) === -1) {
            servicio.id = nuevoID;
        } else {
            nuevoID++;
            generarNuevoID();
        }
    })();

    servicios.push(servicio);

    msjToastify("Nuevo servicio agregado!", "right", "top", "linear-gradient(to right, #00b09b, #96c93d)");

    guardarServiciosLS();
    configMostrarServicios();
    verListaServicios();
    verHorariosDisponibles();
    document.getElementById("formServicios").reset();
}

let btnAgregarTurno = document.querySelector("#agregarTurno");
let selectServicio = document.querySelector("#servicio");
let selectHorario = document.querySelector("#horario");
let btnAgregarServicio = document.querySelector("#agregarServicio");

btnAgregarTurno.addEventListener("click", agregarTurno);
selectServicio.addEventListener("change", () => verHorariosDisponibles());
selectHorario.addEventListener("change", () => {
    if (selectHorario.value !== "") {
        btnAgregarTurno.removeAttribute("disabled");
    }
});
btnAgregarServicio.addEventListener("click", agregarServicio);

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("flip-card-btn-turn-to-back").style.visibility = "visible";
    document.getElementById("flip-card-btn-turn-to-front").style.visibility = "visible";

    document.getElementById("flip-card-btn-turn-to-back").onclick = function () {
        document.getElementById("flip-card").classList.toggle("do-flip");
    };

    document.getElementById("flip-card-btn-turn-to-front").onclick = function () {
        document.getElementById("flip-card").classList.toggle("do-flip");
    };
});

function start() {
    verListaServicios();
    obtenerTurnos();
    mostrarTurnos();
    verHorariosDisponibles();
    configMostrarServicios();
    // crearCalendario();
}

// TAREAS PENDIENTES

// Configuracion general:
//  - cambiar theme
//  - opcion de preguntar antes de eliminar
//  -

// Validar Nombre y Apellido

// Avisar si no hay horarios disponibles de todos los servicios o de alguno en particular
