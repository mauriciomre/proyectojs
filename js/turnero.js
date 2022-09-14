/*El siguiente algoritmo representa un sistema que sirve para agendar los turnos de una sala de manicuría 

    - Paso 1: Crear un bucle que pida al Usuario (dueña de la sala de manicuría) que ingrese los turnos agendados (hora y tiempo de duracion)
    - Paso 2: El bucle debe repetirse hasta completar la agenda de turnos o hasta que no haya mas horarios disponibles (de 8:00 a 20:00 con posibilidad de extenderse)
    - Paso 3: Una vez que se salga del ciclo el algoritmo mostrará al usuario cuantos turnos agendó y duracion de cada turno (no puede ser mayor a 4 horas)
    - Paso 4: Validar los datos almacenados 
    


    
    let dia = prompt(`Bienvenido a su agenda de turnos, para iniciar indique el DIA del mes para la cual va a completar la agenda de turnos`)
    while (dia > 31 || dia < 1 || dia == null || dia == "" || isNaN(dia)) {
        dia = prompt(`Debe ingresar un dia válido`)
    }
    
    let mes = prompt(`Perfecto, ahora indique el MES (en número, por Ej. 02 para Febrero)`)
    while (mes > 12 || mes < 1 || mes == null || mes == "" || isNaN(mes)) {
        mes = prompt(`Debe ingresar un mes válido`)
    }

let turnos = `Sus turnos agendados para el dia ${dia}/${mes} son: 
    
    `;
    let nombreCliente;
    let apellidoCliente;
    let duracionCliente = 0;
    let maximoHoras = 12;
    let totalHoras = 0;
    let horarioInicio = 8;
    let horarioFin;
    
    alert(`A continuación se agendarán los turnos para el dia ${dia}/${mes}`)
    
    for (let i = 1; totalHoras <= maximoHoras; i++) {
        
        nombreCliente = prompt(`Ingrese el NOMBRE del cliente número ${i}`);
        while (nombreCliente == null || nombreCliente == "" || !isNaN(nombreCliente)) {
            alert(`El NOMBRE ingresado NO es válido!`)
            nombreCliente = prompt(`Ingrese el NOMBRE del cliente número ${i}`)
        }
        
        apellidoCliente = prompt(`Ingrese el APELLIDO del cliente número ${i} nuevamente`);
        while (apellidoCliente == null || apellidoCliente == "" || !isNaN(apellidoCliente)) {
            alert(`El APELLIDO ingresado NO es válido!`)
            apellidoCliente = prompt(`Ingrese el APELLIDO del cliente número ${i} nuevamente`)
        }

        duracionCliente = Number(prompt(`ingrese la duración del turno (en horas)`));
        while (duracionCliente > 4 || duracionCliente == null || duracionCliente == "" || isNaN(duracionCliente)) {
            alert(`El dato ingresado NO es VÁLIDO`);
            duracionCliente = Number(prompt(`ingrese la duración del turno (en horas) nuevamente, recuerde que cada turno no puede ser mayor a 4 horas`));
        }
        
        horarioFin = horarioInicio + duracionCliente;
        
        turnos = turnos + `Cliente Nº ${i} - Horario: ${horarioInicio}:00hs a ${horarioFin}:00hs 
        Nombre: ${nombreCliente} ${apellidoCliente}
        Duración: ${duracionCliente} horas
        
        `;
        
        totalHoras = totalHoras + duracionCliente;
        horarioInicio = horarioFin;
    }
    
    turnos += `
    Su jornada finalizará a las ${horarioFin}:00hs`
    alert(turnos);
    console.log(turnos);

    */

const turnos = [];
const profesionales = [];
const servicios = [];

class Turno {
    constructor(nombreCliente, servicio, horario) {
        this.nombreCliente = nombreCliente;
        this.servicio = servicio;
        this.horario = horario;
    }
}

class Profesional {
    constructor(nombreProfesional, servicios) {
        this.nombreProfesional = nombreProfesional;
        this.servicios = servicios;
    }
}

class Servicio {
    constructor(nombreServicio, duracion, costo) {
        this.nombreServicio = nombreServicio;
        this.duracion = Number(duracion);
        this.costo = Number(costo);
    }
}

servicios.push(new Servicio('Semi', '2', '1500'))
servicios.push(new Servicio('Service', '3', '2500'))
servicios.push(new Servicio('Esculpido', '4', '3500'))


