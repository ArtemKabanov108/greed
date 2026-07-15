import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-screamer-overlay',
  templateUrl: './screamer-overlay.component.html',
  styleUrls: ['./screamer-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreamerOverlayComponent {
  @Input() public active = false;
}
