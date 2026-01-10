# weapon-blow_off

**カテゴリ**: weapon | **優先度**: low | **代表例**: BOMB UP

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 武器がキャラクターを遠くに吹き飛ばす効果を持つ |
| 詳細     | 武器を使用することで、キャラクターの移動を操作し、破壊以外の効果を得ることができる。敵や障害物を吹き飛ばすことで、フィールド上の配置を変化させる |
| リスク   | 吹き飛ばされたキャラクターが予期せぬ位置に移動し、プレイヤーに不利な状況を作り出す可能性がある |
| リワード | 戦略的にキャラクターを吹き飛ばすことで、フィールドの状況をコントロールし、有利な状況を作り出すことができる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, obstacle-fall |
| 排他   | player-automatic |
| 依存   | なし |

## 実装例

```js
// bomb_up.js L99-108 より
// 爆弾を起爆すると爆発の力でプレイヤーが吹き飛ばされる
if (bomb != null) {
  play("powerUp");
  explosion = { pos: vec(bomb.pos), ticks: 0 };
  color("light_red");
  particle(bomb.pos, 20, 3);
  const d = bomb.pos.distanceTo(player.pos);
  const a = bomb.pos.angleTo(player.pos);
  player.vel.addWithAngle(a, 20 / d);  // 爆発からの距離に応じて吹き飛ばす
  bomb = undefined;
}
```

**参考**: `games/src/bomb_up.js`: L99-L108

## 使用例ゲーム

このタグを使用しているゲーム:

- BOMB UP (`games/description/bomb_up.md`)
- RPS (`games/description/rps.md`)