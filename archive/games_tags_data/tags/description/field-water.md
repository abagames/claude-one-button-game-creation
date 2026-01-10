# field-water

**カテゴリ**: field | **優先度**: low | **代表例**: SUB JUMP

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 水面と水深がフィールドとして機能する構造 |
| 詳細     | 水面と空中での移動の変化や、風による水面の変化、水中環境の不透明性など、さまざまな条件を作り出す |
| リスク   | 水面と空中の移動変化への適応不足、水中環境の視界不良、水流による移動制御困難 |
| リワード | 水面と空中の移動変化を利用した効率的な移動、水中環境を利用した隠密行動、水流を利用した加速 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-weather, player-bounce, on_pressed-jump |
| 排他   | field-space（環境が混在しすぎる） |
| 依存   | -（単独で機能するが、水中メカニクスと組み合わせると効果的） |

## 実装例

```js
// sub_jump.js L117-149 より
// 水中(y>50)と空中(y<50)の移動差メカニクス
if (input.isPressed) {
  if (sub.pos.y > 50) {  // 水中
    sub.vel.y -= sd * 0.06;  // 上昇力
    sub.vel.x += (1 * sd - sub.vel.x) * 0.1;  // 高速移動
  } else {  // 空中
    sub.vel.y += sd * 0.01;  // 弱い落下
    sub.vel.x += (1 * sd - sub.vel.x) * 0.1;
  }
} else {
  if (sub.pos.y > 50) {  // 水中
    sub.vel.y += sd * 0.03;  // 沈む
    sub.vel.x += (0.5 * sd - sub.vel.x) * 0.1;  // 低速
  } else {  // 空中
    sub.vel.y += sd * 0.05;  // 落下
    sub.vel.x += (0.5 * sd - sub.vel.x) * 0.1;
  }
}
// 水中は抵抗あり、空中は抵抗少ない
sub.vel.mul(sub.pos.y > 50 ? 0.95 : 0.99);
sub.pos.add(sub.vel);

// 水面通過時のエフェクト
if (py > 50 && sub.pos.y < 50) {  // 水面から飛び出し
  play("jump");
  particle(sub.pos.x, 50, 9, 1, -PI / 2, PI);
}
if (py < 50 && sub.pos.y > 50) {  // 水面に着水
  play("hit");
  particle(sub.pos.x, 50, 9, 0.5, -PI / 2, PI);
}
```

**参考**: `games/src/sub_jump.js`: L117-L149

## 使用例ゲーム

このタグを使用しているゲーム:

- SUB JUMP (`games/description/sub_jump.md`) - 水面ジャンプ
- CAST N (`games/description/cast_n.md`) - 水面投げ
- TURBULENT (`games/description/turbulent.md`) - 水流
- BS FISH (`games/description/bs_fish.md`) - 水中生物