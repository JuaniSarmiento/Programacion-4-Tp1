var mensaje = document.getElementById("mensajeLista");

// Cargar lista al abrir la página
cargarUsuarios("LISTAR", "");

document.getElementById("btnBuscar").addEventListener("click", function () {
    var texto = document.getElementById("txtBuscar").value.trim();
    if (!texto) {
        mensaje.textContent = "Ingrese un texto para buscar";
        return;
    }
    cargarUsuarios("BUSCAR", texto);
});

document.getElementById("btnLimpiar").addEventListener("click", function () {
    document.getElementById("txtBuscar").value = "";
    mensaje.textContent = "";
    cargarUsuarios("LISTAR", "");
});

// Buscar al presionar Enter
document.getElementById("txtBuscar").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        document.getElementById("btnBuscar").click();
    }
});

function cargarUsuarios(action, usuario) {
    var url = "/tp1/lista?action=" + encodeURIComponent(action);
    if (usuario) {
        url += "&usuario=" + encodeURIComponent(usuario);
    }

    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data.respuesta === "OK") {
                renderTabla(data.usuarios);
                mensaje.textContent = "";
            } else {
                mensaje.textContent = "Error al cargar usuarios";
            }
        })
        .catch(function () {
            mensaje.textContent = "Error de conexión con el servidor";
        });
}

function renderTabla(usuarios) {
    var tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = "";

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron usuarios</td></tr>';
        return;
    }

    for (var i = 0; i < usuarios.length; i++) {
        var u = usuarios[i];
        var tr = document.createElement("tr");
        tr.className = u.bloqueado === "Y" ? "bloqueado" : "activo";

        tr.innerHTML =
            "<td>" + u.id + "</td>" +
            "<td>" + escapeHtml(u.usuario) + "</td>" +
            "<td>" + escapeHtml(u.apellido) + "</td>" +
            "<td>" + escapeHtml(u.nombre) + "</td>" +
            "<td>" + (u.bloqueado === "Y" ? "Sí" : "No") + "</td>" +
            '<td>' +
                '<button class="btn-accion btn-bloquear" data-id="' + u.id + '" data-estado="Y">Bloquear</button>' +
                '<button class="btn-accion btn-desbloquear" data-id="' + u.id + '" data-estado="N">Desbloquear</button>' +
            '</td>';

        tbody.appendChild(tr);
    }

    // Asignar eventos a los botones
    var botones = tbody.querySelectorAll(".btn-accion");
    for (var j = 0; j < botones.length; j++) {
        botones[j].addEventListener("click", function () {
            var idUser = parseInt(this.getAttribute("data-id"));
            var estado = this.getAttribute("data-estado");
            cambiarEstado(idUser, estado);
        });
    }
}

function cambiarEstado(idUser, estado) {
    fetch("/tp1/bloquear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser: idUser, estado: estado })
    })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            mensaje.textContent = data.mje;
            if (data.respuesta === "OK") {
                // Recargar la tabla
                var txtBuscar = document.getElementById("txtBuscar").value.trim();
                if (txtBuscar) {
                    cargarUsuarios("BUSCAR", txtBuscar);
                } else {
                    cargarUsuarios("LISTAR", "");
                }
            }
        })
        .catch(function () {
            mensaje.textContent = "Error de conexión con el servidor";
        });
}

function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
