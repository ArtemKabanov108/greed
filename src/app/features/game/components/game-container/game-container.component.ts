import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameEngineService } from '../../services/game-engine.service';
import { GameStateService } from '../../services/game-state.service';
import { GameAudioService } from '../../services/game-audio.service';
import { GameStatus } from '../../models/game-status.model';
import { GAME_CONFIG } from '../../constants/game.config';

/**
 * Smart component: wires GameEngineService/GameStateService/GameAudioService
 * to the presentational (dumb) child components. Contains no Three.js or
 * Web Audio calls directly.
 */
@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss']
})
export class GameContainerComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) public gameCanvas!: ElementRef<HTMLCanvasElement>;

  public readonly GameStatus = GameStatus;
  public score = 0;
  public lives = 0;
  public status: GameStatus = GameStatus.Idle;
  public showScreamer = false;

  private screamerTimeoutId: any;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private gameEngine: GameEngineService,
    private gameState: GameStateService,
    private gameAudio: GameAudioService
  ) {}

  public ngOnInit(): void {
    this.gameAudio.preload();
    this.subscribeToState();
  }

  public startGame(): void {
    this.gameEngine.start(this.gameCanvas);
  }

  @HostListener('window:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    if (this.status === GameStatus.Playing) {
      this.gameEngine.movePlayer(event.clientX);
    }
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.gameEngine.handleResize();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.screamerTimeoutId);
    this.gameEngine.destroy();
    this.gameAudio.dispose();
  }

  private subscribeToState(): void {
    this.gameState.score$.pipe(takeUntil(this.destroy$)).subscribe((score) => (this.score = score));
    this.gameState.lives$.pipe(takeUntil(this.destroy$)).subscribe((lives) => (this.lives = lives));

    this.gameState.status$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.status = status;
      if (status === GameStatus.GameOver) {
        this.gameEngine.stop();
      }
    });

    this.gameState.lifeLost$.pipe(takeUntil(this.destroy$)).subscribe(() => this.triggerScreamer());
  }

  private triggerScreamer(): void {
    this.showScreamer = true;
    this.gameAudio.playScreamer();

    clearTimeout(this.screamerTimeoutId);
    this.screamerTimeoutId = setTimeout(() => {
      this.showScreamer = false;
    }, GAME_CONFIG.SCREAMER_DURATION_MS);
  }
}
