# on_holding-thrust

**カテゴリ**: on_holding | **優先度**: medium | **代表例**: UP DOWN PRESS

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン長押し時にプレイヤーキャラクターを前方または上方に加速する |
| 詳細     | ボタンを長く押すほど、より高い速度を得られ、短く押すほど低い速度になるため、より精密なコントロールが可能になる |
| リスク   | 加速コントロールのミスによる障害物との衝突 |
| リワード | 精密な速度コントロールによる効率的な進行と安全性の確保 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-auto_scroll, obstacle-chase, rule-time_limit |
| 排他   | player-automatic（自動移動と手動加速の競合） |
| 依存   | 特になし |

## 実装例

```js
// up_down_press.js L101-114 より
// ジャンプ中に長押しで落下を遅くし、地上では長押しで加速
if (myCar.state === "ground") {
  myCar.pos.y = y;
  myCar.speed += myCarSize * myCar.angle * 0.02;
  myCar.angle += (a - myCar.angle) * 0.025;
  if (input.isJustPressed) {
    play("jump");
    myCar.state = "jump";
    myCar.vy = -2;
    multiplier = 1;
  }
}
if (myCar.state === "jump") {
  myCar.pos.y += myCar.vy * sqrt(difficulty);
  // 長押しで落下を遅く（0.05）、離すと速く落下（0.2）
  myCar.vy += input.isPressed ? 0.05 : 0.2;
  myCar.angle += (atan2(myCar.vy, myCar.speed) - myCar.angle) * 0.05;
}
// 長押しで高速（2.5倍）、離すと低速（0.5倍）
myCar.speed += (myCarSpeed * (input.isPressed ? 2.5 : 0.5) - myCar.speed) * 0.1;
```

**参考**: `games/src/up_down_press.js`: L97-L114

## 使用例ゲーム

このタグを使用しているゲーム:

- DESCENT S (`games/description/descent_s.md`)
- UP DOWN PRESS (`games/description/up_down_press.md`)
- M RIDER (`games/description/m_rider.md`)
- RAID (`games/description/raid.md`)
- SNAKY (`games/description/snaky.md`)
- TURBULENT (`games/description/turbulent.md`)
- TWO LANE (`games/description/two_lane.md`)
- PARKING (`games/description/parking.md`)
- EAROCK (`games/description/earock.md`)
- LLAND (`games/description/lland.md`)