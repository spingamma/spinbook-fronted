# 🏥 Centro Vida FIVGO - Pantalla de Turnos y Citas

¡Hola! 👋 Bienvenido(a) al manual de uso de la pantalla de citas del Centro Vida FIVGO.

Este proyecto es simplemente el **tablero visual** (como la pantalla que ves en un banco o un aeropuerto) donde se muestran los turnos, los pacientes y los estados de cada cita médica en la clínica.

Cualquier persona del equipo puede hacerlo funcionar siguiendo estos sencillos pasos. ¡No necesitas ser una persona experta en computadoras para encenderlo! 👇

---

## 🚀 ¿Cómo poner a funcionar la pantalla en mi computadora?

Solo tienes que seguir estos 3 pasos:

### 1️⃣ Preparar el terreno (Solo se hace la primera vez)
Para que este tablero funcione, la computadora necesita tener instalado un programa gratuito llamado **Node.js**.
- Entra a [nodejs.org](https://nodejs.org/) y descarga la opción que dice "LTS" (Recomendado para la mayoría de usuarios).
- Instálalo como cualquier otro programa (presionando continuar, continuar, finalizar).

### 2️⃣ Preparar los archivos (Solo se hace la primera vez)
- Ve a la carpeta donde guardaste este proyecto (la carpeta principal).
- Abre una **Terminal** o **Consola de comandos** en esta carpeta. *(En Windows: puedes escribir "cmd" en la barra de direcciones de la carpeta y presionar Enter)*.
- Escribe el siguiente comando y presiona `Enter`:
  ```bash
  npm install
  ```
  *(Dale unos segundos. Esto descargará automáticamente las piezas necesarias para que todo funcione).*

### 3️⃣ ¡Encender la pantalla! 🌟 (Esto se hace cada vez que quieras usarlo)
- En la misma ventana negra (Terminal) de antes, escribe:
  ```bash
  npm run dev
  ```
  y presiona `Enter`.
- Abre tu navegador favorito (Chrome, Edge, Safari, etc.).
- En la barra de arriba (donde van las páginas web), escribe: **http://localhost:5173** y presiona Enter.
- ¡Listo! 🎉 Ya deberías ver el panel de citas funcionando en tu pantalla.

---

## 📱 ¿Quieres mostrar el panel en una Tablet o Televisor inteligente?

Si tienes una tablet en el escritorio o un televisor en la sala de espera que está **conectado al mismo Wi-Fi** que tu computadora principal, puedes mostrar el panel allí muy fácilmente:

1. En tu computadora principal, en lugar del comando del paso 3, usa este para encender el panel y "compartir" la señal:
   ```bash
   npm run dev -- --host
   ```
2. En la ventana negra, aparecerá un mensaje con una dirección que dice **"Network:"** (se verá algo así como `http://192.168.X.X:5173/`).
3. Toma la tablet o ve al televisor, abre el navegador de internet que tenga y **escribe exactamente esa dirección**.
4. ¡El tablero aparecerá mágicamente en la otra pantalla! ✨

---

## 🎨 Los Colores de la Clínica

La pantalla ya está configurada con los colores oficiales de Centro Vida FIVGO para que la experiencia sea familiar y se vea perfecta:
- 🔵 **Cian (Azul claro):** Se usa para los títulos y avisa cuando un paciente está **"En Consulta"**.
- 🟠 **Naranja FIVGO:** Le da vida a la pantalla y resalta cuando un paciente está **"En Espera"**.
- 🟣 **Violeta:** Se usa para detalles visuales y citas en estado **"Pendiente"**.

*(Si en el futuro necesitan cambiar algún color o logotipo, coméntaselo a los chicos de sistemas, es muy fácil de ajustar para ellos).*

---
*Si tienes alguna duda o la pantalla no enciende, no te preocupes, cierra la ventana negra y vuelve a intentar el **Paso 3**. Si el problema persiste, contacta a soporte técnico.* 😊