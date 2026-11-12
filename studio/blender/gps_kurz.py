"""Blender: GPS-Kurzszene (~11 s) – nah über Europa mit Pin → hoch ins All → Flug an einen GPS-Satelliten.

Aufruf:  blender -b -P studio/blender/gps_kurz.py -- <ausgabe-ordner> [frames] [samples]
Bilder:  <ausgabe-ordner>/####.png (1080×1920, 30 fps)
Assets (SSD, nicht in Git): erde-5400.jpg (NASA Blue Marble, Credit „NASA Earth Observatory“), studio_small_09_2k.hdr (Poly Haven, CC0).
"""
import math
import sys

import bpy
from mathutils import Vector

ASSETS = '/Volumes/T7/denkwuerfel/assets/'
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ZIEL = argv[0] if argv else '/Volumes/T7/denkwuerfel/blender/gps_kurz/'
FRAMES = int(argv[1]) if len(argv) > 1 else 330
SAMPLES = int(argv[2]) if len(argv) > 2 else 32

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x, sc.render.resolution_y = 1080, 1920
sc.render.fps = 30
sc.frame_start, sc.frame_end = 1, FRAMES
sc.eevee.taa_render_samples = SAMPLES
sc.render.use_motion_blur = False  # Bewegungsunschärfe kostet ein Vielfaches an Zeit (gemessen 20 s statt ~4 s pro Bild)
sc.render.motion_blur_shutter = 0.5
sc.view_settings.view_transform = 'AgX'
sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.image_settings.file_format = 'PNG'
sc.render.image_settings.compression = 0  # schneller schreiben
sc.render.filepath = ZIEL.rstrip('/') + '/'
sc.render.use_overwrite = False  # vorhandene Bilder überspringen (Fortsetzen nach Abbruch)


def mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links


P = lambda nodes: nodes.get('Principled BSDF')  # noqa: E731

# ───────── Welt: Sterne für die Kamera, HDR für Spiegelungen ─────────
w = bpy.data.worlds.new('Welt')
sc.world = w
w.use_nodes = True
wn, wl = w.node_tree.nodes, w.node_tree.links
for n in list(wn):
    wn.remove(n)
out = wn.new('ShaderNodeOutputWorld')
hdr = wn.new('ShaderNodeTexEnvironment')
hdr.image = bpy.data.images.load(ASSETS + 'studio_small_09_2k.hdr')
hbg = wn.new('ShaderNodeBackground')
hbg.inputs['Strength'].default_value = 0.35
wl.new(hdr.outputs['Color'], hbg.inputs['Color'])
koord = wn.new('ShaderNodeTexCoord')
vor = wn.new('ShaderNodeTexVoronoi')
vor.inputs['Scale'].default_value = 160
wl.new(koord.outputs['Generated'], vor.inputs['Vector'])
ramp = wn.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
ramp.color_ramp.elements[1].position = 0.035
ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
wl.new(vor.outputs['Distance'], ramp.inputs['Fac'])
mixc = wn.new('ShaderNodeMixRGB')
mixc.inputs['Color1'].default_value = (0.004, 0.006, 0.014, 1)
mixc.inputs['Color2'].default_value = (0.9, 0.92, 1.0, 1)
wl.new(ramp.outputs['Color'], mixc.inputs['Fac'])
sbg = wn.new('ShaderNodeBackground')
sbg.inputs['Strength'].default_value = 1.2
wl.new(mixc.outputs['Color'], sbg.inputs['Color'])
lp = wn.new('ShaderNodeLightPath')
mx = wn.new('ShaderNodeMixShader')
wl.new(lp.outputs['Is Camera Ray'], mx.inputs['Fac'])
wl.new(hbg.outputs['Background'], mx.inputs[1])
wl.new(sbg.outputs['Background'], mx.inputs[2])
wl.new(mx.outputs['Shader'], out.inputs['Surface'])

# ───────── Erde ─────────
R = 50.0
C = Vector((0, 0, 0))
bpy.ops.mesh.primitive_uv_sphere_add(segments=256, ring_count=128, radius=R, location=C)
erde = bpy.context.object
bpy.ops.object.shade_smooth()
em, en, el = mat('Erde')
eb = P(en)
tex = en.new('ShaderNodeTexImage')
tex.image = bpy.data.images.load(ASSETS + 'erde-5400.jpg')
tex.interpolation = 'Cubic'
el.new(tex.outputs['Color'], eb.inputs['Base Color'])
eb.inputs['Roughness'].default_value = 0.6
eb.inputs['Specular IOR Level'].default_value = 0.3
erde.data.materials.append(em)

