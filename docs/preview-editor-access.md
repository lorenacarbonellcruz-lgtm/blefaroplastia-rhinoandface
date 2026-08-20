# Acceso temporal de edición

La autenticación OAuth no funciona en el dominio temporal de previsualización. Se ha habilitado un enlace de edición firmado, limitado al entorno de desarrollo y con caducidad de 24 horas.

La comprobación de la ruta temporal confirma que el panel carga los cinco controles de sustitución de imágenes: hero, retrato del especialista y tres imágenes de galería.

La ruta estable `/admin` muestra una pantalla de acceso por código sin depender de OAuth ni de parámetros en la URL.

La prueba completa del código estable abre el panel y muestra los cinco controles de sustitución de imágenes.
