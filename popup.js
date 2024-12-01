document.getElementById('start-fasting').addEventListener('click', () => {
    const startTimeInput = document.getElementById('start-time').value;
    const duration = parseInt(document.getElementById('duration').value);

    if (!startTimeInput || isNaN(duration) || duration <= 0) {
        alert("Please provide a valid start time and duration.");
        return;
    }

    const startTime = new Date(startTimeInput);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    const fastingEntry = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isActive: true,
    };

    // Save fasting data to Chrome storage
    chrome.storage.local.set({ fasting: fastingEntry }, () => {
        alert("Fasting started!");
        updateStatus();
    });
});

document.getElementById('end-fasting').addEventListener('click', () => {
    chrome.storage.local.get('fasting', ({ fasting }) => {
        if (fasting && fasting.isActive) {
            fasting.isActive = false;
            fasting.endTime = new Date().toISOString();

            // Update fasting data in Chrome storage
            chrome.storage.local.set({ fasting }, () => {
                alert("Fasting ended!");
                updateStatus();
            });
        } else {
            alert("No active fasting session to end.");
        }
    });
});

function calculatePhase(startTime) {
    const now = new Date();
    const elapsedHours = (now - new Date(startTime)) / (1000 * 60 * 60);

    if (elapsedHours < 4) {
        return "Early Fasting";
    } else if (elapsedHours < 12) {
        return "Fat Burning";
    } else {
        return "Deep Fasting";
    }
}

function updateStatus() {
    chrome.storage.local.get('fasting', ({ fasting }) => {
        if (fasting) {
            const now = new Date();
            const endTime = new Date(fasting.endTime);
            const isActive = fasting.isActive;

            if (isActive && now < endTime) {
                const phase = calculatePhase(fasting.startTime);
                const remaining = Math.ceil((endTime - now) / (1000 * 60)); // Remaining minutes
                document.getElementById('status').innerText = `
                    Phase: ${phase}
                    Time Left: ${remaining} minutes
                `;
            } else {
                document.getElementById('status').innerText = `Fasting ended at ${endTime.toLocaleString()}`;
            }
        } else {
            document.getElementById('status').innerText = "No active fasting session.";
        }
    });
}

// Initialize the status on load
updateStatus();
