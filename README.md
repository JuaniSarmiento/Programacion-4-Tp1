# TP1 - Full Stack UTN

Aplicación Full Stack con FastAPI + Vanilla JS para gestión de usuarios.

## Estructura

```
tp1-fullstack/
├── main.py              # Backend FastAPI
├── database.sql         # Script SQL para crear DB y tabla
├── requirements.txt     # Dependencias Python
├── .gitignore
└── frontend/
    ├── login.html       # Página de login
    ├── login.css
    ├── login.js
    ├── lista.html       # Listado de usuarios
    ├── lista.css
    └── lista.js
```

## Instrucciones

### 1. Base de datos

Tener PostgreSQL instalado y ejecutar:

```bash
psql -U postgres -f database.sql
```

> Si tu usuario/contraseña de PostgreSQL es diferente a `postgres/postgres`, editá `DB_CONFIG` en `main.py`.

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Levantar el servidor

```bash
uvicorn main:app --reload --port 8000
```

### 4. Abrir en el navegador

Ir a: [http://localhost:8000](http://localhost:8000)

- Usuario de prueba: `admin` / Clave: `1234`

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tp1/login?usuario=X&clave=Y` | Login |
| GET | `/tp1/lista?action=LISTAR` | Listar todos |
| GET | `/tp1/lista?action=BUSCAR&usuario=X` | Buscar con LIKE |
| POST | `/tp1/bloquear` | Bloquear/Desbloquear (body: `{idUser, estado}`) |
