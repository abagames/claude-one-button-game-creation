# player-circle

**カテゴリ**: player | **優先度**: low | **代表例**: CIRCLE W

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが円形をしている                                                        |
| 詳細     | プレイヤーが円として表現され、半径を変更できることが多い。半径を増やすことで、より大きなヒットボックスや攻撃範囲を持つが、障害物に触れやすくなるリスクとリターンのトレードオフが発生する |
| リスク   | 大きな半径では障害物や敵に接触しやすく、ゲームオーバーの危険が増す                            |
| リワード | 大きな半径でアイテムを取得すると高得点。半径変更のタイミングを習熟すると効率的なスコア獲得が可能 |

## タグ相性

| 関係   | タグ                                                           |
| :----- | :------------------------------------------------------------- |
| 相性良 | on_holding-extend, field-pins, obstacle-penalty, field-auto_scroll |
| 排他   | なし                                                           |
| 依存   | なし                                                           |

## 実装例

```js
// CIRCLE W より抜粋
// 長押しで半径拡大、離すと縮小
playerRadius += sqrt(difficulty) * (input.isPressed ? 1 : -1) * 0.5;
if (playerRadius < 1) {
  playerRadius = 1;
}
// 円形プレイヤーの描画
color("green");
arc(pp, playerRadius);
```

**参考**: `games/src/circle_w.js`: L44-L61

```js
// TAPPUMP より抜粋
// 長押しで膨張（加速度的に拡大）
if (input.isPressed) {
  player.rv += difficulty * 0.08;
  player.radius += player.rv;
} else {
  player.radius += (1 - player.radius) * 0.04 * difficulty;
  player.rv = 0;
}
// 円形プレイヤーの描画と衝突判定
const c = arc(player.pos, player.radius, 5).isColliding.char;
```

**参考**: `games/src/tappump.js`: L73-L82

## 使用例ゲーム

このタグを使用しているゲーム:

- CIRCLE W (`games/description/circle_w.md`) - 円形プレイヤーの半径を変更し、他の円に接触して乗り移る
- TAPPUMP (`games/description/tappump.md`) - タップでジャンプ、長押しで膨張して浮遊、大きいほどコイン取得時に高得点
