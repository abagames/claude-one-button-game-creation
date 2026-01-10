# player-follow

**カテゴリ**: player | **優先度**: low | **代表例**: IN TOW

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターに追従するオブジェクトがいる                                            |
| 詳細     | プレイヤーの移動軌跡を追いかけるキャラクター（ひよこ、蛇の体、貨物など）が存在する。追従オブジェクトを多く集めることで報酬やパワーが増加するが、衝突判定も増えリスクが高まる |
| リスク   | 追従オブジェクトが増えるほど全体の当たり判定が増大し、障害物や敵との衝突確率が上がる          |
| リワード | 追従オブジェクトを多く集めると高得点やパワーアップ。軌道を意識したプレイで効率的なスコア獲得が可能 |

## タグ相性

| 関係   | タグ                                                           |
| :----- | :------------------------------------------------------------- |
| 相性良 | on_got_item-spawn, on_pressed-turn, field-auto_scroll, rule-survival |
| 排他   | なし                                                           |
| 依存   | なし                                                           |

## 実装例

```js
// IN TOW より抜粋
// 位置履歴を記録し、追従オブジェクトが参照
bird.posHistory.unshift(vec(bird.pos));
if (bird.posHistory.length > 99) {
  bird.posHistory.pop();
}

// ひよこが位置履歴を参照して追従
chicks.forEach((c, i) => {
  c.targetIndex = 3 * (i + 1); // 3フレーム間隔で追従
  c.index += (c.targetIndex - c.index) * 0.05;
  const p = bird.posHistory[floor(c.index)];
  char("c", p);
});
```

**参考**: `games/src/in_tow.js`: L138-L144, L175-L179

```js
// SNAKE 1 より抜粋
// 頭の移動時に体が追従
if (headMoveTicks < 0) {
  if (!isHeadGettingDollar) {
    bodies.shift(); // 先頭の体を削除
  }
  bodies.push(vec(head.pos)); // 頭の位置に新しい体を追加
  // 頭を次の位置に移動
  const ao = angleOfs[head.angle];
  head.pos.add(ao[0], ao[1]);
}
```

**参考**: `games/src/snake_1.js`: L57-L71

## 使用例ゲーム

このタグを使用しているゲーム:

- IN TOW (`games/description/in_tow.md`) - 鳥の軌跡をひよこが追従、ひよこを消費して追加ジャンプ可能
- SNAKE 1 (`games/description/snake_1.md`) - 体が頭の移動軌跡を追従、体が長くなるほど自己衝突リスク増加
- GEOCENT (`games/description/geocent.md`) - ロケットの軌跡を貨物が追従、長い貨物列は高得点だが接触リスク増大
- TWO FACED (`games/description/two_faced.md`) - 尾のセグメントが頭の軌跡を追従、過去の軌道が障害物となる
