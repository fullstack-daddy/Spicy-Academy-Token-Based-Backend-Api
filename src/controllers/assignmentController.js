import Assignment from "../models/Assignments.js";

export const studentAssignmentSubmit = async (req, res) => {
  try {
    const newStudentAssignmentSubmit = new Assignment(req.body);
    const savedStudentAssignmentSubmit =
      await newStudentAssignmentSubmit.save();
    res.status(201).json(savedStudentAssignmentSubmit);
  } catch (error) {}
};

export const teacherAssignmentGradingSubmit = async (req, res) => {
  try {
    const { studentId, assignmentId } = req.params;
    
    const savedTeacherAssignmentGrading =
      await Assignment.findOneAndUpdate({
        studentId,
        assignmentId,
      }, req.body, { new: true, runValidators: true });

      if (!savedTeacherAssignmentGrading) {
        return res.status(404).json({ message: "Assignment not found" });
      }
    res.status(200).json(savedTeacherAssignmentGrading);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllCourseAssignments = async (req, res) => {
    try {
      const { courseId, assignmentId } = req.params;
      const courseAssignments = await Assignment.find({ courseId, assignmentId });
      res.status(200).json(courseAssignments);
    } catch (error) {
      res.status(500).send(error.message);
    }
}
