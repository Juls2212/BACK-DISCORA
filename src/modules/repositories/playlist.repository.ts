import { Pool } from "pg";

interface PlaylistRecord {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export class PlaylistRepository {
  constructor(private readonly pool: Pool) {}

  public async create(id: string, name: string): Promise<void> {
    await this.pool.query(
      `
        INSERT INTO playlists (id, name)
        VALUES ($1, $2)
      `,
      [id, name]
    );
  }

  public async findAll(): Promise<PlaylistRecord[]> {
    const result = await this.pool.query<PlaylistRecord>(
      `
        SELECT id, name, created_at, updated_at
        FROM playlists
        ORDER BY created_at ASC
      `
    );

    return result.rows;
  }

  public async findById(id: string): Promise<PlaylistRecord | null> {
    const result = await this.pool.query<PlaylistRecord>(
      `
        SELECT id, name, created_at, updated_at
        FROM playlists
        WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] ?? null;
  }

  public async rename(id: string, name: string): Promise<void> {
    await this.pool.query(
      `
        UPDATE playlists
        SET name = $2, updated_at = NOW()
        WHERE id = $1
      `,
      [id, name]
    );
  }

  public async delete(id: string): Promise<void> {
    await this.pool.query(
      `
        DELETE FROM playlists
        WHERE id = $1
      `,
      [id]
    );
  }
}
