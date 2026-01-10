# on_pressed-jump

**カテゴリ**: on_pressed | **優先度**: high | **代表例**: JUJUMP

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ジャンプを行う。 |
| 詳細     | 複数回ジャンプできる可能性がある。穴や敵、障害物を避けるためにジャンプする。着地後にジャンプ回数を制限したり、ジャンプするたびにジャンプ能力を減らして最大ジャンプ高を制限したりする。 |
| リスク   | ジャンプのタイミングミスで落下。複雑なジャンプ制御が必要になる。 |
| リワード | 迅速なジャンプで障害物を回避。戦略的なジャンプ計画でゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-bottomless, obstacle-fall, player-bounce |
| 排他   | on_holding-thrust |
| 依存   | - |

## 実装例

```js
// jujump.js L53-58 より
// ボタン押下でジャンプ（方向も同時に反転）
if (input.isJustPressed) {
  play("jump");
  v.x = jumpWay *= -1;      // 左右方向を反転
  v.y = -3 * jumpPower;     // ジャンプ速度を設定
  jumpPower *= 0.7;         // 連続ジャンプで高さが減衰
}

// L43-50: 着地判定でジャンプ力を回復
for (;;) {
  if (!box(p, 7, 7).isColliding.rect.blue) {
    break;
  }
  p.y--;
  v.set();
  jumpPower = 1;  // 着地でジャンプ力リセット
}
```

**参考**: `games/src/jujump.js`: L43-L50, L53-L58

## 使用例ゲーム

このタグを使用しているゲーム:

- JUJUMP (`games/description/jujump.md`)