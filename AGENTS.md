# miotares.com – Anleitung für Agents

Persönliche Website von miotares: ein öffentlicher Notizblock für Texte, Recherchen und
Kaninchenbauten (Vorbild: gwern.net). Dazu ein Buchprojekt über die Rap-Gruppe PCP.
Statische Seite mit **Jekyll 4**, Inhalte in **Markdown (kramdown)**, Sprache **Deutsch**.

Leitprinzip: **so wenig Reibung beim Schreiben wie möglich.** Ein neuer Text braucht nur
`title` und Inhalt. Keine Pflichtbilder, keine Webfonts, keine Frameworks, kein JS-Build.

## Struktur

| Pfad | Zweck |
|---|---|
| `_posts/JJJJ-MM-TT-titel.md` | Texte (Blog). URL: `/articles/<slug>/` |
| `pcp.md` | Das PCP-Buch als **eine** durchgehende Markdown-Seite unter `/pcp/` (mit Inhaltsverzeichnis) |
| `index.html` | Startseite: Intro, Buch, alle Texte, Projekte, Listen |
| `articles.html` | `/articles/`, alle Texte nach Jahr |
| `_layouts/default.html` | HTML-Gerüst für alle Seiten: Head, SEO/OG-Tags, Analytics, Navigation, Footer |
| `_layouts/post.html` | Layout für Texte und `pcp.md`: Label, Titel, Metazeile, Inhaltsverzeichnis, Drop Cap |
| `_includes/post-list.html` | Liste der Texte nach Jahr (blendet `archived: true` aus) |
| `_includes/bild.html` | Bild mit Bildunterschrift, Größe und Position neben dem Text |
| `_includes/toc.html` | Inhaltsverzeichnis aus `##`/`###`, Teile als Zwischentitel (oben im Text + Seitenleiste) |
| `assets/js/toc.js` | Blendet die Seitenleiste ein und markiert den aktuellen Abschnitt |
| `assets/js/galerie.js` | Galerie-Ansicht mit Zoom für alle Bilder im Text (eigener Code, keine Bibliothek) |
| `_includes/footer.html` | Footer (Email, Nostr, RSS, Impressum, Datenschutz) |
| `_includes/contents/*.md` | Inhalt von Leseliste, Musikliste, Tools |
| `_vorlagen/` | Kopiervorlage `text.md` mit allen Bausteinen (wird nicht gebaut) |
| `assets/css/main.css` | Das einzige Stylesheet (Farben als CSS-Variablen, Dark Mode automatisch) |
| `assets/css/legacy.css` | Altes Design, nur noch für `spenden.html` (nicht verlinkt) |
| `assets/bilder/<slug>/`, `assets/bilder/pcp/` | Bilder zu Texten bzw. zum Buch |
| `assets/thumbnails/` | Alte Artikelbilder, nur noch als Vorschaubild beim Teilen (`image:`) |
| `privacy.html` | Datenschutzerklärung der iOS-App Bitcoin Insight (Englisch, URL `/privacy/` nicht ändern) |

Neue Seiten bekommen automatisch `layout: default` und enthalten nur ihren Inhalt,
keinen eigenen `<html>`/`<head>`. `layout: none` nur für Altlasten (`spenden.html`).

## Lokal bauen und ansehen

Ruby kommt aus Homebrew (das System-Ruby 2.6 ist zu alt):

```bash
export PATH=/opt/homebrew/opt/ruby/bin:$PATH
bundle install
bundle exec jekyll serve      # http://localhost:4000
bundle exec jekyll build      # Ergebnis in _site/
```

Im Claude-Desktop-Browser: `.claude/launch.json` enthält die Konfiguration `jekyll`.
Änderungen an `_config.yml` brauchen einen Neustart des Servers.

## Einen neuen Text schreiben

1. `_vorlagen/text.md` nach `_posts/JJJJ-MM-TT-titel.md` kopieren.
2. `title` setzen, losschreiben. Alles andere ist optional.

## Am PCP-Buch schreiben

Das Buch ist bewusst **eine einzige Seite**: `pcp.md` im Hauptverzeichnis, URL `/pcp/`
(Vorbild: lange Essays auf gwern.net). Kapitel sind `##`-Überschriften, Unterkapitel `###`.
Das Inhaltsverzeichnis zeigt nur Teile und Kapitel (`toc: true`, `toc_tiefe: 2`), keine `###`.
Unterkapitel sparsam einsetzen: lieber wenige, aussagekräftige `###` als viele kleine.
Bilder nach `assets/bilder/pcp/`. Es gibt keine Unterseiten oder Kapitel-Dateien.

