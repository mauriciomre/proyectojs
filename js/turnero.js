/* El suiguiente algoritmo representa un sistema que sirve para agendar los turnos de una sala de manicuría 

    - Paso 1: Crear un bucle que pida al Usuario (dueña de la sala de manicuría) que ingrese los turnos agendados (hora y tiempo de duracion)
    - Paso 2: El bucle debe repetirse hasta completar la agenda de turnos o hasta que no haya mas horarios disponibles (de 8:00 a 20:00 con posibilidad de extenderse)
    - Paso 3: Una vez que se salga del ciclo el algoritmo mostrará al usuario cuantos turnos agendó y duracion de cada turno (no puede ser mayor a 4 horas)
    - Paso 4: Validar los datos almacenados 

*/

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
