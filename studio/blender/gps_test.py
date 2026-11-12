"""Blender-Test: fotorealistische GPS-Einstellung (Satellit vor der Erde), per Python ohne Oberfläche.

Aufruf:  blender -b -P studio/blender/gps_test.py -- [ausgabe.png]
Assets (nicht in Git, auf der SSD): /Volumes/T7/denkwuerfel/assets/erde-5400.jpg (NASA Blue Marble, Credit „NASA Earth
Observatory“), studio_small_09_2k.hdr (Poly Haven, CC0).
"""
import math
import sys

import bpy

ASSETS = '/Volumes/T7/denkwuerfel/assets/'
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ZIEL = argv[0] if argv else '/Volumes/T7/denkwuerfel/blender/gps_test.png'

# ───────── Szene leeren ─────────
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = 1080
sc.render.resolution_y = 1920
sc.render.film_transparent = False
sc.eevee.taa_render_samples = 96
sc.view_settings.view_transform = 'AgX'
sc.view_settings.look = 'AgX - Medium High Contrast'


def mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links


def principled(nodes):
    return nodes.get('Principled BSDF')


# ───────── Welt: Sterne für die Kamera, HDR-Studio für Spiegelungen ─────────
w = bpy.data.worlds.new('Welt')
sc.world = w
w.use_nodes = True
wn, wl = w.node_tree.nodes, w.node_tree.links
for n in list(wn):
    wn.remove(n)
out = wn.new('ShaderNodeOutputWorld')
hdr = wn.new('ShaderNodeTexEnvironment')
hdr.image = bpy.data.images.load(ASSETS + 'studio_small_09_2k.hdr')
hdr_bg = wn.new('ShaderNodeBackground')
hdr_bg.inputs['Strength'].default_value = 0.6
wl.new(hdr.outputs['Color'], hdr_bg.inputs['Color'])
# Sterne: Voronoi-Punkte, nur sehr helle Zellen
coord = wn.new('ShaderNodeTexCoord')
vor = wn.new('ShaderNodeTexVoronoi')
vor.inputs['Scale'].default_value = 160
vor.feature = 'F1'
wl.new(coord.outputs['Generated'], vor.inputs['Vector'])
ramp = wn.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
ramp.color_ramp.elements[1].position = 0.035
ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
wl.new(vor.outputs['Distance'], ramp.inputs['Fac'])
stern_bg = wn.new('ShaderNodeBackground')
stern_bg.inputs['Strength'].default_value = 1.2
mix_c = wn.new('ShaderNodeMixRGB')
mix_c.inputs['Color1'].default_value = (0.004, 0.006, 0.014, 1)
wl.new(ramp.outputs['Color'], mix_c.inputs['Fac'])
mix_c.inputs['Color2'].default_value = (0.9, 0.92, 1.0, 1)
wl.new(mix_c.outputs['Color'], stern_bg.inputs['Color'])
lp = wn.new('ShaderNodeLightPath')
mix = wn.new('ShaderNodeMixShader')
wl.new(lp.outputs['Is Camera Ray'], mix.inputs['Fac'])
wl.new(hdr_bg.outputs['Background'], mix.inputs[1])
wl.new(stern_bg.outputs['Background'], mix.inputs[2])
wl.new(mix.outputs['Shader'], out.inputs['Surface'])

# ───────── Sonne ─────────
bpy.ops.object.light_add(type='SUN', location=(0, 0, 0))
sonne = bpy.context.object
sonne.data.energy = 4.5
sonne.data.angle = math.radians(1.2)
sonne.data.color = (1.0, 0.96, 0.9)
sonne.rotation_euler = (math.radians(78), 0, math.radians(-72))

bpy.ops.object.light_add(type='AREA', location=(-3.5, 6, 3.5))
gegen = bpy.context.object
gegen.data.energy = 900
gegen.data.size = 4
gegen.data.color = (0.55, 0.7, 1.0)
gegen.rotation_euler = (math.radians(-60), math.radians(-30), 0)

