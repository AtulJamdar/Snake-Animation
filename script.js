const SEGMENT_COUNT = 15;
const LEGS_PER_SEGMENT = 6;
const SEGMENT_SPACING = 25;
const MOVE_SPEED = 0.15;
const LEG_WAVE_SPEED = 0.1;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
const segments = [];
const legs = [];

class Segment {
    constructor(index) {
        this.element = document.createElement('div');
        this.element.className = 'segment' + (index === 0 ? ' head' : '');

        if (index === 0) {
            // Add eyes
            const leftEye = createEye('left');
            const rightEye = createEye('right');
            this.element.append(leftEye, rightEye);
        }

        document.getElementById('container').appendChild(this.element);
        this.x = mouseX;
        this.y = mouseY;
        this.angle = 0;
    }
}

function createEye(position) {
    const eye = document.createElement('div');
    eye.className = `eye ${position}`;
    const pupil = document.createElement('div');
    pupil.className = 'pupil';
    eye.appendChild(pupil);
    return eye;
}

function createLegs(segment) {
    const legGroup = [];
    for (let i = 0; i < LEGS_PER_SEGMENT; i++) {
        const leg = document.createElement('div');
        leg.className = 'leg';
        segment.element.appendChild(leg);
        legGroup.push(leg);
    }
    return legGroup;
}

function init() {
    // Create segments
    for (let i = 0; i < SEGMENT_COUNT; i++) {
        const segment = new Segment(i);
        segments.push(segment);
        if (i > 0) {
            legs.push(createLegs(segment));
        }
    }
}

function updateSegments() {
    segments.forEach((segment, index) => {
        if (index === 0) {
            // Head follows mouse directly
            segment.x += (mouseX - segment.x) * MOVE_SPEED;
            segment.y += (mouseY - segment.y) * MOVE_SPEED;

            // Calculate rotation angle
            const dx = mouseX - segment.x;
            const dy = mouseY - segment.y;
            segment.angle = Math.atan2(dy, dx);
        } else {
            // Body follows previous segment
            const leader = segments[index - 1];
            const targetX = leader.x - Math.cos(leader.angle) * SEGMENT_SPACING;
            const targetY = leader.y - Math.sin(leader.angle) * SEGMENT_SPACING;

            segment.x += (targetX - segment.x) * MOVE_SPEED;
            segment.y += (targetY - segment.y) * MOVE_SPEED;

            // Calculate body segment angle
            const dx = segment.x - leader.x;
            const dy = segment.y - leader.y;
            segment.angle = Math.atan2(dy, dx);
        }

        // Update position and rotation
        segment.element.style.left = segment.x + 'px';
        segment.element.style.top = segment.y + 'px';
        segment.element.style.transform = `rotate(${segment.angle + Math.PI/2}rad)`;
    });
}

function animateLegs(time) {
    legs.forEach((legGroup, segmentIndex) => {
        legGroup.forEach((leg, legIndex) => {
            const angle = Math.sin(time * LEG_WAVE_SPEED + segmentIndex * 0.5 + legIndex * 0.3) * 45;
            leg.style.transform = `rotate(${angle}deg)`;

            // Position legs around segment
            const radius = 25;
            const legAngle = (legIndex / LEGS_PER_SEGMENT) * Math.PI * 2;
            leg.style.left = Math.cos(legAngle) * radius + 15 + 'px';
            leg.style.top = Math.sin(legAngle) * radius + 15 + 'px';
        });
    });
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation loop
function animate(timestamp) {
    updateSegments();
    animateLegs(timestamp / 1000);
    requestAnimationFrame(animate);
}

// Initialize and start
init();
animate();