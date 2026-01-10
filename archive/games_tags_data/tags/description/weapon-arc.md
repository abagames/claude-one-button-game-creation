# weapon-arc

**カテゴリ**: weapon | **優先度**: minimal | **代表例**: ARCFIRE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | アーチ状の形をした武器 |
| 詳細     | 射程と広がり角度の間のトレードオフを考慮することで、攻撃範囲を工夫する余地がある。特定の角度や範囲に特化した攻撃が可能 |
| リスク   | 狭い攻撃範囲のため、敵を逃してしまう可能性がある |
| リワード | 正確な攻撃範囲を活用することで、効率的な敵の一掃が可能になる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-adjust_angle, player-rotate |
| 排他   | weapon-wipe |
| 依存   | なし |

## 実装例

```js
// arcfire.js L95-102 より
// 長押し中にアーチの範囲を設定
let range = 0;
if (isPressing) {
  arcTo = angle;
  range = 300 / sqrt((arcTo - arcFrom) * 30);  // アーチ角度が広いほど射程が短い
  color("green");
  line(pos, vec(range).rotate(arcFrom).add(pos));  // 開始角度
  line(pos, vec(range).rotate(arcTo).add(pos));    // 終了角度
  arc(pos, range, 3, arcFrom, arcTo);              // アーチ範囲を描画
}

// L122-127: アーチ状の攻撃弾
color("cyan");
shots = shots.filter((s) => {
  s.d += 2;
  arc(pos, s.d, 5, s.arcFrom, s.arcTo);  // アーチ形状の弾
  return s.d < s.range;
});
```

**参考**: `games/src/arcfire.js`: L95-L102, L122-L127

## 使用例ゲーム

このタグを使用しているゲーム:

- ARCFIRE (`games/description/arcfire.md`)