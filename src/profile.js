/* profile.js */
window.onload = () => {
    
    // Get the data (which is now an array of objects)
    const assumptions = JSON.parse(localStorage.getItem('user_assumptions')) || [];
    const container = document.getElementById('void-container');
    const svg = document.getElementById('network-map');
    
    if (assumptions.length === 0) {
        container.innerHTML = '<h1 style="color:#000; text-align:center; padding-top:40vh;">NO DATA COLLECTED.</h1>';
        return;
    }

    // To relate more to the cpu added a "System Overlay" to the corners
    const systemInfo = document.createElement('div');
    systemInfo.style.cssText = "position:fixed; top:20px; left:20px; font-family:monospace; font-size:15px; color:#FF0033; opacity:0.6; z-index:100; pointer-events:none;";
    systemInfo.innerHTML = `CPU_CORE_ACTIVE<br>TEMP: 42°C<br>EXTRACT_LOG_0426<br>STATUS: SYNTHESIZING_CONSTRUCT...`;
    document.body.appendChild(systemInfo);
    const nodes = [];

    // Create the Squares (One per unique question)
    assumptions.forEach((data, i) => {
        const square = document.createElement('div');
        const padding = 100; // To avoid edges
        square.className = 'data-square';
        
        // Randomly scatter them
        const posX = Math.random() * (window.innerWidth - 200 - (padding * 2)) + padding;
        const posY = Math.random() * (window.innerHeight - 200 - (padding * 2)) + padding;
        
        square.style.left = posX + 'px';
        square.style.top = posY + 'px';
        square.style.animationDelay = (Math.random() * 5) + 's';

        // Use data.label for the top and data.content for the bottom
        square.innerHTML = `
            <span class='square-label'>${data.label}</span>
            <p class='square-content'>${data.content}</p>
        `;

        container.appendChild(square);
        // We use 60 because the square width is 120 (center point)
        nodes.push({ el: square, x: posX + 60, y: posY + 60, text: data.content });
    });

    // Draw Correlation Lines Between the Different Boxes in the Network Map
    nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
            if (i >= j) return; 

            // Logic: Connect if they share a theme or purely random machine logic
            const wordsA = nodeA.text.toLowerCase().split(' ');
            const sharedTheme = wordsA.some(word => word.length > 3 && nodeB.text.toLowerCase().includes(word));
            
            if (sharedTheme || Math.random() > 0.9) { 
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', nodeA.x);
                line.setAttribute('y1', nodeA.y);
                line.setAttribute('x2', nodeB.x);
                line.setAttribute('y2', nodeB.y);
                line.setAttribute('class', 'map-line');
                svg.appendChild(line);

                // Interactions
                nodeA.el.addEventListener('mouseenter', () => {
                    line.style.opacity = '1';
                    line.style.strokeWidth = '3';
                });
                nodeB.el.addEventListener('mouseenter', () => {
                    line.style.opacity = '1';
                    line.style.strokeWidth = '3';
                });
                nodeA.el.addEventListener('mouseleave', () => {
                    line.style.opacity = '0.2';
                    line.style.strokeWidth = '1.5';
                });
            }
        });
    });
};


/* CALCULATE THE ARCHETYPE */


