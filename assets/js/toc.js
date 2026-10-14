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
    var geplant = false;

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
        if (!link) return;
        link.classList.add('aktiv');
        // Aktiven Eintrag in langen Verzeichnissen sichtbar halten
        var top = link.offsetTop; // relativ zur Seitenleiste (fixed = offsetParent)
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
