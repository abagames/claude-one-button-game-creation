title = "SNAKY";

description = `
[Hold] Up
`;

characters = [
  `
 llll
ll lll
l llll
llllll
llllll
 llll
`,
];

options = {
  theme: "crt",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 7,
};

/** @type {{angle: number, va: number, prevNode: any, nextNode: any}[]} */
let nodes;
/** @type {{pos: Vector, vx: number, isRed: boolean}[]} */
let items;
let nextItemTicks;
let nextRedItemCount;
let nextItemY;

function update() {
  if (!ticks) {
    nodes = [{ angle: 0, va: 0, prevNode: undefined, nextNode: undefined }];
    addNode();
    items = [];
    nextItemTicks = 0;
    nextRedItemCount = 2;
    nextItemY = 50;
  }
  if (input.isJustPressed) {
    play("select");
  }
  const nl = (50 + nodes.length * 3) / nodes.length;
  const na = PI / (sqrt(nodes.length - 1) + 3);
  let p = vec(0, 50);
  let a = 0;
  nodes.forEach((n, i) => {
    if (i === 0) {
      const pa = n.angle;
      n.angle = clamp(
        n.angle + (input.isPressed ? -1 : 1) * 0.03 * sqrt(difficulty),
        -na,
        na
      );
      n.va = n.angle - pa;
    } else {
      n.angle += n.va;
      if (
        (n.angle > n.prevNode.angle + na && n.va > 0) ||
        (n.angle < n.prevNode.angle - na && n.va < 0)
      ) {
        n.va *= -0.2;
      }
    }
    n.va *= 0.95;
    if (n.nextNode != null) {
      n.nextNode.va += n.va * 0.07 * sqrt(sqrt(difficulty));
    }
    if (n.prevNode != null) {
      n.prevNode.va += n.va * 0.01 * sqrt(sqrt(difficulty));
    }
    a += n.angle;
    color(i === nodes.length - 1 ? "red" : "black");
    bar(p, nl, 3, n.angle, 0);
    p.addWithAngle(n.angle, nl);
  });
  nextItemTicks--;
  if (nextItemTicks < 0) {
    let isRed = false;
    nextRedItemCount--;
    if (nextRedItemCount < 0) {
      isRed = true;
      nextRedItemCount = 7;
    }
    items.push({
      pos: vec(103, nextItemY),
      vx: -rnd(1, difficulty) * 0.1,
      isRed,
    });
    const ny = rnd(20, 80);
    nextItemTicks = (abs(nextItemY - ny + 10) * 4) / sqrt(difficulty);
    nextItemY = ny;
  }
  remove(items, (i) => {
    i.vx *= 1 + 0.005 * sqrt(difficulty);
    i.pos.x += i.vx;
    color(i.isRed ? "red" : "black");
    const c = char("a", i.pos).isColliding.rect;
    let sc = 0;
    if (c.red) {
      if (i.isRed) {
        play("powerUp");
        sc = nodes.length * nodes.length;
        addNode();
      } else {
        play("coin");
        sc = nodes.length;
      }
    } else if (c.black) {
      if (i.isRed) {
        play("hit");
        sc = -nodes.length;
        removeNode();
      } else {
        play("laser");
        sc = 1;
      }
    }
    if (sc !== 0) {
      addScore(sc, i.pos);
      return true;
    }
    if (i.pos.x < 0) {
      play("explosion");
      color("red");
      text("X", 3, i.pos.y);
      end();
    }
  });

  function addNode() {
    if (nodes.length > 9) {
      return;
    }
    const ln = nodes[nodes.length - 1];
    const n = { angle: 0, va: 0, prevNode: ln, nextNode: undefined };
    ln.nextNode = n;
    nodes.push(n);
  }

  function removeNode() {
    nodes.pop();
    nodes[nodes.length - 1].nextNode = undefined;
  }
}
