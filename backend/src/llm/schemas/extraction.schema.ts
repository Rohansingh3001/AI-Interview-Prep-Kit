export const extractionSchema = {
  type: "object",
  properties: {
    role: {
      type: "object",
      properties: {
        title: { type: "string" },
        seniority: { type: "string" },
        responsibilities: {
          type: "array",
          items: { type: "string" }
        },
        requirements: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Stable unique ID for the requirement (e.g. r1, r2)" },
              text: { type: "string" },
              kind: { type: "string", enum: ["technical", "behavioural", "domain"] },
              priority: { type: "string", enum: ["must", "nice"] }
            },
            required: ["id", "text", "kind", "priority"],
            additionalProperties: false
          }
        }
      },
      required: ["title", "seniority", "responsibilities", "requirements"],
      additionalProperties: false
    }
  },
  required: ["role"],
  additionalProperties: false
};
