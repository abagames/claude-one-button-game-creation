# weapon-ray

**カテゴリ**: weapon | **優先度**: minimal | **代表例**: D FIGHT

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 発射方向を示す線が表示される武器 |
| 詳細     | 自動照準や敵を狙うのが難しい場合に、プレイヤーにとって有用な支援になる。照準線やレーザーサイトなどの視覚的ガイドを提供する |
| リスク   | 視覚的ガイドに依存しすぎると、プレイヤーのスキル向上が阻害される可能性がある |
| リワード | 正確な照準が可能になるため、難易度の高い攻撃も成功しやすくなる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-auto_aiming, on_pressed-shoot |
| 排他   | なし |
| 依存   | なし |

## 実装例

```js
// screen.js L63-94 より
// 照準角度を自動的に変化させ、発射方向を示す線を描画
player.angle += 0.01 * difficulty;
if (player.angle >= PI / 2) {
  player.angle -= PI / 2;
}
const sa = player.pos.x > 50 ? -player.angle : PI + player.angle;  // 発射角度

// L93-94: 照準線（レイ）を描画
color("light_black");
bar(player.pos, 99, 2, sa, 0);  // プレイヤー位置から発射方向へ線を描画

// L72-79: 照準線の方向に弾を発射
if (player.shotCount > 0 && input.isJustPressed) {
  play("coin");
  shots.push({
    pos: vec(player.pos),
    angle: sa,        // レイと同じ角度で発射
    speed: difficulty,
  });
}
```

**参考**: `games/src/screen.js`: L63-L94

## 使用例ゲーム

このタグを使用しているゲーム:

- D FIGHT (`games/description/d_fight.md`)
- SCREEN (`games/description/screen.md`)