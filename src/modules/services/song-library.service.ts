import { Song } from "../../core/data-structures/song.type";

export class SongLibraryService {
  private songs: Song[];

  constructor(initialSongs: Song[]) {
    this.songs = initialSongs;
  }

  public setSongs(songs: Song[]): void {
    this.songs = [...songs];
  }

  public addSong(song: Song): void {
    this.songs.push(song);
  }

  public removeSongById(id: string): Song | null {
    const songIndex = this.songs.findIndex((song) => song.id === id);

    if (songIndex === -1) {
      return null;
    }

    const [removedSong] = this.songs.splice(songIndex, 1);
    return removedSong;
  }

  public updateSong(
    id: string,
    updates: {
      title?: string;
      artist?: string;
    }
  ): Song | null {
    const song = this.getSongById(id);

    if (!song) {
      return null;
    }

    if (updates.title !== undefined) {
      song.title = updates.title;
    }

    if (updates.artist !== undefined) {
      song.artist = updates.artist;
    }

    return song;
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
