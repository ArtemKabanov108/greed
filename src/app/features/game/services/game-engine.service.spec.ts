import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';

describe('GameEngineService', () => {
  let service: GameEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not throw when stopping without a prior start', () => {
    expect(() => service.stop()).not.toThrow();
  });
});
