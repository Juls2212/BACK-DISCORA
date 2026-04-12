export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  isDemo: boolean;
  isImported: boolean;
}
