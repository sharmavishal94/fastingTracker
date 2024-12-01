document.getElementById('start-fasting').addEventListener('click', () => {
    const startTimeInput = document.getElementById('start-time').value;
    const duration = parseInt(document.getElementById('duration').value);

    if (!startTimeInput || isNaN(duration) || duration <= 0) {
        alert("Please provide a valid start time and duration.");
        return;
    }

    const startTime = new Date(startTimeInput);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    chrome.storage.local.set(
        { fasting: { startTime: startTime.toISOString(), endTime: endTime.toISOString(), isActive: true } },
        () => {
            updateStatus();
            scheduleNotification(endTime);
        }
    );
});

document.getElementById('end-fasting').addEventListener('click', () => {
    chrome.storage.local.get('fasting', ({ fasting }) => {
        if (fasting && fasting.isActive) {
            const now = new Date();
            fasting.endTime = now.toISOString(); // Manually set the end time
            fasting.isActive = false; // Mark the fast as ended
            chrome.storage.local.set({ fasting }, () => {
                updateStatus();
                alert("Fasting ended manually.");
            });
        } else {
            alert("No active fasting session to end.");
        }
    });
});

function updateStatus() {
    chrome.storage.local.get('fasting', ({ fasting }) => {
        if (fasting) {
            const now = new Date();
            const startTime = new Date(fasting.startTime);
            const endTime = new Date(fasting.endTime);

            if (fasting.isActive && now < endTime) {
                document.getElementById('status').innerText = `Fasting until ${endTime.toLocaleString()}`;
            } else if (!fasting.isActive || now >= endTime) {
                document.getElementById('status').innerText = `Fasting ended at ${endTime.toLocaleString()}`;
            }
        } else {
            document.getElementById('status').innerText = "No active fasting period.";
        }
    });
}

function scheduleNotification(endTime) {
    chrome.notifications.create({
        type: 'basic',
        // iconUrl: 'icons/icon48.png',
        title: 'Fasting Tracker',
        message: `Fasting ends at ${endTime.toLocaleString()}`
    });
}

// Initialize the status on load
updateStatus();
