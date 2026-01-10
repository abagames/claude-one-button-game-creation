# rule-time_limit

**カテゴリ**: rule | **優先度**: medium | **代表例**: G PRESS

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 時間や資源の枯渇でゲームが終了する。時間を回復させたり資源を補充させたりする手段と組み合わせる。 |
| 詳細     | プレイヤーは制限時間内に目標を達成する必要があり、時間管理が重要になる。時間の経過とともに難易度が上昇することが多い。 |
| リスク   | 時間切れになるとゲームオーバーになるリスクがある。 |
| リワード | 時間内に目標を達成することで、高得点やボーナスが得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-gauge_management, on_pressed-attack, rule-mathematics |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// dango.js L42-78 より
// 残り串数（リソース）による時間制限
if (stickTicks === 0 && input.isJustPressed) {
  play("laser");
  stickTicks = 1;
  expStr = "";
  stickAdd = 0;
  stickLeft--;  // 残り串を消費
}

// 串が残っている間は続行可能
if (stickLeft >= 0) {
  color("cyan");
  rect(90, 75, 120, 2);
} else {
  end();  // 串が尽きたらゲームオーバー
}

// 残り串数の表示
if (stickLeft > 0) {
  color("blue");
  times(stickLeft, (i) => {
    rect(92, 70 - i * 3, 8, 1);
  });
}

// L64-66: スコアに応じて串を回復（時間延長相当）
const sl = stickLeft;
stickLeft = clamp(stickLeft + floor(expAdd / 100), -1, 9);
stickAdd = stickLeft - sl;
if (stickAdd > 0) {
  play("powerUp");  // 回復成功
}
```

**参考**: `games/src/dango.js`: L42-L78

## 使用例ゲーム

このタグを使用しているゲーム:

- CAST N (`games/description/cast_n.md`)
- DANGO (`games/description/dango.md`)
- PIZZA ARROW (`games/description/pizza_arrow.md`)
- SCRAMBIRD (`games/description/scrambird.md`)
- G PRESS (`games/description/g_press.md`)
- NUMBER LINE (`games/description/number_line.md`)