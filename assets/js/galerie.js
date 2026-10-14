// Galerie-Ansicht für alle Bilder im Text (.prose img).
// Klick öffnet das Bild groß. Zoom: Mausrad, Doppelklick/Doppeltipp, zwei Finger, +/-.
// Verschieben: ziehen (wenn gezoomt). Blättern: Pfeiltasten, Knöpfe, wischen. Schließen: Esc, ×, Klick daneben.
(function () {
    var items = [];

    document.querySelectorAll('.prose img').forEach(function (img) {
        var link = img.closest('a');
        // Bilder, die auf eine andere Seite verlinken, bleiben normale Links
        if (link && link.getAttribute('href') !== img.getAttribute('src')) return;
        var fig = img.closest('figure');
        var cap = fig ? fig.querySelector('figcaption') : null;
        var index = items.push({
            src: link ? link.href : img.currentSrc || img.src,
            alt: img.alt || '',
            caption: cap ? cap.innerHTML : ''
        }) - 1;
        (link || img).addEventListener('click', function (e) {
            e.preventDefault();
            oeffnen(index);
        });
        img.style.cursor = 'zoom-in';
    });

    if (!items.length) return;

    var MIN = 1, MAX = 6;
    var root, buehne, bild, text, zahl, zurueck, weiter, schliessen;
    var aktuell = 0, fokusVorher = null;
    var s = 1, x = 0, y = 0, basis = null;
    var zeiger = {}, pinch = null, zug = null, letzterTipp = 0;

    function bauen() {
        root = document.createElement('div');
        root.className = 'galerie';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', 'Bildansicht');
        root.hidden = true;
        root.innerHTML =
            '<div class="galerie-buehne"><img class="galerie-bild" alt="" draggable="false"></div>' +
            '<div class="galerie-leiste"><span class="galerie-text"></span><span class="galerie-zahl"></span></div>' +
            '<button type="button" class="galerie-knopf galerie-zu" aria-label="Schließen">×</button>' +
            '<button type="button" class="galerie-knopf galerie-zurueck" aria-label="Vorheriges Bild">‹</button>' +
            '<button type="button" class="galerie-knopf galerie-weiter" aria-label="Nächstes Bild">›</button>';
        document.body.appendChild(root);

        buehne = root.querySelector('.galerie-buehne');
        bild = root.querySelector('.galerie-bild');
        text = root.querySelector('.galerie-text');
        zahl = root.querySelector('.galerie-zahl');
        zurueck = root.querySelector('.galerie-zurueck');
        weiter = root.querySelector('.galerie-weiter');
        schliessen = root.querySelector('.galerie-zu');

        schliessen.addEventListener('click', zu);
        zurueck.addEventListener('click', function () { zeigen(aktuell - 1); });
        weiter.addEventListener('click', function () { zeigen(aktuell + 1); });

        if (items.length < 2) {
            zurueck.hidden = true;
            weiter.hidden = true;
        }

        bild.addEventListener('load', zoomZuruecksetzen);
        buehne.addEventListener('wheel', rad, { passive: false });
        buehne.addEventListener('pointerdown', runter);
        buehne.addEventListener('pointermove', bewegen);
        buehne.addEventListener('pointerup', hoch);
        buehne.addEventListener('pointercancel', hoch);
        buehne.addEventListener('dblclick', function (e) { umschalten(e.clientX, e.clientY); });
        document.addEventListener('keydown', taste);
        window.addEventListener('resize', function () { if (!root.hidden) zoomZuruecksetzen(); });
    }

    function oeffnen(index) {
        if (!root) bauen();
        fokusVorher = document.activeElement;
        root.hidden = false;
        document.documentElement.classList.add('galerie-offen');
        zeigen(index);
        schliessen.focus();
    }

    function zu() {
        root.hidden = true;
        document.documentElement.classList.remove('galerie-offen');
        bild.removeAttribute('src');
        if (fokusVorher && fokusVorher.focus) fokusVorher.focus();
    }

    function zeigen(index) {
        aktuell = (index + items.length) % items.length;
        var item = items[aktuell];
        zoomZuruecksetzen();
        bild.src = item.src;
        bild.alt = item.alt;
        text.innerHTML = item.caption;
        zahl.textContent = items.length > 1 ? (aktuell + 1) + ' / ' + items.length : '';
        // Nachbarn vorladen
        [aktuell - 1, aktuell + 1].forEach(function (i) {
            if (items.length > 1) new Image().src = items[(i + items.length) % items.length].src;
        });
    }

    // --- Zoom & Verschieben (transform-origin: 0 0) ---
    function anwenden() {
        bild.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
        root.classList.toggle('gezoomt', s > 1);
    }

    function zoomZuruecksetzen() {
        s = 1; x = 0; y = 0; basis = null;
        if (bild) anwenden();
    }

    function zoomenAuf(neu, px, py) {
        neu = Math.min(MAX, Math.max(MIN, neu));
        if (s === 1 || !basis) basis = bild.getBoundingClientRect();
        if (neu === 1) { zoomZuruecksetzen(); return; }
        var lx = (px - basis.left - x) / s;
        var ly = (py - basis.top - y) / s;
        x = px - basis.left - lx * neu;
        y = py - basis.top - ly * neu;
        s = neu;
        anwenden();
    }

    function umschalten(px, py) {
        if (s > 1) zoomZuruecksetzen();
        else zoomenAuf(2.5, px, py);
    }

    function rad(e) {
        e.preventDefault();
        zoomenAuf(s * Math.exp(-e.deltaY * 0.002), e.clientX, e.clientY);
    }

    function runter(e) {
        if (e.target.closest('.galerie-knopf')) return;
        buehne.setPointerCapture(e.pointerId);
        zeiger[e.pointerId] = { x: e.clientX, y: e.clientY };
        var ids = Object.keys(zeiger);
        if (ids.length === 2) {
            var a = zeiger[ids[0]], b = zeiger[ids[1]];
            pinch = { abstand: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
            zug = null;
        } else if (ids.length === 1) {
            zug = { startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, aufBild: e.target === bild };
        }
    }

    function bewegen(e) {
        if (!zeiger[e.pointerId]) return;
        zeiger[e.pointerId] = { x: e.clientX, y: e.clientY };
        var ids = Object.keys(zeiger);
        if (ids.length === 2 && pinch) {
            var a = zeiger[ids[0]], b = zeiger[ids[1]];
            var abstand = Math.hypot(a.x - b.x, a.y - b.y);
            var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            zoomenAuf(s * abstand / pinch.abstand, mx, my);
            if (s > 1) { x += mx - pinch.mx; y += my - pinch.my; anwenden(); }
            pinch = { abstand: abstand, mx: mx, my: my };
        } else if (zug && s > 1) {
            x += e.clientX - zug.x;
            y += e.clientY - zug.y;
            anwenden();
            zug.x = e.clientX;
            zug.y = e.clientY;
        } else if (zug) {
            zug.x = e.clientX;
            zug.y = e.clientY;
        }
    }

    function hoch(e) {
        if (!zeiger[e.pointerId]) return;
        delete zeiger[e.pointerId];
        if (Object.keys(zeiger).length < 2) pinch = null;
        if (!zug || Object.keys(zeiger).length) return;

        var dx = e.clientX - zug.startX, dy = e.clientY - zug.startY;
        var weg = Math.hypot(dx, dy);
        var war = zug;
        zug = null;

        if (s === 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) && items.length > 1) {
            zeigen(aktuell + (dx < 0 ? 1 : -1));
            return;
        }
        if (weg < 10) {
            var jetzt = Date.now();
            if (e.pointerType !== 'mouse' && jetzt - letzterTipp < 300) {
                umschalten(e.clientX, e.clientY);
                letzterTipp = 0;
                return;
            }
            letzterTipp = jetzt;
            // Klick neben das Bild schließt (Maus sofort, Touch erst nach kurzer Pause wegen Doppeltipp)
            if (!war.aufBild && s === 1) {
                if (e.pointerType === 'mouse') zu();
                else setTimeout(function () { if (letzterTipp === jetzt) zu(); }, 300);
            }
        }
    }

    function taste(e) {
        if (!root || root.hidden) return;
        if (e.key === 'Escape') zu();
        else if (e.key === 'ArrowRight' && items.length > 1) zeigen(aktuell + 1);
        else if (e.key === 'ArrowLeft' && items.length > 1) zeigen(aktuell - 1);
        else if (e.key === '+' || e.key === '=') mitteZoomen(s * 1.5);
        else if (e.key === '-') mitteZoomen(s / 1.5);
        else if (e.key === '0') zoomZuruecksetzen();
        else if (e.key === 'Tab') fokusFalle(e);
    }

    function mitteZoomen(neu) {
        var r = buehne.getBoundingClientRect();
        zoomenAuf(neu, r.left + r.width / 2, r.top + r.height / 2);
    }

    function fokusFalle(e) {
        var knoepfe = Array.prototype.filter.call(root.querySelectorAll('button'), function (b) { return !b.hidden; });
        var erst = knoepfe[0], letzt = knoepfe[knoepfe.length - 1];
        if (e.shiftKey && document.activeElement === erst) { e.preventDefault(); letzt.focus(); }
        else if (!e.shiftKey && document.activeElement === letzt) { e.preventDefault(); erst.focus(); }
    }
})();
