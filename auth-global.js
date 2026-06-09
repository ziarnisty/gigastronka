import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAoV8SUTRpcBMeFDyH86k3lkiKyDOzSfHw",
    authDomain: "giga-stronka.firebaseapp.com",
    projectId: "giga-stronka",
    storageBucket: "giga-stronka.firebasestorage.app",
    messagingSenderId: "53278121002",
    appId: "1:53278121002:web:ee445fd3c60a9b97f03753",
    measurementId: "G-6ZDX603H8L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- ODCZYTYWANIE WIRTUALNEJ KARTECZKI Z BŁĘDEM ---
if (sessionStorage.getItem('authError')) {
    setTimeout(() => {
        let alertBox = document.getElementById('custom-alert');
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'custom-alert';
            alertBox.className = 'custom-alert';
            document.body.appendChild(alertBox);
        }
        alertBox.innerText = "Musisz być zalogowany, aby wejść na tę stronę!";
        alertBox.classList.remove('success');
        alertBox.classList.add('show');
        setTimeout(() => alertBox.classList.remove('show'), 4500);
    }, 300); 
    sessionStorage.removeItem('authError'); 
}

// --- WSTRZYKIWANIE STYLÓW DLA ROZWIJANEGO MENU ---
if (!document.getElementById('dropdown-styles')) {
    const style = document.createElement('style');
    style.id = 'dropdown-styles';
    style.innerHTML = `
        .user-profile-container { display: flex; align-items: center; gap: 15px; white-space: nowrap; }
        .user-email-text { color: rgba(255,255,255,0.85); font-size: 13px; font-family: 'Montserrat', sans-serif; }
        .user-email-text b { color: #fff; font-weight: 600; letter-spacing: 0.5px; margin-left: 4px; }
        
        .settings-dropdown-wrapper { position: relative; display: inline-block; }
        
        .nav-action-btn {
            background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
            color: white; padding: 6px 14px; border-radius: 8px; cursor: pointer;
            font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600;
            transition: all 0.3s ease; scale: 1 !important; margin: 0 !important; 
            box-shadow: none !important; letter-spacing: normal !important;
            display: flex; align-items: center; gap: 5px; height: 32px; box-sizing: border-box;
        }
        .nav-action-btn:hover { background: rgba(255, 255, 255, 0.2); letter-spacing: normal !important; }
        
        .settings-dropdown-menu {
            position: absolute; top: 100%; left: 50%; margin-top: 25px;
            background: linear-gradient(90deg, rgba(0, 22, 72, 0.3), rgba(0, 45, 84, 0.3)); 
            backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
            min-width: 150px; overflow: hidden;
            opacity: 0; visibility: hidden; transform: translate(-50%, -10px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 9999;
        }
        
        .settings-dropdown-wrapper:hover .settings-dropdown-menu {
            opacity: 1; visibility: visible; transform: translate(-50%, 0);
        }
        
        .settings-dropdown-wrapper::after {
            content: ''; position: absolute; top: 100%; left: -50%; width: 200%; height: 25px;
        }
        
        .dropdown-item {
            padding: 12px 16px; color: #cbd5e1; font-family: 'Montserrat', sans-serif;
            font-size: 12px; font-weight: 500; cursor: pointer; transition: background 0.2s, color 0.2s;
            text-align: center;
        }
        .dropdown-item:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
        
        .dropdown-item.logout-variant { color: #fca5a5; border-top: 1px solid rgba(255,255,255,0.05); }
        .dropdown-item.logout-variant:hover { background: rgba(220, 38, 38, 0.15); color: #f87171; }
    `;
    document.head.appendChild(style);
}

onAuthStateChanged(auth, (user) => {
    const isProtectedPage = window.location.pathname.includes("bot.html") || window.location.pathname.includes("inwestycja.html");
    const isAuthPage = window.location.pathname.includes("logowanie.html") || window.location.pathname.includes("rejestracja.html");

    if (user && user.emailVerified) {
        if (isAuthPage) {
            window.location.href = "bot.html";
            return;
        }

        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            const loginLink = navMenu.querySelector('a[href="logowanie.html"]');
            const regLink = navMenu.querySelector('a[href="rejestracja.html"]');
            if(loginLink) loginLink.parentElement.style.display = 'none';
            if(regLink) regLink.parentElement.style.display = 'none';

            if (!document.getElementById('user-nav-box')) {
                navMenu.style.alignItems = 'center'; 
                
                const userBox = document.createElement('li');
                userBox.id = 'user-nav-box';
                userBox.className = 'push-right'; 
                
                userBox.innerHTML = `
                    <div class="user-profile-container">
                        <span class="user-email-text">
                            Zalogowano jako: <b>${user.email}</b>
                        </span>
                        <div class="settings-dropdown-wrapper">
                            <button class="nav-action-btn">Ustawienia ▾</button>
                            
                            <div class="settings-dropdown-menu">
                                <div class="dropdown-item" id="delete-account-btn">Usuń konto</div>
                                <div class="dropdown-item logout-variant" id="logout-btn">Wyloguj</div>
                            </div>
                        </div>
                    </div>
                `;
                navMenu.appendChild(userBox);

                document.getElementById('logout-btn').addEventListener('click', () => {
                    signOut(auth).then(() => {
                        window.location.href = "logowanie.html"; 
                    });
                });

                document.getElementById('delete-account-btn').addEventListener('click', () => {
                    alert("Funkcja usuwania konta będzie dostępna wkrótce!");
                });
            }
        }
    } else {
        
        // --- TARCZA ODBLOKOWANA: POKAZUJEMY PRZYCISKI GOŚCIOM ---
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.add('unlocked');
        }

        if (isProtectedPage) {
            sessionStorage.setItem('authError', 'true'); 
            window.location.href = "logowanie.html"; 
        }
    }
});