Jedes Kapitel ist so aufgebaut (die automatische Initiale ist in `pcp.md` mit `dropcap: false`
abgeschaltet, stattdessen bekommt jedes Kapitel seine eigene):

```markdown
## Prolog

*Am Anfang…*<br>
*…war das Ende.*
{: .epigraph}

Erster Absatz des Kapitels.
{: .dropcap}

Weiterer Text …
```

Den Text des Autors nicht umformulieren oder „verbessern“, nur so einbauen, wie er geliefert wird.

Das Buch ist in Teile gegliedert (Teil I, Teil II …, Anhang). Eine Teil-Überschrift ist ein `##` mit
der Klasse `.teil` und fester ID, nach einem `---`. Sie wird zentriert in Kapitälchen gesetzt und
erscheint im Inhaltsverzeichnis als Zwischentitel ohne Nummer:

```markdown
---

## Teil II<br>Die Geschichte
{: #teil-2 .teil}
```

Kapitel, die nicht nummeriert werden sollen (Prolog, Anhang-Kapitel), bekommen `{: .ohne-nummer}`
direkt unter die Überschrift.

Teil III besteht aus Porträts, eins pro Person, immer gleich gebaut: Motto, zwei Steckbrief-Zeilen
(getrennt durch `<br>`, darunter `{: .steckbrief}`), Bild, Einleitung mit `{: .dropcap}`, dann genau
drei Abschnitte: `### Porträt` (Leben und musikalische Entwicklung), `### Diskografie` (Solowerk als
Tabelle oder Liste) und `### Heute` (was die Person heute öffentlich macht, mit Abrufdatum in der
Fußnote). Teil IV enthält nur noch die Diskografie der Gruppe und die Texte.

Quellen stehen als kramdown-Fußnoten (`[^k4-thread]`, Präfix pro Kapitel, keine Umlaute im Namen).
Interne Prüfvermerke als HTML-Kommentar (`<!-- PRÜFEN: … -->`), die sind auf der Seite unsichtbar.

## Front Matter

| Feld | Wirkung |
|---|---|
| `title` | Pflicht. Überschrift und Seitentitel |
| `description` | Kursiver Untertitel unter der Überschrift, Meta-Description, Vorschautext |
| `status` | Kleines Label in Titelnähe und in Listen, z.B. `Entwurf`, `in Arbeit`, `Notiz`, `fertig` |
| `toc: true` | Inhaltsverzeichnis über dem Text und mitwandernd links (siehe unten) |
| `toc_tiefe: 2` | Inhaltsverzeichnis nur aus `##` (Standard 3: auch `###`) |
| `blocksatz: true` | Alle Absätze im Blocksatz (siehe unten) |
| `dropcap` | Initiale am Textanfang. Bei Texten in `_posts/` standardmäßig an (`false` schaltet ab), auf anderen Seiten mit `dropcap: true` einschalten |
| `label` | Kleine farbige Zeile über dem Titel, z.B. `"Buch · Arbeitstitel"` |
| `slug` | URL-Teil bei Texten, sonst aus dem Dateinamen. Ohne Umlaute bevorzugt |
| `permalink` | Feste URL. Bestehende Texte haben `/articles/<slug>/`, **nie ändern** (externe Links) |
| `tags: [A, B]` | Erscheinen in der Metazeile |
| `last_modified_at` | Zeigt „aktualisiert TT.MM.JJJJ“ in der Metazeile |
| `archived: true` | Text bleibt unter seiner URL erreichbar, verschwindet aber aus allen Listen |
| `image` | Nur Vorschaubild für Social Media (og:image). **Wird auf der Seite nicht angezeigt** |
| `layout: post` | Nötig für Seiten außerhalb von `_posts/` (z.B. `pcp.md`), damit sie wie ein Text aussehen |
| `robots` | Standard `index,follow` |
| `published: false` | Text wird gar nicht gebaut |

Felder wie `categories`, `lang`, `image_alt`, `canonical`, `twitter_card` in alten Texten sind
Altlasten und werden vom Layout ignoriert. `canonical` zeigt teils auf miotares.de – nicht verwenden.

## Markdown-Bausteine

### Überschriften

`#` nicht im Text verwenden (der Titel ist schon `h1`). Abschnitte mit `##`, Unterabschnitte mit `###`.
kramdown vergibt automatisch IDs (`## Die Anfänge` → `#die-anfänge`), darauf baut das Inhaltsverzeichnis auf.

