document.addEventListener('DOMContentLoaded', () => {
  const u = getUser(), form = q('#bookForm'), list = q('#list');
  if (!u) { location.href = 'login.html'; return }
  if (form) {
    const events = getEvents(), e = events.find(x => x.id == param('id'));
    if (!e) { q('#info').innerHTML = '<p>Event not found. <a href="events.html">Browse events</a></p>'; form.style.display = 'none'; return }
    q('#info').innerHTML = `<h2>${esc(e.title)}</h2><p class="meta">${esc(e.date)}, ${esc(e.location)}. ₹${e.price} per ticket, ${e.seats} left.</p>`;
    form.name.value = u.name; form.email.value = u.email; form.tickets.max = e.seats;
    const tot = () => q('#total').textContent = 'Total: ₹' + (e.price * (+form.tickets.value || 0)); form.tickets.oninput = tot; tot();
    form.onsubmit = ev => {
      ev.preventDefault(); const n = +form.tickets.value;
      if (form.name.value.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(form.email.value) || !/^\d{10}$/.test(form.phone.value)) { q('#err').textContent = 'Enter your name, a valid email and a 10-digit phone number.'; return }
      if (!(n >= 1 && n <= e.seats)) { q('#err').textContent = `Choose between 1 and ${e.seats} tickets.`; return }
      e.seats -= n; saveEvents(events);
      DB.set('bookings', [...getBookings(), { id: Date.now(), eventId: e.id, title: e.title, date: e.date, location: e.location, user: u.email, name: form.name.value.trim(), tickets: n, total: e.price * n }]);
      toast('Booking confirmed'); setTimeout(() => location.href = 'my-bookings.html', 900)
    };
  }
  if (list) {
    const draw = () => {
      const b = getBookings().filter(x => x.user === u.email);
      list.innerHTML = b.length ? b.map(x => `<div class="card ticket" id="t${x.id}"><div class="body"><h3>${esc(x.title)}</h3><div class="meta">${esc(x.date)}, ${esc(x.location)}</div><div>${esc(x.name)}: ${x.tickets} ticket(s), ₹${x.total}</div><div class="muted">Booking #${x.id}</div><div><button class="btn sm" data-p="${x.id}">Print ticket</button> <button class="btn sm ghost" data-c="${x.id}">Cancel booking</button></div></div></div>`).join('') : '<p class="muted">No bookings yet. <a href="events.html">Find an event</a></p>'
    };
    list.onclick = e => {
      const c = e.target.dataset.c, p = e.target.dataset.p;
      if (p) { const t = q('#t' + p); t.classList.add('printing'); window.print(); t.classList.remove('printing') }
      if (c && confirm('Cancel this booking?')) {
        const bs = getBookings(), b = bs.find(x => x.id == c), ev = getEvents(), E = ev.find(x => x.id == b.eventId);
        if (E) { E.seats += b.tickets; saveEvents(ev) } DB.set('bookings', bs.filter(x => x.id != c)); draw(); toast('Booking cancelled')
      }
    };
    draw()
  }
});
