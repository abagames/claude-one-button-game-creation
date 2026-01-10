# on_holding-inhale

**カテゴリ**: on_holding | **優先度**: minimal | **代表例**: TR BEAM

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 吸い込む |
| 詳細     | 物理学の法則と組み合わせることで、複雑な動きを実現できる |
| リスク   | 危険なオブジェクトも吸い込んでしまう可能性 |
| リワード | 遠くのアイテムや敵を引き寄せて効率的に処理 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-physics, weapon-blow_off, obstacle-chase |
| 排他   | 特になし |
| 依存   | 特になし |

## 実装例

```js
// tr_beam.js L54-77 より
// 長押しでトラクタービームを伸ばし、ボールを吸い寄せる
if (input.isJustPressed) {
  play("select");
  multiplier = 1;
}
if (input.isPressed) {
  play("laser");
  // ビームの長さを伸ばす（最大82）
  ufo.trLength = clamp(ufo.trLength + difficulty * 2, 0, 82);
} else {
  // 離すとビームが縮む
  ufo.trLength *= 1 - clamp(sqrt(difficulty), 1, 3) * 0.2;
}
// トラクタービームの描画
let ta = ((ticks % 10) / 10) * (PI / 4);
if (ufo.trLength > 1) {
  color("blue");
  times(4, () => {
    line(
      4 * cos(ta) + ufo.pos.x,
      ufo.pos.y + 5,
      9 * cos(ta) + ufo.pos.x,
      ufo.pos.y + 5 + ufo.trLength,  // ビームの長さ
      2
    );
    ta += PI / 4;
  });
}
// ビームに触れたボールを吸い寄せる
if (c.rect.blue) {
  b.vel.addWithAngle(b.pos.angleTo(ufo.pos), sqrt(difficulty) / sqrt(b.radius));
  b.vel.x += (ufo.pos.x - b.pos.x) * clamp(sqrt(difficulty), 1, 5) * 0.01;
  b.isBeamed = true;
}
```

**参考**: `games/src/tr_beam.js`: L54-L77, L133-L139

## 使用例ゲーム

このタグを使用しているゲーム:

- TR BEAM (`games/description/tr_beam.md`)
