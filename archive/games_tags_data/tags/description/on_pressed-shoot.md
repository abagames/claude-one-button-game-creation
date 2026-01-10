# on_pressed-shoot

**カテゴリ**: on_pressed | **優先度**: medium | **代表例**: SCREEN

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 弾を発射する。 |
| 詳細     | 発射される弾のメカニクスに応じてゲームの行動が大きく変化する。 |
| リスク   | 発射のタイミングミスで敵を逃す。複雑な発射制御が必要になる。 |
| リワード | 迅速な発射で敵を効率的に倒せる。戦略的な発射計画でゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-chase, weapon-explosion, rule-combo_multiplier |
| 排他   | on_holding-shoot |
| 依存   | - |

## 実装例

```js
// screen.js L68-80 より
// ボタン押下で角度を決めて弾を発射
const sa = player.pos.x > 50 ? -player.angle : PI + player.angle;
if (
  player.shotCount > 0 &&
  abs(player.pos.x - player.tx) < 1 &&
  input.isJustPressed
) {
  play("coin");
  shots.push({
    pos: vec(player.pos),
    angle: sa,           // 現在の角度で発射
    speed: difficulty,
  });
  player.shotCount--;    // 弾数を減らす
}

// L63-66: 発射角度は時間で回転
player.angle += 0.01 * difficulty;
if (player.angle >= PI / 2) {
  player.angle -= PI / 2;
}
```

**参考**: `games/src/screen.js`: L63-L80

## 使用例ゲーム

このタグを使用しているゲーム:

- SCREEN (`games/description/screen.md`)