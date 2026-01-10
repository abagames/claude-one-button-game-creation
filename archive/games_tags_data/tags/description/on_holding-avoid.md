# on_holding-avoid

**カテゴリ**: on_holding | **優先度**: low | **代表例**: LIE DOWN

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 長押しで敵や弾を避けられる、またはそれらを通り抜ける |
| 詳細     | ボタンを押し続けている間、プレイヤーは伏せたり姿勢を変えたりして敵や障害物を回避できる。離すと通常の状態に戻る |
| リスク   | 長押しのタイミングを誤ると、敵や障害物に接触してしまう。また、長押ししすぎるとスコア倍率が減少するなどのペナルティが発生する場合がある |
| リワード | 適切なタイミングで長押しすることで、敵や障害物を回避し、生存時間を延ばすことができる。連続回避でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-holes, field-auto_scroll, player-reflect |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// lie_down.js L143-179 より
// 長押しで伏せて穴を回避、離すと自動加速
if (input.isJustPressed) {
  play("select");
  if (multiplier > 1) {
    multiplier--;  // 押下で倍率減少
  }
}
if (!input.isPressed) {
  player.vx += difficulty * 0.02;  // 離している間は加速
}
player.vx *= 0.99;
player.x += player.vx - scr;
if (player.x < 0) {
  play("explosion");
  end();
}
// 長押し中は伏せ姿勢（キャラ"c"）で低い位置（y=39）
// 離している間は立ち姿勢（キャラ"a"/"b"）で高い位置（y=37）
if (
  char(
    input.isPressed ? "c" : addWithCharCode("a", floor(ticks / 20) % 2),
    player.x,
    input.isPressed ? 39 : 37
  ).isColliding.char.f
) {
  play("explosion");
  end();  // 岩に当たるとゲームオーバー
}
// 穴に落ちた時、長押し中なら左に戻る
if (input.isPressed) {
  player.x -= 5;
} else {
  player.y = 1;  // 落下開始
}
```

**参考**: `games/src/lie_down.js`: L143-L179

## 使用例ゲーム

このタグを使用しているゲーム:

- BAMBOO (`games/description/bamboo.md`) - 長押しで竹を通過し、刈り取りと通過の選択
- ROLL S (`games/description/roll_s.md`) - 射撃を止める（ボタンを離す）とスクロールが進み、敵との距離が保たれる
- LIE DOWN (`games/description/lie_down.md`) - 長押しで伏せて岩と穴を回避