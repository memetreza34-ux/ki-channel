import {Config} from '@remotion/cli/config';

// Required for @remotion/effects (WebGL2), @remotion/three and Skia-backed story layers.
// Keep rendering deterministic and compatible with CLI render/bundle workflows.
Config.setChromiumOpenGlRenderer('angle');
