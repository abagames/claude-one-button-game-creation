# field-lanes

**カテゴリ**: field | **優先度**: medium | **代表例**: UP 1 WAY

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | キャラクターが複数のレーンで移動するフィールド構造 |
| 詳細     | レーンを流れる障害物を、レーン移動の適切なタイミングで避ける。複数レーン間の移動と位置調整がゲームの核となる |
| リスク   | レーン間移動のタイミングミス、複数レーンの同時監視失敗、レーン固有の障害物への対応不足 |
| リワード | 効率的なレーン移動による障害物回避、複数レーンの戦略的活用、レーン固有のボーナス獲得 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-multiple, on_pressed-jump, on_pressed-reverse_state, field-auto_scroll |
| 排他   | field-1D（レーン構造が単純化しすぎる） |
| 依存   | -（単独で機能するが、レーン移動メカニクスと組み合わせると効果的） |

## 実装例

```js
// s_lanes.js L59-60, L107-118 より
// 4レーン構造のフィールド
const laneWidth = 20;
const laneCount = 4;

// Y座標をレーン番号から計算
function calcY(i) {
  return i * laneWidth + laneWidth / 2 + 12;
}

// ボタン離し時にレーンを順次移動
ship.laneTicks--;
if (ship.laneTicks < 0) {
  ship.laneIndex = wrap(ship.laneIndex + 1, 0, laneCount);  // 次のレーンへ
  ship.targetY = calcY(ship.laneIndex);
  ship.laneTicks = 20 / sqrt(difficulty);
}
ship.pos.y += (ship.targetY - ship.pos.y) * 0.3;  // レーン位置へスムーズ移動
```

**参考**: `games/src/s_lanes.js`: L59-L60, L107-L118, L170-L172

## 使用例ゲーム

このタグを使用しているゲーム:

- UP 1 WAY (`games/description/up_1_way.md`) - 6階層レーン、上方向ジャンプ
- T LANES (`games/description/t_lanes.md`) - 5本レーン、複数車同時操作
- ROLL S (`games/description/roll_s.md`) - レーン移動とボール転がし
- RPS (`games/description/rps.md`) - レーン別じゃんけん要素
- NOT TURN (`games/description/not_turn.md`) - レーン固定と方向転換