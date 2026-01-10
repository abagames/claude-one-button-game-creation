# field-floors

**カテゴリ**: field | **優先度**: low | **代表例**: FLOORS 5

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 複数のプラットフォームが空中に浮かんでいる。 |
| 詳細     | プラットフォームを移動するためには、落下しないように正確なタイミングでジャンプする必要がある。一部のプラットフォームは動く可能性があり、プレイヤーキャラクターの動きに影響を与える。 |
| リスク   | プラットフォームからの落下や、移動プラットフォームの予測ミスによりゲームオーバーになる。 |
| リワード | プラットフォームを巧みに利用することで、効率的な移動や敵の回避が可能になる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_pressed-jump, field-bottomless | ジャンプでプラットフォーム間を移動できる。落下によるゲームオーバーと組み合わせることで緊張感が増す。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// floors_5.js L66-100 より
// 5つのプラットフォームを生成・描画
floors = times(5, (i) => {
  return {
    pos: vec([25, 52, 105, 160, 220][i], [30, 50, 70, 60, 40][i]),
    width: [10, 35, 30, 30, 50][i],
    index: i,
  };
});

// プラットフォームの描画とスクロール
floors.forEach((f, i) => {
  if (f.pos.x + f.width < 0) {
    f.pos.set(rnd(200, 250), rnd(30, 90));  // 画面外に出たら再配置
    f.width = rnd(20, 60);
  }
  color(colors[i]);
  f.pos.x -= car.vel.x;  // プレイヤー速度でスクロール
  rect(f.pos, f.width, 6);
});

// L133-143: 空中でのジャンプ・ダブルジャンプ
if (car.floor == null && (car.fallTicks > -9 || car.jumpCount < 2) && input.isJustPressed) {
  play("jump");
  car.vel.y = -2;
  car.jumpCount++;
}
```

**参考**: `games/src/floors_5.js`: L66-L100, L133-L143

## 使用例ゲーム

このタグを使用しているゲーム:

- IN TOW (`games/description/in_tow.md`)
- TILTED (`games/description/tilted.md`)
- FLOATER (`games/description/floater.md`)
- JUJUMP (`games/description/jujump.md`)
- REFBALS (`games/description/refbals.md`)