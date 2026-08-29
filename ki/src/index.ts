import {LoadSkia} from '@shopify/react-native-skia/src/web';
import {registerRoot} from 'remotion';

LoadSkia().then(async () => {
  const {RemotionRoot} = await import('./Root');
  registerRoot(RemotionRoot);
});
