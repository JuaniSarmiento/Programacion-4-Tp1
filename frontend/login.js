document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var usuario = document.getElementById("usuario").value.trim();
    var clave = document.getElementById("clave").value.trim();
    var mensaje = document.getElementById("mensaje");

    if (!usuario || !clave) {
        mensaje.textContent = "Complete ambos campos";
        mensaje.className = "mensaje error";
        return;
    }

    var url = "/tp1/login?usuario=" + encodeURIComponent(usuario) + "&clave=" + encodeURIComponent(clave);

    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data.respuesta === "OK") {
                mensaje.textContent = data.mje;
                mensaje.className = "mensaje ok";
                window.location.href = "/static/lista.html";
            } else {
                mensaje.textContent = data.mje;
                mensaje.className = "mensaje error";
            }
        })
        .catch(function () {
            mensaje.textContent = "Error de conexión con el servidor";
            mensaje.className = "mensaje error";
        });
});
