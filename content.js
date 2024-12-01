(function () {
    if (document.getElementById('fasting-timer')) return; // Avoid duplicates

    // Create a draggable button
    // Create a draggable button
    const fastingTimer = document.createElement('div');
    fastingTimer.id = 'fasting-timer';
    fastingTimer.textContent = 'Loading...';
    fastingTimer.style.position = 'fixed';
    fastingTimer.style.top = '50%'; // Vertically center
    fastingTimer.style.transform = 'translateY(-50%)'; // Adjust for centering
    fastingTimer.style.right = '10px'; // Align to right
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
            const newLeft = pageX - shiftX;
            const newTop = pageY - shiftY;

            // Update position
            fastingTimer.style.left = `${Math.max(0, Math.min(window.innerWidth - fastingTimer.offsetWidth, newLeft))}px`;
            fastingTimer.style.top = `${Math.max(0, Math.min(window.innerHeight - fastingTimer.offsetHeight, newTop))}px`;

            // Clear bottom-right positioning to ensure proper drag behavior
            fastingTimer.style.right = "auto";
            fastingTimer.style.bottom = "auto";
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

    // Update fasting timer
    function updateFastingTimer() {
        chrome.storage.local.get('fasting', ({ fasting }) => {
            if (fasting) {
                const now = new Date();
                const endTime = new Date(fasting.endTime);

                if (now < endTime) {
                    const remaining = Math.ceil((endTime - now) / (1000 * 60)); // Remaining minutes
                    fastingTimer.textContent = `Time left: ${remaining} min`;
                } else {
                    fastingTimer.textContent = 'Fasting ended';
                }
            } else {
                fastingTimer.textContent = 'No fasting active';
            }
        });
    }

    setInterval(updateFastingTimer, 1000); // Update every second
})();
