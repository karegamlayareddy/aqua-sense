// ============================================
// AQUASENSE FRONTEND JAVASCRIPT
// ============================================


// ================= API CONFIGURATION =================

const API_URL = "http://localhost:5000/api";


// ================= DAILY DATA =================

const waterData = {

    Hyderabad: {
        usage: 6840,
        availability: 76,
        groundwater: 18.5,
        leakage: 2,
        weekly:[6800,7200,6400,7000,6100,6900,6840]
    },

    Siddipet: {
        usage: 5230,
        availability: 69,
        groundwater: 14.2,
        leakage: 1,
        weekly:[5100,5300,4900,5500,5200,5100,5230]
    },

    Warangal: {
        usage: 6120,
        availability: 72,
        groundwater: 16.8,
        leakage: 2,
        weekly:[6000,6200,5800,6400,6100,6000,6120]
    },

    Nalgonda: {
        usage: 7350,
        availability: 58,
        groundwater: 11.4,
        leakage: 4,
        weekly:[7100,7400,7200,7600,7000,7300,7350]
    }

};


// ================= UPDATE DASHBOARD =================

function updateDashboard(area) {
    const data = waterData[area];

    if (!data) return;

    document.getElementById("todayUsage").textContent =
        data.usage.toLocaleString("en-IN");

    document.getElementById("waterAvailable").textContent =
        data.availability;

    document.getElementById("groundWater").textContent =
        data.groundwater;

    document.getElementById("leakageCount").textContent =
        data.leakage;

    // Update chart for selected location
    if (usageChart) {
        usageChart.data.datasets[0].data = data.weekly;
        usageChart.update();
    }

    // Show selected location
    document.getElementById("selectedArea").textContent = area;
}


// ================= AREA CHANGE =================

document.getElementById("areaSelect")
    .addEventListener("change", function () {

        updateDashboard(this.value);

        showAlert(
            `${this.value} water data updated successfully.`
        );

    });


// ================= LAST UPDATED =================

function updateTime() {

    const now = new Date();

    const time = now.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

    document.getElementById("lastUpdated")
        .textContent = time;
}


// Update every 60 seconds

setInterval(updateTime, 60000);

updateTime();


// ================= SCROLL =================

function scrollToSection(id) {

    document.getElementById(id)
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ================= ALERT =================

function showAlert(message) {

    const alertBox = document.createElement("div");

    alertBox.textContent = message;

    alertBox.style.position = "fixed";
    alertBox.style.bottom = "25px";
    alertBox.style.right = "25px";
    alertBox.style.zIndex = "9999";

    alertBox.style.background = "#063b59";
    alertBox.style.color = "white";

    alertBox.style.padding = "15px 22px";

    alertBox.style.borderRadius = "12px";

    alertBox.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.2)";

    document.body.appendChild(alertBox);


    setTimeout(() => {

        alertBox.remove();

    }, 3000);

}


// ================= CHART =================

const ctx =
    document.getElementById("usageChart")
        .getContext("2d");


new Chart(ctx, {

    type: "line",

    data: {

        labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ],

        datasets: [{

            label: "Water Usage (Litres)",

            data: [
                6800,
                7200,
                6400,
                7000,
                6100,
                6900,
                6840
            ],

            borderWidth: 3,

            tension: 0.4,

            fill: true

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {
                display: true
            }

        },

        scales: {

            y: {

                beginAtZero: false

            }

        }

    }

});


// ================= WATER MAP =================

const map = L.map("waterMap")
    .setView(
        [17.3850, 78.4867],
        8
    );


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ================= AREA MARKERS =================


// Hyderabad

L.marker([17.3850, 78.4867])
    .addTo(map)
    .bindPopup(`
        <b>💧 Hyderabad</b><br>
        Water Availability: 76%<br>
        Groundwater: 18.5 m<br>
        Status: 🟢 Good
    `);


// Siddipet

L.marker([18.1018, 78.8520])
    .addTo(map)
    .bindPopup(`
        <b>💧 Siddipet</b><br>
        Water Availability: 69%<br>
        Groundwater: 14.2 m<br>
        Status: 🟠 Moderate
    `);


// Warangal

L.marker([17.9689, 79.5941])
    .addTo(map)
    .bindPopup(`
        <b>💧 Warangal</b><br>
        Water Availability: 72%<br>
        Groundwater: 16.8 m<br>
        Status: 🟢 Good
    `);


// Nalgonda

L.marker([17.0575, 79.2670])
    .addTo(map)
    .bindPopup(`
        <b>💧 Nalgonda</b><br>
        Water Availability: 58%<br>
        Groundwater: 11.4 m<br>
        Status: 🔴 Low
    `);


// ================= LANGUAGE =================

const translations = {

    en: {

        heroTitle:
            `Every Drop Matters. Every Drop Counts.`,

        heroText:
            `AquaSense helps communities monitor water usage, detect leakage, predict shortages and conserve water.`

    },

    te: {

        heroTitle:
            `ప్రతి నీటి బొట్టు ముఖ్యం. ప్రతి బొట్టును ఆదా చేద్దాం.`,

        heroText:
            `AquaSense నీటి వినియోగాన్ని పర్యవేక్షిస్తుంది, లీకేజీలను గుర్తిస్తుంది మరియు నీటి కొరతను అంచనా వేస్తుంది.`

    },

    hi: {

        heroTitle:
            `हर बूंद महत्वपूर्ण है। हर बूंद बचाएं।`,

        heroText:
            `AquaSense पानी के उपयोग की निगरानी करता है, रिसाव का पता लगाता है और पानी की कमी का अनुमान लगाता है।`

    }

};


document.getElementById("languageSelect")
    .addEventListener("change", function () {

        const language = this.value;

        const data = translations[language];

        document.getElementById("heroTitle")
            .textContent = data.heroTitle;

        document.getElementById("heroText")
            .textContent = data.heroText;

    });


// ================= INITIAL DATA =================

updateDashboard("Hyderabad");


// ================= FUTURE AUTO UPDATE =================

// In the future this function can receive
// real IoT sensor data from server.js.

async function getLatestWaterData() {

    try {

        const response =
            await fetch(`${API_URL}/water`);

        const data =
            await response.json();

        console.log(
            "Latest AquaSense Data:",
            data
        );

    }

    catch (error) {

        console.log(
            "Backend not connected yet."
        );

    }

}


// Try loading server data

getLatestWaterData();