# Corrección de visibilidad de galería

La carga inicial de la aplicación renderizaba la página antes de recibir el documento CMS. Los bloques de la galería se montaban después y quedaban con la clase de animación inicial, sin que el `IntersectionObserver` los registrara.

El observador ahora se vuelve a crear cuando llega el contenido CMS. La respuesta actual contiene tres imágenes de galería con URL propia.

La verificación posterior al desplazamiento confirma que los bloques de contenido, inicialmente ocultos por la animación, recuperan su visibilidad al entrar en el viewport.

La comprobación visual directa de la sección `Casos reales` confirma que las tres imágenes de galería se muestran correctamente.
