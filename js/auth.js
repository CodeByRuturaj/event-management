document.addEventListener('DOMContentLoaded', () => {
    getUsers();
    q('#loginForm').onsubmit = e => {
        e.preventDefault(); const f = e.target, em = f.email.value.trim().toLowerCase();
        const u = getUsers().find(x => x.email === em && x.password === f.password.value);
        if (!u) { q('#lerr').textContent = 'Email or password is incorrect.'; return }
        DB.set('user', { name: u.name, email: u.email, role: u.role }); location.href = u.role === 'admin' ? 'admin.html' : 'events.html'
    };
    q('#signupForm').onsubmit = e => {
        e.preventDefault(); const f = e.target, em = f.email.value.trim().toLowerCase(), users = getUsers();
        if (f.name.value.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(em) || f.password.value.length < 6) { q('#serr').textContent = 'Enter a name, a valid email and a password of 6+ characters.'; return }
        if (users.some(x => x.email === em)) { q('#serr').textContent = 'This email is already registered. Log in instead.'; return }
        users.push({ name: f.name.value.trim(), email: em, password: f.password.value, role: 'user' }); DB.set('users', users);
        DB.set('user', { name: f.name.value.trim(), email: em, role: 'user' }); location.href = 'events.html'
    };
});
