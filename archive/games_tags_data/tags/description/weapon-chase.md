# weapon-chase

**カテゴリ**: weapon | **優先度**: minimal | **代表例**: ACCEL B

## 概要

| 項目     | 内容                                                                                             |
| :------- | :----------------------------------------------------------------------------------------------- |
| 要約     | 発射物が敵を自動追跡する                                                                         |
| 詳細     | ミサイルや弾がターゲットの座標に向かって角度を調整しながら追尾し、プレイヤーは直接照準する必要がない |
| リスク   | 追尾に頼りすぎて発射タイミングを誤る、追尾速度より敵の移動が速いと命中しない                     |
| リワード | 照準負担が軽減される分、発射タイミングやリソース管理に集中できる                                 |

## タグ相性

| 関係   | タグ                                                    |
| :----- | :------------------------------------------------------ |
| 相性良 | on_pressed-shoot, rule-combo_multiplier, field-auto_scroll |
| 排他   | weapon-artillery（手動照準との組み合わせは稀）          |
| 依存   | なし                                                    |

## 実装例

```js
// ACCEL B より抜粋
// プレイヤーのミサイルがターゲットを追跡する
const d = m.pos.distanceTo(m.target);
if (d < 9 || m.pos.y > 95 || m.ticks > 120) {
  play("powerUp");
  m.exTicks = 1;  // 爆発開始
  const s = m.vel.length;
  m.vel.set().addWithAngle(m.pos.angleTo(m.target), s);
}
// 追尾アルゴリズム：ターゲット方向への速度加算
const mv =
  (sqrt(difficulty) / sqrt(d + 9)) *
  (m.ticks < 9 ? 0.1 : m.ticks < 20 ? 3 : 1);
m.vel.addWithAngle(m.pos.angleTo(m.target), mv);
m.vel.mul(m.ticks < 20 ? 0.7 : 0.95);
```

**参考**: `games/src/accel_b.js`: L140-L151

## 使用例ゲーム

このタグを使用しているゲーム:

- ACCEL B (`games/description/accel_b.md`) - 全敵・敵ミサイルに一斉追跡ミサイル発射、連続撃破でコンボ倍増
