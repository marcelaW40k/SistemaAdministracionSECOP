
# Sistema de Administración SECOP / CC2026

Prueba técnica para la vacante de desarrollador backend. Es un sistema web para
ver, crear, editar y eliminar información de dos hojas de datos (SECOP y CC2026),
con login y diferentes permisos según el usuario.

**Lo que usé:** Java con Spring Boot para el backend, React para el frontend,
MySQL para la base de datos, y JWT para el tema de login y roles.

---

## Cómo correr el proyecto

### Lo que necesitas tener instalado
- Java 17
- Node.js
- MySQL

### 1. Base de datos
Con MySQL Workbench, corre en este orden los scripts que están en la carpeta `database/`:
1. `01_crear_esquema.sql` (crea la base y las tablas)
2. Importar los datos ya limpios que están en `data/` (secop_limpio.csv y cc2026_limpio.csv)
3. `02_crear_usuarios.sql` (crea la tabla de usuarios con 3 usuarios de prueba)

### 2. Backend
```bash
cd backend
```
Antes de correrlo, hay que abrir `src/main/resources/application.properties` y
poner ahí tu contraseña real de MySQL. Luego:
```bash
mvn spring-boot:run
```
Queda corriendo en `http://localhost:8080`. Se puede ver y probar todos los
endpoints desde `http://localhost:8080/swagger-ui.html` (usé Swagger para
documentar la API, así no toca usar Postman para todo).

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Queda en `http://localhost:5173`.

### Usuarios para probar
| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | Administrador |
| digitador1 | digitador123 | Digitador |
| consulta1 | consulta123 | Consulta |

---

## Cómo está organizado el proyecto

```
backend/    -> la API en Spring Boot
frontend/   -> la parte visual en React
database/   -> los scripts SQL para crear las tablas
data/       -> los csv ya limpios y el script que usé para limpiarlos
```

Dentro del backend traté de separar las cosas por carpetas según qué hacen:
- `model` → las clases que representan las tablas (Secop, Cc2026, Usuario)
- `repository` → para hablar con la base de datos
- `controller` → los endpoints que expone la API
- `security` → todo lo del JWT (generar el token, validarlo, etc.)
- `config` → la configuración de seguridad y de Swagger

---

## Cómo limpié los datos

El Excel que me dieron tenía dos hojas: SECOP y CC2026. Tenían columnas vacías
y algunas filas que en realidad no eran datos válidos (eran restos de la
paginación de la página web de donde sacaron la info original — cosas como
filas con solo el número "1", "2", "3"... en vez de un dato real).

**Con Power Query:**  usando las herramientas que trae Excel
para esto — tiene una vista que te muestra el % de datos vacíos por columna sin
tener que escribir fórmulas, y cada paso que uno hace queda guardado en una
lista, lo cual sirve como si fuera la documentación del proceso.

```
Text.Remove(Text.From([Referencia]), {"0".."9"}) = ""
```

Lo que hace es quitarle a la Referencia todos los dígitos del 0 al 9. Si
después de quitarlos no queda nada (`= ""`), quiere decir que ese valor era
puro número (como "1", "2", "23"...), o sea que es una fila de paginación y
hay que botarla. Si queda algo (letras, guiones, puntos), es una referencia
real y se conserva — por ejemplo "ACODER-CDCI-333-2026" después de quitarle
los números queda como "ACODER-CDCI--", que no es vacío, entonces esa fila se
mantiene. Esta columna me devuelve `TRUE`/`FALSE`, y con eso filtro cuáles
filas eliminar

 **Eliminación de Columnas:** Se removieron las columnas `Providencias` (100% nula) y `Novedad` .

Al final me quedó así:

| Hoja | Filas antes | Filas después 
|---|---|---|
| SECOP | 190 | 151 | 
| CC2026 | 548 | 548 |


---