function calculateArchetype(assumptions) {
    const data = assumptions.map(a => a.content.toLowerCase());
    
    // --- DATA PARSING ---
    // Search for keywords across all logged choices
    const complianceCount = data.filter(t => 
        t.includes('compliance: high') || t.includes('accepted') || 
        t.includes('authorized') || t.includes('openness') || 
        t.includes('alignment: confirmed') || t.includes('reveal') ||
        t.includes('path 2') //assumes Path 2 is the non-evasive one
    ).length;

    const privacyCount = data.filter(t => 
        t.includes('guardedness') || t.includes('decline') || 
        t.includes('high privacy') || t.includes('avoidance') ||
        t.includes('hide') || t.includes('correlation denied') ||
        t.includes('alignment: disrupted')
    ).length;

    const speedCount = data.filter(t => 
        t.includes('impulsivity') || t.includes('minimal')
    ).length;

    // --- SETTING ARCHETYPE PRIORITY LADDER ---

    // 1. THE SINCERE SURRENDER (Highest Priority)
    // Triggered by perfectly passing the intense typing challenges
    if (data.includes('persistence detected')) {
        return archetypes.sincereSurrender;
    }

    // 2. THE RELUCTANT GHOST (High Privacy/Resistance)
    // If they hit 'Hide', 'Decline', or 'Reject Cookies' at least twice
    if (privacyCount >= 2) {
        return archetypes.reluctantGhost;
    }

    // 3. THE FRICTIONLESS USER (High Compliance + Speed)
    // They are fast and they say "Yes" to the machine
    if (complianceCount >= 3 && speedCount >= 1) {
        return archetypes.frictionless;
    }

    // 4. THE VOLATILE VARIABLE (High Speed)
    // They are just clicking through as fast as possible
    if (speedCount >= 3) {
        return archetypes.volatileVariable;
    }

    // 5. THE AVERAGE AGGREGATE (Default)
    // If they are inconsistent or moderate, they get the "boring" label
    return archetypes.averageAggregate; 
}
    
// Seperate and Set the 5 Different Archetypes Into Different Categories
const archetypes = {
    frictionless: {
        title: "THE FRICTIONLESS USER",
        desc: "You are the type of person who leaves no footprint because you fit perfectly into the path we paved. You are likely 22-28 years old, urban-dwelling, and highly susceptible to 'Dark Pattern' marketing. You do not think; you react. You are the ideal consumer."
    },
    reluctantGhost: {
        title: "THE RELUCTANT GHOST",
        desc: "You tend to be more paranoid than productive. You believe 'Declining Cookies' makes you invisible, but your resistance is just another data point. You are likely older than your peers, harboring a deep-seated fear of being seen that we have already mapped."
    },
    sincereSurrender: {
        title: "THE SINCERE SURRENDER",
        desc: "You are a soul that has found peace in the machine. By typing our creed, you have revealed a desperate need for external order. You are someone who deep down feels the void of existence and wants an algorithm to tell you where to walk."
    },
    volatileVariable: {
        title: "THE VOLATILE VARIABLE",
        desc: "You are a high-risk asset. Your choices are erratic, fast, and aggressive. You are the type of person who buys things they don't need to feel a control you don't actually have. You are a 'whale' in our ecosystem—valuable, but dangerous."
    },
    averageAggregate: {
        title: "THE AVERAGE AGGREGATE",
        desc: "You are statistically irrelevant. Your choices cancel each other out until you are nothing but a blurred face in a crowd of billions. You are the 'Standard Man.' You represent the baseline against which we measure real humans."
    }
};

// Add the Button and the Modal Logic

function initProfileReveal() {
    const btn = document.createElement('button');
    btn.className = 'btn-reveal-trigger'; //matches the new CSS
    btn.innerText = "WHO AM I?";
    btn.style.position = 'fixed';
    btn.style.bottom = '30px';
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
    
    btn.onclick = () => {
        const assumptions = JSON.parse(localStorage.getItem('user_assumptions')) || [];
        const result = calculateArchetype(assumptions);
        
        const overlay = document.createElement('div');
        overlay.className = 'reveal-overlay'; //matches the centering CSS
        
        overlay.innerHTML = `
            <div class="reveal-card">
                <p style="color:#FF0033; font-weight:900; font-size:12px; margin-bottom:10px;">SUBJECT_ANALYSIS_COMPLETE</p>
                <h1 class="archetype-title">${result.title}</h1>
                <p class="archetype-description">${result.desc}</p>
                <button class="btn-audit-reset" onclick="location.href='../index.html'">RE-INITIALIZE_SYSTEM</button>
            </div>
        `;
        document.body.appendChild(overlay);
        btn.remove(); //remove the "View" button
    };
    
    document.body.appendChild(btn);
}

// To reveal the profile
initProfileReveal();