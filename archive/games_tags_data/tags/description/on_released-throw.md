# on_released-throw

**カテゴリ**: on_released | **優先度**: medium | **代表例**: CAST N

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタンを離したときに投げるか前進する |
| 詳細     | ボタンを押している間に力や角度を調整し、離した瞬間に物体を投げたり、プレイヤーを前進させたりする。押している時間やタイミングによって投擲の距離や方向が変化する |
| リスク   | 投擲のタイミングや力加減を誤ると、目標に届かなかったり、予期せぬ方向に投げてしまう。また、投擲中は無防備になる場合がある |
| リワード | 適切なタイミングと力加減で投擲することで、遠くの目標を狙ったり、複数の敵を一度に倒したりすることができる。連続成功でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-adjust_angle, weapon-artillery, obstacle-penalty |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// cast_n.js L73-91 より
// 長押しでパワー蓄積、離して釣り糸をキャスト
if (nodesState === "ready") {
  if (input.isJustPressed) {
    play("select");
    throwPower = 1;
    nodesState = "angle";
    multiplier = 1;
  }
}
if (nodesState === "angle") {
  throwPower += 0.05 * sqrt(difficulty);  // パワー蓄積
  const a = 0.1 - throwPower * 0.2;       // 角度調整
  // パワーに応じた予測線を表示
  line(startPos, vec(startPos).addWithAngle(a, throwPower * 5 + 3), 2);
  // ボタンを離すか最大パワーに達したら発射
  if (input.isJustReleased || throwPower > 3) {
    play("jump");
    throwPower = clamp(throwPower, 1, 3);
    nodesState = "throw";
    // パワーと角度に基づいて速度を設定
    nodes[0].vel.set(sqrt(difficulty) * throwPower).rotate(a);
  }
}
```

**参考**: `games/src/cast_n.js`: L73-L91

## 使用例ゲーム

このタグを使用しているゲーム:

- CAST N (`games/description/cast_n.md`) - 長押しで力調整、離して釣り糸をキャスト
- MORTAR (`games/description/mortar.md`) - 長押しで照準距離調整、離して迫撃砲を発射
- NUMBER BALL (`games/description/number_ball.md`) - 長押しで角度調整、離してボールを投げる