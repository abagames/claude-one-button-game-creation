# rule-balance

**カテゴリ**: rule | **優先度**: minimal | **代表例**: BALANCE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 平衡を達成する。プレイヤーキャラクターの傾き状態を観察して、傾きを制御する。 |
| 詳細     | プレイヤーはキャラクターやオブジェクトのバランスを維持する必要があり、傾きや重心の制御が重要になる。 |
| リスク   | バランスを崩すとゲームオーバーになるか、ペナルティが発生する。 |
| リワード | バランスを維持することで安定した進行やボーナスが得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-rotate, on_holding-rotate, field-roughness |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// snaky.js L49-78 より
// 接続されたノードのバランスを維持するメカニクス
const na = PI / (sqrt(nodes.length - 1) + 3);  // 最大角度制限
nodes.forEach((n, i) => {
  if (i === 0) {
    // 先頭ノード: 入力で角度調整（バランス制御）
    const pa = n.angle;
    n.angle = clamp(
      n.angle + (input.isPressed ? -1 : 1) * 0.03 * sqrt(difficulty),
      -na, na  // 傾きを制限範囲内に
    );
    n.va = n.angle - pa;  // 角速度
  } else {
    // 後続ノード: 前ノードとの角度差でバランス
    n.angle += n.va;
    // 制限角度を超えると跳ね返り（バランス崩壊防止）
    if ((n.angle > n.prevNode.angle + na && n.va > 0) ||
        (n.angle < n.prevNode.angle - na && n.va < 0)) {
      n.va *= -0.2;  // 反発して戻る
    }
  }
  n.va *= 0.95;  // 減衰（安定化）

  // ノード間の力の伝播（バランス維持）
  if (n.nextNode != null) {
    n.nextNode.va += n.va * 0.07 * sqrt(sqrt(difficulty));
  }
  if (n.prevNode != null) {
    n.prevNode.va += n.va * 0.01 * sqrt(sqrt(difficulty));
  }
});
```

**参考**: `games/src/snaky.js`: L49-L78

## 使用例ゲーム

このタグを使用しているゲーム:

- SNAKY (`games/description/snaky.md`)