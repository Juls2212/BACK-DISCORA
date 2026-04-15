import { Pool } from "pg";
import { Song } from "../../core/data-structures/song.type";

export interface SongRecord {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover_url: string | null;
  audio_url: string;
  is_demo: boolean;
  is_imported: boolean;
  created_at: Date;
}

export class SongRepository {
  constructor(private readonly pool: Pool) {}

  public async countSongs(): Promise<number> {
    const result = await this.pool.query<{ count: string }>("SELECT COUNT(*) AS count FROM songs");
    return Number(result.rows[0].count);
  }

  public async createMany(songs: Song[]): Promise<void> {
    for (const song of songs) {
      await this.pool.query(
        `
          INSERT INTO songs (id, title, artist, duration, cover_url, audio_url, is_demo, is_imported)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `,
        [
          song.id,
          song.title,
          song.artist,
          song.duration,
          song.coverUrl ?? null,
          song.audioUrl,
          song.isDemo,
          song.isImported
        ]
      );
    }
  }

  public async create(song: Song): Promise<void> {
    await this.pool.query(
      `
        INSERT INTO songs (id, title, artist, duration, cover_url, audio_url, is_demo, is_imported)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        song.id,
        song.title,
        song.artist,
        song.duration,
        song.coverUrl ?? null,
        song.audioUrl,
        song.isDemo,
        song.isImported
      ]
    );
  }

  public async findAll(): Promise<SongRecord[]> {
    const result = await this.pool.query<SongRecord>(
      `
        SELECT id, title, artist, duration, cover_url, audio_url, is_demo, is_imported, created_at
        FROM songs
        ORDER BY created_at ASC
      `
    );

    return result.rows;
  }

  public async findById(id: string): Promise<SongRecord | null> {
    const result = await this.pool.query<SongRecord>(
      `
        SELECT id, title, artist, duration, cover_url, audio_url, is_demo, is_imported, created_at
        FROM songs
        WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] ?? null;
  }

  public async deleteById(id: string): Promise<void> {
    await this.pool.query(
      `
        DELETE FROM songs
        WHERE id = $1
      `,
      [id]
    );
  }

  public async updateById(id: string, title: string, artist: string): Promise<void> {
    await this.pool.query(
      `
        UPDATE songs
        SET title = $2,
            artist = $3
        WHERE id = $1
      `,
      [id, title, artist]
    );
  }

  public mapToSong(record: SongRecord): Song {
    return {
      id: record.id,
      title: record.title,
      artist: record.artist,
      duration: record.duration,
      coverUrl: record.cover_url ?? undefined,
      audioUrl: record.audio_url,
      isDemo: record.is_demo,
      isImported: record.is_imported
    };
  }
}
