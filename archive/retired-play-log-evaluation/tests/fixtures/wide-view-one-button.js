title = "WIDE VIEW FIXTURE";

description = `
[Tap] Move
`;

characters = [];

options = {
  viewSize: { x: 200, y: 150 },
  theme: "dark",
  isPlayingBgm: false,
  isReplayEnabled: false,
};

let marker;

function update() {
  if (!ticks) {
    marker = { pos: vec(20, 75) };
  }
  if (input.isJustPressed) {
    marker.pos.x += 5;
  }

  beginDrawing({ type: "player", object: marker });
  color("cyan");
  box(marker.pos, 6);
  endDrawing();

  if (marker.pos.x >= 35) {
    end();
  }
}
