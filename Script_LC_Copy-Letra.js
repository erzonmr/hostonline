function copiarContenido() {
    var contenido = document.getElementById("letra");
    var imgEntry = document.getElementById("img-entry");
    var texto = obtenerTextoConSaltos(imgEntry) + '\n\n' + obtenerTextoConSaltos(contenido);
    texto += "\n\nPara más letras cristianas visita: www.letracristiana.com"; // Añadir el mensaje aquí
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
      if (hijo.nodeType === Node.ELEMENT_NODE && (hijo.tagName === 'DIV' || hijo.tagName === 'H1' || hijo.tagName === 'H2')) {
        if (hijo.innerText.trim() !== '') {
          lineas.push(hijo.innerText);
        }
        if (hijo.tagName === 'DIV' && hijo.innerHTML === '<br>') {
          lineas.push('');
        }
      }
    });
    
    return lineas.join('\n');
  }
  