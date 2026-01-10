# on_holding-shoot

**カテゴリ**: on_holding | **優先度**: medium | **代表例**: LASER FORTRESS

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 長押しで弾を発射する |
| 詳細     | ボタンを押し続けている間、継続的に攻撃を実行する。敵の状態に基づいて攻撃をやめ、次の行動に移行する。押している時間によって攻撃範囲や効果が変化する場合がある |
| リスク   | 攻撃のタイミングや範囲を誤ると、敵を倒しきれなかったり、味方を攻撃してしまう場合がある。また、攻撃中は無防備になる場合がある |
| リワード | 適切なタイミングと範囲で攻撃することで、複数の敵を一度に倒したり、連鎖反応を誘発したりすることができる。連続成功でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-stop, weapon-wipe, obstacle-penalty |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// laser_fortress.js L89-104 より
// ボタン押下でレーザー発射開始、長押しで照射継続
if (input.isJustPressed) {
  play("select");
  laserX = sightX;  // 照準位置からレーザー開始
  multiplier = 1;
  color("blue");
  particle(20, 8, 9, 3, 0, PI / 8);
}
if (laserX != null && input.isPressed) {
  play("laser");
  color("blue");
  line(laserX, 50, 20, 8, 2);  // レーザー描画
  laserX += difficulty * 2;    // 長押し中はレーザーが進行
  particle(laserX, 50, 1, 2, -PI / 2, PI / 6);
  color("purple");
  box(laserX - 2, 50, 5, 1);   // レーザー先端の当たり判定
}
```

**参考**: `games/src/laser_fortress.js`: L89-L104

## 使用例ゲーム

このタグを使用しているゲーム:

- LASER FORTRESS (`games/description/laser_fortress.md`) - 長押しでレーザー照射継続
- ROLL HOLD (`games/description/roll_hold.md`) - 長押しで連続射撃
- UP SHOT (`games/description/up_shot.md`) - 長押しで上に連射