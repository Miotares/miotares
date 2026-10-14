---
# Vorlage für ein Kapitel oder eine Notiz zum PCP-Buch.
# Kopieren nach _pcp/dateiname.md (z.B. _pcp/01-anfaenge.md). URL wird /pcp/dateiname/.
# Bilder dazu in assets/bilder/pcp/ ablegen.
title: "Kapitel- oder Notiztitel"
order: 1                   # Reihenfolge auf der Buchseite
status: Entwurf
toc: true                  # Inhaltsverzeichnis aus den ##/###-Überschriften
# dropcap: false           # Initiale am Textanfang abschalten (Standard: an)
# description: "Kurz, worum es geht."
# image: /assets/bilder/pcp/titelbild.jpg   # nur Vorschaubild beim Teilen, wird nicht angezeigt
# last_modified_at: JJJJ-MM-TT
---

Einleitung hier.

## Erster Abschnitt

Text. Ein Bild mit Bildunterschrift:

{% include bild.html src="/assets/bilder/pcp/beispiel.jpg" text="Bildunterschrift, gern mit *Kursiv* oder [Link](https://example.com)" %}

Mit fester Größe (Zahl = Pixel; nur eins von beiden = Seitenverhältnis bleibt, beide = genau diese Maße):

{% include bild.html src="/assets/bilder/pcp/beispiel.jpg" text="Bildunterschrift" breite=300 %}

Oder ganz schlicht ohne Unterschrift:

![Beschreibung des Bildes](/assets/bilder/pcp/beispiel.jpg)

### Unterabschnitt

Taucht eingerückt im Inhaltsverzeichnis auf.[^1]

[^1]: Quelle oder Randbemerkung.
