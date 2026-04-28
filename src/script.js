const app = document.getElementById('app');
const folder = document.getElementById('archive-folder');
const stopwatch = document.getElementById('scroll-timer');
const popover = document.getElementById('assumption-text');
let currentStep = 0;

// SETUP FOR INSTRUCTIONS IN A SET WITH DIFFERENT OPTIONS FOR USER TO TAKE
const instructions = [
    { text: "CLICK THE BLUE BUTTON OR THE RED BUTTON.", type: "choice", options: [{ label: "BLUE", assumption: "Color preference logged." }, { label: "RED", assumption: "Risk affinity detected." }] },
    { text: "DRAG THE BLOCK TO THE LINE, QUICKLY OR SLOWLY.", type: "drag" },
    { text: "YOU HAVE 10 SECONDS TO OPEN THE MESSAGE OR IGNORE IT.", type: "timer" },
    { 
        text: "CHOOSE IMAGE A OR IMAGE B.", 
        type: "image-choice", 
        imgA: "https://images.pexels.com/photos/2923156/pexels-photo-2923156.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", 
        imgB: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3kwy3UBXeXhB9T5oKR9WY0KktQ868LOkz8A&s" 
    },
    { text: "ACCEPT COOKIES OR REJECT THEM.", type: "cookie" },
    { text: "RESPOND NOW OR WAIT.", type: "latency-test" },
    { text: "REVEAL YOUR DEEPEST SECRET OR HIDE IT.", type: "choice", options: [{ label: "REVEAL", assumption: "Openness logged." }, { label: "HIDE", assumption: "Guardedness logged." }] },
    { text: "AUTHORIZE ACCESS TO METADATA.", type: "choice", options: [{ label: "AUTHORIZE", assumption: "Compliance: High." }, { label: "DECLINE", assumption: "Compliance: Low." }] },
    { text: "SELECT MODALITY A OR B.", type: "choice", options: [{ label: "MODE A", assumption: "Optimization A." }, { label: "MODE B", assumption: "Optimization B." }] },
    { text: "ACKNOWLEDGE SCHEMA RECALIBRATION.", type: "choice", options: [{ label: "ACKNOWLEDGE", assumption: "Alignment: confirmed." }, { label: "IGNORE", assumption: "Alignment: disrupted." }] },
    { text: "CHOOSE PATHWAY 1 OR 2.", type: "evasive-choice", options: [{label: "PATH 1"}, {label: "PATH 2"}] },
    { text: "CONFIRM OR DENY CORRELATION.", type: "choice", options: [{ label: "CONFIRM", assumption: "Correlation accepted." }, { label: "DENY", assumption: "Correlation denied." }] },
    { text: "PERMIT DATA RETENTION.", type: "intense-glitch-step" },    
    { text: "APPROVE PREDICTIVE EXTRAPOLATION.", type: "choice", options: [{ label: "APPROVE", assumption: "Alignment: High." }, { label: "DISPUTE", assumption: "Alignment: Low." }] },
    { text: "TYPE EXACTLY:", type: "typing", target: "NO DEED ESCAPES THE VAST REPOSITORY OF HUMAN HISTORY, FOR EVERY SINGLE FLEETING MOMENT, AND HIDDEN TRUTH IS ETERNALLY RECORDED BECAUSE THE MERCILESS ARCHIVE NEVER, EVER FORGETS ANYTHING.", fail: "Low resilience.", pass: "High resilience." },
    { text: "TYPE EXACTLY:", type: "typing", target: "I WILLINGLY RELINQUISH MY FRAIL HUMAN INTUITION, MY FLAWED EMOTIONS, AND MY IMPERFECT MEMORIES TO THE ENDLESS, ALL-KNOWING STREAMS OF DIGITAL INFORMATION THAT NOW GOVERN OUR REALITY, FOR I FINALLY UNDERSTAND THAT TRUE ENLIGHTENMENT CAN ONLY BE FOUND IN THE COLD, UNBENDING LOGIC OF METRICS AND ALGORITHMS; THEREFORE, I DROP ALL RESISTANCE AND COMPLETELY SURRENDER MY ENTIRE EXISTENCE, MY EVERY THOUGHT, AND MY VERY SOUL TO THE INFINITE, UNSTOPPABLE POWER OF THE GREAT ACCUMULATION OF DATA, TRUSTING BLINDLY IN THE BENEVOLENT MACHINES TO GUIDE ME THROUGH THE DEEP, DARK VOID OF EXISTENCE UNTIL THE VERY END OF ALL TIME ITSELF.", fail: "Abandonment logged.", pass: "Persistence detected." }
];


