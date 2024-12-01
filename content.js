(function () {
    if (document.getElementById('fasting-timer')) return; // Prevent duplicate buttons

    // Create a draggable hover button
    const fastingTimer = document.createElement('div');
    fastingTimer.id = 'fasting-timer';
    fastingTimer.textContent = 'Loading...';
    fastingTimer.style.position = 'fixed';
    fastingTimer.style.top = '50%'; // Vertically centered
    fastingTimer.style.transform = 'translateY(-50%)'; // Adjust for centering
    fastingTimer.style.right = '10px'; // Align to the right
    fastingTimer.style.padding = '10px';
    fastingTimer.style.backgroundColor = '#007bff';
    fastingTimer.style.color = '#fff';
    fastingTimer.style.borderRadius = '5px';
    fastingTimer.style.cursor = 'move';
    fastingTimer.style.zIndex = '9999';
    fastingTimer.style.fontFamily = 'Arial, sans-serif';
    fastingTimer.style.fontSize = '14px';

    document.body.appendChild(fastingTimer);

    // Make the button draggable
    fastingTimer.addEventListener('mousedown', (event) => {
        let shiftX = event.clientX - fastingTimer.getBoundingClientRect().left;
        let shiftY = event.clientY - fastingTimer.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            fastingTimer.style.left = `${Math.max(0, Math.min(window.innerWidth - fastingTimer.offsetWidth, pageX - shiftX))}px`;
            fastingTimer.style.top = `${Math.max(0, Math.min(window.innerHeight - fastingTimer.offsetHeight, pageY - shiftY))}px`;
            fastingTimer.style.right = "auto";
            fastingTimer.style.transform = "none";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        fastingTimer.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        });
    });

    fastingTimer.ondragstart = () => false;

    // Calculate fasting phase and time to the next phase
    function calculatePhase(startTime) {
        const now = new Date();
        const elapsedHours = (now - new Date(startTime)) / (1000 * 60 * 60); // Hours elapsed

        if (elapsedHours < 4) {
            return { phase: "Early Fasting", nextPhaseIn: 4 - elapsedHours };
        } else if (elapsedHours < 12) {
            return { phase: "Fat Burning", nextPhaseIn: 12 - elapsedHours };
        } else {
            return { phase: "Deep Fasting", nextPhaseIn: null }; // No next phase
        }
    }

    // Update fasting timer
    function updateFastingTimer() {
        chrome.storage.local.get('fasting', ({ fasting }) => {
            if (fasting && fasting.isActive) {
                const { phase, nextPhaseIn } = calculatePhase(fasting.startTime);
                let nextPhaseText = nextPhaseIn ? `Next stage in ${Math.ceil(nextPhaseIn * 60)} minutes` : "You are in the final phase";

                const now = new Date();
                const endTime = new Date(fasting.endTime);
                const remainingMinutes = Math.ceil((endTime - now) / (1000 * 60));

                fastingTimer.innerHTML = `
                <strong>Stage:</strong> ${phase}<br>
                ${nextPhaseText}<br>
                <strong>Time Left:</strong> ${remainingMinutes} minutes
            `;
        } else {
            fastingTimer.innerHTML = 'No active fasting session';
        }
        });
    }

    setInterval(updateFastingTimer, 1000); // Update every second
})();
