import { pool } from "../database/postgres";
import { PlaylistRepository } from "./playlist.repository";
import { PlaylistSongRepository } from "./playlist-song.repository";
import { SongRepository } from "./song.repository";

const songRepository = new SongRepository(pool);
const playlistRepository = new PlaylistRepository(pool);
const playlistSongRepository = new PlaylistSongRepository(pool);

export { playlistRepository, playlistSongRepository, songRepository };