### Inhaltsverzeichnis

`toc: true` ins Front Matter. Es wird aus allen `##` (nummeriert) und `###` (eingerückt)
erzeugt, steht über dem Text und ist aufklappbar. Mit `toc_tiefe: 2` nur aus `##`.
`##` mit `{: .teil}` erscheinen als Zwischentitel, `##` mit `{: .ohne-nummer}` ohne Nummer. Keine Markierung im Text nötig,
**nicht** zusätzlich kramdowns `{:toc}` verwenden.

Auf breiten Bildschirmen (≥ 1220 px) erscheint dasselbe Verzeichnis zusätzlich als
Seitenleiste links neben dem Text, sobald man am oberen Verzeichnis vorbeigescrollt ist.
Sie bleibt beim Scrollen stehen, der aktuelle Abschnitt ist fett markiert, ein Klick auf
„Inhalt“ springt nach oben. Auf schmaleren Bildschirmen gibt es nur das obere Verzeichnis.

### Blocksatz

`blocksatz: true` im Front Matter setzt alle Absätze und Listen des Textes in Blocksatz
(mit automatischer Silbentrennung; Mottos/Epigraphe bleiben linksbündig). In `pcp.md` ist er an.
Einzelner Absatz im Blocksatz, ohne die ganze Seite umzustellen:

```markdown
Dieser Absatz steht im Blocksatz.
{: .blocksatz}
```

Mehrere Klassen lassen sich kombinieren: `{: .dropcap .blocksatz}`.

### Drop Cap (Initiale)

Bei Texten standardmäßig an (in `pcp.md` per `dropcap: true`): Der erste Absatz bekommt eine große Initiale,
die erste Zeile steht in Kapitälchen. Abschalten mit `dropcap: false`.
Für einen beliebigen weiteren Absatz (z.B. Beginn eines neuen Teils) die kramdown-Klasse
direkt **unter** den Absatz schreiben:

```markdown
Das ist der Absatz mit Initiale.
{: .dropcap}
```

Hinweis: Beginnt der Text mit einem Bild oder Zitat statt mit einem Absatz, bekommt trotzdem
der erste echte Absatz (`<p>`) die Initiale.

### Bilder

Bilder liegen im Repo unter `assets/bilder/<slug>/` (Texte) bzw. `assets/bilder/pcp/` (Buch).
Pfade immer absolut ab `/assets/...`. Vor dem Einchecken verkleinern, z.B.
`sips -Z 1600 datei.jpg` (macOS; überschreibt die Datei).

Mit Bildunterschrift (Unterschrift darf Markdown enthalten, `alt` ist optional und fällt auf
den Text der Unterschrift zurück):

```liquid
{% include bild.html src="/assets/bilder/pcp/cover.jpg" text="Das Cover, *2009*" alt="Albumcover" %}
```

Ohne Unterschrift, normales Markdown:

```markdown
![Beschreibung des Bildes](/assets/bilder/pcp/cover.jpg)
```

**Größe festlegen** mit `breite` und/oder `hoehe` im Include. Eine Zahl bedeutet Pixel
(`breite=400` oder `breite="400"`), ein Bruch einen Anteil der Textspalte (`breite="1/3"`),
andere CSS-Werte gehen als Text (`breite="50%"`, `hoehe="15rem"`).

| Angabe | Ergebnis |
|---|---|
| keine | volle Spaltenbreite (oder Originalgröße, falls kleiner) |
| nur `breite` | Breite fest, Höhe passt sich an, Seitenverhältnis bleibt |
| nur `hoehe` | Höhe fest, Breite passt sich an, Seitenverhältnis bleibt |
| `breite` und `hoehe` | Bild wird genau auf diese Maße gebracht, wird dabei ggf. verzerrt |

```liquid
{% include bild.html src="/assets/bilder/pcp/flyer.jpg" text="Flyer" breite=300 %}
{% include bild.html src="/assets/bilder/pcp/banner.jpg" breite=600 hoehe=150 %}
```

Im reinen Markdown geht nur die Breite (Seitenverhältnis bleibt): `![Text](/pfad.jpg){: width="300"}`.

**Bild neben dem Text** mit `seite="rechts"` oder `seite="links"`. Das Bild schwebt an den
Rand, der Text fließt daneben und läuft darunter in voller Breite weiter, wenn er länger ist.
`breite` bestimmt den Anteil des Bildes (Standard `"1/2"`), der Text bekommt den Rest:

