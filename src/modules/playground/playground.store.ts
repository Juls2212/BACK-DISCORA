import {
  DoublyLinkedPlaylist,
  PlaylistNodeOutput
} from "../../core/data-structures/doubly-linked-playlist";
import { Song } from "../../core/data-structures/song.type";

interface PlaylistResponse {
  id: string;
  name: string;
  size: number;
  currentNodeId: string | null;
  songs: PlaylistNodeOutput[];
}

const demoSongs: Song[] = [
  {
    id: "song-1",
    title: "Midnight Echo",
    artist: "Aurora Lane",
    duration: 214,
    coverUrl: "https://example.com/covers/midnight-echo.jpg",
    audioUrl: "https://example.com/audio/midnight-echo.mp3",
    isDemo: true
  },
  {
    id: "song-2",
    title: "City Lights",
    artist: "Neon Harbor",
    duration: 189,
    coverUrl: "https://example.com/covers/city-lights.jpg",
    audioUrl: "https://example.com/audio/city-lights.mp3",
    isDemo: true
  },
  {
    id: "song-3",
    title: "Static Hearts",
    artist: "Silver Frame",
    duration: 241,
    coverUrl: "https://example.com/covers/static-hearts.jpg",
    audioUrl: "https://example.com/audio/static-hearts.mp3",
    isDemo: true
  },
  {
    id: "song-4",
    title: "Ocean Drive",
    artist: "Blue Signal",
    duration: 203,
    coverUrl: "https://example.com/covers/ocean-drive.jpg",
    audioUrl: "https://example.com/audio/ocean-drive.mp3",
    isDemo: true
  },
  {
    id: "song-5",
    title: "Golden Hour Fade",
    artist: "North Avenue",
    duration: 226,
    coverUrl: "https://example.com/covers/golden-hour-fade.jpg",
    audioUrl: "https://example.com/audio/golden-hour-fade.mp3",
    isDemo: true
  }
];

const playlist = new DoublyLinkedPlaylist("Demo Playlist");
let nextDemoSongIndex = 0;

for (const song of demoSongs) {
  playlist.addSong(song);
}

const getNextDemoSong = (): Song => {
  const song = demoSongs[nextDemoSongIndex];
  nextDemoSongIndex = (nextDemoSongIndex + 1) % demoSongs.length;
  return song;
};

const buildPlaylistResponse = (): PlaylistResponse => {
  return {
    id: playlist.id,
    name: playlist.name,
    size: playlist.size,
    currentNodeId: playlist.current ? playlist.current.nodeId : null,
    songs: playlist.toArray()
  };
};

export { buildPlaylistResponse, getNextDemoSong, playlist };
