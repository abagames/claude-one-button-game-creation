# field-roughness

**カテゴリ**: field | **優先度**: medium | **代表例**: TURBULENT

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 地形がでこぼこしている。 |
| 詳細     | 地形の傾斜によって移動やジャンプの挙動が影響を受ける。でこぼこした地形は障害物やカバーとしても機能する。 |
| リスク   | でこぼこした地形による予期せぬ移動やジャンプの失敗。 |
| リワード | 地形を巧みに利用することで、戦略的な位置取りや敵の回避が可能になる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-move, on_pressed-jump | 移動速度の制御で地形の影響を調整できる。ジャンプで地形の障害を飛び越える。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// scrambird.js L92-123 より
// 壁の高さが変化するでこぼこ地形
walls.forEach((w) => {
  w.x -= scr;
  if (w.x < -10) {
    w.x += 110;
    wallHeight += wallHeightVel;  // 高さを変化
    // 高さの上下限チェック
    if ((wallHeight < 10 && wallHeightVel < 0) ||
        (wallHeight > 50 && wallHeightVel > 0)) {
      wallHeightVel *= -1;
    } else if (rnd() < 0.3) {
      wallHeightVel = rnd() < 0.5 ? -10 : 10;  // ランダムに傾斜変更
    }
    w.height = wallHeight;
  }
  rect(w.x, 90 - w.height, 9, w.height);  // でこぼこした壁を描画
});
```

**参考**: `games/src/scrambird.js`: L92-L123

## 使用例ゲーム

このタグを使用しているゲーム:

- UP DOWN PRESS (`games/description/up_down_press.md`)
- SCRAMBIRD (`games/description/scrambird.md`)
- SUB JUMP (`games/description/sub_jump.md`)
- TURBULENT (`games/description/turbulent.md`)
- TAPE J (`games/description/tape_j.md`)
- LLAND (`games/description/lland.md`)