# Punkt für Breite/Länge über die UV-Koordinaten der Kugel finden (genau so, wie die Textur aufliegt)
def punkt_aus_uv(lat, lon):
    me = erde.data
    uv = me.uv_layers.active.data
    zu, zv = (lon + 180) / 360, (lat + 90) / 180
    best, bestd = None, 9
    for poly in me.polygons:
        for li in poly.loop_indices:
            u, v = uv[li].uv
            d = (u - zu) ** 2 + (v - zv) ** 2
            if d < bestd:
                bestd, best = d, me.loops[li].vertex_index
    return (erde.matrix_world @ me.vertices[best].co).normalized() * R


PIN = punkt_aus_uv(51.0, 10.0)
n = PIN.normalized()
t1 = n.cross(Vector((0, 0, 1))).normalized()
t2 = n.cross(t1).normalized()

# Atmosphäre
bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=R * 1.02, location=C)
atmo = bpy.context.object
bpy.ops.object.shade_smooth()
am, an, al = mat('Atmosphaere')
for x in list(an):
    an.remove(x)
ao = an.new('ShaderNodeOutputMaterial')
lw = an.new('ShaderNodeLayerWeight')
lw.inputs['Blend'].default_value = 0.35
rr = an.new('ShaderNodeValToRGB')
rr.color_ramp.elements[0].position = 0.55
rr.color_ramp.elements[0].color = (0, 0, 0, 1)
al.new(lw.outputs['Facing'], rr.inputs['Fac'])
emi = an.new('ShaderNodeEmission')
emi.inputs['Color'].default_value = (0.25, 0.5, 1.0, 1)
emi.inputs['Strength'].default_value = 1.6
tr = an.new('ShaderNodeBsdfTransparent')
ms = an.new('ShaderNodeMixShader')
al.new(rr.outputs['Color'], ms.inputs['Fac'])
al.new(tr.outputs['BSDF'], ms.inputs[1])
al.new(emi.outputs['Emission'], ms.inputs[2])
al.new(ms.outputs['Shader'], ao.inputs['Surface'])
am.surface_render_method = 'BLENDED'
atmo.data.materials.append(am)

# Sonne von der Seite (Tag-Nacht-Grenze im Bild), Gegenlicht
bpy.ops.object.light_add(type='SUN')
sonne = bpy.context.object
sonne.data.energy = 4.5
sonne.data.angle = math.radians(1.0)
sonne.data.color = (1.0, 0.96, 0.9)
licht_dir = (t1 * 0.55 - n * 0.75 + t2 * 0.35).normalized()  # Licht fällt von der Kameraseite auf Europa und Satellit
sonne.rotation_euler = licht_dir.to_track_quat('-Z', 'Y').to_euler()

# ───────── Pin über Deutschland: leuchtender Punkt + pulsierender Ring ─────────
pin_m, pin_n, _ = mat('Pin')
for x in list(pin_n):
    pin_n.remove(x)
po = pin_n.new('ShaderNodeOutputMaterial')
pe = pin_n.new('ShaderNodeEmission')
pe.inputs['Color'].default_value = (1.0, 0.42, 0.29, 1)
pe.inputs['Strength'].default_value = 5
pin_m.node_tree.links.new(pe.outputs['Emission'], po.inputs['Surface'])
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22, location=PIN + n * 0.2)
pin = bpy.context.object
pin.data.materials.append(pin_m)
bpy.ops.mesh.primitive_torus_add(major_radius=0.55, minor_radius=0.04, location=PIN + n * 0.05)
ring = bpy.context.object
ring.rotation_euler = n.to_track_quat('Z', 'Y').to_euler()
ring.data.materials.append(pin_m)
for f in range(1, FRAMES + 1, 30):
    ring.scale = (0.4, 0.4, 0.4)
    ring.keyframe_insert('scale', frame=f)
    ring.scale = (2.4, 2.4, 2.4)
    ring.keyframe_insert('scale', frame=f + 28)

