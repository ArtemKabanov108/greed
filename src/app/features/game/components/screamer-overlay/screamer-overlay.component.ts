import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-screamer-overlay',
  templateUrl: './screamer-overlay.component.html',
  styleUrls: ['./screamer-overlay.component.scss']
})
export class ScreamerOverlayComponent {
  @Input() public active = false;
}
