const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Login API
router.post("/login", async (req, res) => {
    const { rollNumber, password } = req.body;
    const student = await Student.findOne({ rollNumber, password });
    
    if (student) {
        res.json({ success: true, student });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

module.exports = router;
