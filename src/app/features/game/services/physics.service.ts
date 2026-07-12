import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GAME_CONFIG } from '../constants/game.config';

/**
 * Owns the list of currently falling items: moves them each tick,
 * detects catches/misses against the player's bounding box, and
 * handles GPU resource disposal on removal.
 */
@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
  private fallingItems: THREE.Group[] = [];

  public addItem(item: THREE.Group, scene: THREE.Scene): void {
    this.fallingItems.push(item);
    scene.add(item);
  }

  /**
   * Advances physics by one frame. Calls onCatch()/onMiss() synchronously
   * for every item resolved this tick (an item may only trigger one of them).
   */
  public update(
    scene: THREE.Scene,
    playerBox: THREE.Box3,
    onCatch: () => void,
    onMiss: () => void
  ): void {
    const itemBox = new THREE.Box3();

    for (let i = this.fallingItems.length - 1; i >= 0; i--) {
      const item = this.fallingItems[i];

      item.position.y -= GAME_CONFIG.FALL_SPEED;
      item.rotation.x += 0.02;
      item.rotation.y += 0.01;

      itemBox.setFromObject(item);

      if (playerBox.intersectsBox(itemBox)) {
        this.removeItem(item, i, scene);
        onCatch();
        continue;
      }

      if (item.position.y < GAME_CONFIG.OUT_OF_BOUNDS_Y) {
        this.removeItem(item, i, scene);
        onMiss();
      }
    }
  }

  public clear(scene: THREE.Scene): void {
    this.fallingItems.forEach((item) => scene.remove(item));
    this.fallingItems = [];
  }

  private removeItem(item: THREE.Group, index: number, scene: THREE.Scene): void {
    scene.remove(item);
    this.fallingItems.splice(index, 1);

    // Deep resource disposal to avoid leaking VRAM
    item.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
