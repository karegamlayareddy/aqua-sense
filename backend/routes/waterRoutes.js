const express = require("express");
const router = express.Router();

const supabase = require("../config/db");


// GET ALL AREAS

router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("areas")
        .select("*")
        .order("area_name");

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        areas: data
    });

});


// GET PARTICULAR AREA

router.get("/:area", async (req, res) => {

    const { data: area, error } = await supabase
        .from("areas")
        .select("*")
        .ilike("area_name", req.params.area)
        .maybeSingle();

    if (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    if (!area) {
        return res.status(404).json({
            message: "Area not found"
        });
    }

    const { data: readings, error: readingError } =
        await supabase
            .from("water_readings")
            .select("*")
            .eq("area_id", area.id)
            .order("reading_date", { ascending: false })
            .limit(1);

    if (readingError) {
        return res.status(500).json({
            message: readingError.message
        });
    }

    res.json({
        success: true,
        data: {
            ...area,
            water_usage: readings?.[0]?.water_usage ?? 0
        }
    });

});


// ADD WATER READING

router.post("/reading", async (req, res) => {

    const {
        area_id,
        water_usage,
        flow_rate,
        pressure
    } = req.body;

    if (
        !Number.isInteger(Number(area_id)) ||
        !Number.isFinite(Number(water_usage)) ||
        Number(water_usage) < 0
    ) {
        return res.status(400).json({
            message: "Invalid water reading"
        });
    }

    const { data, error } = await supabase
        .from("water_readings")
        .insert([{
            area_id: Number(area_id),
            water_usage: Number(water_usage),
            flow_rate: flow_rate ?? null,
            pressure: pressure ?? null
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
        message: "Water reading saved",
        data
    });

});


// WEEKLY WATER REPORT

router.get("/:area/weekly", async (req, res) => {

    const { data: area, error } = await supabase
        .from("areas")
        .select("id")
        .ilike("area_name", req.params.area)
        .maybeSingle();

    if (error || !area) {
        return res.status(404).json({
            message: "Area not found"
        });
    }

    const since = new Date();

    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const { data, error: readingError } = await supabase
        .from("water_readings")
        .select("water_usage, reading_date")
        .eq("area_id", area.id)
        .gte("reading_date", since.toISOString())
        .order("reading_date");

    if (readingError) {
        return res.status(500).json({
            message: readingError.message
        });
    }

    const daily = {};

    data.forEach(item => {

        const date = item.reading_date.slice(0, 10);

        daily[date] = (daily[date] || 0) +
            Number(item.water_usage);

    });

    res.json({
        success: true,
        weeklyData: Object.entries(daily).map(
            ([date, total_usage]) => ({
                date,
                total_usage
            })
        )
    });

});


module.exports = router;