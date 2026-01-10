# weapon-auto_aiming

**カテゴリ**: weapon | **優先度**: low | **代表例**: SIGHT ON

## 概要

| 項目     | 内容                                                                                                 |
| :------- | :--------------------------------------------------------------------------------------------------- |
| 要約     | 武器や照準が自動的に敵の方向を向く                                                                   |
| 詳細     | プレイヤーが直接照準を操作せずとも、最も近い敵や最も危険な敵を自動的にロックオンし攻撃方向を決定する |
| リスク   | 自動照準に頼りすぎて発射タイミングを見誤る、狙いたい対象と違う敵をロックしてしまう                   |
| リワード | 照準操作が不要になることで、発射タイミングや位置取りなど他の要素に集中できる                         |

## タグ相性

| 関係   | タグ                                              |
| :----- | :------------------------------------------------ |
| 相性良 | on_pressed-shoot, weapon-explosion, field-outpost |
| 排他   | on_holding-adjust_angle（手動照準調整とは相反）   |
| 依存   | なし                                              |

## 実装例

```js
// SIGHT ON より抜粋
// 最も低い位置（画面下端に近い敵）を追跡対象として選択
let maxY = 0;
let sightEnemy;
remove(enemies, (e) => {
  // ...敵の移動処理...
  if (e.pos.y > maxY) {
    sightEnemy = e;
    maxY = e.pos.y;
  }
});
// 照準が選択した敵に向かって自動追尾
sight.vel.x +=
  wrap((sightEnemy == null ? 50 : sightEnemy.pos.x) - sight.pos.x, -50, 50) *
  0.01;
sight.vel.y +=
  ((sightEnemy == null ? 50 : sightEnemy.pos.y) - sight.pos.y) * 0.01;
sight.vel.mul(0.97);
sight.pos.x += sight.vel.x * (sqrt(difficulty) - 0.8);
sight.pos.y += sight.vel.y * (sqrt(difficulty) - 0.8);
```

**参考**: `games/src/sight_on.js`: L130-L175

## 使用例ゲーム

このタグを使用しているゲーム:

- SIGHT ON (`games/description/sight_on.md`) - 照準が最も低い位置の敵を自動追尾、タップで爆発攻撃
- B CANNON (`games/description/b_cannon.md`) - 枠に沿って移動する砲台が最も近いボールを自動照準
