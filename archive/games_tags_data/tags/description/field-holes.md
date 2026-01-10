# field-holes

**カテゴリ**: field | **優先度**: medium | **代表例**: GOLFME

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 地面に穴がある。 |
| 詳細     | 穴に落ちないように、慎重に移動やジャンプを行う必要がある。穴に隠れて敵の攻撃を避けたりする使い方もできる。 |
| リスク   | 穴に落ちるとゲームオーバーになるか、不利な状態になる。 |
| リワード | 穴を巧みに利用することで、敵の攻撃を回避したり、戦略的な位置取りが可能になる。 |

## タグ相性


| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_pressed-jump, weapon-explosion | ジャンプで穴を飛び越える。爆発で穴を埋めるか、敵を穴に落とすことができる。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// golfme.js L30-41 より
// 地面に穴（ギャップ）を生成
if (width + space < 0) {
  width = 200;              // 次の地面の幅
  space = rnd(50, 150);     // 穴の幅
}
// 地面を2つに分けて描画（間が穴）
color("blue");
rect(0, 90, width, 9);                    // 左側の地面
rect(width + space, 90, 200, 9);          // 右側の地面

// L38-41: 穴に落ちたらゲームオーバー
if (p.x < 0 || p.y > 99) {
  play("lucky");
  end();
}
```

**参考**: `games/src/golfme.js`: L30-L41

## 使用例ゲーム

このタグを使用しているゲーム:

- SHINY (`games/description/shiny.md`)
- GRENADIER (`games/description/grenadier.md`)
- LIE DOWN (`games/description/lie_down.md`)
- PORTAL J (`games/description/portal_j.md`)
- GOLFME (`games/description/golfme.md`)
- TWHOLS (`games/description/twhols.md`)
- MONJUM (`games/description/monjum.md`)