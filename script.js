const sections = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); } });
}, { threshold: 0.14 });
sections.forEach((section) => observer.observe(section));

const navLinks = [...document.querySelectorAll('nav a')];
const anchors = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); });
}, { rootMargin: '-35% 0px -55% 0px' });
anchors.forEach(section => navObserver.observe(section));

const contact = document.querySelector('#contact');
if (contact && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('contact-active'); });
  }, { threshold: .3 }).observe(contact);
}

['#services', '#about'].forEach((selector) => {
  const section = document.querySelector(selector);
  if (section && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) new IntersectionObserver((entries) => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('section-active'); }), { threshold: .22 }).observe(section);
});

const scene = document.querySelector('#growth-scene');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (scene && !reduceMotion) {
  let frame;
  const visual = scene.closest('.hero-visual');
  visual.addEventListener('pointermove', (event) => {
    const bounds = visual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => scene.style.setProperty('--tilt', `${x * 13}deg ${-y * 10}deg`));
  });
  visual.addEventListener('pointerleave', () => scene.style.setProperty('--tilt', '0deg 0deg'));
}

const canvas = document.querySelector('#fdc-webgl');
if (canvas && !reduceMotion) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (gl) {
    const vertex = `attribute vec3 p; uniform mat4 m; void main(){gl_Position=m*vec4(p,1.);}`;
    const fragment = `precision mediump float; uniform vec4 c; void main(){gl_FragColor=c;}`;
    const shader = (type, source) => { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); return s; };
    const program = gl.createProgram(); gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program); gl.useProgram(program);
    const points = [-1,-1,-1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,1,1,-1,1,1,1,1,-1,1,1];
    const indices = [0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,3,2,6,3,6,7,1,5,6,1,6,2,0,3,7,0,7,4];
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
    const mat = gl.getUniformLocation(program, 'm'), color = gl.getUniformLocation(program, 'c');
    let px = 0, py = 0;
    const resize = () => { const d = Math.min(devicePixelRatio, 2), s = canvas.clientWidth * d; canvas.width = s; canvas.height = s; gl.viewport(0,0,s,s); };
    new ResizeObserver(resize).observe(canvas); resize();
    const draw = (time) => { const a = time * .00034 + px, b = time * .00021 + py, ca=Math.cos(a)*.7, sa=Math.sin(a)*.7, cb=Math.cos(b)*.7, sb=Math.sin(b)*.7; const m = new Float32Array([ca,sa*sb,sa*cb,0,0,cb,-sb,0,-sa,ca*sb,ca*cb,.28,0,0,0,1]); gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.uniformMatrix4fv(mat,false,m);gl.uniform4f(color,.43,.19,1,.28);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0); requestAnimationFrame(draw); }; requestAnimationFrame(draw);
    scene.closest('.hero-visual').addEventListener('pointermove', e => { const r = e.currentTarget.getBoundingClientRect(); px = (e.clientX-r.left)/r.width-.5; py = (e.clientY-r.top)/r.height-.5; });
  }
}