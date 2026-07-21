import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://eljykdmzjsdkpojpalen.supabase.co'
const supabaseKey = 'sb_publishable_ABlaHEC7sMgmFQAg5h5wBg_P5-I6TBs'

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Determine paths based on location
const isSubPage = window.location.pathname.includes('/pages/');
const redirectPath = isSubPage ? "../index.html" : "index.html";

// Check session and validate access immediately (except on index.html)
export async function validarAcceso() {
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html/')) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
            window.location.href = redirectPath;
            return null;
        }

        // Validate account approval status in Supabase profiles table
        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', session.user.id)
                .single();

            // If profile is not found or error occurs because the table is missing or status is not 'approved'
            if (profileError) {
                // If table doesn't exist yet, we let them proceed but log a warning (gives admin time to create the table)
                if (profileError.code === 'PGRST116' || profileError.message.includes('relation "public.profiles" does not exist')) {
                    console.warn("Table 'profiles' not found. Admin needs to run the setup script. Proceeding without status checks.");
                    return session;
                }
                
                console.error("Error fetching user profile:", profileError);
                await supabase.auth.signOut();
                window.location.href = redirectPath;
                return null;
            }

            if (!profile || profile.status !== 'approved') {
                console.log("Account is not approved yet. Current status: " + (profile ? profile.status : 'unknown'));
                await supabase.auth.signOut();
                window.location.href = redirectPath;
                return null;
            }
        } catch (err) {
            console.error("Exception during profile validation:", err);
        }

        return session;
    }
}

// Inactivity timeout configuration (15 minutes = 900,000 ms)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

// Reset the inactivity timer
function resetInactivityTimer() {
    localStorage.setItem('last_activity', Date.now().toString());
}

// Check if the user has been inactive for too long
async function checkInactivity() {
    // Only track/check inactivity if we are not on the login page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html/')) {
        return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return; // Not logged in, no need to check

    const lastActivity = localStorage.getItem('last_activity');
    if (lastActivity) {
        const timeElapsed = Date.now() - parseInt(lastActivity, 10);
        if (timeElapsed > INACTIVITY_TIMEOUT) {
            console.log("Session expired due to inactivity.");
            localStorage.removeItem('last_activity');
            await supabase.auth.signOut();
            window.location.href = redirectPath;
        }
    } else {
        // Initialize if not present
        resetInactivityTimer();
    }
}

// Function to handle logout listener setup
function attachLogoutListener() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            localStorage.removeItem('last_activity');
            const { error } = await supabase.auth.signOut();
            if (!error) {
                window.location.href = redirectPath;
            } else {
                alert("Error al cerrar sesión");
            }
        });
    }
    // Also support any logoutBtnHero if exists
    const logoutBtnHero = document.getElementById('logoutBtnHero');
    if (logoutBtnHero) {
        logoutBtnHero.addEventListener('click', async (e) => {
            e.preventDefault();
            localStorage.removeItem('last_activity');
            const { error } = await supabase.auth.signOut();
            if (!error) {
                window.location.href = redirectPath;
            } else {
                alert("Error al cerrar sesión");
            }
        });
    }
}

// Start tracking if we are logged in and not on login page
if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html/')) {
    // Check inactivity every 10 seconds
    setInterval(checkInactivity, 10000);

    // Track user activity events with throttle
    let lastUpdate = 0;
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'mousemove', 'scroll'];
    
    const handleActivity = () => {
        const now = Date.now();
        if (now - lastUpdate > 10000) { // Throttle updates to localstorage every 10 seconds
            resetInactivityTimer();
            lastUpdate = now;
        }
    };

    activityEvents.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial run
    resetInactivityTimer();
    validarAcceso();
}

// Attach logout button listener
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachLogoutListener);
} else {
    attachLogoutListener();
}
