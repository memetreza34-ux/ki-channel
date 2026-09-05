# Motion Readability Review

**Status:** SUPERSEDED_TEST_REVIEW — der erste Test-Render wurde geprüft, danach wurde der Source gezielt verbessert. Ein neuer gemasterter Render ist Pflicht.

## Befunde aus dem ersten Test-Render

- Cover/Hook: stark und sofort verständlich.
- Caption-Lesbarkeit: Position/Größe gut, aber die Schrift fiel außerhalb der Scene-Stage auf Browser-Serif zurück.
- Szene 3: inhaltlich gut, visuell zeitweise zu stark wie eine statische Infografik/Carousel-Folie.
- Szene 4: journalistisch stark, aber die Gegenpositionen reagierten zu wenig auf den gesprochenen Fokus.
- Ending: letzter Zustand war gut, aber der Render endete zu nah an laufender UI-Bewegung.
- Audio: Test-MP4 lag deutlich unter dem Social-Master-Ziel; der rohe Render-/Upload-Pfad hatte das vorhandene -16-LUFS-Mastering umgangen.

## Daraufhin im Source geändert

- Shared Captions besitzen jetzt eine explizite Sans-Serif-Brandtypografie.
- Cover-Frame zeigt bereits eine dezente erste Recent-Changes-Aktivität, ohne die Headline zu verdrängen.
- Szene 3 besitzt einen sichtbaren Indizien→Einordnung-Flow und dichtere, frühere Entwicklung.
- Szene 4 gewichtet Forscherbericht/OpenAI-Reaktion dynamisch nach dem gesprochenen Abschnitt.
- Alle Schluss-Reveals enden früher; die letzten 24 Frames sind ein ruhiger Hold.
- Neuer kanonischer `render-social-reel.mjs` rendert H.264/CRF18 und mastert danach automatisch auf ca. -16 LUFS / -1,5 dBTP.

## Neuer Review erforderlich

COVER_READABLE_AT_1X: PENDING
CAPTION_SAFE_AT_1X: PENDING
ONE_PRIMARY_FOCUS: PENDING
NO_LONG_STATIC_HOLDS: PENDING
BRAND_RECOGNIZABLE_WITHOUT_CAPTION: PENDING
PRIMARY_BRAND_REAPPEARS: PENDING
BRAND_ASSET_VISIBLE_OR_JUSTIFIED: PENDING
BRAND_COLOR_COHERENCE: PENDING
FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS: PENDING
MOTION_NOT_TEMPLATE_LOCKED: PENDING
ANIMATION_TECHNIQUE_FITS_STORY: PENDING
NO_ACCIDENTAL_COLOR_DRIFT: PENDING
REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED: PENDING
CLAIM_VS_RESPONSE_FAIR: PENDING
SOCIAL_AUDIO_MASTER_AT_TARGET: PENDING
CLEAN_FINAL_HOLD: PENDING

REVIEWED_VIDEO_SHA256:

Nur den **neu erzeugten gemasterten Review-Master** bei 1x prüfen und danach auf PASS setzen. Der vorherige Test-Render darf wegen der Source-Änderungen nicht als Freigabenachweis wiederverwendet werden.
