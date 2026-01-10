# rule-combo_multiplier

**カテゴリ**: rule | **優先度**: medium | **代表例**: UNCTRL

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 成功を連鎖させることでスコアボーナスを維持する。成功が続くとマルチプライヤーが上がり、ミスでリセットされる。連鎖に基づくプレイを報酬する。 |
| 詳細     | プレイヤーは連続して成功することで、スコアの倍率が上昇し、高得点が得られる。ミスをすると倍率がリセットされる。 |
| リスク   | 連続成功を維持できないと、倍率がリセットされ、高得点が得られないリスクがある。 |
| リワード | 連続成功により、スコアの倍率が上昇し、高得点が得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-proximity_bonus, field-auto_scroll, weapon-shoot |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// unctrl.js L140-146 より
// 敵の弾を撃墜するとマルチプライヤーが増加
if (c.rect.blue) {
  play("coin");
  addScore(multiplier, b.pos);
  particle(b.pos, 9);
  if (multiplier < 64) {
    multiplier *= 2;  // 倍率が2倍に増加（最大64倍）
  }
  return true;
}

// L161-165: ミサイルを撃つとマルチプライヤーがリセット
function setNextShot() {
  shot.pos.set(shotPos);
  shot.vel.set(0.5, 0.2);
  shot.state = "ready";
  multiplier = 1;  // リセット
}
```

**参考**: `games/src/unctrl.js`: L140-L146, L161-L165

## 使用例ゲーム

このタグを使用しているゲーム:

- THUNDER (`games/description/thunder.md`)
- ACCEL B (`games/description/accel_b.md`)
- COUNTER B (`games/description/counter_b.md`)
- SCRAMBIRD (`games/description/scrambird.md`)
- BALLS BOMBS (`games/description/balls_bombs.md`)
- M FIELD (`games/description/m_field.md`)
- UNCTRL (`games/description/unctrl.md`)