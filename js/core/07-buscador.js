const Buscador = {
    buscar(texto, datos) {
        const resultados = [];
        const textoLower = texto.toLowerCase();
        for (const id in datos) {
            if (datos[id].nombre && datos[id].nombre.toLowerCase().includes(textoLower)) {
                resultados.push({ id, ...datos[id] });
            }
        }
        return resultados;
    }
};
window.Buscador = Buscador;
