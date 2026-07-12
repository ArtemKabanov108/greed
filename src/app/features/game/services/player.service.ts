import { Injectable } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { GAME_CONFIG } from '../constants/game.config';

/**
 * Owns the player-controlled cart: loading the model, moving it
 * with the mouse, and exposing its bounding box for collision checks.
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public player!: THREE.Group;

  public load(scene: THREE.Scene): Promise<void> {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        GAME_CONFIG.PLAYER_MODEL,
        (gltf) => {
          this.player = gltf.scene;
          this.player.scale.set(1, 1, 1);
          this.player.position.set(0, GAME_CONFIG.PLAYER_Y, 0);
          this.player.rotation.y = Math.PI;
          scene.add(this.player);
          resolve();
        },
        undefined,
        (error) => {
          console.error('Error loading market_cart.glb:', error);
          reject(error);
        }
      );
    });
  }

  /** Converts a 2D screen X coordinate into 3D world space and moves the cart. */
  public move(mouseX: number, camera: THREE.PerspectiveCamera): void {
    if (!this.player) {
      return;
    }

    const vector = new THREE.Vector3((mouseX / window.innerWidth) * 2 - 1, 0, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    const bound = GAME_CONFIG.PLAYER_BOUNDS_X;
    this.player.position.x = Math.max(-bound, Math.min(bound, pos.x));
  }

  public getBoundingBox(): THREE.Box3 {
    return new THREE.Box3().setFromObject(this.player);
  }

  public dispose(scene: THREE.Scene): void {
    if (this.player) {
      scene.remove(this.player);
    }
  }
}
