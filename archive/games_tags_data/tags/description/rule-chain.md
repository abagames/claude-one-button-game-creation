# rule-chain

**カテゴリ**: rule | **優先度**: medium | **代表例**: M RIDER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 連鎖効果で発生する出来事。 |
| 詳細     | 同時に消滅させることでより大きな報酬が得られる可能性がある。 |
| リスク   | 連鎖のタイミングミスで報酬を逃す。連鎖依存でゲームが単調になる。 |
| リワード | 連続成功で高スコア獲得。戦略的な連鎖計画でゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-combo_multiplier, weapon-explosion, obstacle-split |
| 排他   | rule-time_limit |
| 依存   | - |

## 実装例

```js
// m_rider.js L133-157 より
// 敵を倒すと周囲の敵に連鎖爆発するメカニクス
remove(planes, (p) => {
  p.pos.add(p.vel);
  p.pos.x -= scr;

  // 爆発カウントダウン中
  if (p.removeTicks > 0) {
    color("light_red");
    particle(p.pos, 1, 1);
    p.removeTicks -= sqrt(difficulty);

    if (p.removeTicks <= 0) {
      play("coin");
      particle(p.pos, 9, 2);
      addScore(multiplier, p.pos);
      multiplier++;  // 連鎖するほどマルチプライヤー上昇

      // 連鎖効果：周囲の敵にも爆発を伝播
      const rt = p.baseRemoveTicks * 0.9;
      if (rt > 2) {
        planes.forEach((ap) => {
          if (ap === p) { return; }
          // 近くの敵に連鎖爆発を設定
          if (ap.pos.distanceTo(p.pos) < 36) {
            line(ap.pos, p.pos);  // 連鎖を視覚化
            ap.removeTicks = ap.baseRemoveTicks = rt;
          }
        });
      }
      return true;
    }
  }
  // 最初の衝突で爆発開始
  const c = char("c", p.pos).isColliding.rect;
  if (c.red) {
    p.baseRemoveTicks = p.removeTicks = 9;
  }
});
```

**参考**: `games/src/m_rider.js`: L133-L157

## 使用例ゲーム

このタグを使用しているゲーム:

- M RIDER (`games/description/m_rider.md`)