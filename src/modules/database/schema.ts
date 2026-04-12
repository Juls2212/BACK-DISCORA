const schemaSql = `
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration INTEGER NOT NULL,
  cover_url TEXT NULL,
  audio_url TEXT NOT NULL,
  is_demo BOOLEAN NOT NULL,
  is_imported BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id TEXT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  node_id TEXT PRIMARY KEY,
  song_id TEXT NOT NULL REFERENCES songs(id),
  prev_node_id TEXT NULL,
  next_node_id TEXT NULL,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT playlist_songs_prev_node_id_unique UNIQUE (prev_node_id),
  CONSTRAINT playlist_songs_next_node_id_unique UNIQUE (next_node_id)
);

CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id
  ON playlist_songs (playlist_id);

CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id
  ON playlist_songs (song_id);
`;

export { schemaSql };
