let turnosArray = [];
let servicios = [];
let turnos = [];
let turnosF = [];

let msjAyuda = `
Bienvenido/a a tu Agenda Personal de Turnos orientada a la manicuría, con ella podremos agendar turnos de manera ordenada, a continuación veremos paso a paso como se utiliza:

FECHA:
Lo primero que debemos elegir es la fecha para ver los turnos que tenemos agregados para ese día o bien agregar turnos nuevos (si hay disponibles, claro)

NUEVO TURNO:
En el apartado de NUEVO TURNO tendremos un formulario en el cual vamos a rellenar los campos con la información requerida (Nombre, Apellido, Servicio y Horario), La asignación de Nombre y apellido son opcionales sin embargo, Servicio y Horario son necesarios para que se nos habilite el boton de Agregar.

SERVICIO Y HORARIO:
En el campo de Servicio se mostraran los servicios por defecto con su respectiva duración, podrás eliminar o agregar nuevos en la parte de configuración (icono de tuerca arriba a la derecha).
El campo de Horario no se habilitará hasta que hayamos elegido un servicio anteriormente, ya que los horarios disponibles dependen directamente de la duración del servicio elegido (los horarios de los turnos no se pisan unos con otros)

LISTA DE TURNOS:
Una vez agregado un nuevo turno, el mismo se vera reflejado en el apartado de LISTA DE TURNOS, donde se veran ordenados según el horario del turno. Aquí podremos ver los turnos agendados a la fecha elegida y tendremos la opción de Eliminar un turno en el caso de que se lo desee.

CONFIGURACIÓN:

    - GENERAL:
    En este apartado podemos optar por opciones generales que se relacionan con toda Web App

    - SERVICIOS:
    Se podrá ver los servicios guardados, eliminarlos o agregar nuevos. Tendremos un botón de Reestablecer para volver a las opciones de Servicio por defecto (Semi, Service y Esculpido)
`;

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

function serviciosDefault() {
    fetch("../data.json")
        .then((response) => response.json())
        .then((data) => {
            servicios = data;
            configMostrarServicios();
            verListaServicios();
        });
}

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
                            servicios[i].id
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

            let substringID = Number(id.substring(14));

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

function mostrarAyuda() {
    Swal.fire(msjAyuda, "Comenzamos?", "question");
}

let checkbox = document.querySelector("input[name=theme]");

checkbox.addEventListener("change", function () {
    if (this.checked) {
        trans();
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        trans();
        document.documentElement.setAttribute("data-theme", "light");
    }
});

let trans = () => {
    document.documentElement.classList.add("transition");
    window.setTimeout(() => {
        document.documentElement.classList.remove("transition");
    }, 1000);
};

let btnAgregarTurno = document.querySelector("#agregarTurno");
let selectServicio = document.querySelector("#servicio");
let selectHorario = document.querySelector("#horario");
let btnAgregarServicio = document.querySelector("#agregarServicio");
let resetServicios = document.querySelector("#resetServicios");
let btnAyuda = document.querySelector("#btnAyuda");

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

resetServicios.addEventListener("click", serviciosDefault);

btnAyuda.addEventListener("click", mostrarAyuda);

function start() {
    JSON.parse(localStorage.getItem("misServicios"))
        ? (servicios = JSON.parse(localStorage.getItem("misServicios")))
        : serviciosDefault();

    configMostrarServicios();
    verListaServicios();
    obtenerTurnos();
    mostrarTurnos();
    verHorariosDisponibles();

    if (!JSON.parse(localStorage.getItem("misServicios")) && !JSON.parse(localStorage.getItem("misTurnos"))) {
        setTimeout(mostrarAyuda, 2000);
    }
}

start();
