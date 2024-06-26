// Import necessary modules and the assessment model
import SpicyLevelAssessment from "../models/studentLevelAssessmentModel.js";

// Define the predefined answers
const predefinedAnswers = [
  "answer1",
  "answer2",
  "answer3",
  "answer4",
  "answer5",
  "answer6"
];

// Define the levelAssessment controller function
export const levelAssessment = async (req, res) => {
  try {
    const {
      assessmentQuestion1,
      assessmentQuestion2,
      assessmentQuestion3,
      assessmentQuestion4,
      assessmentQuestion5,
      assessmentQuestion6,
    } = req.body;

    // Create a new assessment entry
    const newAssessment = new SpicyLevelAssessment({
      assessmentQuestion1,
      assessmentQuestion2,
      assessmentQuestion3,
      assessmentQuestion4,
      assessmentQuestion5,
      assessmentQuestion6,
    });

    // Save the assessment entry to the database
    await newAssessment.save();

    // Compare the answers with predefined answers
    const userAnswers = [
      assessmentQuestion1,
      assessmentQuestion2,
      assessmentQuestion3,
      assessmentQuestion4,
      assessmentQuestion5,
      assessmentQuestion6,
    ];

    let score = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === predefinedAnswers[index]) {
        score += 1;
      }
    });

    // Determine the recommended level based on the score
    let recommendedLevel;
    if (score < 2) {
      recommendedLevel = "beginner";
    } else if (score < 4) {
      recommendedLevel = "amateur";
    } else if (score === 4) {
      recommendedLevel = "intermediate";
    } else if (score === 5) {
      recommendedLevel = "advanced";
    }

    // Return the score and recommended level
    res.status(200).json({
      score: `${score}/6`,
      recommendedLevel,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: `Error in level assessment: ${error.message}` });
  }
};
