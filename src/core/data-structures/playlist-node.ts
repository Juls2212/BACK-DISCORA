import { randomUUID } from "crypto";
import { Song } from "./song.type";

export class PlaylistNode {
  public readonly nodeId: string;
  public readonly song: Song;
  public prev: PlaylistNode | null;
  public next: PlaylistNode | null;

  constructor(song: Song, nodeId?: string) {
    this.nodeId = nodeId ?? randomUUID();
    this.song = song;
    this.prev = null;
    this.next = null;
  }
}
