import { songLibraryService } from "../services/song-library.instance";
import { schemaSql } from "./schema";
import { pool } from "./postgres";
import { songRepository } from "../repositories/repository.instance";

const initializeDatabase = async (): Promise<void> => {
  await pool.query(schemaSql);

  const songsCount = await songRepository.countSongs();

  if (songsCount === 0) {
    await songRepository.createMany(songLibraryService.getAllSongs());
  }
};

export { initializeDatabase };
