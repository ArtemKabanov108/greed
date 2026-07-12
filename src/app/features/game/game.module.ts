import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameContainerComponent } from './components/game-container/game-container.component';
import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { GameHudComponent } from './components/game-hud/game-hud.component';
import { GameOverScreenComponent } from './components/game-over-screen/game-over-screen.component';
import { ScreamerOverlayComponent } from './components/screamer-overlay/screamer-overlay.component';

@NgModule({
  declarations: [
    GameContainerComponent,
    StartScreenComponent,
    GameHudComponent,
    GameOverScreenComponent,
    ScreamerOverlayComponent
  ],
  imports: [CommonModule],
  exports: [GameContainerComponent]
})
export class GameModule {}
