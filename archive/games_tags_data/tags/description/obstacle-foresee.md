# obstacle-foresee

**カテゴリ**: obstacle | **優先度**: minimal | **代表例**: SMILY ANGRY

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 障害物がプレイヤーキャラクターの動きを予測する。 |
| 詳細     | 移動方向を観察して、その意図した経路に向けて攻撃する。プレイヤーキャラクターが同じ動きのパターンを維持すると、incoming assaultに脆弱になる。 |
| リスク   | 予測される動きを繰り返すと攻撃を受けやすくなる。 |
| リワード | 予測をかいくぐる動きをすることで、攻撃を回避できる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_pressed-turn, player-reciprocate | 方向転換や往復動作で予測をかいくぐることができる。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// smily_angry.js L156-176 より
// プレイヤーの移動を予測して弾を発射
function fire(pos, speed, isSmile, isRed) {
  play(isSmile ? "laser" : "hit");
  if (isRed) {
    // プレイヤーの未来位置を計算
    const t1 = player.pos.distanceTo(pos) / speed;  // 到達時間
    const t2 = vec(
      player.pos.x + t1 * player.vx * player.speed,  // 予測位置X
      player.pos.y
    ).distanceTo(pos) / speed;
    // 予測位置に向かって弾を発射
    const vel = vec().addWithAngle(
      pos.angleTo(
        vec(player.pos.x + t2 * player.vx * player.speed, player.pos.y)
      ),
      speed
    );
    bullets.push({ pos: vec(pos), vel, isRed, isBonus: isSmile });
  } else {
    // 予測なしの直接狙い
    const vel = vec().addWithAngle(pos.angleTo(player.pos), speed);
    bullets.push({ pos: vec(pos), vel, isRed, isBonus: isSmile });
  }
}
```

**参考**: `games/src/smily_angry.js`: L156-L176

## 使用例ゲーム

このタグを使用しているゲーム:

- SMILY ANGRY (`games/description/smily_angry.md`)