const express = require("express");
const router = express.Router();

const supabase = require("../config/db");


// GET ALL WATER ISSUES

router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("water_issues")
        .select("*, areas(area_name)")
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    res.json({
        success: true,
        issues: data
    });

});


// REPORT NEW ISSUE

router.post("/", async (req, res) => {

    const {
        area_id,
        issue_type,
        description,
        solution
    } = req.body;

    if (
        !Number.isInteger(Number(area_id)) ||
        typeof issue_type !== "string" ||
        !issue_type.trim() ||
        typeof description !== "string" ||
        !description.trim() ||
        typeof solution !== "string" ||
        !solution.trim()
    ) {
        return res.status(400).json({
            message: "Please enter valid issue details"
        });
    }

    const { data, error } = await supabase
        .from("water_issues")
        .insert([{
            area_id: Number(area_id),
            issue_type: issue_type.trim(),
            description: description.trim(),
            solution: solution.trim()
        }])
        .select()
        .single();

    if (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    res.status(201).json({
        success: true,
        message: "Water issue reported successfully",
        data
    });

});


module.exports = router;