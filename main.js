var width = window.innerWidth;
var height = window.innerHeight;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x0, true);

// create a renderer instance
var renderer = PIXI.autoDetectRenderer(width, height);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// smoke shader
var uniforms = {};
uniforms.resolution = {
  type: '2f',
  value: {
    x: width,
    y: height
  }
};
uniforms.alpha = {
  type: '1f',
  value: 0.0
};
uniforms.shift = {
  type: '1f',
  value: 1.6
};
uniforms.time = {
  type: '1f',
  value: 0
};
uniforms.speed = {
  type: '2f',
  value: {
    x: 0.7,
    y: 0.4
  }
};

var fragmentSrc = [
  "precision mediump float;",
  "uniform vec2      resolution;",
  "uniform float     time;",
  "uniform float     alpha;",
  "uniform vec2      speed;",
  "uniform float     shift;",

  "float rand(vec2 n) {",
    "return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);",
  "}",

  "float noise(vec2 n) {",
    "const vec2 d = vec2(0.0, 1.0);",
    "vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));",
    "return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);",
  "}",

  "float fbm(vec2 n) {",
    "float total = 0.0, amplitude = 1.0;",
    "for (int i = 0; i < 4; i++) {",
      "total += noise(n) * amplitude;",
      "n += n;",
      "amplitude *= 0.5;",
    "}",
    "return total;",
  "}",

  "void main() {",

    "const vec3 c1 = vec3(255.0/255.0, 255.0/255.0, 255.0/255.0);",
    "const vec3 c2 = vec3(255.0/255.0, 255.0/255.0, 255.0/255.0);",
    "const vec3 c3 = vec3(0.0, 0.0, 0.0);",
    "const vec3 c4 = vec3(255.0/255.0, 255.0/255.0, 255.0/255.0);",
    "const vec3 c5 = vec3(0.3);",
    "const vec3 c6 = vec3(1.4);",

    "vec2 p = gl_FragCoord.xy * 8.0 / resolution.xx;",
    "float q = fbm(p - time * 0.1);",
    "vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));",
    "vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);",
    "float grad = gl_FragCoord.y / resolution.y;",
    "gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / resolution.y), 1.0);",
    "gl_FragColor.xyz *= 1.0-grad;",
  "}"
];

var smokeShader = new PIXI.AbstractFilter(fragmentSrc, uniforms);

// background image
var background = PIXI.Sprite.fromImage("bg.jpg");
background.width = width;
background.height = height;
stage.addChild(background);


// graphics
// var graphics = new PIXI.Graphics()
//
// graphics.beginFill(0xFF3300);
// graphics.lineStyle(4, 0xffd900, 1);

// draw a shape
// graphics.moveTo(500,500);
// graphics.lineTo(250, 500);
// graphics.lineTo(100, 100);
// graphics.lineTo(500, 500);
// graphics.endFill();

// graphics.isMask = true;
// stage.addChild(graphics);



// smoke layer
var smoke = PIXI.Sprite.fromImage("sprite.png");
smoke.width = width;
smoke.height = height;
smoke.shader = smokeShader;
smoke.blendMode = 3;
// smoke.mask = graphics;
stage.addChild(smoke);



var count = 0;

function animate() {
  count += 0.01;
  smokeShader.uniforms.time.value = count;
  smokeShader.syncUniforms();

  renderer.render(stage);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);