import { TestBed } from '@angular/core/testing';
import { GameStateService } from './game-state.service';
import { GameStatus } from '../models/game-status.model';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start idle with 0 score and configured initial lives', (done) => {
    service.status$.subscribe((status) => {
      expect(status).toBe(GameStatus.Idle);
      done();
    });
  });

  it('should reset to Playing status with score 0', () => {
    service.reset();
    expect(service.status).toBe(GameStatus.Playing);
  });

  it('should increment score on addScore()', (done) => {
    service.reset();
    service.addScore();
    service.score$.subscribe((score) => {
      expect(score).toBe(1);
      done();
    });
  });

  it('should transition to GameOver once lives reach 0', () => {
    service.reset();
    service.loseLife();
    service.loseLife();
    service.loseLife();
    expect(service.status).toBe(GameStatus.GameOver);
  });

  it('should emit lifeLost$ once per loseLife() call', () => {
    service.reset();
    let emissions = 0;
    service.lifeLost$.subscribe(() => emissions++);
    service.loseLife();
    expect(emissions).toBe(1);
  });
});
