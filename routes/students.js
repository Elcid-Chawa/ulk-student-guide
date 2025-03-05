const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

router.post("/register", async (req, res) => {
  const { rollNumber, name, whatsAppNumber, program } = req.body;
  const password = rollNumber;
  try {
    const existingRollNumber = await Student.findOne({ rollNumber });
    const existingWhatsAppNumber = await Student.findOne({ whatsAppNumber });

    if (existingWhatsAppNumber) {
      return res.status(400).json({
        success: false,
        message: "Student WhatsApp number already exists",
      });
    }
    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: "Student roll number already exists",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
  const student = new Student({
    rollNumber,
    password,
    name,
    whatsAppNumber,
    program,
  });
  await student.save();
  res.json({ success: true, student });
});

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json({ success: true, students });
});

// update student
router.put("/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const { password, name, whatsAppNumber, program } = req.body;
  const student = await Student.findOne({ rollNumber });
  if (!student) {
    return res
      .status(404)
      .json({ success: false, message: "Student not found" });
  }
  student.rollNumber = rollNumber;
  student.password = password;
  student.name = name;
  student.whatsAppNumber = whatsAppNumber;
  student.program = program;
  await student.save();
  res.json({ success: true, student });
});

router.delete("/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  try {
    await Student.findOneAndDelete({ rollNumber });

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
