// Definir datos de mesas, tipos de platos y platos disponibles (sustituir con tus propios datos)
const mesas = [1, 2, 3, 4, 5];
const tiposPlato = ["Entrada", "Plato Principal", "Postre"];
const platosDisponibles = {
    "Entrada": ["Ensalada", "Sopa", "Empanadas"],
    "Plato Principal": ["Bistec", "Fajitas de Puerco", "Pasta"],
    "Postre": ["Pastel de Chocolate", "Helado", "Flan"]
};

// Función para cargar las opciones de mesas
function cargarMesas() {
    const mesaSelect = document.getElementById("mesaSelect");
    mesas.forEach(mesa => {
        const option = document.createElement("option");
        option.text = mesa;
        option.value = mesa;
        mesaSelect.add(option);
    });
}

// Función para cargar las opciones de tipos de platos
function cargarTiposPlato() {
    const tipoPlatoSelect = document.getElementById("tipoPlatoSelect");
    tiposPlato.forEach(tipo => {
        const option = document.createElement("option");
        option.text = tipo;
        option.value = tipo;
        tipoPlatoSelect.add(option);
    });
}

// Función para actualizar los platos disponibles según el tipo seleccionado
function actualizarPlatos() {
    const tipoPlatoSelect = document.getElementById("tipoPlatoSelect");
    const platosDisponiblesDiv = document.getElementById("platosDisponibles");
    const tipoSeleccionado = tipoPlatoSelect.value;
    platosDisponiblesDiv.innerHTML = ""; // Limpiar platos anteriores
    platosDisponibles[tipoSeleccionado].forEach(plato => {
        const platoDiv = document.createElement("div");
        platoDiv.textContent = plato;
        const cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.min = "0";
        cantidadInput.value = "0";
        platoDiv.appendChild(cantidadInput);
        const botonMas = document.createElement("button");
        botonMas.textContent = "+";
        botonMas.type = "button"; // Evitar que el botón actúe como submit
        botonMas.onclick = function () {
            cantidadInput.value = String(parseInt(cantidadInput.value) + 1);
            agregarPlato(plato, cantidadInput.value); // Agregar plato al pedido
        };
        platoDiv.appendChild(botonMas);
        platosDisponiblesDiv.appendChild(platoDiv);
    });
}

// Función para agregar un plato al pedido con su cantidad
function agregarPlato(plato, cantidad) {
    const pedidoList = document.getElementById("pedidoList");
    const pedidoItem = document.createElement("div");
    const cantidadSpan = document.createElement("span");
    cantidadSpan.textContent = cantidad;
    const platoP = document.createElement("p");
    platoP.textContent = plato;
    pedidoItem.appendChild(cantidadSpan);
    pedidoItem.appendChild(platoP);
    pedidoList.appendChild(pedidoItem);
}

// Función para enviar el pedido
function enviarPedido() {
    const pedidoList = document.getElementById("pedidoList");
    const platosPedido = pedidoList.children;
    let mensaje = "Pedido:\n";
    for (let i = 0; i < platosPedido.length; i++) {
        const cantidad = platosPedido[i].querySelector('span').textContent.trim();
        const plato = platosPedido[i].querySelector('p').textContent.trim();
        mensaje += `${cantidad}x ${plato}\n`;
    }
    mensaje += "\n¿Desea enviar el pedido?";
    if (confirm(mensaje)) {
        mostrarPlatosSeleccionados(platosPedido);

        // Llamar a la función obtenerPedido y almacenar el resultado en una variable
        var pedido = obtenerPedido();

        // Convertir el objeto JSON a una cadena de texto con formato JSON
        var pedidoString = JSON.stringify(pedido, null, 2);

        // Mostrar la cadena de texto con formato JSON en la consola
        console.log(pedidoString);
        enviarPedidoAlServidor();

        
    }
}

// Función para mostrar los platos seleccionados con su cantidad por consola
function mostrarPlatosSeleccionados(platosPedido) {
    const platosSeleccionados = [];
    for (let i = 0; i < platosPedido.length; i++) {
        const cantidad = platosPedido[i].querySelector('span').textContent.trim();
        const plato = platosPedido[i].querySelector('p').textContent.trim();
        platosSeleccionados.push({ plato, cantidad });
    }
    console.log("Platos seleccionados:", platosSeleccionados);
}

function obtenerPedido() {
    const idMesa = document.getElementById("mesaSelect").value;
    const platosSeleccionados = [];
    const pedidoList = document.getElementById("pedidoList");
    const platosPedido = pedidoList.children;

    for (let i = 0; i < platosPedido.length; i++) {
        const cantidad = platosPedido[i].querySelector('span').textContent.trim();
        const plato = platosPedido[i].querySelector('p').textContent.trim();
        platosSeleccionados.push({ plato, cantidad });
    }

    const pedidoJSON = {
        idMesa,
        platosSeleccionados
    };

    return pedidoJSON;
}

function enviarPedidoAlServidor() {
    // Obtener el pedido
    const pedido = obtenerPedido();

    // Opciones de la petición fetch
    const opciones = {
        method: 'POST', // Método de la petición
        headers: {
            'Content-Type': 'application/json' // Tipo de contenido del cuerpo de la petición
        },
        body: JSON.stringify(pedido) // Cuerpo de la petición
    };

    // Hacer la petición fetch
    fetch('http://localhost:8080/restaurante/guardarPedido', opciones)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => console.log(data)) // Mostrar los datos de la respuesta en la consola
        .catch(error => console.error('Error:', error)); // Mostrar el error en la consola si hay uno
}

// Cargar opciones de mesas y tipos de platos al cargar la página
window.onload = function () {
    cargarMesas();
    cargarTiposPlato();
};
