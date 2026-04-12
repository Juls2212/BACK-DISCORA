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
            coverUrl: { type: "string", example: "https://example.com/covers/midnight-echo.jpg" },
            audioUrl: { type: "string", example: "https://example.com/audio/midnight-echo.mp3" },
            isDemo: { type: "boolean", example: true }
          },
          required: ["id", "title", "artist", "duration", "audioUrl", "isDemo"]
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
