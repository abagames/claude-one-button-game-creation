# on_holding-reverse_state

**カテゴリ**: on_holding | **優先度**: low | **代表例**: SHINY

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 長押しで属性やステータスを反転させる |
| 詳細     | ボタンを押し続けている間、重力や方向などの属性が反転したユニークな状態が現れる。プレイヤーは状態反転を利用して、通常とは異なる挙動を実現する |
| リスク   | 状態反転のタイミングを誤ると、予期せぬ方向に移動したり、環境との相互作用が逆転してしまう |
| リワード | 状態反転を適切に利用することで、通常では通過できない障害物を回避したり、新しい移動経路を生み出すことができる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-gravity, field-multiple, player-inverted |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// shiny.js L126-137, L175-192, L222-224 より
// 長押しで雨状態に切り替え、人々と地形の挙動が反転
const isRainy = input.isPressed;
if (input.isJustPressed) {
  play("hit");
  windY = rnds(0.5) * sqrt(difficulty);
  grounds[rightEdgeGroundIndex].size -= 0.1;  // ゴールの地面が縮小
}
if (input.isJustReleased) {
  play("hit");
}
// rainyRatioを0〜10で変化させ、雲の位置と天気を制御
rainyRatio +=
  !isRainy && rainyRatio > 0 ? -1 : isRainy && rainyRatio < 10 ? 1 : 0;
const rr = rainyRatio / 10;

// 雲の位置が天気に応じて変化
clouds.forEach((c) => {
  c.pos.set(
    c.rainyPos.x * rr + c.shinyPos.x * (1 - rr),  // 雨なら画面内、晴れなら画面外
    c.rainyPos.y * rr + c.shinyPos.y * (1 - rr)
  );
});

// 人々の速度が天気に応じて変化
const ti = floor(30 / difficulty);
if (h.ticks % ti === 0) {
  h.isRunning = isRainy;  // 雨なら走り(5倍速)、晴れなら歩き
}
```

**参考**: `games/src/shiny.js`: L126-L137, L152-L156, L222-L224

## 使用例ゲーム

このタグを使用しているゲーム:

- SHINY (`games/description/shiny.md`) - 長押しで雨を降らせ、人々の速度と地面の侵食を制御
- GRAVELER (`games/description/graveler.md`) - 長押しで重力を反転させ、壁の隙間を通過
- UD CAVE (`games/description/ud_cave.md`) - 長押しと離すで移動方向が反転し、上下の洞窟を同時に操作