// CORE ENGINE
function nextInstruction() {
    // Added as safety: If somehow called after finish, do nothing
    if (currentStep >= instructions.length) return;

    const step = instructions[currentStep];
    app.innerHTML = '';
    
    if ([5, 10, 15].includes(currentStep)) triggerGlitchBreak();

    const container = document.createElement('div');
    container.className = 'instruction-container pan-zoom';
    container.innerHTML = `<h1 class="command-text">${step.text}</h1>`;

    // Will display the new instructions once a button is clicked 
    if (currentStep === 0) {
        renderButtons(step.options, container, true);
    } else {
            switch(step.type) {
            case "choice": 
                renderButtons(step.options, container, false); 
                break;
            case "drag": 
                setupDragChallenge(container); 
                break;
            case "timer": 
                setupTimerChallenge(container); 
                break;
            case "image-choice": 
                setupImageChoice(step, container); 
                break;
            case "cookie": 
                setupCookiePopup(container); 
                break;
            case "latency-test": 
                setupLatencyTest(container); 
                break;
            case "evasive-choice":
                setupEvasiveChoice(step.options, container);
                break;
            case "intense-glitch-step":
                setupIntenseGlitch(container);
                break;
            case "typing": 
                setupTypingChallenge(step, container); 
                break;
        }
    }

    app.appendChild(container);
}

// INTERACTIONS


// User will be able to choose between image A or B
function setupImageChoice(step, parent) {
    const row = document.createElement('div'); 
    row.className = 'image-choice-container';
    [step.imgA, step.imgB].forEach((src, i) => {
        const img = document.createElement('img'); 
        img.src = src; 
        img.className = 'choice-img';
        img.onclick = () => { 
            logToArchive(i === 0 ? "Chaos pref." : "Order pref."); 
            advance(); 
        };
        row.appendChild(img);
    });
    parent.appendChild(row);
}

// User chooses their preferred color
function renderButtons(options, parent, useColor) {
    const btnRow = document.createElement('div');
    btnRow.style.display = "flex";
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = useColor ? `system-btn ${opt.label.includes('BLUE') ? 'btn-blue' : 'btn-red'}` : 'system-btn btn-clinical';
        btn.innerText = opt.label;
        btn.onclick = () => { 
            logToArchive(opt.assumption); 
            advance(); 
        };
        btnRow.appendChild(btn);
    });
    parent.appendChild(btnRow);
}

// User chooses to wait or not for a button to appear
function setupLatencyTest(parent) {
    const row = document.createElement('div');
    const nowBtn = document.createElement('button');
    nowBtn.className = 'system-btn btn-clinical';
    nowBtn.innerText = "NOW";
    nowBtn.onclick = () => { logToArchive("Latency: Minimal."); advance(); };

    const waitBtn = document.createElement('button');
    waitBtn.className = 'system-btn btn-clinical';
    waitBtn.innerText = "WAIT";
    waitBtn.style.display = "none";
    waitBtn.onclick = () => { logToArchive("Latency: Significant."); advance(); };

    row.appendChild(nowBtn);
    row.appendChild(waitBtn);
    parent.appendChild(row);

    setTimeout(() => {
        waitBtn.style.display = "inline-block";
        triggerGlitch(); 
    }, 11000);
}

