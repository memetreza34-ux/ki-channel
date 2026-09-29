# Motion Engine example

```tsx
<CinematicCameraRig move="impact-push" impactFrame={42}>
  <DirectionalBlur startFrame={12} peakFrame={34} endFrame={45}>
    <ChoreographedObject
      path={[[80,900],[220,620],[420,520],[610,730]]}
      anticipationStart={0}
      launchFrame={12}
      impactFrame={42}
      settleFrame={68}
      endFrame={100}
    >
      <HeroObject />
    </ChoreographedObject>
  </DirectionalBlur>
</CinematicCameraRig>
```

Die Werte werden pro Szene authored. Das ist bewusst kein universelles Auto-Layout.
