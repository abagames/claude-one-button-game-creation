# player-bar

**カテゴリ**: player | **優先度**: low | **代表例**: TWIN P

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが棒状の形をしている                                                    |
| 詳細     | プレイヤーが棒（バー、線、紐）として表現される。回転運動と組み合わせることで、障害物をかわしたり、ターゲットに到達したりする操作の複雑さが増す。棒の長さや角度が攻撃・移動範囲を決定する |
| リスク   | 棒が長いほど広い範囲をカバーできるが、障害物や敵に触れやすくなる。角度の予測を誤ると狙ったターゲットに到達できない |
| リワード | 棒の長さと回転タイミングを習熟すると、効率的なスコア獲得や精密な位置取りが可能                |

## タグ相性

| 関係   | タグ                                                           |
| :----- | :------------------------------------------------------------- |
| 相性良 | player-rotate, on_holding-extend, field-pins, rule-geometry    |
| 排他   | なし                                                           |
| 依存   | なし                                                           |

## 実装例

```js
// TWIN P より抜粋
// 2点を結ぶ線（棒）として描画
const np = vec(pos).addWithAngle(angle, len);
color("black");
line(pos, np, 2);
// 長押しで棒が伸長
if (input.isPressed) {
  play("laser");
  if (targetLen < 99) {
    targetLen += difficulty * 0.2;
  }
}
angle += difficulty * 0.05;
len += (targetLen - len) * 0.2;
```

**参考**: `games/src/twin_p.js`: L40-L67

```js
// PIN CLIMB より抜粋
// ピンから伸びる紐を棒として描画
if (input.isPressed) {
  cord.length += difficulty;
}
cord.angle += difficulty * 0.05;
line(cord.pin, vec(cord.pin).addWithAngle(cord.angle, cord.length));
```

**参考**: `games/src/pin_climb.js`: L52-L60

## 使用例ゲーム

このタグを使用しているゲーム:

- TWIN P (`games/description/twin_p.md`) - 2つのピンを結ぶ線が回転、長押しで伸長、固定点の切り替えで軌道変更
- PIN CLIMB (`games/description/pin_climb.md`) - ピンに固定された紐が回転、長押しで伸ばして次のピンへ移動
- SQUARE BAR (`games/description/square_bar.md`) - 正方形の外周を回る棒、長押しで伸ばしてアイテム取得
- AERIAL BAR (`games/description/aerial_bar.md`) - 空中を回転する棒を操作
- TT FENCE (`games/description/tt_fence.md`) - 棒状のフェンスで領域を区切る
