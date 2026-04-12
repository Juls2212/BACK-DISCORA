import { randomUUID } from "crypto";
import { PlaylistNode } from "./playlist-node";
import { Song } from "./song.type";

export interface PlaylistNodeOutput {
  nodeId: string;
  song: Song;
  prevNodeId: string | null;
  nextNodeId: string | null;
}

export class DoublyLinkedPlaylist {
  public readonly id: string;
  public name: string;
  public head: PlaylistNode | null;
  public tail: PlaylistNode | null;
  public current: PlaylistNode | null;
  public size: number;

  constructor(name: string) {
    this.id = randomUUID();
    this.name = name;
    this.head = null;
    this.tail = null;
    this.current = null;
    this.size = 0;
  }

  public addSong(song: Song): PlaylistNode {
    const newNode = new PlaylistNode(song);

    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
      this.size += 1;
      return newNode;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
    this.size += 1;

    return newNode;
  }

  public removeSong(nodeId: string): PlaylistNode | null {
    const node = this.findNode(nodeId);

    if (!node) {
      return null;
    }

    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    if (this.current === node) {
      this.current = node.next ?? node.prev ?? null;
    }

    node.prev = null;
    node.next = null;
    this.size -= 1;

    if (this.size === 0) {
      this.head = null;
      this.tail = null;
      this.current = null;
    }

    return node;
  }

  public findNode(nodeId: string): PlaylistNode | null {
    let currentNode = this.head;

    while (currentNode) {
      if (currentNode.nodeId === nodeId) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  public setCurrent(nodeId: string): PlaylistNode | null {
    const node = this.findNode(nodeId);

    if (!node) {
      return null;
    }

    this.current = node;
    return node;
  }

  public playNext(): PlaylistNode | null {
    if (!this.current || !this.current.next) {
      return null;
    }

    this.current = this.current.next;
    return this.current;
  }

  public playPrevious(): PlaylistNode | null {
    if (!this.current || !this.current.prev) {
      return null;
    }

    this.current = this.current.prev;
    return this.current;
  }

  public moveUp(nodeId: string): boolean {
    const node = this.findNode(nodeId);

    if (!node || !node.prev) {
      return false;
    }

    const previousNode = node.prev;
    const beforePrevious = previousNode.prev;
    const nextNode = node.next;

    if (beforePrevious) {
      beforePrevious.next = node;
    } else {
      this.head = node;
    }

    node.prev = beforePrevious;
    node.next = previousNode;

    previousNode.prev = node;
    previousNode.next = nextNode;

    if (nextNode) {
      nextNode.prev = previousNode;
    } else {
      this.tail = previousNode;
    }

    return true;
  }

  public moveDown(nodeId: string): boolean {
    const node = this.findNode(nodeId);

    if (!node || !node.next) {
      return false;
    }

    const nextNode = node.next;
    const previousNode = node.prev;
    const afterNext = nextNode.next;

    if (previousNode) {
      previousNode.next = nextNode;
    } else {
      this.head = nextNode;
    }

    nextNode.prev = previousNode;
    nextNode.next = node;

    node.prev = nextNode;
    node.next = afterNext;

    if (afterNext) {
      afterNext.prev = node;
    } else {
      this.tail = node;
    }

    return true;
  }

  public toArray(): PlaylistNodeOutput[] {
    const nodes: PlaylistNodeOutput[] = [];
    let currentNode = this.head;

    while (currentNode) {
      nodes.push({
        nodeId: currentNode.nodeId,
        song: currentNode.song,
        prevNodeId: currentNode.prev ? currentNode.prev.nodeId : null,
        nextNodeId: currentNode.next ? currentNode.next.nodeId : null
      });

      currentNode = currentNode.next;
    }

    return nodes;
  }
}
