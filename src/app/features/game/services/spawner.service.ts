import { Injectable } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { CLOTHING_ASSET_PATHS, GAME_CONFIG } from '../constants/game.config';

/**
 * Preloads clothing asset templates and spawns clones of them on a timer.
 * Knows nothing about physics, collisions, or scoring — it only creates items.
 */
@Injectable({
  providedIn: 'root'
})
export class SpawnerService {
  private templates: THREE.Group[] = [];
  private spawnTimeoutId: any;

  /** onItemReady fires once per clothing item as it finishes loading (or fails) — used to drive a progress bar. */
  public preloadTemplates(onItemReady?: () => void): Promise<void> {
    if (this.templates.length > 0) {
      // Already cached from a previous playthrough (e.g. "Try Again") — report instantly, no network needed.
      this.templates.forEach(() => onItemReady?.());
      return Promise.resolve();
    }

    const loader = new GLTFLoader();
    const promises = CLOTHING_ASSET_PATHS.map(
      (url) =>
        new Promise<void>((resolve) => {
          loader.load(
            url,
            (gltf) => {
              this.templates.push(gltf.scene);
              onItemReady?.();
              resolve();
            },
            undefined,
            (error) => {
              console.error(`Failed to preload dynamic asset at: ${url}`, error);
              onItemReady?.(); // Do not stall the progress bar if one model fails
              resolve(); // Do not crash the entire loading pipeline if one model fails
            }
          );
        })
    );

    return Promise.all(promises).then(() => undefined);
  }

  public start(onSpawn: (item: THREE.Group) => void): void {
    const spawnLogic = () => {
      const item = this.createItem();
      if (item) {
        onSpawn(item);
      }
      this.spawnTimeoutId = setTimeout(spawnLogic, GAME_CONFIG.SPAWN_INTERVAL_MS);
    };
    spawnLogic();
  }

  public stop(): void {
    if (this.spawnTimeoutId) {
      clearTimeout(this.spawnTimeoutId);
    }
  }

  private createItem(): THREE.Group | null {
    if (this.templates.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.templates.length);
    const item = this.templates[randomIndex].clone();

    // Normalize all models to the same physical size regardless of source scale
    const boundingBox = new THREE.Box3().setFromObject(item);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = GAME_CONFIG.ITEM_TARGET_SIZE / maxDimension;
    item.scale.set(scaleFactor, scaleFactor, scaleFactor);

    item.position.set((Math.random() - 0.5) * 8, 5, 0);
    item.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    return item;
  }
}
