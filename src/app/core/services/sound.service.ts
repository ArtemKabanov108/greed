import { Injectable } from '@angular/core';

interface LoadedSound {
  buffer: AudioBuffer;
}

/**
 * Generic Web Audio API wrapper. Not game-specific — can be reused
 * by any feature that needs to preload and play short sound effects.
 */
@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext | null = null;
  private readonly sounds = new Map<string, LoadedSound>();
  private readonly activeSources = new Map<string, AudioBufferSourceNode>();

  public async load(id: string, url: string): Promise<void> {
    const context = this.getContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await context.decodeAudioData(arrayBuffer);
    this.sounds.set(id, { buffer });
  }

  public resume(): void {
    const context = this.getContext();
    if (context.state === 'suspended') {
      context.resume();
    }
  }

  /**
   * Plays a preloaded sound by id, optionally starting at an offset
   * and stopping after a given duration (both in seconds).
   */
  public play(id: string, offsetSeconds = 0, durationSeconds?: number): void {
    const sound = this.sounds.get(id);
    if (!sound) {
      return;
    }

    this.resume();
    this.stop(id);

    const context = this.getContext();
    const source = context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(context.destination);
    this.activeSources.set(id, source);

    if (durationSeconds !== undefined) {
      source.start(0, offsetSeconds, durationSeconds);
    } else {
      source.start(0, offsetSeconds);
    }
  }

  public stop(id: string): void {
    const source = this.activeSources.get(id);
    if (!source) {
      return;
    }
    try {
      source.stop();
    } catch {
      // Source may have already finished playing naturally — safe to ignore.
    }
    this.activeSources.delete(id);
  }

  public dispose(): void {
    this.activeSources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Already stopped — safe to ignore.
      }
    });
    this.activeSources.clear();
    this.audioContext?.close();
    this.audioContext = null;
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    return this.audioContext;
  }
}
