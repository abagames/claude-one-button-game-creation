# on_got_item-spawn

**カテゴリ**: on_got_item | **優先度**: low | **代表例**: IN TOW

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | アイテム取得時にキャラクターをスポーンさせる |
| 詳細     | 特定のアイテムを取得すると、プレイヤーキャラクターが数やサイズを増やす。新しいキャラクターが既存のキャラクターに触れると、追加の能力や得点が得られる場合がある |
| リスク   | キャラクターを増やしすぎると、制御が難しくなったり、敵に当たるリスクが増加したりする。また、キャラクターの管理が複雑になると、ゲームオーバーになる可能性が高まる |
| リワード | 適切なタイミングでキャラクターを増やすことで、高得点を得たり、新しい戦略的オプションを得たりすることができる。連続成功でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-multiple, field-lanes, player-follow |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// in_tow.js L115-137, L79-86 より
// 床にいるひよこを取得すると所持数増加
remove(floors, (f) => {
  f.pos.x -= scr;
  color("light_yellow");
  const c = box(f.pos, f.width, 4).isColliding.rect;
  // ...
  if (f.hasChick) {
    color("black");
    const c = char("c", f.pos.x, f.pos.y - 5).isColliding.char;
    if (c.a || c.b) {
      // プレイヤー（親鳥）がひよこに触れた
      if (chicks.length < 30) {
        chicks.push({ index: 0, targetIndex: 0 });  // ひよこ追加
      }
      play("select");
      addScore(chicks.length, f.pos.x, f.pos.y - 5);
      f.hasChick = false;
    }
  }
});

// ひよこを消費して追加ジャンプ（ジャンプ中にボタン押下）
if (bird.isJumping) {
  if (chicks.length > 0 && input.isJustPressed) {
    play("jump");
    play("hit");
    bird.vy = -2 * sqrt(difficulty);  // 追加ジャンプ
    chicks.shift();  // ひよこを1匹消費
    fallingChicks.push({ pos: vec(bird.posHistory[2]), vy: 0 });
  }
}
```

**参考**: `games/src/in_tow.js`: L79-L86, L115-L137

## 使用例ゲーム

このタグを使用しているゲーム:

- IN TOW (`games/description/in_tow.md`) - ひよこ取得で所持数増加し、追加ジャンプが可能になる
- T LANES (`games/description/t_lanes.md`) - 動いている車に停止中の車が触れると、新しい車が起動
- TWO FACED (`games/description/two_faced.md`) - アイテム取得で新しいキャラクターが出現