| Aufteilung | Angabe |
|---|---|
| Hälfte / Hälfte | `seite="links" breite="1/2"` (oder nur `seite="links"`) |
| Bild 1/3, Text 2/3 | `seite="rechts" breite="1/3"` |
| Bild 2/3, Text 1/3 | `seite="rechts" breite="2/3"` |
| Bild 1/4, Text 3/4 | `seite="rechts" breite="1/4"` |

```liquid
{% include bild.html src="/assets/bilder/pcp/cover.jpg" text="Cover (2009)" seite="rechts" breite="1/3" %}

Dieser Absatz steht links neben dem Bild …
```

Regeln dazu:
- Das Include steht **vor** dem Absatz, der daneben stehen soll.
- Jede `##`/`###`-Überschrift, `---` und die Fußnoten beginnen immer unterhalb des Bildes.
- Mit `hoehe` wird das Bild auf diese Höhe zugeschnitten (nicht verzerrt).
- Auf schmalen Bildschirmen (≤ 520 px) steht das Bild zentriert über dem Text.

Bilder sind zentriert, nie breiter als die Textspalte und werden verzögert geladen.
**Galerie-Ansicht:** Jedes Bild im Text (Include und reines Markdown) öffnet sich per Klick
groß in einer dunklen Ansicht mit Bildunterschrift und Zähler. Dort:
- Zoomen: Mausrad, Doppelklick/Doppeltipp, zwei Finger, Tasten `+`/`-`, `0` setzt zurück
- Verschieben: ziehen, wenn gezoomt
- Blättern durch alle Bilder der Seite: Pfeiltasten, Knöpfe ‹ ›, wischen
- Schließen: `Esc`, ×, Klick neben das Bild

Bilder, die per Markdown auf eine *andere* Adresse verlinken, bleiben normale Links.
Keine Lightbox-Bibliothek nachrüsten; `galerie.js` wird vom Post-Layout immer geladen.

### Motto (Epigraph)

Kurzes Motto oder Zitat am Kapitelanfang, eingerückt und gedämpft. Zeilenumbrüche mit `<br>`:

```markdown
*Am Anfang…*<br>
*…war das Ende.*
{: .epigraph}
```

### Fußnoten

```markdown
Behauptung.[^quelle]

[^quelle]: Autor, *Titel*, Jahr. [Link](https://…)
```

Erscheinen gesammelt am Ende. Externe Links im Text öffnen sich automatisch in neuem Tab.

### Sonstiges

- Zitat: `> Text` (grauer linker Rand)
- Trenner: `---` auf eigener Zeile (wird als ⁂ dargestellt)
- Tabellen: normale Markdown-Tabellen
- Code: `` `inline` `` und ```` ``` ````-Blöcke
- Eigene Klassen auf Absätzen per kramdown-IAL: `{: .klasse}` unter dem Absatz

## Design-Regeln

- Schlicht, typografisch, gwern-artig. Eine Textspalte (`--measure: 40rem`), Serifen-Systemschriften.
- Farben nur über die Variablen in `:root` von `main.css`; jede Farbe braucht ihren
  Gegenpart im `@media (prefers-color-scheme: dark)`-Block.
- Akzentfarbe `--mark` sparsam: Status-Labels, Initiale, Buch-Label.
- Keine Google Fonts oder andere externen Ressourcen (Datenschutz), keine Bild-Pflicht, keine Icons/Logos.
- Bei CSS-Änderungen die Versionsnummer in `_layouts/default.html` (`main.css?v=N`) hochzählen,
  bei JS-Änderungen die in `_layouts/post.html` (`toc.js?v=N`, `galerie.js?v=N`).
- Muss auf Handybreite (375px) funktionieren.

## Analytics

Umami über `t.miotares.com` auf allen Seiten (im Default-Layout). Zusätzlich Umami Cloud,
wenn eine Seite `umami_cloud_id` im Front Matter hat (Startseite, `privacy.html`).
Klick-Events per `data-umami-event` (Projekte, Kontakt).

## Git

- Commit-Messages auf Deutsch.
- Tag `vor-redesign` markiert den Stand vor dem Umbau zur persönlichen Website (Oktober 2026).
- Nur committen/pushen, wenn der Nutzer es verlangt. Push kann die Live-Seite verändern.
- In `_posts/` tauchen manchmal Dateien als „untracked“ auf, deren Namen nur in der
  Unicode-Normalisierung (NFD statt NFC, macOS) abweichen. Das sind keine neuen Texte –
  nicht einchecken, sonst existieren die Artikel doppelt.
