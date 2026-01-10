# obstacle-well_up

**カテゴリ**: obstacle | **優先度**: low | **代表例**: B BLAST

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | キャラクターが湧き出る。 |
| 詳細     | 下部から湧き出て上方向に進むキャラクターを避けたり倒したりする。 |
| リスク   | 湧き出るタイミングや位置を誤ると接触してしまう。 |
| リワード | 湧き出るパターンを読むことで、効率的な回避や攻撃が可能になる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, field-bottomless | 爆発で湧き出る敵を一掃できる。落下を利用して敵を処理できる。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// bamboo.js L69-79 より
// 地面から竹（障害物）が湧き出す
nextBambooTicks--;
if (nextBambooTicks < 0) {
  speedBambooTicks--;
  bamboos.push({
    x: rnd(5, 195),         // ランダムな位置
    height: 0,              // 高さ0から開始（下から湧き出る）
    speed: speedBambooTicks < 0 ? 2 : 1,  // 成長速度
  });
  nextBambooTicks = rnd(70, 100) / difficulty;  // 次の出現間隔
  speedBambooTicks = rndi(4, 7);
}

// L81: 湧き出た後、徐々に成長
b.height += b.speed * difficulty * 0.14;
```

**参考**: `games/src/bamboo.js`: L69-L79, L81

## 使用例ゲーム

このタグを使用しているゲーム:

- B BLAST (`games/description/b_blast.md`)
- BAMBOO (`games/description/bamboo.md`)
- G PRESS (`games/description/g_press.md`)
- TR BEAM (`games/description/tr_beam.md`)
- BOMB UP (`games/description/bomb_up.md`)