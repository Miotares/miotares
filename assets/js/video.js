/* YouTube-Videos erst nach Klick laden (Include video.html). Ohne JS bleibt der Kasten ein Link zu YouTube. */
(function () {
    document.querySelectorAll('figure.video[data-video]').forEach(function (fig) {
        var start = fig.querySelector('.video-start');
        if (!start) return;
        start.addEventListener('click', function (e) {
            e.preventDefault();
            var rahmen = document.createElement('iframe');
            rahmen.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(fig.dataset.video) + '?autoplay=1&rel=0';
            rahmen.title = fig.dataset.titel || 'Video';
            rahmen.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            rahmen.allowFullscreen = true;
            rahmen.referrerPolicy = 'strict-origin-when-cross-origin';
            rahmen.className = 'video-rahmen';
            start.replaceWith(rahmen);
        });
    });
})();
