import { Song } from "../../core/data-structures/song.type";
import { SongLibraryService } from "./song-library.service";

const demoLibrarySongs: Song[] = [
  {
    id: "song-1",
    title: "Midnight Echo",
    artist: "Aurora Lane",
    duration: 214,
    coverUrl: "https://example.com/covers/midnight-echo.jpg",
    audioUrl: "https://example.com/audio/midnight-echo.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-2",
    title: "City Lights",
    artist: "Neon Harbor",
    duration: 189,
    coverUrl: "https://example.com/covers/city-lights.jpg",
    audioUrl: "https://example.com/audio/city-lights.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-3",
    title: "Static Hearts",
    artist: "Silver Frame",
    duration: 241,
    coverUrl: "https://example.com/covers/static-hearts.jpg",
    audioUrl: "https://example.com/audio/static-hearts.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-4",
    title: "Ocean Drive",
    artist: "Blue Signal",
    duration: 203,
    coverUrl: "https://example.com/covers/ocean-drive.jpg",
    audioUrl: "https://example.com/audio/ocean-drive.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-5",
    title: "Golden Hour Fade",
    artist: "North Avenue",
    duration: 226,
    coverUrl: "https://example.com/covers/golden-hour-fade.jpg",
    audioUrl: "https://example.com/audio/golden-hour-fade.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-6",
    title: "Velvet Horizon",
    artist: "June Monroe",
    duration: 232,
    coverUrl: "https://example.com/covers/velvet-horizon.jpg",
    audioUrl: "https://example.com/audio/velvet-horizon.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-7",
    title: "Paper Skies",
    artist: "The Lanterns",
    duration: 205,
    coverUrl: "https://example.com/covers/paper-skies.jpg",
    audioUrl: "https://example.com/audio/paper-skies.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-8",
    title: "Afterglow Avenue",
    artist: "Miles Arden",
    duration: 218,
    coverUrl: "https://example.com/covers/afterglow-avenue.jpg",
    audioUrl: "https://example.com/audio/afterglow-avenue.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-9",
    title: "Falling Satellites",
    artist: "Nova Bloom",
    duration: 247,
    coverUrl: "https://example.com/covers/falling-satellites.jpg",
    audioUrl: "https://example.com/audio/falling-satellites.mp3",
    isDemo: true,
    isImported: false
  },
  {
    id: "song-10",
    title: "Harborline",
    artist: "Coastline Radio",
    duration: 196,
    coverUrl: "https://example.com/covers/harborline.jpg",
    audioUrl: "https://example.com/audio/harborline.mp3",
    isDemo: true,
    isImported: false
  }
];

const songLibraryService = new SongLibraryService(demoLibrarySongs);

export { songLibraryService };
