# weapon-disablement

**カテゴリ**: weapon | **優先度**: minimal | **代表例**: PUMP PRESS

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 命中した敵を無力化する武器 |
| 詳細     | 敵を無力化することで回避や、他の手段で無力化した敵を倒すなど、さまざまな戦術が可能になる。一時的な麻痺や動きの制限を与える |
| リスク   | 無力化時間が短すぎると、効果が薄くなる可能性がある |
| リワード | 敵の動きを制御できるため、安全な攻撃や戦略的なプレイが可能になる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-control_weapons, obstacle-chase |
| 排他   | weapon-explosion |
| 依存   | なし |

## 実装例

```js
// pump_press.js L179-182 より
// ロケットが敵に衝突すると無力化状態にする
if (isRocketGoing && c.c) {
  e.isPressed = true;  // 敵を無力化（ロケットに押し付け）
  pressedCount++;
}

// L151-157: 無力化された敵はロケットと一緒に移動
if (e.isPressed) {
  if (rocketX == null) {
    return true;  // ロケットが消えたら敵も消える
  }
  e.x = rocketX + e.pressedOfs.x;  // ロケットに追従
  y += e.pressedOfs.y;
}
```

**参考**: `games/src/pump_press.js`: L151-L157, L179-L182

## 使用例ゲーム

このタグを使用しているゲーム:

- PUMP PRESS (`games/description/pump_press.md`)