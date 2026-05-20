// Eventos Futuros
const EventosFuturos = {
    proyectar: function(años = 5) {
        const añoActual = new Date().getFullYear();
        const proyecciones = [];
        for (let i = 1; i <= años; i++) {
            proyecciones.push({ año: añoActual + i, eventos: [] });
        }
        return proyecciones;
    }
};
window.EventosFuturos = EventosFuturos;
