# field-spike

**カテゴリ**: field | **優先度**: medium | **代表例**: LIGHT DARK

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ゲームに接触するとゲームオーバーになる地形がある。 |
| 詳細     | プレイヤーは障害物を避けながら進むためにジャンプや移動で避けなければならない。 |
| リスク   | スパイクに接触すると即座にゲームオーバーになる。 |
| リワード | スパイクを巧みに回避することで、安全な経路を確保できる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_pressed-jump, weapon-explosion | ジャンプでスパイクを飛び越える。爆発でスパイクを破壊できる。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// light_dark.js L104-118 より
// スパイクとプレイヤーの衝突判定
objs = objs.filter((o) => {
  const y = o.side === "light" ? 46 : 54;
  color(o.side === "light" ? "black" : "white");
  let c;
  if (o.type === "spike") {
    c = char("c", o.x, y).isColliding;  // スパイクを描画・衝突取得
  } else {
    c = text("o", o.x, y).isColliding;  // コインを描画・衝突取得
  }
  if (c.char.a || c.char.b) {  // プレイヤーと衝突
    if (o.type === "spike") {
      play("explosion");
      end();  // スパイクは即ゲームオーバー
    } else {
      addScore(multiplier, o.x, y);  // コインは得点
      return false;
    }
  }
});
```

**参考**: `games/src/light_dark.js`: L104-L118

## 使用例ゲーム

このタグを使用しているゲーム:

- R WHEEL (`games/description/r_wheel.md`)
- SCRAMBIRD (`games/description/scrambird.md`)
- KITE (`games/description/kite.md`)
- LIFT UP (`games/description/lift_up.md`)
- TOTOGE (`games/description/totoge.md`)
- PARKING (`games/description/parking.md`)
- LIGHT DARK (`games/description/light_dark.md`)
- LLAND (`games/description/lland.md`)