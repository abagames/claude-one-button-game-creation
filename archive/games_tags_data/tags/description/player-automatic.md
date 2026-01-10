# player-automatic

**カテゴリ**: player | **優先度**: low | **代表例**: LADDER DROP

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが入力なしで自動的に移動する                                            |
| 詳細     | プレイヤーが地形に沿って自動的に移動したり、最寄りの脅威から自動的に逃げたりする。プレイヤーは移動を直接制御できず、他のアクション（落下タイミング、ジャミング範囲など）に集中する必要がある |
| リスク   | 自動移動のパターンを把握できないと、危険な位置に誘導される。移動のタイミングが予測と合わないことがある |
| リワード | 移動操作から解放されることで、タイミングや戦略的判断に集中できる。自動移動のパターンを習熟すると効率的なプレイが可能 |

## タグ相性

| 関係   | タグ                                                           |
| :----- | :------------------------------------------------------------- |
| 相性良 | on_pressed-fall, on_holding-extend, on_released-erase, field-auto_scroll |
| 排他   | なし                                                           |
| 依存   | なし                                                           |

## 実装例

```js
// LADDER DROP より抜粋
// プレイヤーが自動で左右歩行、壁や床に当たると反転
if (player.state === "walk" || player.state === "downWalk") {
  player.pos.x += player.vx * sqrt(difficulty) * 0.4;
  // 壁や床に当たると方向反転
  if (c.f || player.pos.x < 5 || player.pos.x > 95) {
    play("laser");
    player.vx *= -1;
    player.pos.x += player.vx * 2;
  }
}
```

**参考**: `games/src/ladder_drop.js`: L189-L201

```js
// M JAMMING より抜粋
// ロボットが自動的に最も近いミサイルから逃げる
if (nm != null) {
  robot.vel.addWithAngle(
    nm.pos.angleTo(robot.pos) + PI / 3,
    sqrt(difficulty) * 0.01
  );
}
```

**参考**: `games/src/m_jamming.js`: L195-L201

## 使用例ゲーム

このタグを使用しているゲーム:

- LADDER DROP (`games/description/ladder_drop.md`) - プレイヤーが自動で左右歩行、梯子で登り降り、タップでパネル落下
- M JAMMING (`games/description/m_jamming.md`) - ロボットが自動的に最寄りのミサイルから逃げる、長押しでジャミング範囲拡大
