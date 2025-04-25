/**
 * crisp-game-lib Game Template
 *
 * Refer to knowledge/crisp-game-lib-readme.md for details.
 */

title = "My Awesome Game"; // Edit this!

description = `
 [Tap] Action
`; // Edit this!

characters = [
  // Example character definition (remove or replace)
  `
 ll
 l l
 l l
 l l
ll ll
l   l
`,
];

options = {
  viewSize: { x: 100, y: 100 }, // Adjust game size
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1, // Change for different random outcomes for audio
};

function update() {
  if (!ticks) {
    // Initialize on the first frame
  }
}
