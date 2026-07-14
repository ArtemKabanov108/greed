import { ElementRef, Injectable, NgZone } from '@angular/core';
import { SceneService } from './scene.service';
import { PlayerService } from './player.service';
import { SpawnerService } from './spawner.service';
import { PhysicsService } from './physics.service';
import { GameStateService } from './game-state.service';
import { CLOTHING_ASSET_PATHS } from '../constants/game.config';

/** Loading steps: the player cart model + one step per clothing template. */
const TOTAL_LOADING_STEPS = 1 + CLOTHING_ASSET_PATHS.length;

/**
 * Orchestrates the game loop by wiring together the single-purpose
 * services below. Contains no Three.js primitives of its own —
 * only coordination and the requestAnimationFrame loop.
 */
@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  private animationFrameId!: number;
  private isRunning = false;

  constructor(
    private ngZone: NgZone,
    private sceneService: SceneService,
    private playerService: PlayerService,
    private spawnerService: SpawnerService,
    private physicsService: PhysicsService,
    private gameStateService: GameStateService
  ) {}

  public async start(canvasRef: ElementRef<HTMLCanvasElement>): Promise<void> {
    this.stop();
    this.gameStateService.startLoading();

    let completedSteps = 0;
    const reportStepDone = () => {
      completedSteps++;
      this.gameStateService.setLoadingProgress((completedSteps / TOTAL_LOADING_STEPS) * 100);
    };

    this.sceneService.init(canvasRef.nativeElement);
    await this.playerService.load(this.sceneService.scene);
    reportStepDone();
    await this.spawnerService.preloadTemplates(reportStepDone);

    this.gameStateService.reset();
    this.isRunning = true;
    this.spawnerService.start((item) => this.physicsService.addItem(item, this.sceneService.scene));
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  public movePlayer(mouseX: number): void {
    if (!this.isRunning) {
      return;
    }
    this.playerService.move(mouseX, this.sceneService.camera);
  }

  public handleResize(): void {
    this.sceneService.handleResize();
  }

  public stop(): void {
    this.isRunning = false;
    this.spawnerService.stop();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  public destroy(): void {
    this.stop();
    this.physicsService.clear(this.sceneService.scene);
    this.playerService.dispose(this.sceneService.scene);
    this.sceneService.dispose();
  }

  private animate(): void {
    if (!this.isRunning) {
      return;
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const playerBox = this.playerService.getBoundingBox();
    this.physicsService.update(
      this.sceneService.scene,
      playerBox,
      () => this.ngZone.run(() => this.gameStateService.addScore()),
      () => this.ngZone.run(() => this.gameStateService.loseLife())
    );

    this.sceneService.render();
  }
}
