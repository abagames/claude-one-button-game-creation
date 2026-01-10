title = "RPS";

description = `
[Tap]
 Go right &
 Change rock
        paper
        scissors
`;

characters = [
  `
 lll
lllll
llllll
lllll
 lll
 lll
`,
  `
llll
llll
llll l
llllll
lllll
 lll
`,
  `
 l l
 l l
ll l
llllll
 llll
 lll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 60,
};

/**
 * @type {{
 * lane: any, y: number, my: number, baseMy: number, type: number,
 * isDestroyed: boolean
 * }[]}
 **/
let hands;
/** @type {{x: number, handType: number, nextTicks: number}[]} */
let lanes;
/**
 *  @type {{
 * laneIndex: number, pos: Vector, ty: number, vy: number, type: number
 * freezeTicks: number,
 * }}
 */
let myHand;
let multiplier;

function update() {
  if (!ticks) {
    hands = [];
    lanes = times(4, (i) => {
      return {
        x: i * 20 + 20,
        handType: rndi(3),
        nextTicks: rnd(99),
      };
    });
    myHand = {
      laneIndex: 0,
      pos: vec(20, 97),
      ty: 97,
      vy: -1,
      type: 0,
      freezeTicks: 0,
    };
    multiplier = 1;
  }
  color("light_black");
  lanes.forEach((l) => {
    l.nextTicks--;
    if (l.nextTicks < 0) {
      const my = rnd(1, difficulty) * 0.1;
      hands.push({
        lane: l,
        y: -9,
        my,
        baseMy: my,
        type: l.handType,
        isDestroyed: false,
      });
      l.nextTicks = rnd(200, 300) / sqrt(difficulty);
      if (rnd() < 0.4) {
        l.handType = rndi(3);
      }
    }
    rect(l.x - 5, 0, 1, 100);
    rect(l.x + 4, 0, 1, 100);
  });
  remove(hands, (h) => {
    // @ts-ignore
    color(["cyan", "purple", "yellow"][h.type]);
    if (h.isDestroyed) {
      particle(h.lane.x, h.y);
      return true;
    }
    h.y += h.my;
    h.my += (h.baseMy * (h.y > 90 ? 2 : 1) - h.my) * 0.1;
    hands.forEach((oh) => {
      if (oh !== h && oh.lane === h.lane && abs(oh.y - h.y) < 6) {
        const cy = (oh.y + h.y) / 2;
        const t = oh.my;
        oh.my = h.my * 0.4 - oh.my * 0.2;
        h.my = t * 0.4 - h.my * 0.2;
        if (oh.y < h.y) {
          oh.y = cy - 3;
          h.y = cy + 3;
        } else {
          oh.y = cy + 3;
          h.y = cy - 3;
        }
      }
    });
    char(addWithCharCode("a", h.type), h.lane.x, h.y, { rotation: 2 });
    if (h.y > 99) {
      play("explosion");
      end();
    }
  });
  myHand.freezeTicks--;
  if (myHand.freezeTicks < 0 && input.isJustPressed) {
    play("select");
    myHand.laneIndex = wrap(myHand.laneIndex + 1, 0, 4);
    myHand.type = wrap(myHand.type + 1, 0, 3);
    myHand.ty = 97;
    myHand.vy = -sqrt(difficulty);
  }
  myHand.vy +=
    ((myHand.freezeTicks < 0 ? -sqrt(difficulty) : 0) - myHand.vy) * 0.05;
  myHand.ty = clamp(myHand.ty + myHand.vy, 10, 97);
  const ox = lanes[myHand.laneIndex].x - myHand.pos.x;
  myHand.pos.x += ox * 0.5;
  if (ox < 1) {
    myHand.pos.x = lanes[myHand.laneIndex].x;
  }
  myHand.pos.y += (myHand.ty - myHand.pos.y) * 0.5;
  // @ts-ignore
  color(["cyan", "purple", "yellow"][myHand.type]);
  char(addWithCharCode("a", myHand.type), myHand.pos);
  hands.forEach((h) => {
    if (h.lane === lanes[myHand.laneIndex] && abs(myHand.ty - h.y) < 5) {
      const o = wrap(myHand.type - h.type, 0, 3);
      if (o === 0) {
        play("laser");
        myHand.vy = 0;
        h.my -= sqrt(difficulty) * 4;
        h.y = myHand.ty - 3;
      } else if (o === 1) {
        play("coin");
        addScore(multiplier, myHand.pos);
        multiplier++;
        h.isDestroyed = true;
      } else if (o === 2) {
        play("hit");
        multiplier = 1;
        myHand.vy = sqrt(difficulty) * 5;
        h.my -= sqrt(difficulty) * 0.5;
        myHand.ty = h.y + 3;
        myHand.freezeTicks = 60 / sqrt(difficulty);
      }
    }
  });
}
