var sm = {
    b1: {
        x: 250,
        y: 80
    },
    b2: {
        x: 250,
        y: 200
    },
    lh1: {
        x: 200,
        y: 100
    },
    lh2: {
        x: 150,
        y: 80
    },
    rh1: {
        x: 300,
        y: 120
    },
    rh2: {
        x: 350,
        y: 130
    },
    ll1: {
        x: 200,
        y: 250
    },
    ll2: {
        x: 150,
        y: 360
    },
    rl1: {
        x: 310,
        y: 270
    },
    rl2: {
        x: 350,
        y: 270
    }
}
const stickStyle = "stroke:black;stroke-width:15;stroke-linecap='round'";
const svg = document.getElementById("svg");
const animTimeline = document.getElementById("animTimeline");
const headSize = 30;
const cpSize = 8;
var savedFrames = [];
var activeFrame = 0;
var mode = 0; // 0: editing, 1: playing
let animTimer;
let animInterval = 1000;

document.getElementById("btnPlay").addEventListener('click', playAnim);
document.getElementById("btnClear").addEventListener('click', clearAnim);
document.getElementById("animIntervalInput").addEventListener('change', handleIntervalChange);
requestAnimationFrame(render);

function render() {
    svg.innerHTML = `
        <!-- Head -->
        <circle cx="${sm.b1.x}" cy="${sm.b1.y - headSize / 2}" r="${headSize}" fill="black" />
        
        <!-- Body -->
        <line x1="${sm.b1.x}" y1="${sm.b1.y}" x2="${sm.b2.x}" y2="${sm.b2.y}" style="${stickStyle}" />

        <!-- Left hand -->
        <line x1="${sm.b1.x}" y1="${sm.b1.y}" x2="${sm.lh1.x}" y2="${sm.lh1.y}" style="${stickStyle}" />
        <line x1="${sm.lh1.x}" y1="${sm.lh1.y}" x2="${sm.lh2.x}" y2="${sm.lh2.y}" style="${stickStyle}" />

        <!-- Right hand -->
        <line x1="${sm.b1.x}" y1="${sm.b1.y}" x2="${sm.rh1.x}" y2="${sm.rh1.y}" style="${stickStyle}" />
        <line x1="${sm.rh1.x}" y1="${sm.rh1.y}" x2="${sm.rh2.x}" y2="${sm.rh2.y}" style="${stickStyle}" />

        <!-- Left leg -->
        <line x1="${sm.b2.x}" y1="${sm.b2.y}" x2="${sm.ll1.x}" y2="${sm.ll1.y}" style="${stickStyle}" />
        <line x1="${sm.ll1.x}" y1="${sm.ll1.y}" x2="${sm.ll2.x}" y2="${sm.ll2.y}" style="${stickStyle}" />

        <!-- Right leg -->
        <line x1="${sm.b2.x}" y1="${sm.b2.y}" x2="${sm.rl1.x}" y2="${sm.rl1.y}" style="${stickStyle}" />
        <line x1="${sm.rl1.x}" y1="${sm.rl1.y}" x2="${sm.rl2.x}" y2="${sm.rl2.y}" style="${stickStyle}" />

        <!-- Control Points -->
        <!-- b1 --> <circle cx="${sm.b1.x}" cy="${sm.b1.y}" r="${cpSize}" fill="red" class="draggable" id="b1" />
        <!-- b2 --> <circle cx="${sm.b2.x}" cy="${sm.b2.y}" r="${cpSize}" fill="red" class="draggable" id="b2" />
        <!-- lh1 --> <circle cx="${sm.lh1.x}" cy="${sm.lh1.y}" r="${cpSize}" fill="red" class="draggable" id="lh1" />
        <!-- lh2 --> <circle cx="${sm.lh2.x}" cy="${sm.lh2.y}" r="${cpSize}" fill="red" class="draggable" id="lh2" />
        <!-- rh1 --> <circle cx="${sm.rh1.x}" cy="${sm.rh1.y}" r="${cpSize}" fill="red" class="draggable" id="rh1" />
        <!-- rh2 --> <circle cx="${sm.rh2.x}" cy="${sm.rh2.y}" r="${cpSize}" fill="red" class="draggable" id="rh2" />
        <!-- ll1 --> <circle cx="${sm.ll1.x}" cy="${sm.ll1.y}" r="${cpSize}" fill="red" class="draggable" id="ll1" />
        <!-- ll2 --> <circle cx="${sm.ll2.x}" cy="${sm.ll2.y}" r="${cpSize}" fill="red" class="draggable" id=ll2 />
        <!-- rl1 --> <circle cx="${sm.rl1.x}" cy="${sm.rl1.y}" r="${cpSize}" fill="red" class="draggable" id="rl1" />
        <!-- rl2 --> <circle cx="${sm.rl2.x}" cy="${sm.rl2.y}" r="${cpSize}" fill="red" class="draggable" id="rl2" />
    `;

    if (mode === 1) {
        animTimeline.innerHTML = "";
        for (let i = 0; i < savedFrames.length; i++) {
            animTimeline.innerHTML += `<div class="animFrame ${activeFrame === i ? '--activeFrame' : ''}"></div>`
        }
    }
    requestAnimationFrame(render);
}

function enableDragging(evt) {
    var svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    var activeCp = false;
    function startDrag(e) {
        if (e.target.classList.contains('draggable')) activeCp = e.target;
    }
    function drag(e) {
        if (activeCp && mode === 0) {
            e.preventDefault();
            sm[activeCp.getAttributeNS(null, "id")] = {
                x: e.clientX,
                y: e.clientY
            }
        }
    }
    function endDrag(e) {
        activeCp = null;
        savedFrames.push(JSON.parse(JSON.stringify(sm)));
    }
}

function playAnim() {
    mode = 1;
    animTimer = setInterval(() => {
        if (savedFrames[activeFrame]) {
            sm = savedFrames[activeFrame];
            activeFrame++;
            if (activeFrame >= savedFrames.length - 1) {
                clearAnim();
            }
        }
    }, animInterval);
}

function clearAnim() {
    savedFrames = [];
    clearInterval(animTimer);
    mode = 0;
    activeFrame = 0;
    animTimeline.innerHTML = "";
}

function handleIntervalChange(e) {
    animInterval = parseInt(e.target.value);
}
