let play = false;

class Snake {
  constructor (position, radio, color, velocity, length, pathLength, context) {
      this.position = position;
      this.radio = radio;
      this.color = color;
      this.velocity = velocity;
      this.context = context;
      this.rotation = 0;
      this.length = length;
      this.pathLength = pathLength;
      this.body = [];
      this.transparency = 1;
      this.isDead = false;
      this.keys = {
        left: false,
        right: false,
        enable: true
      };
      this.keyboard();
  }
  draw() {
    this.context.save();

    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(this.rotation * (Math.PI / 180));
    this.context.translate(-this.position.x, -this.position.y); // reset the position
    this.drawHead();

    this.context.restore();
  }
  drawDifficult() {
    for (let i = 1; i <= this.length; i++) {
      this.drawCircle(this.position.x - (this.pathLength * this.velocity * i), this.position.y, this.radio, this.color, this.color);
    }
    this.drawHead();

  }
  initBody() {
    for (let i = 0; i < this.length; i++) {
      let path = [];
      for (let j = 0; j < this.pathLength; j++) {
        path.push({ x: this.position.x, y: this.position.y });
      }
      this.body.push(new SnakeBody(this.radio, this.color, this.context, path));
    }
  }
  addBody() {
    let path = [];
    for (let j = 0; j < this.pathLength; j++) {
      path.push({ x: this.body.slice(-1)[0].x, y: this.body.slice(-1)[0].y });
    }
    this.body.push(new SnakeBody(this.radio, this.color, this.context, path));
  }
  drawBody() {
    this.body[0].path.unshift({
      x: this.position.x,
      y: this.position.y
    });
    this.body[0].draw();
    for (let i = 1; i < this.body.length; i++) {
      
      this.body[i].path.unshift(this.body[i -1].path.pop())
      this.body[i].draw();
    }
    this.body[this.body.length - 1].path.pop();
  }
  drawHead() {
    this.drawCircle(this.position.x, this.position.y, this.radio +4, this.color, this.color);
    //eyes
    this.drawCircle(this.position.x + 4, this.position.y - 10, this.radio - 7, 'white', 'transparent');
    this.drawCircle(this.position.x + 4, this.position.y + 10, this.radio - 7, 'white', 'transparent');
    // pupil
    this.drawCircle(this.position.x + 6, this.position.y - 10, this.radio - 10, 'black', 'transparent');
    this.drawCircle(this.position.x + 6, this.position.y + 10, this.radio - 10, 'black', 'transparent');

  }
  drawCircle(x,y,radio,color, shadowColor) {
    // using this save/ restore changes made here do not affect other objects
    this.context.save()
    this.context.beginPath();
    this.context.arc(x,y,radio, 0, Math.PI * 2);
    this.context.fillStyle = color;
    this.context.globalAlpha = this.transparency;
    this.context.shadowColor = shadowColor;
    this.context.shadowBlur = 10;
    this.context.fill();
    this.context.closePath();
    this.context.restore()
  }
  keyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = true;
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = false;
      }
    });
  
  }
  colission() {
    if (
      this.position.x - this.radio <= 0 ||
      this.position.x + this.radio >= canvas.width ||
      this.position.y - this.radio <= 0 ||
      this.position.y + this.radio >= canvas.height
    ) {
      this.death();
    }
  }
  death () {
    this.velocity = 0;
    this.isDead = true;
    this.keys.enable = false;
    this.body.forEach((segment) => {
      let lastItem = segment.path[segment.path.length - 1];
      for (let i = 0; i < segment.path.length; i++) {
        segment.path[i] = lastItem;
        segment.transparency = this.transparency
      }
    });
  }
  update(position, rotation) {
    if (this.isDead) {
      this.transparency -= 0.015;
    }
    this.position = position;
    this.rotation = rotation;

    this.drawBody();
    this.draw();

    this.position.x += this.velocity * Math.cos(this.rotation * Math.PI / 180);
    this.position.y += this.velocity * Math.sin(this.rotation * Math.PI / 180);

    this.colission();
  }
}
class SnakeBody {
  constructor(radio,color,context,path) {
    this.radio = radio;
    this.color = color;
    this.context = context;
    this.path = path;
    this.transparency = 1;
  }
  drawCircle(x,y,radio,color) {
    this.context.save();
    this.context.beginPath();
    this.context.arc(x,y,radio, 0, Math.PI * 2);
    this.context.fillStyle = color;
    this.context.globalAlpha = this.transparency;
    this.context.shadowColor = this.color;
    this.context.shadowBlur = 10;
    this.context.fill();
    this.context.closePath();
    this.context.restore();
  }
  draw() {
    this.drawCircle(this.path.slice(-1)[0].x, this.path.slice(-1)[0].y, this.radio, this.color);
  }
}
class Food {
  constructor(position, radio, color, context) {
    this.position = position;
    this.radio = radio;
    this.color = color;
    this.context = context;
  }
  draw() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(this.position.x, this.position.y, this.radio, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.shadowColor = this.color;
    this.context.shadowBlur = 10;
    this.context.fill();
    this.context.closePath();
    this.context.restore();
  }
  colission(snake) {
    let v1 = {
      x: snake.position.x - this.position.x,
      y: snake.position.y - this.position.y
    };
    let distance = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    if (distance < this.radio + snake.radio) {
      this.position = {
        x: Math.floor(Math.random() * ((canvas.width - this.radio) - this.radio + 1)) + this.radio,
        y: Math.floor(Math.random() * ((canvas.height - this.radio) - this.radio + 1)) + this.radio 
      }
      snake.addBody();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return console.error("No se pudo encontrar el elemento canvas en el DOM."); 
  const menu = document.querySelector('.menu');
  const score = document.querySelector('.score');
  const canvas1 = document.getElementById('canvas-1');
  const canvas2 = document.getElementById('canvas-2');
  
  const ctx = canvas.getContext('2d');
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');

  const snakeAttributesEasy = { position: { x: 125, y: 55 }, radio: 15, color: 'red', velocity: 1.1, length: 3, pathLength: 8, context: ctx };
  const snakeAttributesHard = { position: { x: 145, y: 55 }, radio: 15, color: 'blue', velocity: 1.5, length: 5, pathLength: 12, context: ctx };
  const snake = new Snake({ x: canvas.width/2, y: canvas.height/2 }, 15, '#feba39', 1.1, 3, 8, ctx);
  const snakeEasy = new Snake({ x: 125, y: 55 }, 15, 'red', 1.1, 3, 8, ctx1);
  snakeEasy.initBody();
  snakeEasy.drawDifficult();
  const snakeHard = new Snake({ x: 145, y: 55 }, 15, 'blue', 1.5, 5, 12, ctx2);
  snakeHard.initBody();
  snakeHard.drawDifficult();

  canvas1.addEventListener('click', () => {
    initGame(snake, menu, snakeAttributesEasy);
  });
  
  canvas2.addEventListener('click', () => {
    initGame(snake, menu, snakeAttributesHard);
  });

  snake.initBody();
  snake.draw();

  const food = new Food({ x: 100, y: 100 }, 10, 'red', ctx);
  update(ctx, canvas, snake, food);
});

function update(ctx, canvas, snake, food) {
  const { left, right, enable } = snake.keys;
  
  if (left && enable) {
    snake.rotation -= 5;
  }
  if (right & enable) {
    snake.rotation += 5;
  }
  
  snake.position.x += snake.velocity * Math.cos(snake.rotation * Math.PI / 180);
  snake.position.y += snake.velocity * Math.sin(snake.rotation * Math.PI / 180);
  
  background(ctx, canvas);
  if (play) {
    snake.update(snake.position, snake.rotation);
    food.draw();
    food.colission(snake);
  }
  requestAnimationFrame(() => update(ctx, canvas, snake, food));
}

function background(ctx, canvas) {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const squareSize = Math.min(canvas.width, canvas.height) / 20;

  for (let i = 0; i < canvas.height; i += squareSize) {
      for (let j = 0; j < canvas.width; j += squareSize) {
          ctx.fillStyle = '#888';
          ctx.fillRect(j, i, squareSize, squareSize);
      }
  }
}

function initGame(snake, menu, snakeAttributes) {
  snake.body.length = 0;
  snake.isDead = false;
  snake.transparency = 1;
  snake.position = snakeAttributes.position;
  snake.radio = snakeAttributes.radio;
  snake.color = snakeAttributes.color;
  snake.velocity = snakeAttributes.velocity;
  snake.length = snakeAttributes.length;
  snake.pathLength = snakeAttributes.pathLength;
  snake.context = snakeAttributes.context;
  snake.initBody();
  snake.keys.enable = true;
  play = true;
  menu.style.display = 'none';
}
