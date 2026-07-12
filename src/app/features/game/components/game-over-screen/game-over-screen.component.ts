import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-over-screen',
  templateUrl: './game-over-screen.component.html',
  styleUrls: ['./game-over-screen.component.scss']
})
export class GameOverScreenComponent {
  @Input() public score = 0;
  @Output() public retry = new EventEmitter<void>();

  public onRetry(): void {
    this.retry.emit();
  }
}
