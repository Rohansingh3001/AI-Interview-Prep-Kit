export const flashcardsSchema = {
  type: "object",
  properties: {
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          front: { type: "string" },
          back: { type: "string" },
          requirement_ids: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["id", "front", "back", "requirement_ids"],
        additionalProperties: false
      }
    }
  },
  required: ["flashcards"],
  additionalProperties: false
};
