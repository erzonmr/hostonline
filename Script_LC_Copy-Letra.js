function copiarContenido() {
    var contenido = document.getElementById("letra");
    var imgEntry = document.getElementById("img-entry");
    var texto = obtenerTextoConSaltos(imgEntry) + '\n\n' + obtenerTextoConSaltos(contenido);
    texto += "\n\nPara más Letras Cristianas visita: www.letracristiana.com";
    var areaTemporal = document.createElement("textarea");
    areaTemporal.value = texto;
    document.body.appendChild(areaTemporal);
    areaTemporal.select();
    document.execCommand("copy");
    document.body.removeChild(areaTemporal);
    alert("Letra copiada al portapapeles");
}

function obtenerTextoConSaltos(elemento) {
    var lineas = [];
    var hijos = elemento.childNodes;
    
    hijos.forEach(function(hijo) {
        if (hijo.nodeType === Node.ELEMENT_NODE) {
            if (hijo.tagName === 'DIV' || hijo.tagName === 'H1' || hijo.tagName === 'H2') {
                if (hijo.innerText.trim() !== '') {
                    lineas.push(hijo.innerText);
                }
                if (hijo.innerHTML === '<br>' || hijo.innerHTML === '<br/>') {
                    lineas.push('');
                }
            } else if (hijo.tagName === 'BR') {
                // Detectar etiquetas <br /> directas
                lineas.push('');
            }
        } else if (hijo.nodeType === Node.TEXT_NODE && hijo.nodeValue.trim() === '') {
            // Ignorar espacios en blanco
        }
    });
    
    return lineas.join('\n');
}
