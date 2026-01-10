# field-rotate

**カテゴリ**: field | **優先度**: low | **代表例**: R WHEEL

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | フィールドが回転している状態の構造 |
| 詳細     | プレイヤーキャラクターの移動に variety を加えるために、左右だけでなく、周期的なフィールドを作成する |
| リスク   | 回転による方向感覚の混乱、回転タイミングの予測失敗、遠心力による移動制御困難 |
| リワード | 回転を利用した効率的な移動、回転タイミングの戦略的活用、遠心力を利用した加速 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-rotate, field-space, field-gravity |
| 排他   | field-1D（回転効果が活かせない） |
| 依存   | -（単独で機能するが、回転メカニクスと組み合わせると効果的） |

## 実装例

```js
// r_wheel.js L134-168 より
// 回転するホイール（フィールド）上にスパイクを配置
const wheelRadius = 40;
const spikeCount = 32;

angleOfs += va;  // ホイールの回転
color("black");
arc(50, 50, wheelRadius + 3, 3, angleOfs, angleOfs + PI * 2);

// 各スパイクを回転角度に応じて配置
let a = angleOfs;
spikes.forEach((s) => {
  color(s.height > 0 ? "red" : "transparent");
  // 回転角度から位置を計算
  const p = vec(50, 50).addWithAngle(a, wheelRadius * (1 - s.height * 0.1));
  line(p, vec(50, 50).addWithAngle(a - PI / 2, 50 / spikeCount));
  a += (PI * 2) / spikeCount;  // 次のスパイクの角度
});
```

**参考**: `games/src/r_wheel.js`: L134-L168

## 使用例ゲーム

このタグを使用しているゲーム:

- R WHEEL (`games/description/r_wheel.md`) - 回転フィールド
- METEO PLANET (`games/description/meteo_planet.md`) - 惑星回転
- ANT LION (`games/description/ant_lion.md`) - 回転重力フィールド