document.documentElement.dataset.theme = DB.get('theme', 'light');
function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2500) }
document.addEventListener('DOMContentLoaded', () => {
    const u = getUser();
    q('#nav').innerHTML = `<nav class="nav"><a class="logo" href="index.html">🎉 EventHub</a><button id="burger" aria-label="Menu">☰</button><div class="links" id="links"><a href="index.html">Home</a><a href="events.html">Events</a><a href="my-bookings.html">My bookings</a>${u && u.role === 'admin' ? '<a href="admin.html">Admin</a>' : ''}<a href="contact.html">Contact</a>${u ? `<a href="#" id="out">Log out (${esc(u.name)})</a>` : '<a href="login.html">Log in</a>'}<button id="theme" aria-label="Toggle theme">🌓</button></div></nav>`;
    q('#foot').innerHTML = '<footer>© 2026 EventHub. Built with HTML, CSS and JavaScript.</footer>';
    q('#burger').onclick = () => q('#links').classList.toggle('open');
    q('#theme').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; DB.set('theme', t) };
    const o = q('#out'); if (o) o.onclick = e => { e.preventDefault(); localStorage.removeItem('user'); location.href = 'index.html' };
    const cf = q('#contactForm'); if (cf) cf.onsubmit = e => {
        e.preventDefault(); const n = cf.name.value.trim(), m = cf.email.value.trim(), t = cf.message.value.trim();
        if (n.length < 2 || !/^\S+@\S+\.\S+$/.test(m) || t.length < 10) { q('#cerr').textContent = 'Enter your name, a valid email and a message of at least 10 characters.'; return }
        DB.set('messages', [...DB.get('messages', []), { n, m, t, at: new Date().toISOString() }]); cf.reset(); q('#cerr').textContent = ''; toast('Message sent')
    };
});
