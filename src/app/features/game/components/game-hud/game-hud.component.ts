import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-hud',
  templateUrl: './game-hud.component.html',
  styleUrls: ['./game-hud.component.scss']
})
export class GameHudComponent {
  @Input() public score = 0;
  @Input() public lives = 0;
}
