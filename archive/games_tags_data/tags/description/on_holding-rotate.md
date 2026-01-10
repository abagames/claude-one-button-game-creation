# on_holding-rotate

**カテゴリ**: on_holding | **優先度**: medium | **代表例**: SLALOM

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン長押し時に回転する |
| 詳細     | キャラクターが適切な方向を向くまでボタンを押す |
| リスク   | 回転タイミングのミスによる方向誤り |
| リワード | 正確な方向調整による効率的な進行 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-rotate, field-rotate, rule-balance |
| 排他   | on_pressed-turn（瞬間回転と連続回転の競合） |
| 依存   | 特になし |

## 実装例

```js
// slalom.js L81-86 より
// ボタン長押しで方向転換、離すと直進
color("black");
if (input.isPressed) {
  // 長押し中は現在のターゲット壁の方向に回転
  angle += (targetWall || { side: 0 }).side * 0.07 * difficulty;
  particle(pos, 1, vel.length, angle + PI, 0.2);
}
// 速度と位置の更新
vel.mul(1 - 0.02 / difficulty).add(vec(0.03).rotate(angle));
pos.add(vel);
```

**参考**: `games/src/slalom.js`: L81-L86

## 使用例ゲーム

このタグを使用しているゲーム:

- PHOTON LINE (`games/description/photon_line.md`)
- T PUNCH (`games/description/t_punch.md`)
- SWINGBY (`games/description/swingby.md`)
- GEOCENT (`games/description/geocent.md`)
- D MISSILE (`games/description/d_missile.md`)
- UNCTRL (`games/description/unctrl.md`)
- SLALOM (`games/description/slalom.md`)