# ───────── Erde ─────────
R = 50.0
bpy.ops.mesh.primitive_uv_sphere_add(segments=192, ring_count=96, radius=R, location=(0, 0, -62))
erde = bpy.context.object
bpy.ops.object.shade_smooth()
em, en, el = mat('Erde')
bsdf = principled(en)
tex = en.new('ShaderNodeTexImage')
tex.image = bpy.data.images.load(ASSETS + 'erde-5400.jpg')
el.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
bsdf.inputs['Roughness'].default_value = 0.62
bsdf.inputs['Specular IOR Level'].default_value = 0.35
erde.data.materials.append(em)
# Deutschland nach oben drehen (UV-Kugel: Länge über Z-Rotation, Breite über X)
erde.rotation_euler = (math.radians(90 - 38), 0, math.radians(-100))

# Atmosphäre: Rand leuchtet (Facing), innen durchsichtig
bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=R * 1.022, location=erde.location)
atmo = bpy.context.object
bpy.ops.object.shade_smooth()
am, an, al = mat('Atmosphaere')
for n in list(an):
    an.remove(n)
ao = an.new('ShaderNodeOutputMaterial')
lw = an.new('ShaderNodeLayerWeight')
lw.inputs['Blend'].default_value = 0.35
rr = an.new('ShaderNodeValToRGB')
rr.color_ramp.elements[0].position = 0.35
rr.color_ramp.elements[0].color = (0, 0, 0, 1)
rr.color_ramp.elements[1].position = 1.0
rr.color_ramp.elements[1].color = (1, 1, 1, 1)
al.new(lw.outputs['Facing'], rr.inputs['Fac'])
emi = an.new('ShaderNodeEmission')
emi.inputs['Color'].default_value = (0.25, 0.5, 1.0, 1)
emi.inputs['Strength'].default_value = 3.0
tr = an.new('ShaderNodeBsdfTransparent')
ms = an.new('ShaderNodeMixShader')
al.new(rr.outputs['Color'], ms.inputs['Fac'])
al.new(tr.outputs['BSDF'], ms.inputs[1])
al.new(emi.outputs['Emission'], ms.inputs[2])
al.new(ms.outputs['Shader'], ao.inputs['Surface'])
am.surface_render_method = 'BLENDED'
atmo.data.materials.append(am)

# ───────── Satellit ─────────
def wuerfel(name, groesse, ort, material, fase=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=ort)
    o = bpy.context.object
    o.name = name
    o.scale = groesse
    bpy.ops.object.transform_apply(scale=True)
    if fase:
        b = o.modifiers.new('Fase', 'BEVEL')
        b.width = fase
        b.segments = 3
        bpy.ops.object.shade_smooth()
    o.data.materials.append(material)
    return o


def zylinder(name, r, h, ort, rot, material):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=ort, rotation=rot, vertices=32)
    o = bpy.context.object
    o.name = name
    bpy.ops.object.shade_smooth()
    o.data.materials.append(material)
    return o


# Goldfolie: Metall, Knitter über Noise-Bump
gold, gn, gl = mat('Goldfolie')
gb = principled(gn)
gb.inputs['Base Color'].default_value = (0.95, 0.66, 0.24, 1)
gb.inputs['Metallic'].default_value = 1.0
gb.inputs['Roughness'].default_value = 0.28
noise = gn.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 6
noise.inputs['Detail'].default_value = 12
noise.inputs['Distortion'].default_value = 2.2
vk = gn.new('ShaderNodeTexVoronoi')
vk.inputs['Scale'].default_value = 7
vk.feature = 'DISTANCE_TO_EDGE'
mixh = gn.new('ShaderNodeMath')
mixh.operation = 'ADD'
gl.new(noise.outputs['Fac'], mixh.inputs[0])
gl.new(vk.outputs['Distance'], mixh.inputs[1])
bump = gn.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = 1.0
bump.inputs['Distance'].default_value = 0.03
gl.new(mixh.outputs['Value'], bump.inputs['Height'])
gl.new(bump.outputs['Normal'], gb.inputs['Normal'])
fr = gn.new('ShaderNodeValToRGB')
fr.color_ramp.elements[0].color = (0.62, 0.36, 0.08, 1)
fr.color_ramp.elements[1].color = (1.0, 0.8, 0.38, 1)
gl.new(noise.outputs['Fac'], fr.inputs['Fac'])
gl.new(fr.outputs['Color'], gb.inputs['Base Color'])
rr2 = gn.new('ShaderNodeMapRange')
rr2.inputs['To Min'].default_value = 0.15
rr2.inputs['To Max'].default_value = 0.45
gl.new(noise.outputs['Fac'], rr2.inputs['Value'])
gl.new(rr2.outputs['Result'], gb.inputs['Roughness'])

