# weapon-smoke

**カテゴリ**: weapon | **優先度**: minimal | **代表例**: BOUNCES

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 視界を遮る煙の効果を持つ武器 |
| 詳細     | プレイヤーが能動的にカバーを作り、攻撃を避ける別の方法を提供する。煙幕や視界妨害効果を生成する |
| リスク   | 視界が遮られすぎると、ゲームの進行が困難になる可能性がある |
| リワード | 戦術的な視界コントロールが可能になり、敵の攻撃を回避しやすくなる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-shelter, field-limited_vision |
| 排他   | weapon-ray |
| 依存   | なし |

## 実装例

```js
// accel_b.js L82-90 より
// ミサイルの軌跡として煙パーティクルを生成
remove(smokes, (s) => {
  s.pos.add(s.vel);
  s.pos.x -= scr;
  s.vel.mul(0.95);  // 煙は徐々に減速
  color(s.isEnemy && s.ticks < 20 ? "light_red" : "light_black");
  box(s.pos, 3 + cos(s.ticks * 0.03) * 5);  // 煙のサイズが変化
  s.ticks += sqrt(difficulty);
  return s.ticks > 60;  // 60フレームで消滅
});

// L155-164: ミサイルから煙を生成
m.smokeTicks += sqrt(difficulty);
if (m.smokeTicks > 5) {
  smokes.push({
    pos: vec(m.pos),
    vel: vec(m.vel).mul(0.5),
    ticks: 0,
    isEnemy: false,
  });
  m.smokeTicks -= 5;
}
```

**参考**: `games/src/accel_b.js`: L82-L90, L155-L164

## 使用例ゲーム

このタグを使用しているゲーム:

- BOUNCES (`games/description/bounces.md`)