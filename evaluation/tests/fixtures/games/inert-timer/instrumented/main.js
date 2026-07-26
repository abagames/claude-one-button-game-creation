title = "INERT TIMER";

description = `
[Tap] Ignored
`;

characters = [];

options = {
  viewSize: { x: 100, y: 100 },
  theme: "dark",
  isPlayingBgm: false,
  isSoundEnabled: false,
  isReplayEnabled: false,
};

let marker;
let drifters;

function update() {
  if (!ticks) {
    marker = { pos: vec(50, 50) };
    drifters = [
      { pos: vec(20, 12), vx: 0.7 },
      { pos: vec(70, 88), vx: -0.5 },
    ];
  }

  marker.pos.y = 50 + Math.sin(ticks * 0.09) * 6;

  drifters.forEach((drifter) => {
    drifter.pos.x += drifter.vx;
    if (drifter.pos.x < 6 || drifter.pos.x > 94) {
      drifter.vx *= -1;
    }
  });

  color("red");
  drifters.forEach((drifter) => {
    beginDrawing({ type: "drifter", object: drifter });
    box(drifter.pos, 6);
    endDrawing();
  });

  color("cyan");
  beginDrawing({ type: "marker", object: marker });
  box(marker.pos, 5);
  endDrawing();

  if (ticks % 20 === 19) {
    addScore(1);
  }
  if (ticks >= 240) {
    end();
  }
}
