export const evaluationSchema = {
  type: "object",
  properties: {
    score: { 
      type: "integer", 
      description: "A score out of 10 based on how well the user answered the question." 
    },
    feedback: { 
      type: "string", 
      description: "Positive reinforcement and specifically what the user did well." 
    },
    improvements: { 
      type: "string", 
      description: "Constructive feedback on what key points were missing and how to improve." 
    }
  },
  required: ["score", "feedback", "improvements"],
  additionalProperties: false
};
