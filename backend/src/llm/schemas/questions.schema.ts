export const questionsSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          requirement_ids: {
            type: "array",
            items: { type: "string" }
          },
          category: { type: "string", enum: ["technical", "behavioural", "system-design", "company-fit"] },
          prompt: { type: "string" },
          answer_outline: { type: "string" },
          difficulty: { type: "integer" }
        },
        required: ["id", "requirement_ids", "category", "prompt", "answer_outline", "difficulty"],
        additionalProperties: false
      }
    }
  },
  required: ["questions"],
  additionalProperties: false
};
