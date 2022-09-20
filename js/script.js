class Turno {
    constructor(nombreCliente, apellidoCliente, servicio, horario) {
        this.nombreCliente = nombreCliente;
        this.apellidoCliente = apellidoCliente;
        this.servicio = servicio;
        this.horario = horario;
    }
}

class Servicio {
    constructor(nombreServicio, duracion, costo) {
        this.nombreServicio = nombreServicio;
        this.duracion = Number(duracion);
        this.costo = Number(costo);
    }
}

const turnos = [];
const servicios = [];

servicios.push(new Servicio("Semi", "2", "1500"));
servicios.push(new Servicio("Service", "3", "2500"));
servicios.push(new Servicio("Esculpido", "4", "3500"));

function verListaServicios() {
    let servicioDisponible = document.querySelector("#servicio");

    servicioDisponible.innerHTML = "";

    for (let i = 0; i < servicios.length; i++) {
        servicioDisponible.innerHTML += `<option value="${i}">${servicios[i].nombreServicio}</option>`;
    }
}

function verListaHorarios() {
    let horarioDisponible = document.querySelector("#horario");

    horarioDisponible.innerHTML = "";

    for (let i = 8; i < 20; i++) {
        if (turnos.length) {
            for (let j = 0; j < turnos.length; j++) {
                if (i === turnos[j].horario) {
                    i = i + servicios[turnos[j].servicio].duracion;
                }
            }
        }
        horarioDisponible.innerHTML += `<option value="${i}">${i}:00hs</option>
	`;
    }
}

function resetTabla() {
    let tbodyTurnos = document.querySelector("#tbodyTurnos");
    tbodyTurnos.innerHTML = "";
}

function agregarTurno() {
    resetTabla();

    let turno = new Turno();

    turno.nombreCliente = document.querySelector("#nombreCliente").value;

    turno.apellidoCliente = document.querySelector("#apellidoCliente").value;

    turno.servicio = Number(document.querySelector("#servicio").value);

    turno.horario = Number(document.querySelector("#horario").value);

    turnos.push(turno);

    if (turnos.length) {
        for (let i = 0; i < turnos.length; i++) {
            tbodyTurnos.innerHTML += `<tr><th scope="row">${i}</th><td>${
                turnos[i].horario
            }:00hs a ${
                turnos[i].horario + servicios[turnos[i].servicio].duracion
            }:00hs</td><td>${servicios[turnos[i].servicio].nombreServicio}</td>
            <td>${turnos[i].nombreCliente}</td><td>${
                turnos[i].apellidoCliente
            }</td></tr>`;
        }
    }
    verListaServicios();
    verListaHorarios();
    console.log(turnos);
}

let boton = document.querySelector("#agregar");

boton.addEventListener("click", agregarTurno);

verListaServicios();
verListaHorarios();
