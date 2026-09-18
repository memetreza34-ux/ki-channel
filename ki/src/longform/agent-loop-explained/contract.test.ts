import {describe,expect,it} from 'vitest';
import {AGENT_LOOP_CHAPTERS,AGENT_LOOP_DURATION_IN_FRAMES,AGENT_LOOP_FPS,AGENT_LOOP_HEIGHT,AGENT_LOOP_WIDTH} from './contract';
import {CHAPTER_SCENES} from './chapterScenes';
import {VOICE_WORDS} from './words.generated';

describe('agent loop longform contract',()=>{
  it('uses the current 16:9 YouTube standard',()=>{
    expect(AGENT_LOOP_WIDTH).toBe(1920);
    expect(AGENT_LOOP_HEIGHT).toBe(1080);
    expect(AGENT_LOOP_FPS).toBe(30);
  });

  it('keeps the baseline inside 5–6 minutes',()=>{
    expect(AGENT_LOOP_DURATION_IN_FRAMES).toBeGreaterThanOrEqual(300*30);
    expect(AGENT_LOOP_DURATION_IN_FRAMES).toBeLessThanOrEqual(360*30);
  });

  it('has continuous chapters covering the whole baseline',()=>{
    expect(AGENT_LOOP_CHAPTERS[0].startFrame).toBe(0);
    AGENT_LOOP_CHAPTERS.slice(1).forEach((c,i)=>expect(c.startFrame).toBe(AGENT_LOOP_CHAPTERS[i].endFrame));
    expect(AGENT_LOOP_CHAPTERS.at(-1)?.endFrame).toBe(AGENT_LOOP_DURATION_IN_FRAMES);
  });

  /**
   * Der Grund fuer die neue Laenge: das Video endete 76 Frames vor dem letzten
   * gesprochenen Wort. Dieser Test haelt fest, dass das Voiceover vollstaendig
   * ins Bild passt — und nicht wieder abgeschnitten wird.
   */
  it('laesst das Voiceover vollstaendig auslaufen',()=>{
    const lastWord=VOICE_WORDS.at(-1);
    expect(lastWord).toBeDefined();
    expect(AGENT_LOOP_DURATION_IN_FRAMES).toBeGreaterThan(lastWord!.b);
  });

  /**
   * Jedes Kapitel deckt genau den Absatz ab, der darin gesprochen wird. Wenn
   * eine Grenze verrutscht, stehen die Bilder wieder zu einem Text, der erst
   * spaeter kommt.
   */
  it('beginnt jedes Kapitel in einer Sprechpause',()=>{
    AGENT_LOOP_CHAPTERS.slice(1).forEach((chapter)=>{
      const wordAcross=VOICE_WORDS.find((w)=>w.a<chapter.startFrame&&w.b>chapter.startFrame);
      expect(wordAcross,`${chapter.id} schneidet ein gesprochenes Wort`).toBeUndefined();
    });
  });

  it('hat fuer jedes Kapitel Bilder',()=>{
    AGENT_LOOP_CHAPTERS.forEach((chapter)=>{
      const items=CHAPTER_SCENES[chapter.id];
      expect(items,`${chapter.id} hat keine Bilder`).toBeDefined();
      expect(items!.length).toBeGreaterThanOrEqual(7);
    });
  });

  /**
   * Die Kritik an der ersten Fassung war „zu wenig Animation". Dieser Wert
   * haelt die Gegenmassnahme fest: mindestens ein Bildwechsel alle vier
   * Sekunden, statt neun Auftritten auf 40 Sekunden Kapitellaenge.
   */
  it('haelt die Bilddichte hoch genug',()=>{
    AGENT_LOOP_CHAPTERS.forEach((chapter)=>{
      const items=CHAPTER_SCENES[chapter.id] ?? [];
      const seconds=(chapter.endFrame-chapter.startFrame)/AGENT_LOOP_FPS;
      const secondsPerImage=seconds/items.length;
      expect(secondsPerImage,`${chapter.id}: ${secondsPerImage.toFixed(1)}s je Bild`).toBeLessThan(5);
    });
  });
});
