# field-auto_scroll

**カテゴリ**: field | **優先度**: high | **代表例**: PARKING

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | フィールドが固定速度で継続的にスクロールされるフィールド構造 |
| 詳細     | プレイヤーは地形、危険、報酬が固定速度で通り過ぎるのを適応させ、位置決めやタイミングを調整しなければならない。自動スクロールによりゲームにペースと緊張感が生まれる |
| リスク   | スクロール速度への適応失敗、タイミング調整の誤り、位置取りの遅れによる機会損失 |
| リワード | スクロールパターンの習得による効率的な移動、タイミング調整の習熟による高度な操作、スクロールを活用した戦略的な位置取り |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_holding-move, player-automatic, obstacle-fall, rule-time_limit, player-multiple |
| 排他   | field-static（スクロールメカニクスと矛盾） |
| 依存   | -（単独で機能するが、移動制御や時間管理と組み合わせると効果的） |

## 実装例

```js
// parking.js L41-51 より
// 自動スクロール速度の計算
const carSpeed = difficulty;
let scr = carSpeed * 1.05;  // 基本スクロール速度
if (cars.length > 0) {
  const cy = cars[0].pos.y;
  if (cy < 50) {
    scr += (50 - cy) * 0.1;  // 車が上にいるときスクロール加速
  }
}

// L51-62: スクロールに合わせて道路を移動
roadY -= scr;
color("light_black");
rect(0, 0, 11, 100);
rect(89, 0, 11, 100);
times(3, (x) => {
  const lx = 30 + x * 20;
  times(6, (y) => {
    const ly = y * 20 - (roadY % 20) - 10;  // スクロールに連動
    box(lx, ly, 3, 10);
  });
});
```

**参考**: `games/src/parking.js`: L41-L62

## 使用例ゲーム

このタグを使用しているゲーム:

- PARKING (`games/description/parking.md`) - 自動スクロール駐車ゲーム
- UP 1 WAY (`games/description/up_1_way.md`) - 上方向スクロールゲーム
- GROWTH (`games/description/growth.md`) - サイズ変化スクロールゲーム
- FLIP O (`games/description/flip_o.md`) - 反転スクロールゲーム
- IN TOW (`games/description/in_tow.md`) - 追従スクロールゲーム
- NUMBER BALL (`games/description/number_ball.md`) - 数字スクロールゲーム
- PIN CLIMB (`games/description/pin_climb.md`) - ピンスクロールゲーム
- FROOOOG (`games/description/froooog.md`) - カエルスクロールゲーム
- PAINT BALL (`games/description/paint_ball.md`) - ペイントスクロールゲーム
- ACCEL B (`games/description/accel_b.md`) - 加速スクロールゲーム