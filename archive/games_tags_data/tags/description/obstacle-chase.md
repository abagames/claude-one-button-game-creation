# obstacle-chase

**カテゴリ**: obstacle | **優先度**: low | **代表例**: PAKU PAKU

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 障害物がプレイヤーキャラクターを追跡する。 |
| 詳細     | 技巧的に誘導して避けられる。追跡パターンを読んで、安全な経路やタイミングを計算する必要がある。 |
| リスク   | 追跡を誤るとプレイヤーが追い詰められ、接触してゲームオーバーになる。 |
| リワード | 追跡を巧みに避けることで、高いスコアや生存時間の延長が得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-auto_scroll, player-automatic, on_pressed-turn | 追跡を避けるための移動や方向転換と組み合わせることで、戦略的な深みが増す。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// paku_paku.js L133-144 より
// 敵がプレイヤーを追跡（パワー状態では逃げる）
const evx =
  enemy.eyeVx !== 0
    ? enemy.eyeVx
    : (player.x > enemy.x ? 1 : -1) * (powerTicks > 0 ? -1 : 1);
    //  プレイヤーの方向に移動      パワー時は逆方向
enemy.x = clamp(
  enemy.x +
    evx *
      (powerTicks > 0 ? 0.25 : enemy.eyeVx !== 0 ? 0.75 : 0.55) *
      difficulty,
  0,
  100
);
```

**参考**: `games/src/paku_paku.js`: L133-L144

## 使用例ゲーム

このタグを使用しているゲーム:

- PAKU PAKU (`games/description/paku_paku.md`)
- M JAMMING (`games/description/m_jamming.md`)
- JUMP ON (`games/description/jump_on.md`)