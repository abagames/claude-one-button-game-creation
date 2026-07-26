title = "ASYNC FAILURE FIXTURE";

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
    Promise.reject(new Error("simulated asynchronous game failure"));
  }
  if (input.isJustPressed) {
    marker.pos.x += 5;
  }

  beginDrawing({ type: "player", object: marker });
  color("cyan");
  box(marker.pos, 6);
  endDrawing();
}
