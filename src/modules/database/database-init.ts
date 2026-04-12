import { songLibraryService } from "../services/song-library.instance";
import { schemaSql } from "./schema";
import { pool } from "./postgres";
import { songRepository } from "../repositories/repository.instance";

interface DatabaseInitializationResult {
  seedStatus: "skipped" | "completed";
  songsCountBeforeSeed: number;
}

const initializeDatabase = async (): Promise<DatabaseInitializationResult> => {
  await pool.query(schemaSql);

  const songsCount = await songRepository.countSongs();

  if (songsCount === 0) {
    await songRepository.createMany(songLibraryService.getAllSongs());
    return {
      seedStatus: "completed",
      songsCountBeforeSeed: songsCount
    };
  }

  return {
    seedStatus: "skipped",
    songsCountBeforeSeed: songsCount
  };
};

export { initializeDatabase };
