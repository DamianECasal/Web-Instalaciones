/**
 * Inicializa buscadores para tarjetas con clase .manual-item.
 */
function initManualSearch() {
    const searchInput = document.getElementById('manualSearch');
    const items = Array.from(document.querySelectorAll('.manual-item'));

    if (!searchInput || !items.length) {
        return;
    }

    searchInput.addEventListener('input', (event) => {
        const text = event.target.value.toLowerCase();
        const activeFilter = document.querySelector('[data-filter-value].is-active')?.dataset.filterValue ||
            document.querySelector('[data-filter-value]:checked')?.dataset.filterValue ||
            'all';

        applyManualFilters(items, text, activeFilter);
    });

    const filterInputs = document.querySelectorAll('[data-filter-value]');
    filterInputs.forEach((input) => {
        input.addEventListener('change', () => {
            const filterValue = input.dataset.filterValue || 'all';
            applyManualFilters(items, searchInput.value.toLowerCase(), filterValue);
        });
    });
}

/**
 * Aplica filtros por texto y categoría sobre tarjetas de manuales.
 */
function applyManualFilters(items, text, category) {
    items.forEach((item) => {
        const title = item.querySelector('h5')?.innerText.toLowerCase() || '';
        const desc = item.querySelector('p')?.innerText.toLowerCase() || '';
        const itemCategory = item.getAttribute('data-category') || 'all';

        const matchesText = !text || title.includes(text) || desc.includes(text);
        const matchesCategory = category === 'all' || itemCategory === category;

        item.style.display = matchesText && matchesCategory ? 'block' : 'none';
    });
}

/**
 * Inicializa modal de imagen reutilizable para guías con data-img-src.
 */
function initImageModal() {
    const imgModal = document.getElementById('imgModal');
    const modalImage = document.getElementById('modalImage');

    if (!imgModal || !modalImage) {
        return;
    }

    imgModal.addEventListener('show.bs.modal', (event) => {
        const trigger = event.relatedTarget;
        const src = trigger?.getAttribute('data-img-src');
        if (src) {
            modalImage.src = src;
        }
    });
}

/**
 * Inicializa modal de video para tutoriales OFSC.
 */
function initVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    const modalTitle = document.getElementById('videoModalLabel');

    if (!videoModal || !videoIframe || !modalTitle) {
        return;
    }

    videoModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const videoUrl = button?.getAttribute('data-video') || '';
        const cardTitle = button?.parentElement?.querySelector('h5')?.innerText || 'Guía Instructiva';

        modalTitle.innerHTML = `<i class="fas fa-play-circle me-2"></i> ${cardTitle}`;
        videoIframe.src = videoUrl;
    });

    videoModal.addEventListener('hide.bs.modal', () => {
        videoIframe.src = '';
    });
}

/**
 * Inicializa botones de copiado en scripts operativos.
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy-target]');
    if (!copyButtons.length) {
        return;
    }

    copyButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const targetId = button.dataset.copyTarget;
            const target = document.getElementById(targetId);
            if (!target) {
                return;
            }

            try {
                await navigator.clipboard.writeText(target.innerText);
                const originalText = button.innerText;
                button.innerText = 'COPIADO!';
                button.classList.add('bg-success', 'text-white');
                setTimeout(() => {
                    button.innerText = originalText;
                    button.classList.remove('bg-success', 'text-white');
                }, 2000);
            } catch {
                alert('No se pudo copiar el texto.');
            }
        });
    });
}

/**
 * Inicializa navegación atrás para botones declarativos.
 */
function initBackButtons() {
    document.querySelectorAll('[data-go-back]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            window.history.back();
        });
    });
}

