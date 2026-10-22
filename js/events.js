document.addEventListener('DOMContentLoaded', () => {
    const all = getEvents();
    const feat = q('#featured'); if (feat) feat.innerHTML = all.slice(0, 3).map(card).join('');
    const cats = q('#cats'); if (cats) cats.innerHTML = Object.keys(CATS).map(c => `<a class="btn alt" href="events.html?cat=${c}">${icon(c)} ${c}</a>`).join('');
    const grid = q('#grid');
    if (grid) {
        const sc = q('#cat'), sl = q('#loc');
        Object.keys(CATS).forEach(c => sc.add(new Option(c, c)));
        [...new Set(all.map(e => e.location))].forEach(l => sl.add(new Option(l, l)));
        if (param('cat')) sc.value = param('cat');
        const draw = () => {
            const s = q('#search').value.toLowerCase(), d = q('#date').value;
            const r = all.filter(e => e.title.toLowerCase().includes(s) && (!sc.value || e.category === sc.value) && (!sl.value || e.location === sl.value) && (!d || e.date >= d));
            grid.innerHTML = r.length ? r.map(card).join('') : '<p class="muted">No events match your filters. Clear a filter to see more.</p>'
        };
        ['search', 'cat', 'loc', 'date'].forEach(i => q('#' + i).addEventListener('input', draw)); draw();
    }
    const box = q('#detail');
    if (box) {
        const e = all.find(x => x.id == param('id'));
        if (!e) { box.innerHTML = '<p>Event not found. <a href="events.html">Browse events</a></p>'; return }
        box.innerHTML = `<div class="banner big" style="background:${grad(e.category)}">${icon(e.category)}</div><span class="tag">${esc(e.category)}</span><h1>${esc(e.title)}</h1><p class="meta">${esc(e.date)} at ${esc(e.time)}, ${esc(e.location)}</p><p>${esc(e.desc)}</p><h3>Schedule</h3><ul>${e.schedule.split('|').map(s => `<li>${esc(s.trim())}</li>`).join('')}</ul><p class="price">₹${e.price} per ticket, ${e.seats} seats left</p><div class="count" id="count"></div>${e.seats > 0 ? `<a class="btn" href="booking.html?id=${e.id}">Book tickets</a>` : '<span class="tag">Sold out</span>'} <a class="btn ghost" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.date.replace(/-/g, '')}/${e.date.replace(/-/g, '')}&location=${encodeURIComponent(e.location)}">Add to Google Calendar</a>`;
        const tick = () => {
            let ms = new Date(e.date + 'T' + e.time) - new Date(); if (ms < 0) { q('#count').innerHTML = '<div>Event started</div>'; return }
            const p = [['Days', 864e5], ['Hrs', 36e5], ['Min', 6e4], ['Sec', 1e3]]; q('#count').innerHTML = p.map(([n, v]) => { const x = Math.floor(ms / v); ms -= x * v; return `<div><b>${x}</b><br>${n}</div>` }).join('')
        };
        tick(); setInterval(tick, 1000)
    }
});
