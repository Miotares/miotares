/* ASCII-Animation „Download in Echtzeit“ (Include ascii-download.html).
   Vier Balken laden ein Megabyte, in echter Zeit und ohne Zeitraffer: DSL in 11 Sekunden, das Modem in zweieinhalb Minuten.
   Die Zeiten sind die der Rechnung im Fließtext (1 MB = 8,4 Megabit bei 56, 64, 128 und 768 Kilobit pro Sekunde).
   Ohne JS bleibt das feste Bild aus dem HTML stehen, mit prefers-reduced-motion ebenfalls (in voller Breite). */
(function () {
    var ZEILEN = [
        { name: 'Modem', sekunden: 150 },
        { name: 'ISDN', sekunden: 131 },
        { name: 'ISDN x2', sekunden: 66 },
        { name: 'DSL', sekunden: 11 }
    ];
    var ENDE = 150;             // Sekunde, in der die letzte Zeile fertig ist (zugleich das feste Bild)
    var HALTEN = 6;             // Sekunden, die das fertige Bild steht, bevor es von vorn beginnt
    var BREITE = 20;            // Zeichen pro Balken, wenn die Breite nicht gemessen wird (festes Bild im HTML)
    var MAX_BREITE = 60;

    function pad(text, n) {
        while (text.length < n) text += ' ';
        return text;
    }

    function links(text, n) {
        while (text.length < n) text = ' ' + text;
        return text;
    }

    function zeit(sekunden) {
        var s = Math.floor(sekunden);
        return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
    }

    function balken(anteil, breite) {
        var voll = Math.floor(anteil * breite);
        var s = '';
        for (var i = 0; i < breite; i++) {
            s += i < voll ? '=' : (i === voll && anteil < 1 ? '>' : ' ');
        }
        return '[' + s + ']';
    }

    // Text des Bildes zur Sekunde t (öffentlich, damit sich das feste Bild prüfen lässt)
    function bild(t, breite) {
        breite = breite || BREITE;
        t = Math.min(t, ENDE);
        var gesamt = breite + 16;
        var linie = new Array(gesamt + 1).join('-');
        var kopf = 'Datei, 1 MB';
        var uhr = 'Zeit ' + zeit(t);
        var zeilen = [kopf + new Array(gesamt - kopf.length - uhr.length + 1).join(' ') + uhr, linie];
        var fertig = true;
        ZEILEN.forEach(function (z) {
            var anteil = Math.min(t / z.sekunden, 1);
            var rechts;
            if (anteil >= 1) {
                rechts = zeit(z.sekunden);
            } else {
                fertig = false;
                rechts = Math.floor(anteil * 100) + '%';
            }
            zeilen.push(pad(z.name, 8) + ' ' + balken(anteil, breite) + ' ' + links(rechts, 4));
        });
        zeilen.push(linie);
        zeilen.push(fertig ? 'Fertig nach ' + zeit(ENDE) + ' Minuten' : 'Echtzeit, 1 Megabyte');
        return zeilen.join('\n');
    }

    window.AsciiDownload = { bild: bild, ende: ENDE };

    var kleineBewegung = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wie viele Zeichen breit der Balken sein darf, damit das Bild die Textspalte ausfüllt
    function passendeBreite(pre) {
        var probe = document.createElement('span');
        probe.textContent = '0000000000';
        probe.style.visibility = 'hidden';
        pre.appendChild(probe);
        var zeichen = probe.getBoundingClientRect().width / 10;
        pre.removeChild(probe);
        var stil = getComputedStyle(pre);
        var innen = pre.clientWidth - parseFloat(stil.paddingLeft) - parseFloat(stil.paddingRight);
        var breite = Math.floor(innen / zeichen) - 16;
        return Math.max(12, Math.min(MAX_BREITE, breite));
    }

    document.querySelectorAll('[data-ascii-download]').forEach(function (pre) {
        var timer = null, start = 0, breite = passendeBreite(pre);

        function tick() {
            var t = ((Date.now() - start) / 1000) % (ENDE + HALTEN);
            pre.textContent = bild(t, breite);
        }

        window.addEventListener('resize', function () {
            breite = passendeBreite(pre);
            if (kleineBewegung) pre.textContent = bild(ENDE, breite); else if (timer) tick();
        });

        // Sofort das fertige Bild in voller Breite zeigen, bis die Animation startet
        pre.textContent = bild(ENDE, breite);
        if (kleineBewegung) return;

        function los() {
            if (timer) return;
            start = Date.now();
            tick();
            timer = setInterval(tick, 100);
        }

        function halt() {
            clearInterval(timer);
            timer = null;
        }

        if (!('IntersectionObserver' in window)) { los(); return; }
        new IntersectionObserver(function (eintraege) {
            eintraege.forEach(function (e) { e.isIntersecting ? los() : halt(); });
        }, { threshold: 0.6 }).observe(pre);
    });
})();
