# rule-control_weapons

**カテゴリ**: rule | **優先度**: low | **代表例**: UNCTRL

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 武器を操作する。敵に近づく前に武器で敵を倒し、敵の武器が近づく前に倒す。 |
| 詳細     | プレイヤーは武器の操作に熟練する必要があり、敵の攻撃を避けながら効果的に武器を使用する。 |
| リスク   | 武器の操作に失敗すると、敵の攻撃を受けたり、ゲームオーバーになるリスクがある。 |
| リワード | 武器を上手く操作することで、敵を効率的に倒し、高得点が得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, weapon-shoot, rule-friendly_fire |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// unctrl.js L71-90 より
// ショット（武器）の操作メカニクス
color(shot.state === "ready" ? "light_blue" : "blue");
if (shot.state === "ready") {
  if (input.isJustPressed) {
    play("select");
    shot.state = "fired";  // 発射状態に変更
  }
} else {
  if (input.isJustPressed) {
    play("hit");
  }
  if (input.isJustReleased) {
    play("laser");
  }
  // 長押しで上昇、離すと下降（武器の軌道制御）
  shot.vel.y += input.isPressed ? -0.1 : 0.1;
  shot.pos.add(shot.vel);
  particle(shot.pos, 1, 1, shot.vel.angle + PI, 1);

  // 画面外に出たらリセット
  if (!shot.pos.isInRect(0, 0, 150, 100)) {
    setNextShot();
  }
}
bar(shot.pos, 6, 4, shot.vel.angle, -0.5);  // 武器を描画

// L109-118: 敵との衝突判定
if (
  char(addWithCharCode("a", floor(t.animTicks / 20) % 3), t.pos, {
    mirror: { x: -1 },
  }).isColliding.rect.blue
) {
  play("powerUp");
  particle(t.pos, 19, 3);
  addScore(multiplier * 10, t.pos);
  setNextShot();
  return true;
}
```

**参考**: `games/src/unctrl.js`: L71-L118

## 使用例ゲーム

このタグを使用しているゲーム:

- D MISSILE (`games/description/d_missile.md`)
- UNCTRL (`games/description/unctrl.md`)
- DIVARR (`games/description/divarr.md`)