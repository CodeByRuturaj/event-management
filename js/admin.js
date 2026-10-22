document.addEventListener('DOMContentLoaded', () => {
    const u = getUser(); if (!u || u.role !== 'admin') { location.href = 'login.html'; return }
    const f = q('#evForm'), F = ['title', 'category', 'date', 'time', 'location', 'price', 'seats', 'desc', 'schedule'];
    Object.keys(CATS).forEach(c => f.category.add(new Option(c, c)));
    const draw = () => { q('#rows').innerHTML = getEvents().map(e => `<tr><td>${esc(e.title)}</td><td>${esc(e.date)}</td><td>${esc(e.location)}</td><td>${e.seats}</td><td><button class="btn sm" data-e="${e.id}">Edit</button> <button class="btn sm ghost" data-d="${e.id}">Delete</button></td></tr>`).join('') };
    f.onsubmit = ev => {
        ev.preventDefault();
        if (F.some(k => !f[k].value.trim())) { q('#err').textContent = 'Fill in every field.'; return }
        const all = getEvents(), o = {}; F.forEach(k => o[k] = f[k].value.trim()); o.price = +o.price; o.seats = +o.seats;
        if (f.id.value) { Object.assign(all.find(x => x.id == f.id.value), o); toast('Event updated') }
        else { o.id = Date.now(); all.push(o); toast('Event added') }
        saveEvents(all); f.reset(); f.id.value = ''; q('#err').textContent = ''; q('#save').textContent = 'Add event'; draw()
    };
    q('#rows').onclick = e => {
        const ed = e.target.dataset.e, de = e.target.dataset.d;
        if (ed) { const x = getEvents().find(v => v.id == ed); F.forEach(k => f[k].value = x[k]); f.id.value = x.id; q('#save').textContent = 'Save changes'; scrollTo(0, 0) }
        if (de && confirm('Delete this event?')) { saveEvents(getEvents().filter(v => v.id != de)); draw(); toast('Event deleted') }
    };
    draw()
});
