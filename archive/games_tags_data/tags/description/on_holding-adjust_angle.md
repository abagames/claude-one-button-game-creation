# on_holding-adjust_angle

**カテゴリ**: on_holding | **優先度**: medium | **代表例**: NUMBER BALL

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン長押し時に方向と距離を調整する |
| 詳細     | ボタンを押している間、角度と距離が変化し、ボタンを離すと発射または移動が行われる。ボタン操作のタイミングに応じて目的地を変更できる |
| リスク   | 調整ミスによる攻撃の不命中や移動の失敗 |
| リワード | 精密なコントロールによる高い命中率と効率的な移動 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-artillery, rule-geometry, field-gravity |
| 排他   | on_pressed-shoot（瞬間攻撃と調整攻撃の競合） |
| 依存   | 特になし |

## 実装例

```js
// number_ball.js L131-148 より
// 長押しで角度を調整、離すとボールを発射
if (b.state === "stay") {
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    // 長押し中は角度が回転していく
    b.vel.rotate(-0.01 * difficulty);
    color("black");
    // 発射方向の予測線を表示
    line(vec(b.vel).mul(3).add(b.pos), vec(b.vel).mul(15).add(b.pos), 2);
  }
  // ボタンを離すか、角度が上限に達したら発射
  if (input.isJustReleased || b.vel.angle < -PI * 0.47) {
    play("powerUp");
    if (multiplier > 1) {
      multiplier /= 2;
    }
    scrV = scrVB;
    scrVB++;
    b.vel.mul(5);  // 発射速度
    b.state = "flying";
  }
}
```

**参考**: `games/src/number_ball.js`: L131-L148

## 使用例ゲーム

このタグを使用しているゲーム:

- CAST N (`games/description/cast_n.md`)
- NUMBER BALL (`games/description/number_ball.md`)
- FROOOOG (`games/description/froooog.md`)
- MORTAR (`games/description/mortar.md`)
- THROW M (`games/description/throw_m.md`)
- GRENADIER (`games/description/grenadier.md`)
- ARCFIRE (`games/description/arcfire.md`)
- GOLFME (`games/description/golfme.md`)