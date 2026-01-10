# weapon-wipe

**カテゴリ**: weapon | **優先度**: low | **代表例**: LASER FORTRESS

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 敵をなぎ倒す広範囲攻撃武器 |
| 詳細     | 一度に多数の敵を倒すことができる武器。ボタンを長押しすることで攻撃範囲を調整し、敵をなぎ倒すことができる |
| リスク   | 広範囲攻撃のため、味方や重要なオブジェクトも巻き込んでしまう可能性がある |
| リワード | 効率的に多数の敵を一掃できるため、スコアやクリア時間の向上が期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-shoot, field-auto_scroll |
| 排他   | weapon-arc |
| 依存   | なし |

## 実装例

```js
// laser_fortress.js L96-104 より
// ボタン長押しでレーザー照射、左から右へ薙ぎ払う
if (laserX != null && input.isPressed) {
  play("laser");
  color("blue");
  line(laserX, 50, 20, 8, 2);  // レーザー描画
  laserX += difficulty * 2;     // レーザーが右に進む
  particle(laserX, 50, 1, 2, -PI / 2, PI / 6);
  color("purple");
  box(laserX - 2, 50, 5, 1);    // 衝突判定用のヒットボックス
}

// L135-151: レーザーに当たった敵を撃破
if (char(...).isColliding.rect.purple) {
  if (o.type === "enemy") {
    play("hit");
    particle(o.x, 47);
    addScore(multiplier, o.x, 47);
    multiplier++;
  }
  return true;
}
```

**参考**: `games/src/laser_fortress.js`: L96-L104, L135-L151

## 使用例ゲーム

このタグを使用しているゲーム:

- LASER FORTRESS (`games/description/laser_fortress.md`)
- WIPER (`games/description/wiper.md`)