# ───────── Satellit (Block-IIF-Stil) ─────────
gold, gn, gl = mat('Goldfolie')
gb = P(gn)
gb.inputs['Metallic'].default_value = 1.0
noise = gn.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 6
noise.inputs['Detail'].default_value = 12
noise.inputs['Distortion'].default_value = 2.2
vk = gn.new('ShaderNodeTexVoronoi')
vk.inputs['Scale'].default_value = 7
vk.feature = 'DISTANCE_TO_EDGE'
add = gn.new('ShaderNodeMath')
gl.new(noise.outputs['Fac'], add.inputs[0])
gl.new(vk.outputs['Distance'], add.inputs[1])
bump = gn.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = 1.0
bump.inputs['Distance'].default_value = 0.03
gl.new(add.outputs['Value'], bump.inputs['Height'])
gl.new(bump.outputs['Normal'], gb.inputs['Normal'])
fr = gn.new('ShaderNodeValToRGB')
fr.color_ramp.elements[0].color = (0.62, 0.36, 0.08, 1)
fr.color_ramp.elements[1].color = (1.0, 0.8, 0.38, 1)
gl.new(noise.outputs['Fac'], fr.inputs['Fac'])
gl.new(fr.outputs['Color'], gb.inputs['Base Color'])
rmap = gn.new('ShaderNodeMapRange')
rmap.inputs['To Min'].default_value = 0.15
rmap.inputs['To Max'].default_value = 0.45
gl.new(noise.outputs['Fac'], rmap.inputs['Value'])
gl.new(rmap.outputs['Result'], gb.inputs['Roughness'])
weiss, wn2, _ = mat('Weiss')
P(wn2).inputs['Base Color'].default_value = (0.86, 0.87, 0.9, 1)
P(wn2).inputs['Roughness'].default_value = 0.42
metall, mn, _ = mat('Metall')
P(mn).inputs['Base Color'].default_value = (0.8, 0.82, 0.86, 1)
P(mn).inputs['Metallic'].default_value = 1.0
P(mn).inputs['Roughness'].default_value = 0.22
solar, sn, sl = mat('Solar')
sb = P(sn)
brick = sn.new('ShaderNodeTexBrick')
brick.inputs['Scale'].default_value = 14
brick.inputs['Mortar Size'].default_value = 0.012
brick.offset = 0.0
brick.inputs['Color1'].default_value = (0.03, 0.06, 0.2, 1)
brick.inputs['Color2'].default_value = (0.05, 0.09, 0.28, 1)
brick.inputs['Mortar'].default_value = (0.6, 0.62, 0.68, 1)
sl.new(brick.outputs['Color'], sb.inputs['Base Color'])
sb.inputs['Metallic'].default_value = 0.4
sb.inputs['Roughness'].default_value = 0.12
sb.inputs['Coat Weight'].default_value = 0.8


def teil(typ, name, groesse, ort, material, rot=(0, 0, 0), fase=0.0, parent=None):
    if typ == 'wuerfel':
        bpy.ops.mesh.primitive_cube_add(size=1, location=ort, rotation=rot)
        o = bpy.context.object
        o.scale = groesse
        bpy.ops.object.transform_apply(scale=True)
    else:
        bpy.ops.mesh.primitive_cylinder_add(radius=groesse[0], depth=groesse[1], location=ort, rotation=rot, vertices=32)
        o = bpy.context.object
    o.name = name
    if fase:
        b = o.modifiers.new('Fase', 'BEVEL')
        b.width = fase
        b.segments = 3
    bpy.ops.object.shade_smooth()
    o.data.materials.append(material)
    o.parent = parent
    return o


