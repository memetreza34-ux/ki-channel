import React from 'react';
import {Composition, Folder} from 'remotion';
import {FORMATS, FPS} from './kit';
import {PROJEKTE} from './projekte';
import {IconSuche} from './projekte/kit-katalog/IconSuche';
import {
  ERKLAER_BEISPIELE,
  Erklaerer,
  erklaererMetadata,
  erklaererSchema,
  Spot,
  SPOT_BEISPIELE,
  spotMetadata,
  spotSchema,
} from './ersteller';

export const StudioRoot: React.FC = () => (
  <>
    {/*
      Ersteller: "Spot" und "Erklaerer" rechts in Studio über das Formular bearbeiten,
      mit "Save" speichern und mit "Render" als Video ausgeben.
    */}
    <Folder name="Ersteller">
      <Composition
        id="Spot"
        component={Spot}
        schema={spotSchema}
        calculateMetadata={spotMetadata}
        durationInFrames={240}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          design: 'editorial' as const,
          format: 'vertical' as const,
          hook: ['Neue KI?', 'Kein Plan?', "Wir erklären's."],
          held: {titel: 'KI einfach erklärt.', hervorheben: ['einfach'], icon: 'fluent-emoji-flat:robot'},
          punkte: ['Kurz', 'Ehrlich', 'Mit Beispielen'],
          cta: {titel: 'Mehr KI, einfach erklärt.', knopf: 'Jetzt folgen'},
          sounds: true,
        }}
      />
      <Composition
        id="Erklaerer"
        component={Erklaerer}
        schema={erklaererSchema}
        calculateMetadata={erklaererMetadata}
        durationInFrames={300}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          design: 'editorial' as const,
          format: 'vertical' as const,
          uebergang: 'cut' as const,
          sounds: true,
          szenen: [
            {typ: 'titel' as const, kicker: 'KI einfach erklärt', titel: 'Hier steht dein Thema', hervorheben: ['Thema'], icon: 'ph:sparkle-duotone', sekunden: 3},
            {typ: 'liste' as const, titel: 'Das Wichtigste', punkte: ['Punkt eins', 'Punkt zwei', 'Punkt drei'], ton: 'gut' as const, sekunden: 4},
            {typ: 'ende' as const, titel: 'Mehr KI, einfach erklärt.', knopf: 'Folgen', sekunden: 3},
          ],
        }}
      />
    </Folder>
    <Folder name="Werkzeuge">
      <Composition
        id="Icon-Suche"
        component={IconSuche}
        durationInFrames={1}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{titel: 'Icon-Suche', icons: ['ph:robot-duotone', 'tabler:robot', 'lucide:bot', 'fluent-emoji-flat:robot', 'logos:openai-icon']}}
      />
    </Folder>
    <Folder name="Beispiele">
      {SPOT_BEISPIELE.map((b) => (
        <Composition key={b.id} id={b.id} component={Spot} schema={spotSchema} calculateMetadata={spotMetadata} durationInFrames={240} fps={FPS} width={1080} height={1920} defaultProps={b.props} />
      ))}
      {ERKLAER_BEISPIELE.map((b) => (
        <Composition key={b.id} id={b.id} component={Erklaerer} schema={erklaererSchema} calculateMetadata={erklaererMetadata} durationInFrames={300} fps={FPS} width={1080} height={1920} defaultProps={b.props} />
      ))}
    </Folder>
    {PROJEKTE.flatMap((p) => {
      const formats = Array.isArray(p.format) ? p.format : [p.format];
      return formats.map((format, i) => {
        const id = i === 0 ? p.id : `${p.id}-${format}`;
        return (
          <Composition
            key={id}
            id={id}
            component={p.component}
            durationInFrames={p.durationInFrames}
            fps={p.fps ?? FPS}
            width={FORMATS[format].width}
            height={FORMATS[format].height}
          />
        );
      });
    })}
  </>
);
