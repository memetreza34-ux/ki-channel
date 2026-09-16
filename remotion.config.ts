// Remotion-CLI-Konfiguration für das KI-Channel-Repository.
//
// Der Kanal-Workspace liegt unter `ki/`, damit auch sein `public/`-Ordner.
// Ohne diese Zeile sucht die CLI `public/` im Repository-Root, findet die
// Marken-Fonts nicht (404) und rendert jedes Video in der Fallback-Schrift
// statt in Bebas Neue / Inter.
import {Config} from '@remotion/cli/config';

Config.setPublicDir('ki/public');
