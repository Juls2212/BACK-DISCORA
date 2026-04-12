import { Pool } from "pg";

interface PlaylistSongRecord {
  playlist_id: string;
  node_id: string;
  song_id: string;
  prev_node_id: string | null;
  next_node_id: string | null;
  is_current: boolean;
  created_at: Date;
}

interface CreatePlaylistSongInput {
  playlistId: string;
  nodeId: string;
  songId: string;
  prevNodeId: string | null;
  nextNodeId: string | null;
  isCurrent: boolean;
}

export class PlaylistSongRepository {
  constructor(private readonly pool: Pool) {}

  public async create(input: CreatePlaylistSongInput): Promise<void> {
    await this.pool.query(
      `
        INSERT INTO playlist_songs (
          playlist_id,
          node_id,
          song_id,
          prev_node_id,
          next_node_id,
          is_current
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        input.playlistId,
        input.nodeId,
        input.songId,
        input.prevNodeId,
        input.nextNodeId,
        input.isCurrent
      ]
    );
  }

  public async findByPlaylistId(playlistId: string): Promise<PlaylistSongRecord[]> {
    const result = await this.pool.query<PlaylistSongRecord>(
      `
        SELECT playlist_id, node_id, song_id, prev_node_id, next_node_id, is_current, created_at
        FROM playlist_songs
        WHERE playlist_id = $1
        ORDER BY created_at ASC
      `,
      [playlistId]
    );

    return result.rows;
  }

  public async findByNodeId(nodeId: string): Promise<PlaylistSongRecord | null> {
    const result = await this.pool.query<PlaylistSongRecord>(
      `
        SELECT playlist_id, node_id, song_id, prev_node_id, next_node_id, is_current, created_at
        FROM playlist_songs
        WHERE node_id = $1
      `,
      [nodeId]
    );

    return result.rows[0] ?? null;
  }

  public async updateLinks(
    nodeId: string,
    prevNodeId: string | null,
    nextNodeId: string | null,
    isCurrent: boolean
  ): Promise<void> {
    await this.pool.query(
      `
        UPDATE playlist_songs
        SET prev_node_id = $2,
            next_node_id = $3,
            is_current = $4
        WHERE node_id = $1
      `,
      [nodeId, prevNodeId, nextNodeId, isCurrent]
    );
  }

  public async clearCurrentForPlaylist(playlistId: string): Promise<void> {
    await this.pool.query(
      `
        UPDATE playlist_songs
        SET is_current = FALSE
        WHERE playlist_id = $1
      `,
      [playlistId]
    );
  }

  public async deleteByNodeId(nodeId: string): Promise<void> {
    await this.pool.query(
      `
        DELETE FROM playlist_songs
        WHERE node_id = $1
      `,
      [nodeId]
    );
  }

  public async deleteByPlaylistId(playlistId: string): Promise<void> {
    await this.pool.query(
      `
        DELETE FROM playlist_songs
        WHERE playlist_id = $1
      `,
      [playlistId]
    );
  }
}
