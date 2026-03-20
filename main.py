from fastapi import FastAPI, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import psycopg2
import psycopg2.extras

app = FastAPI()

# CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Conexión a PostgreSQL ---

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "database": os.getenv("DB_NAME", "utn_db"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres"),
    "port": int(os.getenv("DB_PORT", "5432")),
}


def get_connection():
    return psycopg2.connect(**DB_CONFIG)


# --- Rutas de la API ---


@app.get("/tp1/login")
def login(usuario: str = Query(...), clave: str = Query(...)):
    """Login por Query String. Devuelve JSON con respuesta OK o ERROR."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute(
            "SELECT * FROM usuarios_utn WHERE usuario = %s AND clave = %s",
            (usuario, clave),
        )
        row = cur.fetchone()
        if row:
            if row["bloqueado"] == "Y":
                return {"respuesta": "ERROR", "mje": "Usuario bloqueado"}
            return {"respuesta": "OK", "mje": "Bienvenido"}
        return {"respuesta": "ERROR", "mje": "Usuario o clave incorrectos"}
    finally:
        cur.close()
        conn.close()


@app.get("/tp1/lista")
def lista(action: str = Query("LISTAR"), usuario: str = Query("")):
    """
    Listado y búsqueda de usuarios.
    action=LISTAR  -> devuelve todos
    action=BUSCAR&usuario=texto -> filtra con LIKE
    """
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        if action == "BUSCAR" and usuario:
            cur.execute(
                "SELECT id, usuario, apellido, nombre, bloqueado "
                "FROM usuarios_utn WHERE usuario LIKE %s ORDER BY id",
                (f"%{usuario}%",),
            )
        else:
            cur.execute(
                "SELECT id, usuario, apellido, nombre, bloqueado "
                "FROM usuarios_utn ORDER BY id"
            )
        rows = cur.fetchall()
        usuarios = [
            {
                "id": r["id"],
                "usuario": r["usuario"],
                "apellido": r["apellido"],
                "nombre": r["nombre"],
                "bloqueado": r["bloqueado"],
            }
            for r in rows
        ]
        return {"respuesta": "OK", "usuarios": usuarios}
    finally:
        cur.close()
        conn.close()


@app.post("/tp1/bloquear")
def bloquear(data: dict = Body(...)):
    """
    Bloquear o desbloquear usuario.
    Body JSON: { "idUser": 1, "estado": "Y" | "N" }
    """
    id_user = data.get("idUser")
    estado = data.get("estado")

    if not id_user or not isinstance(id_user, int):
        return {"respuesta": "ERROR", "mje": "ID de usuario inválido"}
    if estado not in ("Y", "N"):
        return {"respuesta": "ERROR", "mje": "Estado inválido"}

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE usuarios_utn SET bloqueado = %s WHERE id = %s",
            (estado, id_user),
        )
        conn.commit()
        if cur.rowcount == 0:
            return {"respuesta": "ERROR", "mje": "Usuario no encontrado"}
        accion = "bloqueado" if estado == "Y" else "desbloqueado"
        return {"respuesta": "OK", "mje": f"Usuario {accion} correctamente"}
    finally:
        cur.close()
        conn.close()


# --- Servir archivos estáticos del frontend ---

app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
def root():
    return FileResponse("frontend/login.html")
