# SPDX-License-Identifier: GPL-3.0-or-later
"""Headless Blender helper for safe static GLB/GLTF preparation.

Run only through scripts/prepare-blender-3d-asset.mjs. The source file is never modified.
This helper intentionally refuses rigs, animation and shape keys because automatic
geometry decimation could damage them.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

import bpy


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--target-faces", type=int, default=80000)
    parser.add_argument("--min-ratio", type=float, default=0.35)
    return parser.parse_args(argv)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def mesh_face_count(objects: list[bpy.types.Object]) -> int:
    return sum(len(obj.data.polygons) for obj in objects if obj.type == "MESH")


def main() -> None:
    args = parse_args()
    source = Path(args.input).resolve()
    output = Path(args.output).resolve()
    manifest = Path(args.manifest).resolve()

    if source.suffix.lower() not in {".glb", ".gltf"}:
        raise SystemExit("Only .glb/.gltf input is supported by this safe preparation step.")
    if not source.is_file():
        raise SystemExit(f"Input not found: {source}")
    if args.target_faces < 1000:
        raise SystemExit("--target-faces must be >= 1000")
    if not (0.1 <= args.min_ratio <= 1.0):
        raise SystemExit("--min-ratio must be between 0.1 and 1.0")

    output.parent.mkdir(parents=True, exist_ok=True)
    manifest.parent.mkdir(parents=True, exist_ok=True)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source))

    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not mesh_objects:
        raise SystemExit("No mesh objects found in input asset.")

    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    animated = [obj.name for obj in bpy.context.scene.objects if obj.animation_data is not None]
    shape_key_meshes = [obj.name for obj in mesh_objects if getattr(obj.data, "shape_keys", None) is not None]
    if armatures or animated or shape_key_meshes:
        raise SystemExit(
            "Safe Blender prep refuses rigged/animated/shape-key assets. "
            "Use the original local asset or perform a manual reviewed optimization."
        )

    before_faces = mesh_face_count(mesh_objects)
    requested_ratio = min(1.0, args.target_faces / max(1, before_faces))
    applied_ratio = max(args.min_ratio, requested_ratio) if requested_ratio < 1.0 else 1.0

    changed_objects: list[str] = []
    if applied_ratio < 0.999:
        for obj in mesh_objects:
            if len(obj.data.polygons) < 24:
                continue
            bpy.context.view_layer.objects.active = obj
            obj.select_set(True)
            modifier = obj.modifiers.new(name="KIChannelSafeDecimate", type="DECIMATE")
            modifier.decimate_type = "COLLAPSE"
            modifier.ratio = applied_ratio
            modifier.use_collapse_triangulate = True
            bpy.ops.object.modifier_apply(modifier=modifier.name)
            changed_objects.append(obj.name)
            obj.select_set(False)

    after_faces = mesh_face_count(mesh_objects)

    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        export_animations=False,
        export_cameras=False,
        export_lights=False,
    )

    if not output.is_file() or output.stat().st_size == 0:
        raise SystemExit("Blender did not produce a valid output GLB.")

    report = {
        "version": 1,
        "status": "PREPARED_NOT_PRODUCTION_APPROVED",
        "source": str(source),
        "sourceSha256": sha256_file(source),
        "sourceBytes": source.stat().st_size,
        "output": str(output),
        "outputSha256": sha256_file(output),
        "outputBytes": output.stat().st_size,
        "targetFaces": args.target_faces,
        "minRatio": args.min_ratio,
        "appliedRatio": round(applied_ratio, 6),
        "facesBefore": before_faces,
        "facesAfter": after_faces,
        "meshObjects": [obj.name for obj in mesh_objects],
        "changedObjects": changed_objects,
        "riggedOrAnimatedInputAllowed": False,
        "remoteMediaUsed": False,
        "productionManifestModified": False,
        "humanVisualReviewRequired": True,
    }
    manifest.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
