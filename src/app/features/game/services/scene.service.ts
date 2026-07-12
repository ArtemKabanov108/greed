import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GAME_CONFIG } from '../constants/game.config';

/**
 * Owns the Three.js scene graph, camera, renderer, lights and background.
 * Knows nothing about game rules, players, or falling items.
 */
@Injectable({
  providedIn: 'root'
})
export class SceneService {
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public renderer!: THREE.WebGLRenderer;

  private backgroundTexture: THREE.Texture | null = null;

  public init(canvas: HTMLCanvasElement): void {
    this.scene = new THREE.Scene();
    this.loadBackground();

    this.camera = new THREE.PerspectiveCamera(
      GAME_CONFIG.CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      GAME_CONFIG.CAMERA_NEAR,
      GAME_CONFIG.CAMERA_FAR
    );
    this.camera.position.set(0, 0, GAME_CONFIG.CAMERA_Z);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.addLights();
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public handleResize(): void {
    if (!this.camera || !this.renderer) {
      return;
    }
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public dispose(): void {
    if (this.backgroundTexture) {
      this.backgroundTexture.dispose();
      this.backgroundTexture = null;
    }
    this.renderer?.dispose();
  }

  private loadBackground(): void {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      GAME_CONFIG.BACKGROUND_IMAGE,
      (texture) => {
        (texture as any).encoding = 3001; // Backward compatibility for older Three.js versions
        this.backgroundTexture = texture;
        this.scene.background = texture;
      },
      undefined,
      (error) => console.error('Error loading background image:', error)
    );
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);
  }
}
