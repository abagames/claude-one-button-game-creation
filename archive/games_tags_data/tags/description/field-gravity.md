# field-gravity

**カテゴリ**: field | **優先度**: low | **代表例**: GRAVELER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 重力や引力が働いているフィールド構造 |
| 詳細     | 引き寄せられないように、方向を変更したり、プレイヤーキャラクターの属性を変更したりする |
| リスク   | 重力による移動制御困難、引力による軌道予測失敗、重力変化への適応不足 |
| リワード | 重力を利用した効率的な移動、引力を利用した加速、重力変化を利用した新ルート開拓 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-space, player-rotate, on_pressed-reverse_state |
| 排他   | field-1D（重力効果が活かせない） |
| 依存   | -（単独で機能するが、重力メカニクスと組み合わせると効果的） |

## 実装例

```js
// graveler.js L72-93 より
// 重力反転メカニクス
walls.forEach((w) => {
  // 壁の描画
  color("blue");
  rect(w.pos.x, 0, 11, w.pos.y - w.width / 2);
  rect(w.pos.x, w.pos.y + w.width / 2, 11, 101 - w.pos.y - w.width / 2);

  // 重力方向の視覚表示（紫=反転中、シアン=通常）
  color(input.isPressed ? "purple" : "cyan");
  for (let y = w.pos.y - w.width / 2 + grvOfs; y < w.pos.y; y += 10) {
    rect(w.pos.x, y, 10, 1);
  }

  // プレイヤーの重力計算
  if (sx >= w.pos.x && sx < w.pos.x + 10) {
    let f = sy < w.pos.y ? -1 : 1;  // 通常重力方向
    if (input.isPressed) {
      f *= -1.5;  // 長押しで重力反転・強化
    }
    svy += sqrt(difficulty) * f * 0.015;  // 速度に加算
  }
});
// 重力アニメーションオフセット更新
grvOfs = wrap(grvOfs + difficulty * (input.isPressed ? 0.25 : -0.16), 0, 10);
```

**参考**: `games/src/graveler.js`: L72-L93

## 使用例ゲーム

このタグを使用しているゲーム:

- GRAVELER (`games/description/graveler.md`) - 重力フィールド
- NS CLIMB (`games/description/ns_climb.md`) - 重力反転
- SWINGBY (`games/description/swingby.md`) - 引力を利用した移動
- EAROCK (`games/description/earock.md`) - 重力を利用したパズル