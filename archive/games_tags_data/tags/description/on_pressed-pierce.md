# on_pressed-pierce

**カテゴリ**: on_pressed | **優先度**: low | **代表例**: COLOR ROLL

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 集団で貫通する。 |
| 詳細     | 色や他の条件を事前にマッチングさせると、大きな報酬が得られる。 |
| リスク   | 貫通のタイミングミスで報酬を逃す。複雑な貫通制御が必要になる。 |
| リワード | 迅速な貫通で複数敵を効率的に倒せる。戦略的な貫通計画でゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-match, weapon-ray, obstacle-stack |
| 排他   | weapon-wipe |
| 依存   | - |

## 実装例

```js
// color_roll.js L45-101 より
// ボタン押下で弾を発射し、同色レーンを貫通して連続破壊
if (shotY != null) {
  shotY -= sqrt(difficulty) * 3;  // 弾が上昇
  sy = shotY;
} else {
  hitColor = undefined;
  if (input.isJustPressed) {
    play("laser");
    multiplier = 1;
    shotY = sy;  // 発射開始
    laneY += 2 * penalty * sqrt(sqrt(difficulty));
  }
}
color(hitColor == null ? "black" : hitColor);
rect(49, sy, 3, 99 - sy);  // 弾を描画

// L66-101: 各レーンとの衝突判定（同色なら貫通して連続破壊）
l.bars.forEach((b) => {
  color(b.color);
  // ...衝突判定
  if (c.black) {
    hitColor = b.color;  // 最初に当たった色を記録
    isRemoved = true;
  } else if (hitColor != null) {
    if (c[b.color]) {
      isRemoved = true;  // 同じ色なら貫通して破壊
    } else if (c.red || c.green || c.blue || c.yellow) {
      isShotRemoved = true;  // 違う色に当たったら弾消滅
    }
  }
});
if (isRemoved) {
  play("coin");
  addScore(multiplier * pow(2, baseMultiplier), 50, l.y);
  multiplier *= 2;  // 連続で貫通するほどマルチプライヤー上昇
}
```

**参考**: `games/src/color_roll.js`: L45-L101

## 使用例ゲーム

このタグを使用しているゲーム:

- COLOR ROLL (`games/description/color_roll.md`)