class Turno {
    constructor(nombreCliente, apellidoCliente, servicio, horario, dia) {
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

let turnosArray = [];
let turnos = [];
let servicios = [];

servicios.push(new Servicio(0, "Semi", "2", "1500"));
servicios.push(new Servicio(1, "Service", "3", "2500"));
servicios.push(new Servicio(2, "Esculpido", "4", "3500"));

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
    turnos.sort(function (a, b) {
        a = a || 0;
        b = b || 0;
        return a.horario - b.horario;
    });

    if (turnos.length) {
        for (let i = 0; i < turnos.length; i++) {
            if (turnos[i] !== undefined && turnos[i] !== null) {
                if (turnos[i].id == undefined) {
                    turnos[i].id = i;
                }

                tbodyTurnos.innerHTML +=
                    // prettier-ignore
                    `<tr>
                        <th scope="row">${i}</th>
                        <td>${turnos[i].horario}:00hs a ${turnos[i].horario + servicios[turnos[i].servicio].duracion}:00hs</td>
                        <td>${servicios[turnos[i].servicio].nombreServicio}</td>
                        <td>${turnos[i].nombreCliente}</td>
                        <td>${turnos[i].apellidoCliente}</td>
                        <td>
                        <i id="borrarTurno${i}" class="click fa-solid fa-trash btn text-danger"></i>
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

            let numeroID = id.substring(11);

            turnos.splice(numeroID, 1);

            console.log(turnos);

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
    let tbodyTurnos = document.querySelector("#tbodyTurnos");
    tbodyTurnos.innerHTML = "";

    let turno = new Turno();

    turno.nombreCliente = document.querySelector("#nombreCliente").value;

    turno.apellidoCliente = document.querySelector("#apellidoCliente").value;

    turno.servicio = Number(document.querySelector("#servicio").value);

    turno.horario = Number(document.querySelector("#horario").value);

    turnos.push(turno);

    mostrarTurnos();
    verListaServicios();
    verHorariosDisponibles();
    guardarTurnosLS();
}

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
verListaServicios();
obtenerTurnos();
mostrarTurnos();
verHorariosDisponibles();

// Usar libreria Toastify JS para notificar nuevo turno agregado y turno eliminado

// Incluir calendario (usar libreria LUXON) para elegir el dia del turno

// Seccion de agregar, modificar y borrar Servicios

// Validar Nombre y Apellido

// Avisar si no hay horarios disponibles de todos los servicios o de alguno en particular

// Usar Bootswatch para darle mejor estilo
