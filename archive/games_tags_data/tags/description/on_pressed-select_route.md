# on_pressed-select_route

**カテゴリ**: on_pressed | **優先度**: low | **代表例**: JUMP ON

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン押下時に進行ルートを決定する |
| 詳細     | 複数のレーンとそれらをつなぐパスが存在するフィールドで、適切なレーンを巧みに選択して進む必要がある |
| リスク   | 誤ったルート選択による障害物との衝突や時間ロス |
| リワード | 最適なルート選択による効率的な進行と安全性の確保 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-lanes, field-pins, rule-match |
| 排他   | on_pressed-jump_into_another（テレポートとルート選択の競合） |
| 依存   | field-lanes（複数レーンが前提） |

## 実装例

```js
// jump_on.js L290-310 より
// 穴を上昇中にボタン押下でレーン（ルート）を選択してジャンプアウト
} else if (player.state === "up") {
  player.pos.x = player.hole.x;
  player.pos.y -= difficulty;  // 上昇中
  if (player.pos.y < 23) {
    player.state = "down";  // 最上部で折り返し
  }
  // ボタン押下で現在の高さのレーンにジャンプ
  if (input.isPressed) {
    play("jump");
    player.state = "jumpFrom";
    // 現在のY座標を最も近いレーンに合わせる
    player.pos.y = ceil((player.pos.y - 90) / 12) * 12 + 87;
  }
  char("c", player.pos);
} else if (player.state === "jumpFrom") {
  player.pos.x += difficulty - scr;
  const o = player.pos.x - player.hole.x;
  player.pos.y += o < 4 ? -1 : 1;
  if (o >= 8) {
    player.state = "walk";  // 選択したレーンで歩行開始
    player.pos.y = round((player.pos.y - 90) / 12) * 12 + 87;
  }
}
```

**参考**: `games/src/jump_on.js`: L290-L311

## 使用例ゲーム

このタグを使用しているゲーム:

- JUMP ON (`games/description/jump_on.md`)
- NOT TURN (`games/description/not_turn.md`)