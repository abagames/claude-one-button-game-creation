# on_pressed-attack

**カテゴリ**: on_pressed | **優先度**: low | **代表例**: T PUNCH

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン押下時に武器を伸ばすなどして攻撃する |
| 詳細     | 敵が攻撃範囲に入ってきた瞬間に攻撃する |
| リスク   | 攻撃タイミングのミスによる敵の攻撃受けやダメージ |
| リワード | 正確な攻撃タイミングによる敵の効率的な排除 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, obstacle-chase, rule-combo_multiplier |
| 排他   | on_holding-shoot（連続攻撃と瞬間攻撃の競合） |
| 依存   | 特になし |

## 実装例

```js
// t_punch.js L71-78 より
// ボタン押下で攻撃状態に移行
if (input.isJustPressed) {
  if (arm.length < 5) {
    play("select");
    arm.isAttacking = true;  // 攻撃状態をオン
  } else {
    play("laser");
  }
  multiplier = 1;
}

// L103-111: 攻撃状態の腕（先端）を赤く描画
times(5, (i) => {
  let s = sz;
  if (i === 4 && arm.isAttacking) {
    color("red");   // 攻撃時は先端が赤に
    s *= 1.5;       // サイズ拡大
  } else {
    color("cyan");
  }
  box(p.set(50, 50).addWithAngle(a, r), s);
  r += ri;
});

// L152-154: 赤い攻撃部分に敵が接触すると撃破
if (c.rect.red) {
  play("powerUp");
  // 敵撃破時にボーナスアイテムをスポーン
}
```

**参考**: `games/src/t_punch.js`: L71-L78, L103-L111, L152-L154

## 使用例ゲーム

このタグを使用しているゲーム:

- G PRESS (`games/description/g_press.md`)
- T PUNCH (`games/description/t_punch.md`)
- BOMB UP (`games/description/bomb_up.md`)
- LINE B (`games/description/line_b.md`)