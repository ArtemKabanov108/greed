import { Injectable } from '@angular/core';
import { SoundService } from '../../../core/services/sound.service';
import { GAME_CONFIG } from '../constants/game.config';

const SCREAMER_SOUND_ID = 'screamer';

/**
 * Game-specific audio concerns (which sound, when, how long),
 * built on top of the generic, reusable SoundService.
 */
@Injectable({
  providedIn: 'root'
})
export class GameAudioService {
  constructor(private soundService: SoundService) {}

  public preload(): void {
    this.soundService
      .load(SCREAMER_SOUND_ID, GAME_CONFIG.SCREAMER_SOUND)
      .catch((error) => console.error('Failed to preload screamer sound:', error));
  }

  public playScreamer(): void {
    this.soundService.play(SCREAMER_SOUND_ID, 0, GAME_CONFIG.SCREAMER_SOUND_PLAY_SECONDS);
  }

  public dispose(): void {
    this.soundService.dispose();
  }
}
