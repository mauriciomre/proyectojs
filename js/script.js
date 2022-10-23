let turnosArray = [];
let turnos = [];
let servicios = [];

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
            if (turnos.length) {
                for (let j = 0; j < turnos.length; j++) {
                    if (turnos[j] !== undefined && turnos[j] !== null) {
                        let duracionServicioSeleccionado = servicios[Number(selectServicio.value)].duracion;

                        let duracionTurnoAgendado = servicios[turnos[j].servicio].duracion;
                        let horarioTurnosAgendado = turnos[j].horario;
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
    let turnosF = turnos.filter((turno) => turno.dia == fechaSeleccionada.value);

    console.log(fechaSeleccionada.value);

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
                        <i id="borrarTurno${turnosF[i].id}" class="click fa-solid fa-trash btn text-danger"></i>
                        </td>
                    </tr>`;
            }
        }
    }
    eliminarTurno();
}

function eliminarTurno() {
    document.querySelectorAll(".click").forEach((el) => {
        el.addEventListener("click", (e) => {
            const id = e.target.getAttribute("id");

            element = e.target.parentElement;

            element.parentElement.remove();

            let substringID = Number(id.substring(11));

            let indiceTurno = turnos.findIndex((element) => element.id === substringID);

            turnos.splice(indiceTurno, 1);

            msjEliminarTurno();

            selectServicio.value = "";
            verHorariosDisponibles();
            guardarTurnosLS();
        });
    });
}

function guardarTurnosLS() {
    const turnosStr = JSON.stringify(turnos);
    localStorage.setItem("misTurnos", turnosStr);
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

    msjAgregarTurno();

    mostrarTurnos();
    verListaServicios();
    verHorariosDisponibles();
    guardarTurnosLS();
}

function msjAgregarTurno() {
    Toastify({
        text: "Turno agendado!",
        className: "info",
        duration: 1000,
        position: "right",
        gravity: "bottom",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}

function msjEliminarTurno() {
    Toastify({
        text: "Turno eliminado!",
        className: "info",
        duration: 1000,
        position: "right",
        gravity: "bottom",
        style: {
            background: "linear-gradient(to right, #db3a6e, #de3075)",
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

let btnAgregarTurno = document.querySelector("#agregarTurno");
let selectServicio = document.querySelector("#servicio");
let selectHorario = document.querySelector("#horario");

btnAgregarTurno.addEventListener("click", agregarTurno);
selectServicio.addEventListener("change", () => verHorariosDisponibles());
selectHorario.addEventListener("change", () => {
    if (selectHorario.value !== "") {
        btnAgregarTurno.removeAttribute("disabled");
    }
});

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
    // crearCalendario();
}

// TAREAS PENDIENTES

// mostrar horarios disponibles en relacion al dia seleccionado

// Seccion de agregar, modificar y borrar Servicios

// Validar Nombre y Apellido

// Avisar si no hay horarios disponibles de todos los servicios o de alguno en particular
