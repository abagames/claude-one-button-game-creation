# field-1D

**カテゴリ**: field | **優先度**: medium | **代表例**: PAKU PAKU

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | フィールドが1次元に限定された移動空間 |
| 詳細     | キャラクターの移動を左右（または上下）方向のみに制限する。限られたフィールド内で viable なゲームを確保するためには、ゲームルールを適切に簡素化する必要がある |
| リスク   | 移動方向の制限による回避手段の減少、1次元空間での敵との接近リスク、位置取りの誤判断 |
| リワード | 1次元空間を活用した効率的な移動、限定空間での戦略的な位置取り、単純化された制御による精密操作 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_pressed-turn, obstacle-chase, rule-physics, player-automatic |
| 排他   | field-3D, field-multiple（次元制限と矛盾） |
| 依存   | -（単独で機能するが、移動制御や障害物と組み合わせると効果的） |

## 実装例

```js
// paku_paku.js L84-144 より
// 1Dフィールドのメカニクス（横方向のみの移動）
let player = { x: 40, vx: 1 };
let enemy = { x: 100, eyeVx: 0 };

// タップで方向転換（1D空間での唯一の移動制御）
if (input.isJustPressed) {
  player.vx *= -1;
}

// プレイヤー移動（1D制限、x軸のみ）
player.x += player.vx * 0.5 * difficulty;

// 画面端でループ
if (player.x < -3) {
  player.x = 103;
} else if (player.x > 103) {
  player.x = -3;
}

// レーン（1D軌道）の描画
color("blue");
rect(0, 23, 100, 1);
rect(0, 25, 100, 1);
rect(0, 34, 100, 1);
rect(0, 36, 100, 1);

// 敵の追跡（1D空間）
const evx = enemy.eyeVx !== 0
  ? enemy.eyeVx
  : (player.x > enemy.x ? 1 : -1) * (powerTicks > 0 ? -1 : 1);
enemy.x = clamp(
  enemy.x + evx * (powerTicks > 0 ? 0.25 : 0.55) * difficulty,
  0, 100
);
```

**参考**: `games/src/paku_paku.js`: L84-L144

## 使用例ゲーム

このタグを使用しているゲーム:

- PAKU PAKU (`games/description/paku_paku.md`) - 1Dパックマン
- CHARGE BEAM (`games/description/charge_beam.md`) - 1D射撃ゲーム
- BAMBOO (`games/description/bamboo.md`) - 1D回避ゲーム
- LASER FORTRESS (`games/description/laser_fortress.md`) - 1D防御ゲーム
- PHOTON LINE (`games/description/photon_line.md`) - 1D光線ゲーム
- GRENADIER (`games/description/grenadier.md`) - 1D投擲ゲーム
- PORTAL J (`games/description/portal_j.md`) - 1Dポータルジャンプ
- PUMP PRESS (`games/description/pump_press.md`) - 1D圧力管理