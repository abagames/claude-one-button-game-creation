# on_holding-defend

**カテゴリ**: on_holding | **優先度**: minimal | **代表例**: EMBATTLED

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 防御姿勢に入る |
| 詳細     | 圧力を維持しながら、incoming attacks に対して免疫になるが、機動性が失われるといったトレードオフがある |
| リスク   | 防御中は移動や攻撃ができず、敵に囲まれる危険 |
| リワード | 適切なタイミングでの防御により被ダメージを回避 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | obstacle-chase, rule-friendly_fire |
| 排他   | on_holding-move（防御中は移動不可） |
| 依存   | 特になし |

## 実装例

```js
// embattled.js L70-103 より
// 長押しで防御壁を展開、離すと移動
const pWall = player.pressedTicks > 10 / sqrt(difficulty);
if (input.isPressed) {
  player.pressedTicks++;  // 長押し時間をカウント
} else {
  player.pos.y += player.vy * difficulty * 0.5;  // 離すと移動
  player.pressedTicks = 0;
}
const playerHasWall = player.pressedTicks > 10 / sqrt(difficulty);
if (!pWall && playerHasWall) {
  play("powerUp");  // 防御発動時の効果音
}
color(playerHasWall ? "cyan" : "blue");
char(addWithCharCode("a", floor(ticks / 20) % 2), player.pos, {
  mirror: { x: player.vy },
});
let hwr = 1;
if (playerHasWall) {
  // 防御壁を描画（プレイヤーの左右）
  box(player.pos.x - 5, player.pos.y, 5, 15);
  box(player.pos.x + 6, player.pos.y, 5, 15);
  hwr *= 2;  // 防御中は敵弾が2倍速で移動
}
// 弾が防御壁(cyan)に当たると消滅
remove(bullets, (b) => {
  b.pos.add(vec(b.vel).mul(hwr));
  color(b.side === 0 ? "red" : "purple");
  const c = bar(b.pos, 3, 3, b.vel.angle).isColliding;
  if (c.rect.cyan) {
    play("hit");
    return true;  // 防御成功、弾消滅
  }
  if (c.char.a || c.char.b) {
    play("lucky");
    end();  // プレイヤーに当たるとゲームオーバー
  }
});
```

**参考**: `games/src/embattled.js`: L70-L103

## 使用例ゲーム

このタグを使用しているゲーム:

- EMBATTLED (`games/description/embattled.md`)