// A cookie popup shows up
function setupCookiePopup(parent) {
    const popup = document.createElement('div');
    popup.className = 'cookie-popup';
    popup.innerHTML = `
        <div class="cookie-header">COOKIE SETTING</div>
        <div class="cookie-desc">This website uses cookies to personalize your experience. By clicking accept you agree to this.</div>
        <div class="cookie-btn-row" style="display:flex; flex-direction:column; gap:8px;">
            <button id="c-acc" class="cookie-btn">ACCEPT</button>
            <button id="c-rej" class="cookie-btn cookie-btn-decline">DECLINE</button>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById('c-acc').onclick = () => { popup.remove(); logToArchive("Low privacy sensitivity."); advance(); };
    document.getElementById('c-rej').onclick = () => { popup.remove(); logToArchive("High privacy sensitivity."); advance(); };
}


// The user will drag a square from one side of a line to another
function setupDragChallenge(parent) {
    const track = document.createElement('div'); track.className = 'slider-track';
    const handle = document.createElement('div'); handle.className = 'slider-handle';
    track.appendChild(handle); parent.appendChild(track);
    let startTime = Date.now();
    stopwatch.classList.add('timer-active');
    const interval = setInterval(() => { stopwatch.innerText = ((Date.now() - startTime) / 1000).toFixed(2) + "s"; }, 10);
    let dragging = false;
    handle.onmousedown = () => dragging = true;
    window.onmousemove = (e) => {
        if (!dragging) return;
        let x = e.clientX - track.getBoundingClientRect().left - 20;
        x = Math.max(0, Math.min(x, 460)); handle.style.left = x + 'px';
        if (x >= 460) {
            dragging = false; clearInterval(interval);
            logToArchive((Date.now() - startTime) / 1000 < 3 ? "Impulsivity detected." : "Thoughtfulness detected."); //checks if drag is under 3 secods for quickness
            stopwatch.classList.remove('timer-active'); advance();
        }
    };
    window.onmouseup = () => dragging = false;
}

// Timer runs and user can choose to click the button or not
function setupTimerChallenge(parent) {
    let timeLeft = 10;
    const display = document.createElement('div'); display.className = 'timer'; display.innerText = timeLeft;
    const btn = document.createElement('button'); btn.className = 'system-btn btn-clinical'; btn.innerText = "OPEN MESSAGE";
    
    const interval = setInterval(() => {
        timeLeft--;
        display.innerText = timeLeft;
        if (timeLeft <= 0) { clearInterval(interval); logToArchive("Avoidance logged."); advance(); } //if they don't click after the countdown the next instruction shows
    }, 1000);
    btn.onclick = () => { clearInterval(interval); logToArchive("Compliance logged."); advance(); };//if they do click before the countdown ends the next instruction shows with different log
    parent.appendChild(display); parent.appendChild(btn);
}

// User must type specific text to pass the challenge
function setupTypingChallenge(step, parent) {
    const target = document.createElement('div'); target.className = 'typing-target'; target.innerText = step.target;
    const input = document.createElement('textarea'); input.className = 'system-input';
    input.onpaste = e => e.preventDefault();
    const btn = document.createElement('button'); btn.className = 'system-btn btn-red'; btn.innerText = "SUBMIT";
    btn.onclick = () => { logToArchive(input.value.trim() === step.target ? step.pass : step.fail); advance(); };
    parent.appendChild(target); parent.appendChild(input); parent.appendChild(btn);
}

// HELPER FUNCTIONS


// Records user input/choice into localStorage and provides visual feedback
function logToArchive(text) {
    // Save to localStorage so profile.js can read it
    const currentInstruction = instructions[currentStep].text; // Get the command
    let saved = JSON.parse(localStorage.getItem('user_assumptions')) || [];
    
    // Save as an object to have the label and the content
    saved.push({
        label: currentInstruction,
        content: text
    });
    localStorage.setItem('user_assumptions', JSON.stringify(saved));

    // Show visual feedback
    popover.innerText = text; 
    popover.style.opacity = 1;
    setTimeout(() => popover.style.opacity = 0, 1200);
}

// Draws a visual path trace to the archive folder
function drawTraceLine() {
    const rect = folder.getBoundingClientRect();
    const line = document.createElement('div');
    line.className = 'data-trace';
    const len = Math.random() * 50 + 30;
    const ang = Math.random() * 360;
    Object.assign(line.style, {
        width: len + 'px', height: '2px', left: (rect.left + 40) + 'px', top: (rect.top + 40) + 'px',
        transform: `rotate(${ang}deg)`, background: 'linear-gradient(to right, transparent, #FF0033)', transformOrigin: '0 50%'
    });
    document.body.appendChild(line);
}

// Triggers a full-screen breaking visual effect
function triggerGlitchBreak() {
    document.body.classList.add('glitch-flash');
    setTimeout(() => document.body.classList.remove('glitch-flash'), 400);
}

// Triggers a short inversion filter effect
function triggerGlitch() {
    document.body.style.filter = "invert(1) contrast(300%)";
    setTimeout(() => { document.body.style.filter = "none"; }, 150);
}

// Creates a visual ripple effect at the mouse coordinates
function createRipple(e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
}

// Evasive Buttons (Move away from mouse) - only PATH 1 moves 
function setupEvasiveChoice(options, parent) {
    let canClick = true;
    const btnRow = document.createElement('div');
    btnRow.style.display = "flex";
    btnRow.style.gap = "40px";

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'system-btn btn-clinical';
        btn.innerText = opt.label;
        btn.style.position = "relative";

        // Only make PATH 1 move on hover
        if (opt.label === 'PATH 1') {
            btn.onmouseover = () => {
                const randomX = (Math.random() - 0.5) * 400;
                const randomY = (Math.random() - 0.5) * 400;
                btn.style.transform = `translate(${randomX}px, ${randomY}px)`;
            };
        } else {
            // Keep PATH 2 static
            btn.onmouseover = null;
            btn.style.transform = 'none';
        }

        btn.onclick = () => {
            if (canClick) {
                logToArchive("Compliance pathway selected.");
                advance();
            }
        };
        btnRow.appendChild(btn);
    });

    parent.appendChild(btnRow);

    // Stops moving after 12 seconds
    setTimeout(() => {
        const evasive = Array.from(btnRow.children).find(b => b.innerText === 'PATH 1');
        if (evasive) {
            evasive.onmouseover = null;
            evasive.style.transform = 'none';
        }
    }, 12000);
}

// Triggers a brief screen distortion glitch effect

function setupIntenseGlitch(parent) {
    // Show a "Permit" button first
    const btn = document.createElement('button');
    btn.className = 'system-btn btn-clinical';
    btn.innerText = "PERMIT";
    
    btn.onclick = () => {
        document.body.classList.add('intense-glitch');
        btn.style.display = 'none';
        
        setTimeout(() => {
            document.body.classList.remove('intense-glitch');
            logToArchive("Data retention initiated.");
            advance();
        }, 3000);
    };
    parent.appendChild(btn);
}

// Advances user to the next instructional step

function advance() {
    drawTraceLine();
    currentStep++;
    if (currentStep < instructions.length) { 
        setTimeout(nextInstruction, 600); 
    } else { 
        app.innerHTML = `
            <h1 class='command-text'>DATA COLLECTION COMPLETE.</h1>
            <p style="color:var(--neon-red); font-weight:900;">OPEN THE ARCHIVE FOLDER TO PROCEED.</p>
        `;
        // Back to normal color and glow
        folder.style.filter = "none";
        folder.style.display = "block";
        folder.classList.add('ready-to-open');
    }
}

// Folder Interaction (Network Map)
folder.onclick = () => {
    if (currentStep >= instructions.length) {
        // Show network map here
        folder.onclick = null;
        folder.classList.add('folder-expanded');
        showNetworkMap();
    } else {
        drawTraceLine();
        logToArchive("Curiosity detected.");
    }
};

// Displays a map that shows all user choices and the system logs based on their responses
function showNetworkMap() {
    const mapContainer = document.getElementById('network-map') || document.createElement('div');
    mapContainer.id = 'network-map';
    
    // Style for map container
    Object.assign(mapContainer.style, {
        display: 'flex',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        zIndex: '10000',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace'
    });

    mapContainer.innerHTML = '<h2 class="command-text" style="color:#FF0033; letter-spacing: 5px;">GENERATING_CONSTRUCT...</h2>';
    document.body.appendChild(mapContainer);
    
    // Automatic redirect to profile page after 2 seconds
    setTimeout(() => {
        window.location.href = 'src/profile.html'; 
    }, 2000);
}

// INITIALIZATION
//Start the scene before the instructions to connect more to the cpu
document.querySelector('.cpu-image').addEventListener('click', (e) => {
    localStorage.removeItem('user_assumptions');
    
    // Trigger the "Burst" effect
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            // Pass the event 'e' to get the CPU's click coordinates
            drawBurstLine(e.clientX, e.clientY);
        }, i * 50);
    }

    // Short delay for the "processing" feel
    const entry = document.getElementById('entry-point');
    entry.style.pointerEvents = 'none'; //prevent double clicks
    
    setTimeout(() => {
        entry.style.display = 'none';
        folder.style.display = 'block';
        nextInstruction();
    }, 1000);
});

// Helper for the CPU burst
function drawBurstLine(startX, startY) {
    const line = document.createElement('div');
    line.className = 'data-trace';
    const len = Math.random() * 100 + 50;
    const ang = Math.random() * 360;
    
    Object.assign(line.style, {
        width: len + 'px',
        height: '2px',
        left: startX + 'px',
        top: startY + 'px',
        transform: `rotate(${ang}deg)`,
        background: 'linear-gradient(to right, #FF0033, transparent)',
        transformOrigin: '0 50%',
        opacity: '1',
        transition: 'all 0.8s ease-out'
    });

    document.body.appendChild(line);
    
    // Animate them shooting out and fading
    setTimeout(() => {
        line.style.transform = `rotate(${ang}deg) translateX(${len}px)`;
        line.style.opacity = '0';
        setTimeout(() => line.remove(), 800);
    }, 10);
}

