import {LoadSkia} from '@shopify/react-native-skia/src/web';
import {registerRoot} from 'remotion';

LoadSkia().then(async () => {
  const {LongformCapabilitySmokeRoot} = await import('./Root');
  registerRoot(LongformCapabilitySmokeRoot);
});
