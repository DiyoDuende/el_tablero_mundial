// Timeline Global
const TimelineGlobal = {
    añoActual: new Date().getFullYear(),
    generarAños: function() {
        const años = [];
        const inicio = this.añoActual - 25;
        const fin = this.añoActual + 5;
        for (let año = inicio; año <= fin; año++) años.push(año.toString());
        return años;
    },
    getMensajeAños: function() {
        const años = this.generarAños();
        return `📅 Años disponibles: ${años[0]} - ${años[años.length-1]} · Actualizado a ${this.añoActual}`;
    },
    generarHTML: function() {
        return `<div class="timeline-info">${this.getMensajeAños()}</div>`;
    }
};
window.TimelineGlobal = TimelineGlobal;
