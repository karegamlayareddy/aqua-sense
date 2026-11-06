const express = require("express");
const router = express.Router();

const supabase = require("../config/db");


// GET LEAKAGE ALERTS

router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("leakage_alerts")
        .select("*, areas(area_name)")
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    res.json({
        success: true,
        alerts: data
    });

});


// ADD LEAKAGE ALERT

router.post("/", async (req, res) => {

    const {
        area_id,
        location,
        severity,
        flow_rate,
        expected_flow
    } = req.body;

    if (
        !Number.isInteger(Number(area_id)) ||
        typeof location !== "string" ||
        !location.trim() ||
        !["Critical", "Warning", "Safe"].includes(severity) ||
        !Number.isFinite(Number(flow_rate)) ||
        !Number.isFinite(Number(expected_flow)) ||
        Number(flow_rate) < 0 ||
        Number(expected_flow) < 0
    ) {
        return res.status(400).json({
            message: "Invalid leakage information"
        });
    }

    const { data, error } = await supabase
        .from("leakage_alerts")
        .insert([{
            area_id: Number(area_id),
            location: location.trim(),
            severity,
            flow_rate: Number(flow_rate),
            expected_flow: Number(expected_flow)
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
        message: "Leakage alert saved",
        data
    });

});


// UPDATE ALERT STATUS

router.patch("/:id/status", async (req, res) => {

    const { status } = req.body;

    if (!["Open", "In Progress", "Resolved"].includes(status)) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    const { data, error } = await supabase
        .from("leakage_alerts")
        .update({ status })
        .eq("id", req.params.id)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    if (!data) {
        return res.status(404).json({
            message: "Alert not found"
        });
    }

    res.json({
        success: true,
        data
    });

});


module.exports = router;