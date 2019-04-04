let height, width;
let currentColor = 0,particles = [];

const rainbow = d3.scaleSequential(d3.interpolateRainbow).domain([0, 1000]);

const resizeCanvas = (node, context) => {
    width = window.innerWidth;
    height = window.innerHeight;

    node.width = width;
    node.height = height;
    context.globalAlpha = 0.25;
    context.strokeStyle = '#D7D7D7';
};

const addParticles = context => {
    const max = 96;
    const max2 = max * max;

    particles = d3.range(width > 786 ? 256 : 128).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0 }));

    return () => {
        particles.forEach(p => {
            p.x += p.vx;
            if (p.x < -max) p.x += width + max * 2;else
                if (p.x > width + max) p.x -= width + max * 2;

            p.y += p.vy;
            if (p.y < -max) p.y += height + max * 2;else
                if (p.y > height + max) p.y -= height + max * 2;

            p.vx += 0.025 * (Math.random() - 0.5) - 0.001 * p.vx;
            p.vy += 0.025 * (Math.random() - 0.5) - 0.001 * p.vy;
        });

        for (let i = 0; i < particles.length; ++i) {
            for (let j = i + 1; j < particles.length; ++j) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = dx * dx + dy * dy;

                if (dist < max2) {
                    context.beginPath();
                    context.moveTo(particles[i].x, particles[i].y);
                    context.lineTo(particles[j].x, particles[j].y);
                    context.stroke();
                }
            }
        }
    };
};

const node = d3.select('canvas').node();
const context = node.getContext('2d');
resizeCanvas(node, context);

const renderParticles = addParticles(context);

const render = timestamp => {
    const lastPaint = context.getImageData(0, 0, width, height);
    const lastData = lastPaint.data;
    context.clearRect(0, 0, width, height);

    for (let i = 3; i < lastData.length; i += 4) {
        lastData[i] -= 1;
    }
    context.putImageData(lastPaint, 0, 0);

    if (Math.floor(timestamp) % 64) {
        context.strokeStyle = rainbow(currentColor);
        currentColor++;
    }
    renderParticles();
    requestAnimationFrame(render);
};

window.addEventListener('resize', () => resizeCanvas(node, context));
render(0);
