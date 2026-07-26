title = "ANNOTATED FIXTURE";

description = `
[Tap] Move
`;

characters = [];

options = {
  viewSize: { x: 100, y: 100 },
  theme: "dark",
  isPlayingBgm: false,
  isReplayEnabled: false,
};

let marker;

function update() {
  if (!ticks) {
    marker = { pos: vec(20, 50) };
  }
  if (input.isJustPressed) {
    marker.pos.x += 5;
    addScore(1, marker.pos.x, marker.pos.y);
  }

  beginDrawing({ type: "player", object: marker });
  color("cyan");
  box(marker.pos, 6);
  endDrawing();

  if (marker.pos.x >= 35) {
    end();
  }
}
