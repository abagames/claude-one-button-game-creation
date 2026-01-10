# on_holding-extend

**カテゴリ**: on_holding | **優先度**: medium | **代表例**: TAPE J

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | オブジェクトを伸ばし広げる |
| 詳細     | 攻撃範囲や移動範囲を調整できる。攻撃範囲を広げることでヒットボックスが増えるリスクは、より広い範囲で攻撃できる高リターンで相殺される |
| リスク   | 伸ばしすぎると自身の当たり判定も拡大し被弾しやすくなる |
| リワード | 広範囲の敵を一度に捕捉・攻撃可能 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-bar, field-pins, weapon-wipe |
| 排他   | 特になし |
| 依存   | 特になし |

## 実装例

```js
// tape_j.js L51-120 より
// 長押しでテープを伸ばして前進、離すと収縮
if (input.isJustPressed) {
  play("select");
}
if (input.isPressed) {
  const spd = difficulty;
  dist += spd;
  switch (head.type) {
    case "ground":
      head.to.x += spd;  // 地面を進む
      break;
    case "up":
      head.to.y -= spd;  // 障害物を登る
      if (head.to.y < groundY - head.rect.size.y) {
        head.to.y = groundY - head.rect.size.y;
        tapes.push({ from: vec(head.from), to: vec(head.to) });
        head.type = "top";
        play("coin");
        head.from.set(head.to);
      }
      break;
    case "top":
      head.to.x += spd;  // 障害物の上を進む
      // ...
      break;
    case "down":
      head.to.y += spd;  // 障害物を降りる
      // ...
      break;
  }
} else {
  // 離すとスコア獲得してテープが収縮
  if (dist > 0) {
    play("powerUp");
    addScore(floor(sqrt(dist) * dist * 0.1 + 1), head.to);
    dist = 0;
  }
  // テープが縮む
  if (tapes.length > 0) {
    const t = tapes[0];
    t.from.x += (t.to.x - t.from.x) * 0.2 * sqrt(difficulty);
    t.from.y += (t.to.y - t.from.y) * 0.2 * sqrt(difficulty);
  }
}
```

**参考**: `games/src/tape_j.js`: L51-L120

## 使用例ゲーム

このタグを使用しているゲーム:

- TAPE J (`games/description/tape_j.md`)
- GROWTH (`games/description/growth.md`)
- M JAMMING (`games/description/m_jamming.md`)
- PIN CLIMB (`games/description/pin_climb.md`)
- SCAFFOLD (`games/description/scaffold.md`)
- SQUARE BAR (`games/description/square_bar.md`)
- T PUNCH (`games/description/t_punch.md`)
- TAPPUMP (`games/description/tappump.md`)
- TWIN P (`games/description/twin_p.md`)
