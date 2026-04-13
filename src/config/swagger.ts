import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Discora Backend API",
      version: "1.0.0"
    },
    components: {
      schemas: {
        Song: {
          type: "object",
          properties: {
            id: { type: "string", example: "song-1" },
            title: { type: "string", example: "Midnight Echo" },
            artist: { type: "string", example: "Aurora Lane" },
            duration: { type: "number", example: 214 },
            coverUrl: { type: "string", nullable: true, example: "https://example.com/covers/midnight-echo.jpg" },
            audioUrl: { type: "string", example: "https://example.com/audio/midnight-echo.mp3" },
            isDemo: { type: "boolean", example: true },
            isImported: { type: "boolean", example: false }
          },
          required: ["id", "title", "artist", "duration", "audioUrl", "isDemo", "isImported"]
        },
        PlaylistNode: {
          type: "object",
          properties: {
            nodeId: { type: "string" },
            song: { $ref: "#/components/schemas/Song" },
            prevNodeId: { type: "string", nullable: true },
            nextNodeId: { type: "string", nullable: true }
          },
          required: ["nodeId", "song", "prevNodeId", "nextNodeId"]
        },
        Playlist: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            size: { type: "number" },
            currentNodeId: { type: "string", nullable: true },
            headNodeId: { type: "string", nullable: true },
            tailNodeId: { type: "string", nullable: true },
            songs: {
              type: "array",
              items: { $ref: "#/components/schemas/PlaylistNode" }
            }
          },
          required: ["id", "name", "size", "currentNodeId", "headNodeId", "tailNodeId", "songs"]
        },
        PlaylistResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Playlist" }
          },
          required: ["success", "data"]
        },
        PlaylistListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Playlist" }
            }
          },
          required: ["success", "data"]
        },
        DemoSongsResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Song" }
            }
          },
          required: ["success", "data"]
        },
        CreatePlaylistRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "My Playlist" }
          },
          required: ["name"]
        },
        RenamePlaylistRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Renamed Playlist" }
          },
          required: ["name"]
        },
        AddSongRequest: {
          type: "object",
          properties: {
            songId: { type: "string", example: "song-1" }
          },
          required: ["songId"]
        },
        CreateImportedSongRequest: {
          type: "object",
          properties: {
            title: { type: "string", example: "My Local Track" },
            artist: { type: "string", example: "Unknown Artist" },
            duration: { type: "number", example: 203 },
            coverUrl: { type: "string", nullable: true, example: "file://local/cover.jpg" },
            audioUrl: { type: "string", example: "file://local/path/or-app-uri" }
          },
          required: ["title", "artist", "duration", "audioUrl"]
        },
        UploadSongRequest: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary"
            },
            title: { type: "string", example: "My Local Track" },
            artist: { type: "string", example: "Unknown Artist" }
          },
          required: ["file", "title"]
        },
        DeleteResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                deleted: { type: "boolean", example: true }
              },
              required: ["id", "deleted"]
            }
          },
          required: ["success", "data"]
        },
        MessageResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Song deleted successfully" }
          },
          required: ["success", "message"]
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "PLAYLIST_NOT_FOUND" },
                message: { type: "string", example: "Playlist not found" }
              },
              required: ["code", "message"]
            }
          },
          required: ["success", "error"]
        }
      }
    }
  },
  apis: [path.join(__dirname, "../routes/*.ts")]
});

export { swaggerSpec };
