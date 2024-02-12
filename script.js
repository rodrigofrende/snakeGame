class Snake {
  constructor (position, radio, color, velocity, context) {
      this.position = position;
      this.radio = radio;
      this.color = color;
      this.velocity = velocity;
      this.context = context;
      this.rotation = 0;
      this.body = [];
      this.keys = {
        left: false,
        right: false
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
  initBody() {
    const numSegments = 3; // Ajusta el número de segmentos del cuerpo de la serpiente
    const numPoints = 8; // Ajusta el número de puntos en cada segmento
    for (let i = 0; i < numSegments; i++) {
      let path = [];
      for (let j = 0; j < numPoints; j++) {
        path.push({ x: this.position.x, y: this.position.y });
      }
      this.body.push(new SnakeBody(this.radio, this.color, this.context, path));
    }
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
    this.drawCircle(this.position.x, this.position.y, this.radio +4, this.color);
    //eyes
    this.drawCircle(this.position.x + 4, this.position.y - 10, this.radio - 7, 'white');
    this.drawCircle(this.position.x + 4, this.position.y + 10, this.radio - 7, 'white');
    // pupil
    this.drawCircle(this.position.x + 6, this.position.y - 10, this.radio - 10, 'black');
    this.drawCircle(this.position.x + 6, this.position.y + 10, this.radio - 10, 'black');

  }
  drawCircle(x,y,radio,color) {
    this.context.beginPath();
    this.context.arc(x,y,radio, 0, Math.PI * 2);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.closePath();
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
  update(position, rotation) {
    this.position = position;
    this.rotation = rotation;
    this.drawBody();
    this.draw();
    this.position.x += this.velocity * Math.cos(this.rotation * Math.PI / 180);
    this.position.y += this.velocity * Math.sin(this.rotation * Math.PI / 180);
  }
}
class SnakeBody {
  constructor(radio,color,context,path) {
    this.radio = radio;
    this.color = color;
    this.context = context;
    this.path = path;
  }
  drawCircle(x,y,radio,color) {
    this.context.beginPath();
    this.context.arc(x,y,radio, 0, Math.PI * 2);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.closePath();
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
    this.context.beginPath();
    this.context.arc(this.position.x, this.position.y, this.radio, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return console.error("No se pudo encontrar el elemento canvas en el DOM."); 

  const ctx = canvas.getContext('2d');

  const snake = new Snake({ x: canvas.width/2, y: canvas.height/2 }, 15, '#feba39', 1.2, ctx);
  snake.initBody();
  snake.draw();

  const food = new Food({ x: 100, y: 100 }, 10, 'red', ctx);
  update(ctx, canvas, snake, food);
});

function update(ctx, canvas, snake, food) {
  const { left, right } = snake.keys;
  
  if (left) {
    snake.rotation -= 5;
  }
  if (right) {
    snake.rotation += 5;
  }
  
  snake.position.x += snake.velocity * Math.cos(snake.rotation * Math.PI / 180);
  snake.position.y += snake.velocity * Math.sin(snake.rotation * Math.PI / 180);
  
  background(ctx, canvas);
  snake.update(snake.position, snake.rotation);
  food.draw();
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
