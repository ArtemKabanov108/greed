import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  @Output() public start = new EventEmitter<void>();

  public onStart(): void {
    this.start.emit();
  }
}
