// Benno Stäbler, Benedikt Groß
// additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;

let ground;
let wall01;
let wall02;

let ball;
let path;
let path2;
let scaledImage;
let scaledImage2;

function preload() {
  httpGet("./pathTest03.svg", "text", false, function(response) {
    // when the HTTP request completes ...
    // 1. parse the svg and get the path
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(response, "image/svg+xml");
    const svgPathElement = svgDoc.querySelector("path");
    // 2. setup all matter.js related things
    setupMatter(svgPathElement);
  });
}

function setup() {
  createCanvas(800, 800);
}

function setupMatter(svgPathElement) {
  // use the path from the svg file to create the corresponding matter object
  // path = bodyFromPath(svgPathElement, 180, 300, { isStatic: true, friction: 0.0 });
  path = bodyFromPath(svgPathElement, 180, 200);
  scaledImage = Body.scale(path, 0.15, 0.15);
  // path2 = bodyFromPath(svgPathElement, 180, 100);
  // scaledImage2 = Body.scale(path2, 0.15, 0.15);

  // create an engine
  engine = Engine.create();

  ball = Bodies.circle(100, 50, 25, {friction: 0.0});

  wall01 = Bodies.rectangle(-250, 0, 500, height * 50, {isStatic: true});
  wall02 = Bodies.rectangle(width+1000, 0, 1000, height * 50, {isStatic: true});

  World.add(engine.world, [wall01, wall02])

  ground = Bodies.rectangle(0, height + 50, 1810, 100, {isStatic: true});
  World.add(engine.world, [ground]);

  World.add(engine.world, [ball, path]);
  // World.add(engine.world, [path2]);
  Engine.run(engine);
}


function draw() {
  // do nothing if variable path is empty
  if (!path) return;

  background(255);

  fill(255);
  noStroke();
  // drawVertices(ball.vertices);

  // strokeWeight(0.5);
  // stroke(255);
  fill(0);
  drawBody(path);
  // drawBody(path2);
}

function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    for (let p = 1; p < body.parts.length; p++) {
      drawVertices(body.parts[p].vertices)
    }
  } else {
    drawVertices(body.vertices);
  }
}

function bodyFromPath(path, x, y, options) {
  const body = Matter.Bodies.fromVertices(
    x,
    y,
    Matter.Svg.pathToVertices(path, 10),
    options
  );
  return body;
}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    var pos = mouseConstraint.body.position;
    var offset = mouseConstraint.constraint.pointB;
    var m = mouseConstraint.mouse.position;
    stroke(0, 255, 0);
    strokeWeight(2);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }
}
