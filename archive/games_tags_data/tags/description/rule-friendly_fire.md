# rule-friendly_fire

**カテゴリ**: rule | **優先度**: low | **代表例**: EMBATTLED

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 味方でも武器で倒すことができる。 |
| 詳細     | 自分の武器の攻撃範囲に入らないようにし、敵を狙って味方射撃に engaged する。 |
| リスク   | 味方を誤って攻撃してしまう。複雑な攻撃制御が必要になる。 |
| リワード | 戦略的な位置取りで敵を効率的に倒せる。チーム戦術の複雑さが増す。 |

## タグ相性


| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-multiple, weapon-explosion, rule-control_weapons |
| 排他   | weapon-auto_aiming |
| 依存   | - |

## 実装例

```js
// embattled.js L140-149, L178-186 より
// 敵同士が互いの弾で倒せるフレンドリーファイア
// 戦車のターゲット選択：敵側の戦車を狙う
tanks.forEach((ot) => {
  if (t.side === ot.side) {
    return;  // 同じ側は無視
  }
  const d = t.pos.distanceTo(ot.pos);
  if (d < md) {
    md = d;
    t.targetPos = ot.pos;  // 敵側の戦車をターゲットに
  }
});

// 弾が敵側の戦車に当たると撃破（フレンドリーファイア）
color(t.side === 0 ? "light_red" : "light_purple");
const c = bar(t.pos, 1, 6, t.angle).isColliding;
// 赤側の弾が紫側に、紫側の弾が赤側に当たる
if (c.rect[t.side === 0 ? "purple" : "red"]) {
  play("explosion");
  color("black");
  particle(t.pos);
  addScore(multiplier, t.pos);  // 敵同士の撃破でもスコア獲得
  multiplier++;
  return true;
}

// L196-201: 弾と敵戦車の衝突判定
remove(bullets, (b) => {
  const c = bar(b.pos, 3, 3, b.vel.angle).isColliding.rect;
  // 弾が反対側の戦車に当たったら消える
  if (c[b.side === 0 ? "light_purple" : "light_red"]) {
    return true;
  }
});
```

**参考**: `games/src/embattled.js`: L140-L149, L178-L201

## 使用例ゲーム

このタグを使用しているゲーム:

- EMBATTLED (`games/description/embattled.md`)