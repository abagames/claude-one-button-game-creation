# obstacle-split

**カテゴリ**: obstacle | **優先度**: low | **代表例**: D MISSILE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 障害物が分割が起こる。 |
| 詳細     | 攻撃を受けたり時間の経過で分割が起こり、複雑さが増す。分割前に破壊するなど、適切な行動を選択する必要がある。 |
| リスク   | 分割を放置すると障害物が増殖し、回避が困難になる。 |
| リワード | 分割前の適切な処理により、効率的な障害物の排除が可能になる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, rule-chain | 爆発で一括処理することで分割を防止できる。連鎖反応と組み合わせることで効率的な排除が可能。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// d_missile.js L105-124 より
// 一定時間後に敵が分裂する
if (e.ticks > 0) {
  e.pos.add(e.vel);
  e.ticks--;
  if (e.ticks === 0) {  // タイマー終了で分裂
    play("hit");
    const c = rndi(2, 5);  // 2〜4体に分裂
    times(c, (i) => {
      const pos = vec(e.pos);
      const vel = vec(e.vel.length).rotate(pos.angleTo(rnd(10, 90), 90));
      enemies.push({
        pos,
        vel,
        from: vec(pos),
        ticks: 999,  // 分裂後は再分裂しない
        id: i === 0 ? e.id : enemyId,
        isRemoving: false,
      });
      enemyId++;
    });
  }
}
```

**参考**: `games/src/d_missile.js`: L105-L124

## 使用例ゲーム

このタグを使用しているゲーム:

- D MISSILE (`games/description/d_missile.md`)
- B CANNON (`games/description/b_cannon.md`)