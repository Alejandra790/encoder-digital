# Encoder Digital Interactivo

Página web educativa e interactiva sobre el **encoder (codificador digital)**, desarrollada para la materia de Arquitectura y Organización de Computadoras.

El proyecto usa como modelo didáctico un **encoder de prioridad de 4 entradas (E0–E3) y 2 salidas (S1, S0)** con una señal de validez **V**. Si la asignatura define el encoder de otra forma, el proyecto debe ajustarse a esa definición.

## Contenido

- Explicación del concepto, funcionamiento, entradas/salidas, aplicaciones, ventajas y limitaciones.
- **Simulador interactivo** con interruptores E0–E3, salidas S1, S0 y V, diagrama animado y explicación automática.
- **Tabla de verdad** de las 16 combinaciones (prioridad E3 > E2 > E1 > E0), con filas de entradas múltiples resaltadas.

## Lógica implementada

| Condición | S1 S0 | V |
|-----------|-------|---|
| E3 = 1 | 11 | 1 |
| E3 = 0, E2 = 1 | 10 | 1 |
| E3 = E2 = 0, E1 = 1 | 01 | 1 |
| E3 = E2 = E1 = 0, E0 = 1 | 00 | 1 |
| Ninguna entrada activa | (sin significado) | 0 |

## Archivos

- `index.html` — estructura
- `styles.css` — diseño con paleta pastel
- `script.js` — lógica, simulador y tabla de verdad
- `README.md` — este archivo

No requiere servidor, base de datos, frameworks ni conexión a Internet.

## Ejecutar localmente (Windows)

1. Guarda los cuatro archivos en una misma carpeta (por ejemplo `C:\Proyectos\encoder`).
2. Haz doble clic en `index.html`. Se abrirá en tu navegador.

## Publicar en GitHub Pages

1. Crea una cuenta en https://github.com y un repositorio público nuevo (por ejemplo `encoder-digital`).
2. Sube los cuatro archivos (botón **Add file → Upload files**) y confirma con **Commit changes**.
3. Ve a **Settings → Pages**. En *Build and deployment*, elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`, y guarda.
4. Espera uno o dos minutos. GitHub mostrará en esa misma pantalla el enlace de tu sitio, normalmente con el formato `https://TU-USUARIO.github.io/encoder-digital/`.
5. Abre el enlace en otro dispositivo para comprobar que funciona.
