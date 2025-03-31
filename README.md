
# Reto Konecta - Front-End React

## Breve Descripción

Este proyecto fue desarrollado para el reto de Konecta. La aplicación presenta una pantalla de inicio de sesión donde se requiere ingresar las credenciales de correo electrónico y contraseña, junto con la verificación de un Hcaptcha. Para acceder al sistema, es necesario estar registrado previamente; de lo contrario, no será posible iniciar sesión, ya que el usuario no será encontrado en la base de datos.

El sistema implementa la validación mediante tokens JWT, los cuales se generan al iniciar sesión y se utilizan para autorizar cualquier otra acción dentro de la plataforma.

El proyecto está dividido en dos módulos principales: "Gestión de Usuarios" y "Radicar Venta". La visibilidad de cada módulo dependerá del perfil asignado al usuario durante el registro.

Toda la información persistente se almacena en una base de datos PostgreSQL.

## Versiones

* **Node.js:** 20.11.1
* **react-dom:** 19.0.0
* **react-router-dom:** 7.4.0
* **@mui/icons-material:** 7.0.0
* **jwt-decode:** 4.0.0
* **@hcaptcha/react-hcaptcha:** 1.12.0

## Pasos para ejecutar el proyecto

1.  **Descarga el proyecto:** Clona o descarga el repositorio en una carpeta local llamada `app`.
2.  **Navega a la carpeta del proyecto:** Abre tu terminal y dirígete a la carpeta `app` donde se encuentra el proyecto.
3.  **Instala las dependencias:** Ejecuta el siguiente comando para instalar todas las dependencias listadas en el archivo `package.json`:

    ```bash
    npm install
    ```

    Espera a que el proceso de instalación finalice.
4.  **Ejecuta el proyecto:** Una vez que las dependencias estén instaladas, ejecuta el siguiente comando para iniciar el servidor de desarrollo:

    ```bash
    npm start
    ```

    Después de unos momentos, el proyecto se abrirá automáticamente en tu navegador web en la dirección `http://localhost:3000`.

## Consideraciones Adicionales

* Asegúrate de tener Node.js y npm instalados en tu sistema antes de ejecutar los comandos anteriores.
* Si el proyecto no se abre automáticamente en tu navegador, puedes acceder manualmente a él a través de `http://localhost:3000`.
* Para que el proyecto funcione correctamente, es necesario tener una base de datos PostgreSQL configurada y accesible para la aplicación.
* Cualquier duda o inconveniente por favor comunicarla.


### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