weiss, wn2, _ = mat('Radiator')
principled(wn2).inputs['Base Color'].default_value = (0.86, 0.87, 0.9, 1)
principled(wn2).inputs['Roughness'].default_value = 0.42

metall, mn, _ = mat('Metall')
principled(mn).inputs['Base Color'].default_value = (0.8, 0.82, 0.86, 1)
principled(mn).inputs['Metallic'].default_value = 1.0
principled(mn).inputs['Roughness'].default_value = 0.22

# Solarzellen: dunkelblau glänzend, Zellraster über Brick-Textur
solar, sn, sl = mat('Solar')
sb = principled(sn)
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

SAT = (0.0, 0.0, 0.0)
sat_teile = []
sat_teile.append(wuerfel('Koerper', (1.3, 1.5, 1.3), SAT, gold, fase=0.04))
for s in (-1, 1):
    for k in range(5):
        sat_teile.append(wuerfel(f'Lamelle{s}{k}', (0.16, 0.04, 0.9), (-0.44 + k * 0.22, s * 0.77, 0.05), weiss, fase=0.01))
# Antennenfeld nach unten (−Z, zur Erde)
sat_teile.append(wuerfel('Antennenplatte', (1.15, 1.15, 0.06), (0, 0, -0.7), metall, fase=0.01))
for i in range(12):
    a = i / 12 * 2 * math.pi
    r = 0.4 if i % 2 else 0.24
    sat_teile.append(zylinder(f'Wendel{i}', 0.05, 0.32, (math.cos(a) * r, math.sin(a) * r, -0.88), (0, 0, 0), weiss))
# Solarflügel an Auslegern (entlang X)
for s in (-1, 1):
    sat_teile.append(zylinder(f'Ausleger{s}', 0.04, 0.9, (s * 1.1, 0, 0), (0, math.radians(90), 0), metall))
    sat_teile.append(wuerfel(f'Joch{s}', (0.08, 1.3, 0.08), (s * 1.58, 0, 0), metall))
    for k in range(3):
        sat_teile.append(wuerfel(f'Paneel{s}{k}', (1.15, 1.9, 0.04), (s * (2.25 + k * 1.2), 0, 0), solar, fase=0.008))

bpy.ops.object.select_all(action='DESELECT')
for o in sat_teile:
    o.select_set(True)
bpy.ops.object.empty_add(location=SAT)
traeger = bpy.context.object
for o in sat_teile:
    o.parent = traeger
traeger.rotation_euler = (math.radians(8), math.radians(-14), math.radians(28))

# ───────── Kamera ─────────
bpy.ops.object.camera_add(location=(4.6, -7.4, 2.3))
cam = bpy.context.object
sc.camera = cam
cam.data.lens = 38
cam.data.dof.use_dof = True
cam.data.dof.focus_object = traeger
cam.data.dof.aperture_fstop = 2.2
ziel = (0.0, 0.0, -1.4)
richtung = [ziel[i] - cam.location[i] for i in range(3)]
cam.rotation_euler = (
    math.atan2(math.hypot(richtung[0], richtung[1]), -richtung[2]),
    0,
    math.atan2(richtung[1], richtung[0]) - math.pi / 2,
)

# ───────── Nachbearbeitung: Leuchten (Blender 5: Compositor als Node-Gruppe) ─────────
try:
    ng = bpy.data.node_groups.new('Leuchten', 'CompositorNodeTree')
    ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
    rl = ng.nodes.new('CompositorNodeRLayers')
    glare = ng.nodes.new('CompositorNodeGlare')
    glare.inputs['Type'].default_value = 'Fog Glow' if 'Type' in glare.inputs else None
    for name, wert in (('Strength', 0.35), ('Threshold', 0.9)):
        if name in glare.inputs:
            glare.inputs[name].default_value = wert
    aus = ng.nodes.new('NodeGroupOutput')
    ng.links.new(rl.outputs['Image'], glare.inputs['Image'])
    ng.links.new(glare.outputs['Image'], aus.inputs[0])
    sc.compositing_node_group = ng
except Exception as fehler:
    print('Leuchten übersprungen:', fehler)

sc.render.filepath = ZIEL
bpy.ops.render.render(write_still=True)
print('FERTIG', ZIEL)
