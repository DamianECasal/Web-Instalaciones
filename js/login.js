import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://eljykdmzjsdkpojpalen.supabase.co'
const supabaseKey = 'sb_publishable_ABlaHEC7sMgmFQAg5h5wBg_P5-I6TBs'
const supabase = createClient(supabaseUrl, supabaseKey)

// Validar de forma inmediata si el usuario está logueado
async function validarAcceso() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.href = "../index.html";
    }
}
validarAcceso();

// Lógica para cerrar la sesión activa
const logoutAction = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = "../index.html";
    } else {
        alert("Error al cerrar sesión");
    }
};

// Escuchador del botón del Navbar (si existe en el HTML actual)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutAction);
}

// También para portada.html que tiene logoutBtnHero
const logoutBtnHero = document.getElementById('logoutBtnHero');
if (logoutBtnHero) {
    logoutBtnHero.addEventListener('click', logoutAction);
}