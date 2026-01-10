# on_got_item-power_up

**カテゴリ**: on_got_item | **優先度**: low | **代表例**: PAKU PAKU

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | アイテム取得時にアップグレードし、力を得る |
| 詳細     | 特定のアイテムを取得すると、プレイヤーがパワーアップ状態になり、敵を倒したり、障害物を破壊したりする能力を得る。パワーアップ状態は一定時間続き、敵に反撃できる能力を有効にする |
| リスク   | パワーアップのタイミングを誤ると、敵を倒しきれなかったり、パワーアップ状態が終了した後に敵に囲まれてしまう。また、パワーアップ中に敵を倒しすぎると、敵がいなくなり得点チャンスを失う場合がある |
| リワード | 適切なタイミングでパワーアップすることで、複数の敵を一度に倒したり、高得点を得たりすることができる。連続成功でスコア倍率が上昇するなどのボーナスも期待できる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | obstacle-chase, on_pressed-turn, player-bounce |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// paku_paku.js L115-177 より
// パワードットを取得すると約120フレーム間、敵を食べられる
remove(dots, (d) => {
  color(d.isPower && floor(animTicks / 7) % 2 === 0 ? "transparent" : "yellow");
  const c = char(d.isPower ? "g" : "f", d.x, 30).isColliding.char;
  if (c.a || c.b || c.c) {
    if (d.isPower) {
      play("jump");
      if (enemy.eyeVx === 0) {
        powerTicks = 120;  // パワーアップ状態を120フレーム維持
      }
    } else {
      play("hit");
    }
    addScore(multiplier);
    return true;
  }
});

// 敵との衝突判定
const c = char(
  enemy.eyeVx !== 0 ? "h" : addWithCharCode("d", floor(animTicks / 7) % 2),
  enemy.x, 30,
  { mirror: { x: evx } }
).isColliding.char;
if (enemy.eyeVx === 0 && (c.a || c.b || c.c)) {
  if (powerTicks > 0) {
    // パワーアップ中は敵を食べられる
    play("powerUp");
    addScore(10 * multiplier, enemy.x, 30);
    enemy.eyeVx = player.x > 50 ? -1 : 1;  // 敵は目だけになって戻る
    powerTicks = 0;
    multiplier++;
  } else {
    // 通常時は敵に当たるとゲームオーバー
    play("explosion");
    end();
  }
}
powerTicks -= difficulty;  // パワーアップ時間減少
```

**参考**: `games/src/paku_paku.js`: L115-L177

## 使用例ゲーム

このタグを使用しているゲーム:

- PAKU PAKU (`games/description/paku_paku.md`) - パワードットを取得すると約120フレーム間、敵を食べられる
- UP 1 WAY (`games/description/up_1_way.md`) - アイテム取得で敵を倒す能力を得る
- R WHEEL (`games/description/r_wheel.md`) - アイテム取得で攻撃力が上昇
- BALLS BOMBS (`games/description/balls_bombs.md`) - アイテム取得で爆発範囲が拡大
- HOPPING P (`games/description/hopping_p.md`) - パワーアップ取得で状態反転し、敵を倒せる