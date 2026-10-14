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
| `_pcp/*.md` | Kapitel & Notizen zum PCP-Buch (Collection). URL: `/pcp/<dateiname>/` |
| `pcp.html` | Buchseite `/pcp/`, listet `_pcp/` sortiert nach `order` |
| `index.html` | Startseite: Intro, Buch, alle Texte, Projekte, Listen |
| `articles.html` | `/articles/`, alle Texte nach Jahr |
| `_layouts/default.html` | HTML-Gerüst für alle Seiten: Head, SEO/OG-Tags, Analytics, Navigation, Footer |
| `_layouts/post.html` | Layout für Texte und Kapitel: Titel, Metazeile, Inhaltsverzeichnis, Drop Cap |
| `_includes/post-list.html` | Liste der Texte nach Jahr (blendet `archived: true` aus) |
| `_includes/bild.html` | Bild mit Bildunterschrift |
| `_includes/toc.html` | Inhaltsverzeichnis aus `##`/`###` |
| `_includes/footer.html` | Footer (Email, Nostr, RSS, Impressum, Datenschutz) |
| `_includes/contents/*.md` | Inhalt von Leseliste, Musikliste, Tools |
| `_vorlagen/` | Kopiervorlagen `text.md` und `pcp-kapitel.md` (wird nicht gebaut) |
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

## Ein PCP-Kapitel schreiben

1. `_vorlagen/pcp-kapitel.md` nach `_pcp/<name>.md` kopieren (z.B. `_pcp/01-anfaenge.md`).
2. `title` und `order` setzen. Die Buchseite `/pcp/` listet das Kapitel automatisch.
3. Bilder nach `assets/bilder/pcp/`.

## Front Matter

| Feld | Wirkung |
|---|---|
| `title` | Pflicht. Überschrift und Seitentitel |
| `description` | Kursiver Untertitel unter der Überschrift, Meta-Description, Vorschautext |
| `status` | Kleines Label in Titelnähe und in Listen, z.B. `Entwurf`, `in Arbeit`, `Notiz`, `fertig` |
| `toc: true` | Inhaltsverzeichnis über dem Text (siehe unten) |
| `dropcap: false` | Initiale abschalten (Standard für Texte und Kapitel: an) |
| `slug` | URL-Teil bei Texten, sonst aus dem Dateinamen. Ohne Umlaute bevorzugt |
| `permalink` | Feste URL. Bestehende Texte haben `/articles/<slug>/`, **nie ändern** (externe Links) |
| `tags: [A, B]` | Erscheinen in der Metazeile |
| `last_modified_at` | Zeigt „aktualisiert TT.MM.JJJJ“; bei Kapiteln auch Datum in der Kapitelliste |
| `order` | Nur `_pcp/`: Reihenfolge auf der Buchseite |
| `archived: true` | Text bleibt unter seiner URL erreichbar, verschwindet aber aus allen Listen |
| `image` | Nur Vorschaubild für Social Media (og:image). **Wird auf der Seite nicht angezeigt** |
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
erzeugt, steht über dem Text und ist aufklappbar. Keine Markierung im Text nötig,
**nicht** zusätzlich kramdowns `{:toc}` verwenden.

### Drop Cap (Initiale)

Standardmäßig an: Der erste Absatz eines Textes oder Kapitels bekommt eine große Initiale,
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
(`breite=400` oder `breite="400"`), andere CSS-Werte gehen als Text (`breite="50%"`, `hoehe="15rem"`).

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

Bilder sind zentriert, nie breiter als die Textspalte und werden verzögert geladen.
Beim Include führt ein Klick auf das Bild zur Originaldatei.

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
- Bei CSS-Änderungen die Versionsnummer in `_layouts/default.html` (`main.css?v=N`) hochzählen.
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
