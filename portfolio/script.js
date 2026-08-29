// ===== PARTICLES CANVAS =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const PARTICLE_COUNT = 80;

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '168, 85, 247' : '236, 72, 153';
  }

  update() {
    // Mouse attraction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.x += dx * 0.02;
      this.y += dy * 0.02;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPED TEXT EFFECT =====
const roles = ['Frontend Developer', 'UI/UX Designer', 'Creative Coder', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.querySelector('.typed-text');

function type() {
  const current = roles[roleIndex];
  typedEl.textContent = isDeleting
    ? current.slice(0, --charIndex)
    : current.slice(0, ++charIndex);

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; type(); }, 1800);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(type, isDeleting ? 60 : 100);
}
type();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.section, .skill-card, .project-card, .about-content, .contact-content, .stat');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.style.background = window.scrollY > 50
    ? 'rgba(10, 10, 15, 0.98)'
    : 'rgba(10, 10, 15, 0.8)';
});

// ===== TILT EFFECT ON SKILL CARDS =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== RIPPLE EFFECT ON BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%; background:rgba(255,255,255,0.3);
      width:10px; height:10px;
      top:${e.clientY - rect.top - 5}px;
      left:${e.clientX - rect.left - 5}px;
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform: scale(30); opacity: 0; } }`;
document.head.appendChild(style);

// ===== CONTACT FORM =====
// ===== EMAILJS CONTACT FORM =====
emailjs.init('iTspnNQVPrieRr5Pr');

document.querySelector('#contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  emailjs.send('service_2h04wjn', 'template_8gzbj5o', {
    name:    document.getElementById('senderName').value,
    email:   document.getElementById('senderEmail').value,
    message: document.getElementById('senderMessage').value,
  }).then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }).catch((err) => {
    console.error('EmailJS error:', JSON.stringify(err));
    btn.innerHTML = 'Failed: ' + (err.text || err.status || 'Check console');
    btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    btn.disabled = false;
  });
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--primary)' : '';
  });
});

// ===== FLUID DIM ON HOVER =====
const fluidCanvas = document.getElementById('fluid');
document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .social-btn, .stat, .btn').forEach(el => {
  el.addEventListener('mouseenter', () => fluidCanvas.style.opacity = '0.15');
  el.addEventListener('mouseleave', () => fluidCanvas.style.opacity = '1');
});
document.querySelectorAll('.project-card, .contact-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// ===== SPLASH CURSOR FLUID SIMULATION =====
(function () {
  const canvas = document.getElementById('fluid');
  const config = {
    SIM_RESOLUTION: 128, DYE_RESOLUTION: 1440, DENSITY_DISSIPATION: 7,
    VELOCITY_DISSIPATION: 4, PRESSURE: 0.1, PRESSURE_ITERATIONS: 20,
    CURL: 3, SPLAT_RADIUS: 0.2, SPLAT_FORCE: 6000, SHADING: true,
    RAINBOW_MODE: false, COLOR: '#a855f7',
    BACK_COLOR: { r: 0, g: 0, b: 0 }, TRANSPARENT: true
  };

  function pointerProto() {
    this.id = -1; this.texcoordX = 0; this.texcoordY = 0;
    this.prevTexcoordX = 0; this.prevTexcoordY = 0;
    this.deltaX = 0; this.deltaY = 0;
    this.down = false; this.moved = false; this.color = [0, 0, 0];
  }
  let pointers = [new pointerProto()];

  const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
  let gl = canvas.getContext('webgl2', params);
  const isWebGL2 = !!gl;
  if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

  let halfFloat, supportLinearFiltering;
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float');
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
  }
  gl.clearColor(0, 0, 0, 1);
  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat && halfFloat.HALF_FLOAT_OES);

  function getSupportedFormat(internalFormat, format, type) {
    if (!supportRenderTextureFormat(internalFormat, format, type)) {
      if (internalFormat === gl.R16F) return getSupportedFormat(gl.RG16F, gl.RG, type);
      if (internalFormat === gl.RG16F) return getSupportedFormat(gl.RGBA16F, gl.RGBA, type);
      return null;
    }
    return { internalFormat, format };
  }
  function supportRenderTextureFormat(internalFormat, format, type) {
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  }

  let formatRGBA, formatRG, formatR;
  if (isWebGL2) {
    formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType);
    formatRG   = getSupportedFormat(gl.RG16F,   gl.RG,   halfFloatTexType);
    formatR    = getSupportedFormat(gl.R16F,    gl.RED,  halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG   = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR    = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
  }
  if (!supportLinearFiltering) { config.DYE_RESOLUTION = 256; config.SHADING = false; }

  function compileShader(type, src, keywords) {
    if (keywords) src = keywords.map(k => '#define ' + k + '\n').join('') + src;
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s;
  }
  function createProgram(vs, fs) {
    const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p); return p;
  }
  function getUniforms(prog) {
    const u = {}, n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(prog, i).name; u[name] = gl.getUniformLocation(prog, name); }
    return u;
  }

  const baseVS = compileShader(gl.VERTEX_SHADER, `precision highp float;
    attribute vec2 aPosition; varying vec2 vUv,vL,vR,vT,vB; uniform vec2 texelSize;
    void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);
    vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`);

  const programs = {
    copy:     createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`)),
    clear:    createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`)),
    splat:    createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1.);}`)),
    advect:   createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize,dyeTexelSize;uniform float dt,dissipation;void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;vec4 result=texture2D(uSource,coord);gl_FragColor=result/(1.+dissipation*dt);}`)),
    diverge:  createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`)),
    curl:     createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){gl_FragColor=vec4(.5*(texture2D(uVelocity,vR).y-texture2D(uVelocity,vL).y-texture2D(uVelocity,vT).x+texture2D(uVelocity,vB).x),0.,0.,1.);}`)),
    vorticity:createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force=force/(length(force)+.0001)*curl*C;force.y*=-1.;vec2 v=texture2D(uVelocity,vUv).xy+force*dt;gl_FragColor=vec4(clamp(v,-1000.,1000.),0.,1.);}`)),
    pressure: createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){gl_FragColor=vec4((.25*(texture2D(uPressure,vL).x+texture2D(uPressure,vR).x+texture2D(uPressure,vB).x+texture2D(uPressure,vT).x-texture2D(uDivergence,vUv).x)),0.,0.,1.);}`)),
    gradSub:  createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){vec2 v=texture2D(uVelocity,vUv).xy-vec2(texture2D(uPressure,vR).x-texture2D(uPressure,vL).x,texture2D(uPressure,vT).x-texture2D(uPressure,vB).x);gl_FragColor=vec4(v,0.,1.);}`)),
  };
  const displayKeywords = config.SHADING ? ['SHADING'] : [];
  const displayProgram = createProgram(baseVS, compileShader(gl.FRAGMENT_SHADER,
    `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform vec2 texelSize;
    vec3 ltog(vec3 c){return max(1.055*pow(max(c,vec3(0.)),vec3(.4166667))-.055,vec3(0.));}
    void main(){vec3 c=texture2D(uTexture,vUv).rgb;
    #ifdef SHADING
    float dx=length(texture2D(uTexture,vR).rgb)-length(texture2D(uTexture,vL).rgb);
    float dy=length(texture2D(uTexture,vT).rgb)-length(texture2D(uTexture,vB).rgb);
    vec3 n=normalize(vec3(dx,dy,length(texelSize)));c*=clamp(dot(n,vec3(0.,0.,1.))+.7,.7,1.);
    #endif
    gl_FragColor=vec4(c,max(c.r,max(c.g,c.b)));}`, displayKeywords));

  const U = {}; [['copy',programs.copy],['clear',programs.clear],['splat',programs.splat],
    ['advect',programs.advect],['diverge',programs.diverge],['curl',programs.curl],
    ['vorticity',programs.vorticity],['pressure',programs.pressure],['gradSub',programs.gradSub],
    ['display',displayProgram]].forEach(([k,p]) => { U[k] = getUniforms(p); });

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);

  function blit(target, clear) {
    if (target == null) { gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER,null); }
    else { gl.viewport(0,0,target.width,target.height); gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo); }
    if (clear) { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  function createFBO(w, h, internalFormat, format, type, param) {
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture:tex, fbo, width:w, height:h, texelSizeX:1/w, texelSizeY:1/h,
      attach(id){ gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D,tex); return id; }};
  }
  function createDoubleFBO(w,h,iF,f,t,p){
    let a=createFBO(w,h,iF,f,t,p), b=createFBO(w,h,iF,f,t,p);
    return { width:w,height:h,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,
      get read(){return a;}, set read(v){a=v;}, get write(){return b;}, set write(v){b=v;},
      swap(){let t=a;a=b;b=t;} };
  }

  function getRes(r){ const ar=gl.drawingBufferWidth/gl.drawingBufferHeight; const ratio=ar<1?1/ar:ar; const mn=Math.round(r),mx=Math.round(r*ratio); return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx}; }
  function scaleByDPR(v){ return Math.floor(v*(window.devicePixelRatio||1)); }

  let dye, velocity, divergence, curl, pressure;
  function initFBOs(){
    const sr=getRes(config.SIM_RESOLUTION), dr=getRes(config.DYE_RESOLUTION);
    const tt=halfFloatTexType, fil=supportLinearFiltering?gl.LINEAR:gl.NEAREST;
    gl.disable(gl.BLEND);
    dye      = createDoubleFBO(dr.width,dr.height,formatRGBA.internalFormat,formatRGBA.format,tt,fil);
    velocity = createDoubleFBO(sr.width,sr.height,formatRG.internalFormat,  formatRG.format,  tt,fil);
    divergence= createFBO(sr.width,sr.height,formatR.internalFormat,formatR.format,tt,gl.NEAREST);
    curl      = createFBO(sr.width,sr.height,formatR.internalFormat,formatR.format,tt,gl.NEAREST);
    pressure  = createDoubleFBO(sr.width,sr.height,formatR.internalFormat,formatR.format,tt,gl.NEAREST);
  }
  initFBOs();

  function HSV(h,s,v){let r,g,b,i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);switch(i%6){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;break;default:r=g=b=0;}return{r,g,b};}
  function hexToRGB(hex){let v=hex.replace('#','');if(v.length===3)v=v[0]+v[0]+v[1]+v[1]+v[2]+v[2];return{r:parseInt(v.slice(0,2),16)/255*.12,g:parseInt(v.slice(2,4),16)/255*.12,b:parseInt(v.slice(4,6),16)/255*.12};}
  let colorToggle = 0;
  function genColor(){
    colorToggle++;
    const hex = colorToggle % 2 === 0 ? '#a855f7' : '#ec4899';
    return hexToRGB(hex);
  }

  function splat(x,y,dx,dy,color){
    gl.useProgram(programs.splat);
    gl.uniform1i(U.splat.uTarget,velocity.read.attach(0));
    gl.uniform1f(U.splat.aspectRatio,canvas.width/canvas.height);
    gl.uniform2f(U.splat.point,x,y);
    gl.uniform3f(U.splat.color,dx,dy,0);
    let r=config.SPLAT_RADIUS/100; if(canvas.width/canvas.height>1)r*=canvas.width/canvas.height;
    gl.uniform1f(U.splat.radius,r);
    blit(velocity.write); velocity.swap();
    gl.uniform1i(U.splat.uTarget,dye.read.attach(0));
    gl.uniform3f(U.splat.color,color.r,color.g,color.b);
    blit(dye.write); dye.swap();
  }

  function step(dt){
    gl.disable(gl.BLEND);
    gl.useProgram(programs.curl);
    gl.uniform2f(U.curl.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(U.curl.uVelocity,velocity.read.attach(0)); blit(curl);

    gl.useProgram(programs.vorticity);
    gl.uniform2f(U.vorticity.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(U.vorticity.uVelocity,velocity.read.attach(0));
    gl.uniform1i(U.vorticity.uCurl,curl.attach(1));
    gl.uniform1f(U.vorticity.curl,config.CURL); gl.uniform1f(U.vorticity.dt,dt);
    blit(velocity.write); velocity.swap();

    gl.useProgram(programs.diverge);
    gl.uniform2f(U.diverge.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(U.diverge.uVelocity,velocity.read.attach(0)); blit(divergence);

    gl.useProgram(programs.clear);
    gl.uniform1i(U.clear.uTexture,pressure.read.attach(0));
    gl.uniform1f(U.clear.value,config.PRESSURE); blit(pressure.write); pressure.swap();

    gl.useProgram(programs.pressure);
    gl.uniform2f(U.pressure.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(U.pressure.uDivergence,divergence.attach(0));
    for(let i=0;i<config.PRESSURE_ITERATIONS;i++){
      gl.uniform1i(U.pressure.uPressure,pressure.read.attach(1));
      blit(pressure.write); pressure.swap();
    }

    gl.useProgram(programs.gradSub);
    gl.uniform2f(U.gradSub.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(U.gradSub.uPressure,pressure.read.attach(0));
    gl.uniform1i(U.gradSub.uVelocity,velocity.read.attach(1));
    blit(velocity.write); velocity.swap();

    gl.useProgram(programs.advect);
    gl.uniform2f(U.advect.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform2f(U.advect.dyeTexelSize,velocity.texelSizeX,velocity.texelSizeY);
    const vid=velocity.read.attach(0);
    gl.uniform1i(U.advect.uVelocity,vid); gl.uniform1i(U.advect.uSource,vid);
    gl.uniform1f(U.advect.dt,dt); gl.uniform1f(U.advect.dissipation,config.VELOCITY_DISSIPATION);
    blit(velocity.write); velocity.swap();

    gl.uniform2f(U.advect.dyeTexelSize,dye.texelSizeX,dye.texelSizeY);
    gl.uniform1i(U.advect.uVelocity,velocity.read.attach(0));
    gl.uniform1i(U.advect.uSource,dye.read.attach(1));
    gl.uniform1f(U.advect.dissipation,config.DENSITY_DISSIPATION);
    blit(dye.write); dye.swap();
  }

  function render(){
    gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
    const w=gl.drawingBufferWidth, h=gl.drawingBufferHeight;
    gl.useProgram(displayProgram);
    if(config.SHADING) gl.uniform2f(U.display.texelSize,1/w,1/h);
    gl.uniform1i(U.display.uTexture,dye.read.attach(0));
    blit(null);
  }

  function resizeCanvas(){
    const w=scaleByDPR(canvas.clientWidth), h=scaleByDPR(canvas.clientHeight);
    if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; return true; }
    return false;
  }

  let lastTime=Date.now(), colorTimer=0;
  function loop(){
    const now=Date.now(), dt=Math.min((now-lastTime)/1000,.016666); lastTime=now;
    if(resizeCanvas()) initFBOs();
    colorTimer+=dt*config.COLOR_UPDATE_SPEED;
    if(colorTimer>=1){ colorTimer=0; pointers.forEach(p=>{ p.color=genColor(); }); }
    pointers.forEach(p=>{ if(p.moved){ p.moved=false; splat(p.texcoordX,p.texcoordY,p.deltaX*config.SPLAT_FORCE,p.deltaY*config.SPLAT_FORCE,p.color); } });
    step(dt); render();
    requestAnimationFrame(loop);
  }
  loop();

  // Correct delta for aspect ratio
  function cdx(d){ const ar=canvas.width/canvas.height; return ar<1?d*ar:d; }
  function cdy(d){ const ar=canvas.width/canvas.height; return ar>1?d/ar:d; }

  window.addEventListener('mousemove', e => {
    const p=pointers[0];
    const px=scaleByDPR(e.clientX), py=scaleByDPR(e.clientY);
    p.prevTexcoordX=p.texcoordX; p.prevTexcoordY=p.texcoordY;
    p.texcoordX=px/canvas.width; p.texcoordY=1-py/canvas.height;
    p.deltaX=cdx(p.texcoordX-p.prevTexcoordX);
    p.deltaY=cdy(p.texcoordY-p.prevTexcoordY);
    p.moved=Math.abs(p.deltaX)>0||Math.abs(p.deltaY)>0;
    if(!p.color||!p.color.r) p.color=genColor();
  });

  window.addEventListener('mousedown', e => {
    const p=pointers[0];
    p.texcoordX=scaleByDPR(e.clientX)/canvas.width;
    p.texcoordY=1-scaleByDPR(e.clientY)/canvas.height;
    p.color=genColor(); p.color.r*=10; p.color.g*=10; p.color.b*=10;
    splat(p.texcoordX,p.texcoordY,10*(Math.random()-.5),30*(Math.random()-.5),p.color);
  });
})();
