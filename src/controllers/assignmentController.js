import pendingAssignmentModel from "../models/pendingAssignments.js";
import reviewedAssignmentModel from "../models/reviewedAssignments.js";
import studentModel from "../models/studentModel.js";
import courseLessonModel from "../models/courseLessonsModel.js";
import checkPrivilege from "../middleware/checkPrivilege.js";

export const studentAssignmentSubmit = async (req, res) => {
  try {
    const { body, user, params } = req;
    const { lessonId } = params;

    // Find the student details from the database using the studentId
    const studentDetails = await studentModel.findOne({
      studentId: user.studentId,
    });

    // If student details are not found, return a 404 error
    if (!studentDetails) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find lesson details
    const adminDetails = await courseLessonModel.findOne(params);

    if (!adminDetails) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Concatenate the student's first name and last name to get the full name
    const studentName = `${studentDetails.firstName} ${studentDetails.lastName}`;

    // Create a new assignment submission object
    const newAssignmentSubmission = new pendingAssignmentModel({
      ...body,
      studentEmail: studentDetails.email,
      studentId: user.studentId,
      lessonId,
      lessonTitle: adminDetails.lessonTitle,
      lessonLevel: adminDetails.lessonLevel,
      studentName,
      adminId: adminDetails.adminId, // Include adminId from the admin details
    });

    // Save the new assignment submission to the database
    const savedAssignmentSubmission = await newAssignmentSubmission.save();

    // Return a success response with the saved assignment details
    res.status(201).json({
      message:
        "Assignment Submitted Successfully, Kindly Wait for a review from your tutor!",
      submissionDetails: savedAssignmentSubmission,
    });
  } catch (error) {
    // Return a 500 error response in case of any server error
    res.status(500).json({ message: error.message });
  }
};

export const teacherAssignmentGradingSubmit = [
  checkPrivilege("Grade Assignment"),
  async (req, res) => {
    try {
      const { studentId, assignmentId } = req.params;
      const {
        assignment1TutorGrade,
        assignment2TutorGrade,
        assignment3TutorGrade,
        assignment1TutorRemark,
        assignment2TutorRemark,
        assignment3TutorRemark,
      } = req.body;

      // Find the student details from the database using the studentId
      const studentDetails = await studentModel.findOne({ studentId });

      // If student details are not found, return a 404 error
      if (!studentDetails) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Find the pending assignment details
      const findStudentAssignment = await pendingAssignmentModel.findOne({
        studentId,
        assignmentId,
      });

      // If assignment details are not found, return a 404 error
      if (!findStudentAssignment) {
        return res.status(404).json({ message: "Assignment not found!" });
      }

      // If the assignment is already reviewed, return a 400 error
      if (findStudentAssignment.status === "reviewed") {
        return res.status(400).json({ message: "Assignment already graded!" });
      }

      // Create a new reviewed assignment object
      const savePendingAssignment = new reviewedAssignmentModel({
        adminId: req.user.adminId,
        assignmentId: findStudentAssignment.assignmentId,
        studentName: `${studentDetails.firstName} ${studentDetails.lastName}`,
        lessonTitle: findStudentAssignment.lessonTitle,
        lessonLevel: findStudentAssignment.lessonLevel,
        studentId: studentDetails.studentId,
        studentEmail: studentDetails.email,
        assignmentStudentSubmissionDate:
          findStudentAssignment.assignmentStudentSubmissionDate, // Ensure this field is populated
        assignment1TutorGrade,
        assignment2TutorGrade,
        assignment3TutorGrade,
        assignment1TutorRemark,
        assignment2TutorRemark,
        assignment3TutorRemark,
        status: "reviewed",
      });

      // Save the new reviewed assignment
      const savedTeacherAssignmentGrading = await savePendingAssignment.save();

      res.status(200).json({
        message: "Student Graded Successfully",
        savedTeacherAssignmentGrading,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
];

export const getAllPendingAssignments = async (req, res) => {
  try {
    const pendingAssignments = await pendingAssignmentModel.find({
      adminId: req.user.adminId,
      status: "pending",
    });
    res.status(200).json(pendingAssignments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllReviewedAssignments = async (req, res) => {
  try {
    const reviewedAssignments = await reviewedAssignmentModel.find({
      adminId: req.user.adminId,
      status: "reviewed",
    });
    res.status(200).json(reviewedAssignments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


export const addAssignment = [
  checkPrivilege("Add Assignment"),
  async (req, res) => {
    try {
      const { lessonId } = req.params;
      const { assignmentTitle, assignmentDescription, dueDate } = req.body;

      // Find the lesson
      const lesson = await courseLessonModel.findOne({ lessonId: lessonId });

      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Create new assignment object
      const newAssignment = {
        assignmentTitle,
        assignmentDescription,
        dueDate,
        createdBy: req.user.adminId,
      };

      // Add the new assignment to the lesson's assignments array
      lesson.assignments.push(newAssignment);

      // Save the updated lesson
      await lesson.save();

      res.status(201).json({
        message: "Assignment added successfully",
        assignment: newAssignment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];