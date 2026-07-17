// --- MODAL DE IMÁGENES PARA FOTOS TOA ---
const imgModal = document.getElementById('imgModal');
if (imgModal) {
    imgModal.addEventListener('show.bs.modal', function (event) {
        const trigger = event.relatedTarget;
        const src = trigger.getAttribute('data-img-src');
        document.getElementById('modalImage').src = src;
    });
}
