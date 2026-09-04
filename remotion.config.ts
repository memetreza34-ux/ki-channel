import {Config} from '@remotion/cli/config';
import {enableSkia} from '@remotion/skia/enable';

// @remotion/effects uses WebGL2 and @remotion/three benefits from ANGLE.
Config.setChromiumOpenGlRenderer('angle');

// Required by @remotion/skia so CanvasKit/Skia can be bundled correctly.
Config.overrideWebpackConfig((currentConfiguration) => {
  return enableSkia(currentConfiguration);
});
