# rule-time_manipulation

**カテゴリ**: rule | **優先度**: minimal | **代表例**: FUTURE WAKE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 時間の流れが変化する。 |
| 詳細     | プレイヤーのインタラクションを必要としない期間をスキップし、細かい操作を必要とするシーンで時間をスローにする。 |
| リスク   | 時間操作のタイミングミスでゲームバランスが崩れる。時間減速の過剰使用でゲームが単調になる。 |
| リワード | 緊張した状況でも落ち着いて操作できる。戦略的な時間管理で高得点を狙える。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-time_limit, on_holding-charge, on_released-throw |
| 排他   | rule-gauge_management |
| 依存   | - |

## 実装例

```js
// pizza_arrow.js L89-105 より
// 長押し中は時間が大幅に減速するメカニクス
if (arrow != null) {
  if (input.isPressed) {
    // 長押し中は時間を0.05倍に減速（狙いを定めやすくする）
    gameSpeed += (0.05 - gameSpeed) * 0.1;
  }
  if (input.isJustReleased || arrow.x > 90) {
    play("laser");
    arrow.vx = -5;  // 矢を発射
  }
  if (arrow.vx < 0) {
    // 発射後は通常速度に戻る
    gameSpeed += (1 - gameSpeed) * 0.2;
  }
  // ...
  arrow.x += arrow.vx * gameSpeed;  // gameSpeedで移動速度調整
}

// L76: ピザの回転にもgameSpeedを適用
pizza.angle += pizza.angleVel * gameSpeed;
```

**参考**: `games/src/pizza_arrow.js`: L76, L89-L105

## 使用例ゲーム

このタグを使用しているゲーム:

- PIZZA ARROW (`games/description/pizza_arrow.md`)