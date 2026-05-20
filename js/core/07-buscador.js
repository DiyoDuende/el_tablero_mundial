// Buscador global
const Buscador = {
    buscar: function(texto, datos) {
        const resultados = [];
        const textoLower = texto.toLowerCase();
        for (const id in datos) {
            if (datos[id] && datos[id].nombre && datos[id].nombre.toLowerCase().includes(textoLower)) {
                resultados.push({ id, ...datos[id] });
            }
        }
        return resultados;
    }
};
window.Buscador = Buscador;
