# player-multiple

**カテゴリ**: player | **優先度**: low | **代表例**: SURVIVOR

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | 複数のプレイヤーキャラクターを同時に操作する                                                  |
| 詳細     | 複数のキャラクター（人物、車、ボールなど）がフィールド上に存在し、1つの入力で全員が同時に反応する。個別操作ではなく一括操作により、複数キャラクターの位置関係を考慮した戦略的な判断が求められる |
| リスク   | 全キャラクターが同時に動くため、一部が危険な状態でも全体を優先した判断が必要。個別に救済できない |
| リワード | 複数キャラクターを同時に活用した効率的なアイテム収集やスコア獲得が可能。全員の動きを把握する達成感 |

## タグ相性

| 関係   | タグ                                                           |
| :----- | :------------------------------------------------------------- |
| 相性良 | on_pressed-jump, on_pressed-turn, field-lanes, rule-survival   |
| 排他   | なし                                                           |
| 依存   | なし                                                           |

## 実装例

```js
// SURVIVOR より抜粋
// 複数プレイヤーの一括ジャンプ処理
players.forEach((p) => {
  if (
    input.isJustPressed &&
    (p.isOnFloor || (p.underFoot != null && p.underFoot.isJumped))
  ) {
    play("jump");
    p.vel.set(0, -1.5);
    particle(p.pos, 10, 2, PI / 2, 0.5);
    p.isOnFloor = false;
    p.isJumping = true;
  }
});
```

**参考**: `games/src/survivor.js`: L121-L134

```js
// T LANES より抜粋
// 複数の車を配列で管理
cars = [
  { pos: vec(20, cy), angle: 0, speed: 0.1, ty: 0, onArrow: false, invDist: 0 },
  { pos: vec(99, cy), angle: PI, speed: 0.1, ty: 0, onArrow: false, invDist: 0 }
];
// 全ての矢印の向きを一括で切り替え
if (input.isJustPressed) {
  play("select");
  arrows.forEach((a) => {
    a.angle = wrap(a.angle + PI / 2, 0, PI * 2);
  });
}
```

**参考**: `games/src/t_lanes.js`: L90-L100, L106-L111

## 使用例ゲーム

このタグを使用しているゲーム:

- SURVIVOR (`games/description/survivor.md`) - 9人のキャラクターを同時にジャンプさせ、足場を渡りながら生存させる
- FLIP O (`games/description/flip_o.md`) - 複数のボールがピンボール風フィールドで同時に動く
- T LANES (`games/description/t_lanes.md`) - 複数の車がレーン上を走行、タップで全交差点の矢印方向を切り替え
