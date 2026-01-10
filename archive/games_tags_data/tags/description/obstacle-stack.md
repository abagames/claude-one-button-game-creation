# obstacle-stack

**カテゴリ**: obstacle | **優先度**: minimal | **代表例**: PILEUP

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 障害物が積み重なる。 |
| 詳細     | 移動範囲が制限されたり、一定まで積み重なるとゲームオーバーになったりする可能性がある。そのため、これらの制限を防ぐ方法を工夫する必要がある。 |
| リスク   | 積み重なりを放置すると移動が制限され、ゲームオーバーになる。 |
| リワード | 積み重なりを適切に管理することで、移動の自由度が維持される。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, on_holding-move | 爆発で積み重なりを一括解消できる。移動で積み重なりを回避できる。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// bamboo.js L80-151 より
// 竹が成長して積み重なる処理
remove(bamboos, (b) => {
  b.height += b.speed * difficulty * 0.14;  // 高さが増加
  let h = b.height / 4;
  let y = 90 - h / 2;

  // 高さに応じて色を変化（成長段階を表現）
  times(4, (i) => {
    color(b.height < 5 ? "light_yellow"
      : b.height > 50 ? "green"
      : b.height > 25 ? (i % 2 === 0 ? "green" : "light_green")
      : "yellow");
    box(b.x, y, (4 - i) * 2, ceil(h));
    y -= h;
  });

  // 最大高さに達するとゲームオーバー
  if (b.height >= 89) {
    color("red");
    text("X", b.x, 3);
    play("lucky");
    end();
  }
});
```

**参考**: `games/src/bamboo.js`: L80-L151

## 使用例ゲーム

このタグを使用しているゲーム:

- PILEUP (`games/description/pileup.md`)