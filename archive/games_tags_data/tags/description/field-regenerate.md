# field-regenerate

**カテゴリ**: field | **優先度**: minimal | **代表例**: REGENE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 地形が時間経過または特定条件で再生するフィールド構造 |
| 詳細     | 再生された地形を巧みに避けなければならない。再生パターンの予測と適応が重要 |
| リスク   | 再生地形の予測失敗、再生タイミングの誤判断、再生エリアへの巻き込まれ |
| リワード | 再生パターンの習得による安全ルート確保、再生タイミングを利用した戦略的移動、再生メカニクスの活用 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-time_limit, obstacle-fall, player-automatic |
| 排他   | field-static（再生メカニクスと矛盾） |
| 依存   | -（単独で機能するが、時間管理や障害物と組み合わせると効果的） |

## 実装例

```js
// wiper.js L53-89 より
// 雨粒が再生成されるメカニクス（地形再生の類似パターン）
nextRainTicks--;
if (nextRainTicks < 0) {
  // 新しい雨粒を生成（再生）
  rains.push({ pos: vec(rnd(10, 90), rnd(20)), size: 2 });
  nextRainTicks = 10 / difficulty;
}

remove(rains, (r) => {
  color("transparent");
  let isRemoved = box(r.pos, sqrt(r.size) * 2).isColliding.rect.black;
  let isAbsorbed = false;

  // 雨粒同士の合体（再生要素の結合）
  rains.forEach((or) => {
    if (r.pos.y > or.pos.y &&
        r.pos.distanceTo(or.pos) < sqrt(r.size + or.size) * 2) {
      or.size += r.size;
      or.pos.x = (or.pos.x + r.pos.x) / 2;
      isAbsorbed = true;
    }
  });
  if (isAbsorbed) {
    play("laser");
    return true;
  }

  r.pos.y += sqrt(r.size - 1.9) * 0.3 * sqrt(difficulty);
  color("cyan");
  if (isRemoved || box(r.pos, sqrt(r.size)).isColliding.rect.black) {
    play("powerUp");
    addScore(ceil(r.size - 1), r.pos);
    return true;  // 消去後、また再生成される
  }
});
```

**参考**: `games/src/wiper.js`: L53-L89（類似メカニクス）

## 使用例ゲーム

このタグを使用しているゲーム:

- REGENE (`games/description/regene.md`) - 再生プラットフォーム
- 類似メカニクスを含むゲーム: TAPE J (obstacle-fall), WIPER (obstacle-fall)