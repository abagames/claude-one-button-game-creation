# field-connected

**カテゴリ**: field | **優先度**: low | **代表例**: C NODES

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 複数のオブジェクトが相互に接続されているフィールド構造 |
| 詳細     | 接続を切断したり、接続されたコンポーネントを操作したりする |
| リスク   | 接続切断のタイミングミス、接続構造の予測失敗、接続コンポーネントの制御不足 |
| リワード | 接続切断による新ルート開拓、接続構造を利用した効率的な移動、接続コンポーネントの戦略的活用 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-string, weapon-explosion, rule-chain |
| 排他   | field-1D（接続構造が活かせない） |
| 依存   | -（単独で機能するが、接続メカニクスと組み合わせると効果的） |

## 実装例

```js
// snaky.js L49-78 より
// ノード間が接続されたスネーク構造
const na = PI / (sqrt(nodes.length - 1) + 3);  // 接続角度制限
let p = vec(0, 50);
let a = 0;
nodes.forEach((n, i) => {
  if (i === 0) {
    // 先頭ノードは入力で角度変更
    const pa = n.angle;
    n.angle = clamp(
      n.angle + (input.isPressed ? -1 : 1) * 0.03 * sqrt(difficulty),
      -na, na
    );
    n.va = n.angle - pa;
  } else {
    // 後続ノードは前ノードに追従
    n.angle += n.va;
    if ((n.angle > n.prevNode.angle + na && n.va > 0) ||
        (n.angle < n.prevNode.angle - na && n.va < 0)) {
      n.va *= -0.2;  // 接続の制限で反発
    }
  }
  n.va *= 0.95;
  // 接続されたノード間で力を伝播
  if (n.nextNode != null) {
    n.nextNode.va += n.va * 0.07 * sqrt(sqrt(difficulty));
  }
  if (n.prevNode != null) {
    n.prevNode.va += n.va * 0.01 * sqrt(sqrt(difficulty));
  }
  a += n.angle;
  color(i === nodes.length - 1 ? "red" : "black");
  bar(p, nl, 3, n.angle, 0);  // 接続線を描画
  p.addWithAngle(n.angle, nl);
});
```

**参考**: `games/src/snaky.js`: L49-L78

## 使用例ゲーム

このタグを使用しているゲーム:

- C NODES (`games/description/c_nodes.md`) - ノード接続
- SNAKY (`games/description/snaky.md`) - 接続されたスネーク
- REVOLVE A (`games/description/revolve_a.md`) - 接続された回転要素