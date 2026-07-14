import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GameStatus } from '../models/game-status.model';
import { GAME_CONFIG } from '../constants/game.config';

/**
 * Single source of truth for game state (score, lives, status).
 * Pure data/state layer — has no knowledge of Three.js or rendering.
 */
@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly scoreSubject = new BehaviorSubject<number>(0);
  private readonly livesSubject = new BehaviorSubject<number>(GAME_CONFIG.INITIAL_LIVES);
  private readonly statusSubject = new BehaviorSubject<GameStatus>(GameStatus.Idle);
  private readonly lifeLostSubject = new Subject<void>();
  private readonly loadingProgressSubject = new BehaviorSubject<number>(0);

  public readonly score$ = this.scoreSubject.asObservable();
  public readonly lives$ = this.livesSubject.asObservable();
  public readonly status$ = this.statusSubject.asObservable();
  /** Fires once per lost life — used to trigger transient UI/audio (screamer). */
  public readonly lifeLost$ = this.lifeLostSubject.asObservable();
  /** 0–100 while status is Loading. */
  public readonly loadingProgress$ = this.loadingProgressSubject.asObservable();

  public get status(): GameStatus {
    return this.statusSubject.value;
  }

  public startLoading(): void {
    this.loadingProgressSubject.next(0);
    this.statusSubject.next(GameStatus.Loading);
  }

  public setLoadingProgress(percent: number): void {
    this.loadingProgressSubject.next(Math.min(100, Math.max(0, percent)));
  }

  public reset(): void {
    this.scoreSubject.next(0);
    this.livesSubject.next(GAME_CONFIG.INITIAL_LIVES);
    this.statusSubject.next(GameStatus.Playing);
  }

  public addScore(points = 1): void {
    this.scoreSubject.next(this.scoreSubject.value + points);
  }

  public loseLife(): void {
    const remaining = this.livesSubject.value - 1;
    this.livesSubject.next(remaining);
    this.lifeLostSubject.next();

    if (remaining <= 0) {
      this.statusSubject.next(GameStatus.GameOver);
    }
  }
}
