# field-space

**カテゴリ**: field | **優先度**: low | **代表例**: GEOCENT

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 宇宙がフィールドとして機能する構造 |
| 詳細     | 惑星や流れ星などの天体の性質をゲームに組み込む |
| リスク   | 天体の軌道予測失敗、宇宙空間の無重力への適応不足、天体間移動のタイミングミス |
| リワード | 天体の性質を利用した効率的な移動、宇宙空間ならではの移動感覚、天体間移動の戦略的活用 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-gravity, field-rotate, player-follow |
| 排他   | field-water（環境が混在しすぎる） |
| 依存   | -（単独で機能するが、宇宙メカニクスと組み合わせると効果的） |

## 実装例

```js
// geocent.js L74-82 より
// 惑星軌道の更新と描画（地動説的な天体配置）
stars.forEach((s) => {
  s.angle += s.av * difficulty;  // 各天体が異なる角速度で公転
  s.cPos.set(50, 50).addWithAngle(s.angle, s.radius);
});
let ep = stars[3].cPos;  // 地球(index 3)を基準に
stars.forEach((s) => {
  s.pos.set(s.cPos).sub(ep).add(50, 50);  // 地球中心の座標系に変換
  color(s.color);
  arc(s.pos, s.size);  // 天体を描画
});
```

**参考**: `games/src/geocent.js`: L74-L82

## 使用例ゲーム

このタグを使用しているゲーム:

- GEOCENT (`games/description/geocent.md`) - 惑星軌道
- METEO PLANET (`games/description/meteo_planet.md`) - 流星と惑星
- ORBIT MAN (`games/description/orbit_man.md`) - 惑星間移動
- SWINGBY (`games/description/swingby.md`) - 宇宙空間での引力移動
- EAROCK (`games/description/earock.md`) - 宇宙空間パズル