def satellit(name):
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.object
    root.name = name
    teil('wuerfel', 'Koerper', (1.3, 1.5, 1.3), (0, 0, 0), gold, fase=0.04, parent=root)
    for s in (-1, 1):
        for k in range(5):
            teil('wuerfel', 'Lamelle', (0.16, 0.04, 0.9), (-0.44 + k * 0.22, s * 0.77, 0.05), weiss, fase=0.01, parent=root)
    teil('wuerfel', 'Antennenplatte', (1.15, 1.15, 0.06), (0, 0, -0.7), metall, fase=0.01, parent=root)
    for i in range(12):
        a = i / 12 * 2 * math.pi
        r = 0.4 if i % 2 else 0.24
        teil('zyl', 'Wendel', (0.05, 0.32), (math.cos(a) * r, math.sin(a) * r, -0.88), weiss, parent=root)
    for s in (-1, 1):
        teil('zyl', 'Ausleger', (0.04, 0.9), (s * 1.1, 0, 0), metall, rot=(0, math.radians(90), 0), parent=root)
        teil('wuerfel', 'Joch', (0.08, 1.3, 0.08), (s * 1.58, 0, 0), metall, parent=root)
        for k in range(3):
            teil('wuerfel', 'Paneel', (1.15, 1.9, 0.04), (s * (2.25 + k * 1.2), 0, 0), solar, fase=0.008, parent=root)
    return root


def ausrichten(obj, ort):
    """Antennenfeld (−Z) zur Erdmitte, Flügel quer zur Bahn."""
    obj.location = ort
    obj.rotation_euler = (C - ort).normalized().to_track_quat('-Z', 'Y').to_euler()


H = R + 18.0
HAUPT = C + n * H + t1 * 13.0 + t2 * 1.5
sat = satellit('Satellit')
ausrichten(sat, HAUPT)
sat.keyframe_insert('rotation_euler', frame=1)
sat.rotation_euler.rotate_axis('Z', math.radians(25))
sat.keyframe_insert('rotation_euler', frame=FRAMES)
for i, (a, b) in enumerate([(-9, 6), (16, -10), (30, 8), (-20, -14), (42, 2), (8, 18)]):
    s2 = satellit(f'Sat{i}')
    ausrichten(s2, C + (n * H + t1 * a + t2 * b).normalized() * H)

# ───────── Kamera mit Ziel-Empty (Kamerafahrt) ─────────
bpy.ops.object.empty_add(location=PIN)
ziel = bpy.context.object
bpy.ops.object.camera_add(location=C + n * (R + 6))
cam = bpy.context.object
sc.camera = cam
cam.data.lens = 32
cam.data.clip_end = 2000
tt = cam.constraints.new('TRACK_TO')
tt.target = ziel
tt.track_axis = 'TRACK_NEGATIVE_Z'
tt.up_axis = 'UP_Y'
cam.data.dof.use_dof = True
cam.data.dof.focus_object = ziel
cam.data.dof.aperture_fstop = 2.8

KEYS = [
    # Frame, Kamera, Ziel
    (1, PIN + n * 16.0 - t1 * 3.5 - t2 * 3.0, PIN),
    (int(FRAMES * 0.33), PIN + n * 11.0 - t1 * 2.2 - t2 * 1.8, PIN),
    (int(FRAMES * 0.58), C + n * (H + 7) - t1 * 1.0 - t2 * 6.0, HAUPT - n * 7.0),
    (FRAMES, HAUPT + n * 3.6 - t1 * 5.2 - t2 * 3.2, HAUPT - n * 1.6),
]
for f, c_ort, z_ort in KEYS:
    cam.location = c_ort
    cam.keyframe_insert('location', frame=f)
    ziel.location = z_ort
    ziel.keyframe_insert('location', frame=f)
for o in (cam, ziel):
    for fc in o.animation_data.action.fcurves if hasattr(o.animation_data.action, 'fcurves') else []:
        for kp in fc.keyframe_points:
            kp.interpolation = 'BEZIER'
            kp.easing = 'EASE_IN_OUT'

import os  # noqa: E402
# Mess-Schalter (nur für Tests): GPS_DOF=0, GPS_SCHATTEN=0, GPS_HALB=1
if os.environ.get('GPS_DOF') == '0':
    cam.data.dof.use_dof = False
if os.environ.get('GPS_SCHATTEN') == '0':
    sonne.data.use_shadow = False
    gegen_licht = None
if os.environ.get('GPS_HALB') == '1':
    sc.render.resolution_percentage = 50

if len(argv) > 3:  # Einzelbild-Test: Frame-Nummer als 4. Argument
    sc.frame_set(int(argv[3]))
    sc.render.filepath = ZIEL.rstrip('/') + f'/test_{int(argv[3]):04d}.png'
    bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
print('FERTIG')
