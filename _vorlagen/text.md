---
# Vorlage für einen neuen Text.
# Kopieren nach _posts/JJJJ-MM-TT-titel.md und losschreiben. Nur "title" ist Pflicht.
# Bilder dazu in assets/bilder/<slug>/ ablegen.
title: "Titel"
# description: "Ein Satz, worum es geht (erscheint unter dem Titel und in Vorschauen)."
# status: Entwurf          # oder: in Arbeit, Notiz, fertig (wird als kleines Label angezeigt)
# slug: titel-ohne-umlaute # sonst wird die URL aus dem Dateinamen gebildet
# toc: true                # Inhaltsverzeichnis aus den ##/###-Überschriften
# tags: [Thema]
# last_modified_at: JJJJ-MM-TT
# archived: true           # blendet den Text aus der Liste aus
---

Text hier. Fußnoten gehen so.[^1]

Bild mit Bildunterschrift:

{% include bild.html src="/assets/bilder/titel-ohne-umlaute/bild.jpg" text="Bildunterschrift" %}

Bild ohne Unterschrift:

![Beschreibung](/assets/bilder/titel-ohne-umlaute/bild.jpg)

[^1]: Quelle oder Randbemerkung.
