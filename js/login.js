import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://eljykdmzjsdkpojpalen.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ABlaHEC7sMgmFQAg5h5wBg_P5-I6TBs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/** Devuelve la sesión activa de Supabase. */
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        throw error;
    }
    return data.session;
}

/** Inicia sesión con email y password. */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw error;
    }
    return data;
}

/** Cierra la sesión actual. */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
}

async function validateProtectedPage() {
    try {
        const session = await getSession();
        if (!session) {
            window.location.href = '../index.html';
        }
    } catch {
        window.location.href = '../index.html';
    }
}

function initLoginPage() {
    const loginForm = document.querySelector('form');
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = loginForm.querySelector('input[type="email"]')?.value?.trim();
        const password = loginForm.querySelector('input[type="password"]')?.value ?? '';

        const button = loginForm.querySelector('.btn-login');
        const originalLabel = button?.innerText ?? 'Ingresar';

        if (button) {
            button.innerText = 'VERIFICANDO...';
            button.disabled = true;
        }

        try {
            await signIn(email, password);
            window.location.href = 'pages/portada.html';
        } catch (error) {
            alert(`Acceso denegado: ${error.message}`);
            if (button) {
                button.innerText = originalLabel;
                button.disabled = false;
            }
        }
    });
}

function initLogoutButtons() {
    const logoutButtons = document.querySelectorAll('[data-logout-btn]');
    if (!logoutButtons.length) {
        return;
    }

    logoutButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                await signOut();
                window.location.href = '../index.html';
            } catch {
                alert('Error al cerrar sesión');
            }
        });
    });
}

async function initAuth() {
    const mode = document.body.dataset.auth;

    if (mode === 'login') {
        initLoginPage();
        return;
    }

    if (mode === 'required') {
        await validateProtectedPage();
        initLogoutButtons();
    }
}

initAuth();
