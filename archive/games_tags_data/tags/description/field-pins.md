# field-pins

**カテゴリ**: field | **優先度**: medium | **代表例**: PIN CLIMB

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 複数のピンがさまざまな構成で配置されているフィールド構造 |
| 詳細     | ピンにフックしたり、ピンの上を歩いたり、ピンを互いに接続したり、ピンに当たって落下したりするなど、さまざまな使い方ができる |
| リスク   | ピン間移動のタイミングミス、ピン配置の予測失敗、ピン接続の不安定性 |
| リワード | 効率的なピン移動による高得点、ピン配置の戦略的活用、ピン接続による新ルート開拓 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-bar, on_holding-extend, player-rotate, field-auto_scroll, field-space |
| 排他   | field-1D（ピン構造が単純化しすぎる） |
| 依存   | -（単独で機能するが、ピン移動メカニクスと組み合わせると効果的） |

## 実装例

```js
// pin_climb.js L31-93 より
// ピン間を紐で移動するメカニクス
const cordLength = 7;
let cord = { angle: 0, length: cordLength, pin: pins[0] };

// 紐の自動回転
cord.angle += difficulty * 0.05;

// 長押しで紐を伸ばす
if (input.isPressed) {
  cord.length += difficulty;
} else {
  cord.length += (cordLength - cord.length) * 0.1;  // 離すと縮む
}

// 紐を描画
line(cord.pin, vec(cord.pin).addWithAngle(cord.angle, cord.length));

// ピンとの衝突判定
let nextPin;
remove(pins, (p) => {
  p.y += scr;  // ピンがスクロール
  // 紐（黒線）との衝突で次のピンを検出
  if (box(p, 3).isColliding.rect.black && p !== cord.pin) {
    nextPin = p;
  }
  return p.y > 102;  // 画面外で削除
});
if (nextPin != null) {
  play("powerUp");
  addScore(ceil(cord.pin.distanceTo(nextPin)), nextPin);  // 距離に応じたスコア
  cord.pin = nextPin;  // 次のピンに移動
  cord.length = cordLength;
}
```

**参考**: `games/src/pin_climb.js`: L31-L93

## 使用例ゲーム

このタグを使用しているゲーム:

- PIN CLIMB (`games/description/pin_climb.md`) - ピン間紐移動
- ORBIT MAN (`games/description/orbit_man.md`) - 惑星間回転移動
- CIRCLE W (`games/description/circle_w.md`) - ピンを使った円形移動
- REVOLVE A (`games/description/revolve_a.md`) - ピンを使った回転アクション
- TEETER (`games/description/teeter.md`) - ピンを使ったバランスゲーム