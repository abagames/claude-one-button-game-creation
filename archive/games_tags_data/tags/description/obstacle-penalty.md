# obstacle-penalty

**カテゴリ**: obstacle | **優先度**: medium | **代表例**: DIVARR

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 接触または破壊するとペナルティが発生するオブジェクトが散在している。 |
| 詳細     | ペナルティを避けるためには、ペナルティ対象のキャラクターを巧みに避けながら攻撃する必要がある。強力な攻撃を持つプレイヤーキャラクターに対する制約として機能する。 |
| リスク   | ペナルティオブジェクトに接触すると、スコア減少や状態悪化などの不利益を被る。 |
| リワード | ペナルティを回避しながら攻撃することで、安全に敵を排除できる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, rule-combo_multiplier | 爆発でペナルティオブジェクトを一掃できる。連鎖攻撃で効率的に排除できる。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// divarr.js L128-168 より
// 人間（ペナルティオブジェクト）と爆弾（通常ターゲット）の処理
fallings = fallings.filter((f) => {
  f.pos.add(f.vel);

  // 人間への警告表示
  if (f.isHuman && (firstHumanCount > 0 || f.pos.y < 8)) {
    text("Don't", f.pos.x - 10, f.pos.y + 6);
    text("hit me !", f.pos.x - 15, f.pos.y + 12);
  }

  // 衝突判定
  if (char(f.isHuman ? "d" : "c", f.pos).isColliding.char.a) {
    if (f.isHuman) {  // 人間に当てると即ゲームオーバー（ペナルティ）
      play("lucky");
      color("red");
      text("X", f.pos);
      end();
    } else {  // 爆弾は得点
      play("hit");
      addScore(shots.length, f.pos);
    }
    return false;
  }
});
```

**参考**: `games/src/divarr.js`: L128-L168

## 使用例ゲーム

このタグを使用しているゲーム:

- CHARGE BEAM (`games/description/charge_beam.md`)
- CAST N (`games/description/cast_n.md`)
- LASER FORTRESS (`games/description/laser_fortress.md`)
- TR BEAM (`games/description/tr_beam.md`)
- CIRCLE W (`games/description/circle_w.md`)
- DIVARR (`games/description/divarr.md`)