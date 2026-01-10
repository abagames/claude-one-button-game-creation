# on_holding-stop

**カテゴリ**: on_holding | **優先度**: medium | **代表例**: ROLL HOLD

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 長押しで停止する |
| 詳細     | ボタンを押し続けている間、プレイヤーやオブジェクトが停止し、特定のアクション（射撃など）を実行できる。離すと通常の動作に戻る |
| リスク   | 停止のタイミングを誤ると、敵や障害物に接触してしまう。また、停止しすぎるとゲームオーバーになる場合がある |
| リワード | 適切なタイミングで停止することで、敵を倒したり、障害物を回避したりすることができる。連続成功でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-shoot, player-rotate, weapon-vertical |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// roll_hold.js L103-121 より
// タップで回転方向反転、長押しで砲塔を停止して連続射撃
if (input.isJustPressed) {
  play("select");
  turretVa *= -1;  // 回転方向を反転
  fireTicks = 0;
}
const tp = vec(turretRadius).rotate(turretAngle).add(playerPos);
color("light_cyan");
if (!input.isPressed) {
  // ボタン離し中は砲塔が回転
  turretAngle = wrap(turretAngle + turretVa * 0.07 * df, -PI, PI);
} else {
  // 長押し中は回転停止して射撃
  fireTicks -= df;
  if (fireTicks < 0) {
    play("laser");
    shots.push({ pos: vec(tp), angle: turretAngle });
    fireTicks = 9;
    particle(tp, 3, 1, turretAngle, 0.5);
  }
  bar(tp, 4, 1, turretAngle + (turretVa > 0 ? PI / 2 : -PI / 2), -0.5);
}
```

**参考**: `games/src/roll_hold.js`: L103-L121

## 使用例ゲーム

このタグを使用しているゲーム:

- ROLL HOLD (`games/description/roll_hold.md`) - 長押しで砲塔の回転を停止し、連続射撃
- UP SHOT (`games/description/up_shot.md`) - 長押しで停止して上に連射
- D LASER (`games/description/d_laser.md`) - 長押しで停止し、レーザーを充填