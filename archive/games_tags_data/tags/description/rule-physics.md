# rule-physics

**カテゴリ**: rule | **優先度**: medium | **代表例**: HOLES

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 物理学の原則を組み込む。物体の衝突や跳ね返りを考慮して物体を操作する。 |
| 詳細     | 重力、摩擦、衝突、跳ね返りなどの物理演算がゲームメカニクスに組み込まれる。プレイヤーは物理法則を理解して操作する必要がある。 |
| リスク   | 物理演算を誤ると、意図しない動きや衝突が発生し、ゲームオーバーになるリスクがある。 |
| リワード | 物理演算を上手く利用することで、効率的な動きや高得点が得られる。 |

## タグ相性


| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-artillery, field-gravity, obstacle-bounce, player-bounce |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// holes.js L70-101 より
// 物理演算によるボールの動きと跳ね返り
remove(balls, (b) => {
  // 重力と減衰を適用
  b.vel.y += 0.2 * sqrt(difficulty);  // 重力
  b.vel.mul(1 - 0.02 * sqrt(difficulty));  // 減衰（摩擦）
  b.pos.add(vec(b.vel).mul(sqrt(difficulty) * 0.5));
  b.pos.y -= scr;  // スクロール

  b.angle += b.vel.x * 0.03 + b.vel.y * 0.02;  // 回転
  color("red");
  const c = arc(b.pos, ballRadius, 3, b.angle, b.angle + PI * 2).isColliding.rect;

  // 壁との跳ね返り判定
  if (c.light_yellow) {
    reflect(b, b.pos.x < 50 ? 0 : PI, "light_yellow");
  }
  if (c.green) {
    reflect(b, wallAngle - PI / 2, "green");
  }
  if (c.cyan) {
    reflect(b, PI - wallAngle + PI / 2, "cyan");
  }

  // 画面外で消滅
  if (b.pos.y > 99 + ballRadius) {
    play("hit");
    return true;
  }
});

// L117-131: 反射計算関数
function reflect(b, a, c) {
  const oa = wrap(b.vel.angle - a - PI, -PI, PI);
  if (abs(oa) < PI / 2) {
    b.vel.addWithAngle(a, b.vel.length * cos(oa) * 1.7);  // 跳ね返り
  }
}
```

**参考**: `games/src/holes.js`: L70-L131

## 使用例ゲーム

このタグを使用しているゲーム:

- FLIP O (`games/description/flip_o.md`)
- DESCENT S (`games/description/descent_s.md`)
- CATAPULT (`games/description/catapult.md`)
- HOLES (`games/description/holes.md`)
- TURBULENT (`games/description/turbulent.md`)