let menu = function () {

    opcion = Number(prompt(`Bienvenida a la agenda de turnos! elija una de las opciones con su numero correspondiente:

(1) TURNOS
(2) PROFESIONALES
(3) SERVICIOS`));
    console.log(opcion)
    switch (opcion) {
        case 1:

            opcion = Number(prompt(`Elija una opción:

(1) NUEVO TURNO
(2) VER LISTA DE TURNOS
(3) VOLVER AL MENU PRINCIPAL`))

            switch (opcion) {
                case 1:
                    let turno = new Turno;

                    let listaServicios = '';
                    for (let i = 0; i < servicios.length; i++) {
                        listaServicios += `(${i}) ${servicios[i].nombreServicio}
`;
                    }

                    turno.servicio = Number(prompt(`Ingrese un servicio de la lista:
                    
${listaServicios}`))

                    let disponible = ''

                    for (let i = 8; i < 20; i++) {


                        if (turnos.length) {
                            for (let j = 0; j < turnos.length; j++) {
                                if (i === turnos[j].horario) {
                                    i = i + servicios[turnos[j].servicio].duracion
                                } else {
                                    disponible += `${i}hs sfdf
`
                                }
                            }
                        } else {
                            disponible += `${i}hs hola
`
                        }
                    }
                    turno.horario = Number(prompt(`Elija uno de los HORARIOS disponibles:
${disponible}`))

                    nombreCliente = prompt(`Ingrese el nombre del cliente`)

                    while (nombreCliente == null || nombreCliente == "" || !isNaN(nombreCliente)) {
                        alert(`El NOMBRE ingresado NO es válido!`)
                        nombreCliente = prompt(`Ingrese el NOMBRE del cliente nuevamente`)
                    }

                    turno.nombreCliente = nombreCliente;

                    turnos.push(turno);

                    alert(`El turno se guardo satisfactoriamente!
    Detalle:
        Cliente: ${turno.nombreCliente}
        Servicio: ${servicios[turno.servicio].nombreServicio}
        Horario: de ${turno.horario}hs a ${turno.horario + servicios[turno.servicio].duracion}hs`)

                    console.log(turnos)
                    menu()

                    break;
                case 2:
                    if (turnos.length === 0) {
                        alert(`No hay turnos agendados!`)
                    } else {
                        let listaTurnos = '';
                        for (let i = 0; i < turnos.length; i++) {
                            listaTurnos += `(${i}) HORARIO: ${turnos[i].horario}hs - NOMBRE: ${turnos[i].nombreCliente} - SERVICIO: ${servicios[turnos[i].servicio].nombreServicio} 
                    `;
                        }
                        alert(`Lista de TURNOS:
                
 ${listaTurnos}`)
                    }
                    menu();
                    break;


                case 3:
                    menu();
                    break;

                default:
                    menu();
                    break;
            }

        case 2:
            opcion = Number(prompt(`Elija una opción
            (1) NUEVO PROFESIONAL
            (2) VER LISTA DE PROFESIONALES
            (3) VOLVER AL MENU PRINCIPAL`))

            switch (opcion) {
                case 1:

                case 2:

                case 3:
                    menu();
                    break;
            }

        case 3:
            opcion = Number(prompt(`Elija una opción
            (1) NUEVO SERVICIO
            (2) VER LISTA DE SERVICIOS
            (3) VOLVER AL MENU PRINCIPAL`))

            switch (opcion) {
                case 1:
                    let servicio = new Servicio();

                    servicio.nombreServicio = prompt(`Ingrese un NOMBRE para el nuevo SERVICIO:`);
                    servicio.duracion = prompt(`Cuánto dura un servicio de ${servicio.nombreServicio}? (En horas)`);
                    servicio.costo = prompt(`Cuál es es costo para el servicio de ${servicio.nombreServicio}?`)

                    alert(`Un nuevo SERVICIO ha sido añadido correctamente:
                        SERVICIO: ${servicio.nombreServicio}
                        DURACION: ${servicio.duracion}hs
                        COSTO: $${servicio.costo}
                        `)
                    menu();
                    break;
                case 2:

                case 3:
                    menu();
                    break;

                default:
                    alert(`Ingrese un número válido!`)
                    break;
            }

    }
}


menu();