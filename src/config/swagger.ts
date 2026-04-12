import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Discora Backend API",
      version: "1.0.0"
    }
  },
  apis: [path.join(__dirname, "../routes/*.ts")]
});

export { swaggerSpec };
