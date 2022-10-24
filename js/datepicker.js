new Litepicker({
    element: document.getElementById("fechaTurno"),
    format: "DD / MM / YYYY",
    startDate: new Date(),
    lang: "es-ES",
    resetButton: true,
    setup: (picker) => {
        picker.on("hide", () => {
            mostrarTurnos();
        });

        picker.on("error:date", () => {
            console.log("error fecha");
        });
    },
});
