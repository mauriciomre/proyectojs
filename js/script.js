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

const turnos = [];
const servicios = [];

servicios.push(new Servicio(0, "Semi", "2", "1500"));
servicios.push(new Servicio(1, "Service", "3", "2500"));
servicios.push(new Servicio(2, "Esculpido", "4", "3500"));

function verListaServicios() {
    let servicioDisponible = document.querySelector("#servicio");

    servicioDisponible.innerHTML = `<option value="" disabled selected>Servicio</option>`;

    for (let i = 0; i < servicios.length; i++) {
        servicioDisponible.innerHTML += `<option value="${i}">${servicios[i].nombreServicio}</option>`;
    }
}

function verHorariosDisponibles(servicioElegido) {
    let horarioDisponible;
    let habilitar = document.querySelector("#horario");
    if (servicioElegido !== undefined) {
        habilitar.removeAttribute("disabled");

        horarioDisponible = document.querySelector("#horario");

        horarioDisponible.innerHTML = "";

        for (let i = 8; i <= 18; i++) {
            if (turnos.length) {
                for (let j = 0; j < turnos.length; j++) {
                    if (turnos[j] !== undefined && i === turnos[j].horario) {
                        i = i + servicios[turnos[j].servicio].duracion;
                    }
                }
            }

            if (i < 18) {
                horarioDisponible.innerHTML += `<option value="${i}">${i}:00hs</option>`;
                i = i + servicios[servicioElegido].duracion;
            }
        }
    } else if (servicioElegido == undefined) {
        habilitar.setAttribute("disabled", "disabled");
    }
}

function mostrarTurnos() {
    if (turnos.length) {
        for (let i = 0; i < turnos.length; i++) {
            if (turnos[i] !== undefined) {
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
}

function eliminarTurno() {
    document.querySelectorAll(".click").forEach((el) => {
        el.addEventListener("click", (e) => {
            const id = e.target.getAttribute("id");

            element = e.target.parentElement;

            element.parentElement.remove();

            let numeroID = id.substring(11);

            delete turnos[numeroID];
        });
    });

    verHorariosDisponibles();
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
    eliminarTurno();
    verListaServicios();
    verHorariosDisponibles();
}

let btnAgregarTurno = document.querySelector("#agregarTurno");

btnAgregarTurno.addEventListener("click", agregarTurno);

let servicioSeleccionado = document.querySelector("#servicio");

// prettier-ignore
servicioSeleccionado.addEventListener("change", () => verHorariosDisponibles(servicioSeleccionado.value));

verListaServicios();
mostrarTurnos();
verHorariosDisponibles();

//anular boton de agregar cuando no haya mas turnos disponibles o cuando no se completen los datos
