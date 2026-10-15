// Inhaltsverzeichnis in der Seitenleiste: erscheint, sobald das Verzeichnis oben aus dem Bild
// gescrollt ist, und markiert den Abschnitt, in dem man gerade liest.
(function () {
    var inline = document.querySelector('.toc-inline');
    var side = document.querySelector('.toc-side');
    if (!inline || !side) return;

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            var e = entries[0];
            side.classList.toggle('sichtbar', !e.isIntersecting && e.boundingClientRect.top < 0);
        }).observe(inline);
    }

    side.querySelector('.toc-side-titel').addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var links = {};
    side.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var id = decodeURIComponent(a.getAttribute('href').slice(1));
        if (id) links[id] = a;
    });
    var headings = Array.prototype.filter.call(
        document.querySelectorAll('.prose h2[id], .prose h3[id]'),
        function (h) { return links[h.id]; }
    );
    if (!headings.length) return;

    var aktiv = null;
    var offen = null;
    var geplant = false;

    // Kapitel-Eintrag (oberste Ebene) zu einem Link: dessen ###-Liste wird ausgeklappt
    function kapitel(link) {
        var li = link.closest('li');
        while (li && li.parentElement && li.parentElement.classList.contains('toc-sub')) {
            li = li.parentElement.closest('li');
        }
        return li;
    }

    function markieren() {
        geplant = false;
        var current = null;
        for (var i = 0; i < headings.length; i++) {
            if (headings[i].getBoundingClientRect().top < 120) current = headings[i];
            else break;
        }
        var link = current ? links[current.id] : null;
        if (link === aktiv) return;
        if (aktiv) aktiv.classList.remove('aktiv');
        aktiv = link;
        var li = link ? kapitel(link) : null;
        if (li !== offen) {
            if (offen) offen.classList.remove('offen');
            if (li) li.classList.add('offen');
            offen = li;
        }
        if (!link) return;
        link.classList.add('aktiv');
        // Aktiven Eintrag in langen Verzeichnissen sichtbar halten
        var top = link.getBoundingClientRect().top - side.getBoundingClientRect().top + side.scrollTop;
        if (top < side.scrollTop || top > side.scrollTop + side.clientHeight - 40) {
            side.scrollTop = top - side.clientHeight / 3;
        }
    }

    window.addEventListener('scroll', function () {
        if (!geplant) {
            geplant = true;
            window.requestAnimationFrame(markieren);
        }
    }, { passive: true });
    markieren();
})();
