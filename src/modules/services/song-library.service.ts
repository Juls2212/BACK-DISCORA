import { Song } from "../../core/data-structures/song.type";

export class SongLibraryService {
  private songs: Song[];

  constructor(initialSongs: Song[]) {
    this.songs = initialSongs;
  }

  public setSongs(songs: Song[]): void {
    this.songs = [...songs];
  }

  public getAllSongs(): Song[] {
    return [...this.songs];
  }

  public getSongById(id: string): Song | null {
    const song = this.songs.find((currentSong) => currentSong.id === id);
    return song ?? null;
  }

  public searchSongs(query: string): Song[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.getAllSongs();
    }

    return this.songs.filter((song) => {
      const normalizedTitle = song.title.toLowerCase();
      const normalizedArtist = song.artist.toLowerCase();

      return (
        normalizedTitle.includes(normalizedQuery) ||
        normalizedArtist.includes(normalizedQuery)
      );
    });
  }
}
