# Verificación de arquitectura independiente

La aplicación de blefaroplastia se ejecuta desde el directorio autónomo `/home/ubuntu/blefaroplastia-landing` y se previsualiza en la raíz de su propio servidor. La landing pública de rinoplastia permanece en su aplicación original y la ruta pública `rinoplastia.rhinoandface.com/blefaroplastia` no debe utilizarse.

El formulario de blefaroplastia utiliza la tabla `blepharoplasty_leads` y el contenido se obtiene del documento Sanity `blefaroplastiaLanding`, separado de la configuración de rinoplastia.
