let amigosIngresados = [];
let amigosSorteados = [];

function asignarTextoElemento(id, texto) {
    let elemento = document.getElementById(id);
    elemento.innerHTML = texto;
}

document.getElementById("amigo").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        agregarAmigo();
    }
});

function playSound(soundFile) {
    let audio = new Audio(`sounds/${soundFile}`);
    audio.play();
}

function agregarAmigo() {
    let nombre = document.getElementById("amigo").value.trim();
    let regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (nombre === "") {
        alert("Por favor, inserte un nombre.");
    } else if (!regexLetras.test(nombre)) { 
        alert("Solo se permiten ingresar letras.");
        limpiarCampo();
    } else if (amigosIngresados.includes(nombre.toUpperCase())) { 
        alert("Este nombre ya ha sido ingresado.");
        limpiarCampo();
    } else {
        amigosIngresados.push(nombre.toUpperCase());
        limpiarCampo();
        actualizarLista();
        actualizarEstadoBotonReiniciar();
        mostrarMensaje(`✅ ${nombre.toUpperCase()} agregado con éxito.`);
        playSound("add.mp3");
    }
}

function mostrarMensaje(mensaje) {
    let mensajeDiv = document.getElementById("mensaje-exito");
    if (!mensajeDiv) {
        mensajeDiv = document.createElement("div");
        mensajeDiv.id = "mensaje-exito";
        mensajeDiv.classList.add("mensaje-oculto");
        document.body.appendChild(mensajeDiv);
    }
    
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = "block";

    setTimeout(() => {
        mensajeDiv.style.display = "none";
    }, 3000);
}

function actualizarLista() {
    let lista = document.getElementById("listaAmigos");
    lista.innerHTML = "";

    for (let i = 0; i < amigosIngresados.length; i++) {
        let elemento = document.createElement("li");
        elemento.textContent = amigosIngresados[i];
        
        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = function() {
            if (confirm(`¿Seguro(a) que quieres eliminar a ${amigosIngresados[i]}?`)) {
                eliminarAmigo(i);
            }
        };

        elemento.appendChild(botonEliminar);
        lista.appendChild(elemento);
    }

    document.getElementById("borrarTodo").style.display = amigosIngresados.length > 0 ? "block" : "none";
}

function eliminarAmigo(indice) {
    amigosIngresados.splice(indice, 1);
    actualizarLista();
    actualizarEstadoBotonReiniciar();
    playSound("delete.mp3");
}

function borrarLista() {
    if (confirm("¿Seguro(a) que quieres borrar toda la lista?")) {
        amigosIngresados = [];
        actualizarLista();
        playSound("clear.mp3");
    }
}

function sortearAmigo() {
    let secretoContainer = document.getElementById("secreto-container");

    if (amigosIngresados.length === 0) {
        alert("No hay amigos para sortear.");
    } else {
        let indiceAleatorio = Math.floor(Math.random() * amigosIngresados.length);
        let amigoSorteado = amigosIngresados[indiceAleatorio];

        let botonVer = document.createElement("button");
        botonVer.textContent = "Ver Amigo Secreto";
        botonVer.onclick = function () {
            mostrarAmigoSecreto(amigoSorteado, botonVer);
        };

        secretoContainer.innerHTML = "";
        secretoContainer.appendChild(botonVer);
        secretoContainer.style.display = "block";

        amigosSorteados.push(amigoSorteado);
        amigosIngresados.splice(indiceAleatorio, 1);
        actualizarLista();

        playSound("sort.mp3");

        if (amigosIngresados.length === 0) {
            document.getElementById("reiniciarSorteo").removeAttribute("disabled");
        }
    }
}

function mostrarAmigoSecreto(nombre, boton) {
    let mensajeExistente = boton.nextElementSibling;
    if (mensajeExistente) {
        mensajeExistente.remove();
    }

    let resultado = document.createElement("p");
    resultado.textContent = `🎁 Tu amigo secreto es: ${nombre}`;
    resultado.style.fontSize = "18px";
    resultado.style.fontWeight = "bold";
    resultado.style.color = "#b8795b";

    boton.after(resultado);
    setTimeout(() => {
        resultado.remove();
    }, 3000);

    playSound("reveal.mp3");
    lanzarConfetti();
}

function reiniciarSorteo() {
    if (amigosIngresados.length === 0 && amigosSorteados.length === 0) {
        return;
    }

    let mensajeAlerta = "¿Seguro(a) que quieres reiniciar el sorteo? Se perderán todos los datos.";
    
    if (confirm(mensajeAlerta)) {
        amigosIngresados = [];
        amigosSorteados = [];

        actualizarLista();
        actualizarEstadoBotonReiniciar();
        document.getElementById("secreto-container").innerHTML = "<p id='mensaje-secreto'>Aquí aparecerá tu amigo secreto...</p>";
        document.getElementById("secreto-container").style.display = "none";

        document.getElementById("reiniciarSorteo").setAttribute("disabled", "true");

        playSound("reset.mp3");
    }
}

function actualizarEstadoBotonReiniciar() {
    let botonReiniciar = document.getElementById("reiniciarSorteo");

    if (amigosIngresados.length > 0 || amigosSorteados.length > 0) {
        botonReiniciar.removeAttribute("disabled");
    } else {
        botonReiniciar.setAttribute("disabled", "true");
    }
}

function lanzarConfetti() {
    confetti({
        particleCount: 200,
        spread: 360, 
        startVelocity: 50,
        scalar: 1.2,  
        colors: ["#ff0a54", "#ff477e", "#ff85a1", "#ffb3c1", "#ffc2d1"],
        origin: { x: 0.5, y: 0.5 } 
    });
}

function limpiarCampo() {
    document.getElementById("amigo").value = "";
}