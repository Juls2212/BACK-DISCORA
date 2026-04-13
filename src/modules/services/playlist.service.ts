import {
  DoublyLinkedPlaylist,
  PlaylistNodeOutput
} from "../../core/data-structures/doubly-linked-playlist";
import { PlaylistNode } from "../../core/data-structures/playlist-node";
import { Song } from "../../core/data-structures/song.type";

export interface SerializedPlaylist {
  id: string;
  name: string;
  size: number;
  currentNodeId: string | null;
  headNodeId: string | null;
  tailNodeId: string | null;
  songs: PlaylistNodeOutput[];
}

export class PlaylistService {
  private readonly playlists: Map<string, DoublyLinkedPlaylist>;

  constructor() {
    this.playlists = new Map<string, DoublyLinkedPlaylist>();
  }

  public createPlaylist(name: string): DoublyLinkedPlaylist {
    const playlist = new DoublyLinkedPlaylist(name);
    this.playlists.set(playlist.id, playlist);

    return playlist;
  }

  public registerPlaylist(playlist: DoublyLinkedPlaylist): void {
    this.playlists.set(playlist.id, playlist);
  }

  public clearPlaylists(): void {
    this.playlists.clear();
  }

  public getAllPlaylists(): DoublyLinkedPlaylist[] {
    return Array.from(this.playlists.values());
  }

  public getPlaylistById(id: string): DoublyLinkedPlaylist | null {
    return this.playlists.get(id) ?? null;
  }

  public renamePlaylist(id: string, name: string): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(id);

    if (!playlist) {
      return null;
    }

    playlist.name = name;
    return playlist;
  }

  public deletePlaylist(id: string): boolean {
    return this.playlists.delete(id);
  }

  public addSongToPlaylist(playlistId: string, song: Song): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }

    playlist.addSong(song);
    return playlist;
  }

  public removeSongFromPlaylist(playlistId: string, nodeId: string): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }

    const removedNode = playlist.removeSong(nodeId);

    if (!removedNode) {
      return null;
    }

    return playlist;
  }

  public removeSongEverywhere(songId: string): string[] {
    const affectedPlaylistIds: string[] = [];

    for (const playlist of this.playlists.values()) {
      let currentNode = playlist.head;
      let wasModified = false;

      while (currentNode) {
        const nextNode = currentNode.next;

        if (currentNode.song.id === songId) {
          playlist.removeSong(currentNode.nodeId);
          wasModified = true;
        }

        currentNode = nextNode;
      }

      if (wasModified) {
        affectedPlaylistIds.push(playlist.id);
      }
    }

    return affectedPlaylistIds;
  }

  public moveSongUp(playlistId: string, nodeId: string): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }

    const wasMoved = playlist.moveUp(nodeId);

    if (!wasMoved) {
      return null;
    }

    return playlist;
  }

  public moveSongDown(playlistId: string, nodeId: string): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }

    const wasMoved = playlist.moveDown(nodeId);

    if (!wasMoved) {
      return null;
    }

    return playlist;
  }

  public setCurrentSong(playlistId: string, nodeId: string): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }

    const currentNode = playlist.setCurrent(nodeId);

    if (!currentNode) {
      return null;
    }

    return playlist;
  }

  public playNext(playlistId: string): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }

    const nextNode = playlist.playNext();

    if (!nextNode) {
      return null;
    }

    return playlist;
  }

  public playPrevious(playlistId: string): DoublyLinkedPlaylist | null {
    const playlist = this.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }

    const previousNode = playlist.playPrevious();

    if (!previousNode) {
      return null;
    }

    return playlist;
  }

  public serializePlaylist(playlist: DoublyLinkedPlaylist): SerializedPlaylist {
    return {
      id: playlist.id,
      name: playlist.name,
      size: playlist.size,
      currentNodeId: playlist.current ? playlist.current.nodeId : null,
      headNodeId: playlist.head ? playlist.head.nodeId : null,
      tailNodeId: playlist.tail ? playlist.tail.nodeId : null,
      songs: playlist.toArray()
    };
  }

  public serializeAllPlaylists(): SerializedPlaylist[] {
    return this.getAllPlaylists().map((playlist) => this.serializePlaylist(playlist));
  }

  public rebuildPlaylist(
    id: string,
    name: string,
    nodes: Array<{
      nodeId: string;
      song: Song;
      prevNodeId: string | null;
      nextNodeId: string | null;
      isCurrent: boolean;
    }>
  ): DoublyLinkedPlaylist {
    const playlist = new DoublyLinkedPlaylist(name, id);
    const nodeMap = new Map<string, PlaylistNode>();

    for (const item of nodes) {
      const node = new PlaylistNode(item.song, item.nodeId);
      nodeMap.set(item.nodeId, node);
    }

    for (const item of nodes) {
      const node = nodeMap.get(item.nodeId);

      if (!node) {
        continue;
      }

      node.prev = item.prevNodeId ? nodeMap.get(item.prevNodeId) ?? null : null;
      node.next = item.nextNodeId ? nodeMap.get(item.nextNodeId) ?? null : null;

      if (item.isCurrent) {
        playlist.current = node;
      }
    }

    for (const node of nodeMap.values()) {
      if (!node.prev) {
        playlist.head = node;
      }

      if (!node.next) {
        playlist.tail = node;
      }
    }

    playlist.size = nodeMap.size;

    this.registerPlaylist(playlist);
    return playlist;
  }
}
