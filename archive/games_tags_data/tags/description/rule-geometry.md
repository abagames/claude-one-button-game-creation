# rule-geometry

**カテゴリ**: rule | **優先度**: low | **代表例**: SQUARE BAR

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 幾何学の原則を組み込む。プレイヤーキャラクターが地形との相互作用を通して幾何学的パターンを描く。 |
| 詳細     | 角度、形状、位置関係などの幾何学的要素がゲームメカニクスに組み込まれる。プレイヤーは幾何学的な思考が求められる。 |
| リスク   | 幾何学的な判断を誤ると、衝突やゲームオーバーになるリスクがある。 |
| リワード | 幾何学的なパターンを上手く利用することで、効率的な進行や高得点が得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-pass_through_gap, player-rotate, field-pins, rule-physics |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// clean_robo.js L64-80 より
// 三角形ロボットの幾何学的な衝突判定
let icw = false;  // 壁との衝突フラグ
let icg = false;  // ゴミとの衝突フラグ
color("light_black");

// 三角形の各頂点を幾何学的に計算（120度間隔）
const rps = times(3, (i) => {
  const p = vec(robotRadius)
    .rotate(robot.angle + ((PI * 2) / 3) * i)  // 120度(2π/3)ずつ回転
    .add(robot.pos);  // 中心位置を加算
  bar(p, 5, 3, ticks * 0.7 + i);  // 頂点を描画
  return p;
});

// 三角形の各辺と他オブジェクトの衝突判定
color("black");
times(3, (i) => {
  // 頂点間を結ぶ辺を描画して衝突判定
  const c = line(rps[i], rps[wrap(i + 1, 0, 3)]);
  if (c.isColliding.rect.purple) {
    icw = true;  // 壁(紫)との衝突
  }
  if (c.isColliding.rect.yellow) {
    icg = true;  // ゴミ(黄)との衝突
  }
});
```

**参考**: `games/src/clean_robo.js`: L64-L80

## 使用例ゲーム

このタグを使用しているゲーム:

- CLEAN ROBO (`games/description/clean_robo.md`)
- SQUARE BAR (`games/description/square_bar.md`)