# field-press

**カテゴリ**: field | **優先度**: minimal | **代表例**: PRESS M

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 地形がキャラクターを潰すことができるフィールド構造 |
| 詳細     | 潰される領域を避けたり、正確なタイミングで動きを調整して潰されないようにする |
| リスク   | 潰されるタイミングの予測失敗、潰される領域からの脱出不足、潰される領域への誤進入 |
| リワード | 潰される直前の脱出による高得点、潰される領域を利用した加速、潰されるタイミングの戦略的活用 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-stop, player-automatic |
| 排他   | field-auto_scroll（潰されるタイミングが予測困難になる） |
| 依存   | -（単独で機能するが、潰されるメカニクスと組み合わせると効果的） |

## 実装例

```js
// clean_robo.js L88-109 より
// 壁が迫ってくるプレスメカニクス
if ((robot.pos.x - 100) * robot.vx > 0 && icw) {  // 壁に衝突
  robot.vx *= -1;  // 反転
  leftGarbage = undefined;
  if (garbage != null) {
    play("explosion");
    leftGarbage = vec(garbage);  // ゴミを残す
    robot.speed = 1;
    color("red");
    particle(garbage);
  }
  // 壁の距離を調整（プレス効果）
  const wli = (-robot.vx + 1) / 2;
  walls[wli].dist = clamp(
    walls[wli].dist + (garbage == null ? -10 : 20),  // 成功で狭く、失敗で広く
    30,
    100
  );
  setWall(wli, true);  // 壁を再配置
}
```

**参考**: `games/src/clean_robo.js`: L88-L109

## 使用例ゲーム

このタグを使用しているゲーム:

- PRESS M (`games/description/press_m.md`) - 潰されるフィールド
- CLEAN ROBO (`games/description/clean_robo.md`) - 潰される領域回避
- D LASER (`games/description/d_laser.md`) - レーザー潰し