const motives = [
        {
            id: 1,
            title: "Adecuación",
            type: "no-realizada",
            desc:  ["Caja en mal estado.", "Mal ubicada (supera altura máxima).", 
                    "Pasivas dañadas.", "Ramas cruzadas."],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Panorámica de fachada con linderos.","Utilizar las 7 imágenes restantes que nos permite cargar la herramienta (TOA), donde se visualice la problemática",
                    "Detalle de problemática (puerto roto, caja colgando, etc)."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema y acrónimo del splitter."]
        },
        {
            id: 2,
            title: "Actividad Iniciada por Error",
            type: "no-realizada",
            desc: ["Cuando existe un error en el reordenamiento de la ruta y el tecnico inicia una actividad erronea."],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],            
            photos: ["Frente de domicilio con aviso pegado."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["No Aplica"]
        },
        {
            id: 3,
            title: "Cañerías Obstruidas Cliente",
            type: "no-realizada",
            desc: ["Las cañerías dentro del domicilio del cliente están obstruidas lo que no permite el pase de la fibra o el cableado de UTP."],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos:["Foto donde se observe la cañería obstruida.",
                    "Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Cañerías obstruidas cliente."]
        },
        {
            id: 4,
            title: "Cliente Ausente",
            type: "no-realizada",
            desc:  ["Cliente no se encuentra en el domicilio sin respuesta previa llamada del proceso precontacto y confirmación con MDD."],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos."],
            stock: "No se NO se debe dejar materiales provisionados ni descargar materiales.",
            notes: ["Cliente ausente."]
        },
        {
            id: 5,
            title: "Cliente no cuenta con Permisos/Accesos",
            type: "no-realizada",
            desc:  ["Cliente no cuenta con permisos o acceso a un lugar especifico para instalar el servicio:",
                    "Sin permisos de la administración/propietario.","Ausencia del encargado.","Sin permisos linderos.",
                    "Sin acceso terraza/subsuelo.","Sitio en construcción/obra."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos.", 
                    "Foto del sitio en obra/construcción (Si corresponde)."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema, si el problema surge a raíz de no tener acceso a la caja (motivos varios), falta de permisos de la administración, encargado ausente, entre otros."]
        },
        {
            id: 6,
            title: "Domicilio Erróneo",
            type: "no-realizada",
            desc:  ["En caso de que la orden pertenezca al segmento Pymes: Reportar con mesa de despacho correspondiente ya que por proceso no permite la modificación en linea.",
                    "En caso de que la orden pertenezca al segmento Residencial: Reportar con mesa de despacho correspondiente ya que si el domicilio real se encuentra mayor a 1km no sepuede realizar la modificación de la misma en linea.",
                    "En caso que se valide que el domicilio real se encuentre con cobertura y menor a 1km se deberá ir a sitio"],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos",
                     "Utilizar las 7 imágenes restantes que nos permite cargar la herramienta (TOA), donde se visualice la problemática."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Detallar la ubicación real del domicilio del cliente y sus entre calles."]
        },
        {
            id: 7,
            title: "Domicilio reportado por fraude",
            type: "no-realizada",
            desc:  ["Se utiliza cuando el cliente pertenece al segmento Residencial: Varios servicios solicitados que se encuentran activos", 
                    "caídos y/o pendientes sobre la mismanumeración y/o titular.", 
                    "Se valida varias fibras ingresando al domicilio.", 
                    "Se visualiza varios equipos seriados (ONT/STB) de Claro sin utilización",
                    "Se visualiza antena repetidora."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // / 0800-122-6565 opcion 2 en caso de detectarlo antes de avanzar con la instalación"],
            photos: ["Captura de falta de señal en Link Home."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema, incluyendo todos los datos e información recaudada."]
        },
        {
            id: 8,
            title: "Edificio No Acometido",
            type: "no-realizada",
            desc: ["Domicilio en complejo de viviendas/oficinas/locales/PH bajo la misma numeración de hasta 3 pisos (sin contar PB) y/o 8 o mas UF, que no cuente con splitter propio para continuar con la instalación. Ejemplos:",
                    "Torre/Ala sin caja interna", 
                    "Error cartográfico", 
                    "Toma cobertura de edificio lindero o caja no habilitada."],
            steps: ["Reportarlo con la mesa de despacho correspondiente según el segmento:",
                    "Pymes: *617 // 0800-122-1617",
                    "Residencial: *6565 // 0800-122-6565 opción 1"],
            photos: ["Foto panorámica de la fachada del edificio/torre del cliente.",
                    "Foto del portero eléctrico (si corresponde).",
                    "Foto de medidor electricidad (si corresponde)."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Especificar la cantidad de unidades funcionales.",
                    "Especificar torre o ala sin acometer (si corresponde).",
                    "Aclarar en caso de tomar cobertura lindera (El domicilio correcto)."]
        },
        {
            id: 9,
            title: "Estética en la instalación",
            type: "no-realizada",
            desc: ["Cliente no acepta la instalación del servicio por cuestiones estéticas en su domicilio.",
                    "No está de acuerdo con el color del cable.",
                    "No desea nuevas perforaciones.",
                    "No quiere el servicio cableado."],
            steps: ["Reportarlo con la mesa de despacho correspondiente según el segmento de la actividad:",
                    "Pymes: *617 // 0800-122-1617",
                    "Residencial: *6565 // 0800-122-6565 opcion 2"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Dejar asentado el motivo estético por el cual rechaza el cliente la instalación."]
        },
        {
            id: 10,
            title: "Falta caja en la cuadra",
            type: "no-realizada",
            desc: ["Se requiere una caja mas cercana al domicilio para llegar con el metraje del cableado y donde falte el splitter físicamente siendo que el mismo figura en gestor Portalgis/Web cobertura:",
                    " En caso robo.",
                    "Ubicación errónea de la caja en Portalgis/Web de cobertura.",
                    "Previa consulta en gestor Portalgis/Web de cobertura con despacho de la contratista."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617",
                    "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos.",
                    "Utilizar las 7 imágenes restantes que nos permite cargar la herramienta (TOA), donde se visualice la problemática."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema."]
        },
        {
            id: 11,
            title: "Falta Poste de Apoyo",
            type: "no-realizada",
            desc: ["Se utiliza solo cuando hay faltante de poste/s de apoyo/s disponible para picar el cable drop."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
           photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos.",
                    "Utilizar las 7 imágenes restantes que nos permite cargar la herramienta (TOA), donde se visualice la problemática."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Informar ubicación/dirección donde se encontraría el faltante del poste."]
        },
        {
            id: 12,
            title: "Montante Obstruida",
            type: "no-realizada",
            desc: ["Se deberá utilizar el motivo donde no se pueda realizar la instalación por encontrarnos con cañerías obstruidas/saturadas/rotas o con faltantes de las mismas que van desde el splitter hasta la puerta del departamento/domicilio del cliente."],
            steps: ["Reportar a mesa de despacho según segmento.",
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 2"],
            photos: ["Foto panorámica de la fachada del edificio/torre del cliente.",
                     "Utilizar las 7 imágenes restantes que nos permite cargar la herramienta (TOA), donde se visualice la problemática"],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema, especificar en que parte del recorrido se encuentra la obstrucción."]
        },
        {
            id: 13,
            title: "No Filtra Orden en SGT",
            type: "no-realizada",
            desc: ["Se utiliza cuando la orden a trabajar no filtra en sgt y soporte no puede solucionarlo en el momento (no se debe instalar).",
                    "Utilizar únicamente para OTs que no filtran en SGT."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos:["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["No filtra la orden en SGT, por lo que no se puede avanzar con la misma."]
        },
        {
            id: 14,
            title: "Poste en mal estado",
            type: "no-realizada",
            desc: ["El poste del splitter o poste de apoyo se encuentra en malas condiciones y no existe otra alternativa de cableado."],
            steps:["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos:["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos.",
                    "En la imagen debe identificarse splitter, tendido y fachada donde esta ubicado (según corresponda)",
                    "Foto en diagonal para sumar referencia de ubicación."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Indicar la altura real o mas cercana del poste reclamado.",
                    "Para los casos en donde estén varios postes juntos, resaltar el reportado.",
                    "Especificar si el problema corresponde a poste del splitter o poste de apoyo.",
                    "Detallar a que empresa corresponde el poste reportado."]
        },
        {
            id: 15,
            title: "Puerto de red mal asignado",
            type: "no-realizada",
            desc: ["Se utiliza cuando la caja asignada en la orden de trabajo no se encuentra en el polígono del domicilio del cliente (Motivo utilizado únicamente en la red de UFINET)."],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos.",
                    "Foto de la CTO."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Indicar donde se ubica físicamente la CTO mal asignada (altura y entre calles).",
                    "Indicar donde se ubica físicamente la CTO correspondiente al domicilio del cliente (altura y entre calles)."]
        },
        {
            id: 16,
            title: "Rechaza Oferta Comercial",
            type: "no-realizada",
            desc: ["El cliente rechaza el plan comercial que figura en la orden:",
                    "Sobreventa en un domicilio con servicio activo.",
                    "Cliente desiste por desinterés.",
                    "Cliente desiste por demora en la visita",
                    "Nunca solicito servicio.",
                    "Mejor oferta comercial de la competencia.",
                    "Plan erróneo/error de carga en componente Ejemplo: (Solicito 2play y le cargaron 3play).",
                    "Desiste por no estar conforme con las normas de instalación",
                    "Falta de información (Ejemplo: precio/dia de visita).",
                    "Sin portabilidad (Utilizar únicamente en segmento Pymes).",
                    "No desea adquirir un AP."],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Captura de falta de señal en Link Home."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema."]
        },
        {
            id: 17,
            title: "Recoordinar a Pedido de la Contratista",
            type: "no-realizada",
            desc: ["Se debe solicitar al Analista (Referente de la plaza) para su utilizacion:",
                    "Se solicitara unicamente cuando la contratista, no pueda/logre asumir las tareas asignadas debido a las ausencias de los tecnios"],
            steps: ["NO se debe llamar a Mesa de Despacho"],
            photos: ["No Aplica"],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["No Aplica"]
        },
                {
            id: 18,
            title: "Referente Se Retira durante la Instalación",
            type: "no-realizada",
            desc: ["Cliente/Referente nos informa en sitio que se debe retirar y no puede esperar a que finalicemos la instalación.",
                   "¡Este cierre se utiliza únicamente cuando eltécnico realizo alguna tarea en el domicilio!. Ej: ingreso de FO"],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Captura de falta de señal en Link Home."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["El cliente no puede aguardar a finalizar la tarea, se debe retirar."]
        },
        {
            id: 19,
            title: "Sin capacidad",
            type: "no-realizada",
            desc: ["Previa verificación con las herramientas (ORION-SGT MOBILE) nos encontramos con los splitters de la cuadra llenos (sin pasivas disponibles)."],
            steps:["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos.",
                    "Utilizar las 7 imágenes restantes que nos permite cargar la herramienta (TOA), donde se visualice la problemática."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema."]
        },
        {
            id: 20,
            title: "Sin energía eléctrica",
            type: "no-realizada",
            desc: ["No se puede realizar la instalación porque el cliente no cuenta con suministro eléctrico para iniciar la tarea o finalizar la misma."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción detallada del problema."]
        },
        {
            id: 21,
            title: "Sin Potencia / Mala Potencia",
            type: "no-realizada",
            desc: ["El splitter no se encuentra dentro del rango de potencia establecidos para instalar (según la plaza) y el cliente no quiere que le instalemos el servicio.",
                    "En caso de ser necesario, validar rango de potencia con el ing. de campo"],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["En la foto se debe visualizar la medición en la que sea vea la longitud de onda (1490 nm), el acrónimo de la caja y el patchcord conectado al puerto correspondiente.",
                     "En caso de poseer mas de una pasiva disponible realizar la medición en las misma (Exceptuando red UFINET)."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["El cliente desiste de la instalación por no aceptar el servicio en dichas condiciones."]
        },
        {
            id: 22,
            title: "Zona Peligrosa",
            type: "no-realizada",
            desc: ["Se utiliza cuando se ve involucrada la integridad física del técnico:",
                    "Intento de robo",
                    "Amenazas.",
                    "Disturbios ajenos. Ejemplo: Manifestaciones."],
            steps: ["Reportar a mesa de despacho según segmento:", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Foto panorámica de la fachada del domicilio del cliente, donde se observen sus linderos. (En caso de que sea factible)."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Descripción de la situación ocurrida."]
        },
        {
            id: 23,
            title: "Averia Masiva",
            type: "no-realizada",
            desc: ["Se utiliza este motivo cuando Claro valida que hay una averia masiva sobre alguna de sus herramientas que impida continuar con las actividades. (No se debe instalar, visualizacion solo dispatcher)"],
            steps: ["Mediante el aviso del analista al disptacher de la contratista se deberá interrumpir estas tareas bajo este motivo."],
            photos: ["No aplica."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Template de ejemplo: [Avería masiva - TOA MOBILE]"]
        },
        {
            id: 24,
            title: "Recoordinar por Falta de Stock",
            type: "no-realizada",
            desc: ["Cuando no cuentan con materiales para realizar la instalación."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["No aplica."],
            stock: "NO se debe dejar materiales provisionados, NO se debe instalar NI descargar materiales.",
            notes: ["Especificar el material faltante."]
        },
        {
            id: 25,
            title: "Instalación Exitosa",
            type: "realizada",
            desc: ["Solo cuando el servicio se encuentra probado y funcionando correctamente luego de la conformidad del cliente."],
            steps: ["Cerrar la orden sin la necesidad de llamar a la mesa."],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Instalación realizada con éxito."]
        },
        {
            id: 26,
            title: "A la espera de Rta. Sistemas TV",
            type: "realizada",
            desc: ["El servicio se encuentra instalado pero presenta problemas en funcionamiento de STB",
                    "Grilla de canal",
                    "Pantalla en negro/logo de claro",
                    "Control remoto"],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Detallar el inconveniente que presenta el servicio."]
        },
        {
            id: 27,
            title: "A la espera de Rta. Sistemas",
            type: "realizada",
            desc: ["Problemas en algún gestor o servidor de Claro por el cual no quedaría funcionando los servicios correctamente."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Detallar el inconveniente que presenta el servicio."]
        },
        {
            id: 28,
            title: "Cl Instalado No Operativo",
            type: "realizada",
            desc: ["Instalación realizada con potencia nula o degradada por parte de la CTO."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter: (En la foto se debe visualizar la medición en la que sea vea la longitud de onda (1490 nm), el acrónimo de la caja y el patchcord conectado al puerto correspondiente. En caso de poseer mas de una pasiva disponible realizar la medición en las misma (Exceptuando red UFINET)",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Detallar el inconveniente que presenta el servicio."]
        },
        {
            id: 29,
            title: "Problema Provisión",
            type: "realizada",
            desc: ["Se realizo la provisión del servicio en SGT pero da error en alguno de los checks/flags, y el servicio no funciona correctamente."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Detallar el inconveniente que presenta el servicio."]
        },
        {
            id: 30,
            title: "Problema Telefonía",
            type: "realizada",
            desc: ["Se realizo la provisión del servicio en SGT pero se verifican problemas solo en la parte de telefonía del servicio:",
                    "Sin tono de marcado",
                    "No se puede realizar llamadas salientes/entrantes"],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Detallar el inconveniente que presenta el servicio"]
        },
        {
            id: 31,
            title: "Posible Fraude Instalado",
            type: "realizada",
            desc: ["Proceso técnico completado sin anomalías."],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Detallar la practica fraudulenta detectada."]
        },
        {
            id: 32,
            title: "Cl Inst Sin Equipos de TV físico",
            type: "realizada",
            desc: ["Cuando al finalizar la instalación detectamos que el titular/referente realiza la practica fraudulenta sobre reventa de equipos de Claro"],
            steps: ["Reportar a mesa de despacho según segmento.", 
                    "Pymes: *617 // 0800-122-1617", 
                    "Residencial: *6565 // Opción 1"],
            photos: ["Realizar la carga de las 8 imágenes correspondientes.",
                    "Niveles / Banda",
                    "Frente Domicilio",
                    "Medición Interna",
                    "Foto Caja / Splitter",
                    "Nomenclador",
                    "Ingreso Domicilio",
                    "Estado ONT",
                    "Acta Aceptación"],
            stock: "Descargar materiales utilizados en la actividad.",
            notes: ["Detallar la practica fraudulenta detectada."]
        }

    ];

/**
 * Inicializa la pantalla de motivos OFSC (búsqueda, filtros y modal).
 */
function initMotivosOfsc() {
    const page = document.body.dataset.page;
    if (page !== 'motivosOfsc') {
        return;
    }

    const grid = document.getElementById('motivesGrid');
    const searchInput = document.getElementById('searchInput');
    const modalElement = document.getElementById('detailModal');

    if (!grid || !searchInput || !modalElement) {
        return;
    }

    let activeType = 'all';

    const mapToDotList = (items) => items.map((item) => `<li><span class="dot-indicator"></span>${item}</li>`).join('');

    const showDetail = (id) => {
        const motive = motives.find((item) => item.id === id);
        if (!motive) {
            return;
        }

        document.getElementById('motiveTitle').innerText = motive.title;
        document.getElementById('motiveStock').innerText = motive.stock;
        document.getElementById('motiveDesc').innerHTML = mapToDotList(motive.desc);
        document.getElementById('motiveSteps').innerHTML = mapToDotList(motive.steps);
        document.getElementById('motivePhotos').innerHTML = mapToDotList(motive.photos);
        document.getElementById('motiveNotes').innerHTML = mapToDotList(motive.notes);

        const header = document.getElementById('modalHeader');
        header.style.backgroundColor = motive.type === 'realizada' ? 'var(--success-green)' : 'var(--claro-red)';
        new bootstrap.Modal(modalElement).show();
    };

    const renderMotives = (data) => {
        grid.innerHTML = data
            .map((motive) => `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card motive-card p-3 ${motive.type === 'realizada' ? 'realizada' : ''}" data-motive-id="${motive.id}">
                        <div class="d-flex flex-column h-100">
                            <h6 class="mb-2 text-truncate-2">${motive.title}</h6>
                            <div class="mt-auto">
                                <span class="badge ${motive.type === 'realizada' ? 'bg-success' : 'bg-danger'} badge-type">
                                    ${motive.type === 'realizada' ? 'Realizada' : 'No Realizada'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            .join('');

        grid.querySelectorAll('[data-motive-id]').forEach((card) => {
            card.addEventListener('click', () => showDetail(Number(card.dataset.motiveId)));
        });
    };

    const applyFilters = () => {
        const term = searchInput.value.toLowerCase();
        const filtered = motives.filter((motive) => {
            const byType = activeType === 'all' || motive.type === activeType;
            const byTerm = motive.title.toLowerCase().includes(term);
            return byType && byTerm;
        });
        renderMotives(filtered);
    };

    document.querySelectorAll('[data-motive-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-motive-filter]').forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            activeType = button.dataset.motiveFilter;
            applyFilters();
        });
    });

    searchInput.addEventListener('input', applyFilters);
    applyFilters();
}

function initUIEffects() {
    initManualSearch();
    initImageModal();
    initVideoModal();
    initCopyButtons();
    initBackButtons();
    initMotivosOfsc();
}

document.addEventListener('DOMContentLoaded', initUIEffects);
