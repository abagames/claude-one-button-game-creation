# on_pressed-split

**カテゴリ**: on_pressed | **優先度**: minimal | **代表例**: DIVARR

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 複数の部分に分割する。 |
| 詳細     | 分割された複数の武器やプレイヤーキャラクターを同時に制御する必要がある。 |
| リスク   | 分割のタイミングミスで制御が複雑化。複雑な分割制御が必要になる。 |
| リワード | 迅速な分割で複数敵を効率的に倒せる。戦略的な分割計画でゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-multiple, weapon-split, obstacle-split |
| 排他   | rule-chain |
| 依存   | - |

## 実装例

```js
// divarr.js L65-87 より
// ボタン押下で弾を2方向に分割するメカニクス
if (input.isJustPressed) {
  if (shots.length === 0) {
    // 最初のタップで発射
    play("laser");
    shots = [
      {
        pos: vec(50, 85),
        angle: 3,  // 上方向
        cc: 0,
      },
    ];
  } else {
    // 2回目以降のタップで分割
    play("select");
    const ns = [];
    shots.forEach((s) => {
      if (shots.length < 16) {
        // 2方向に分割（角度を±1）
        ns.push({ pos: vec(s.pos), angle: wrap(s.angle - 1, 0, 4), cc: 0 });
        ns.push({ pos: vec(s.pos), angle: wrap(s.angle + 1, 0, 4), cc: 0 });
      } else {
        // 最大数に達したら1方向のみ
        ns.push({ pos: vec(s.pos), angle: wrap(s.angle + 1, 0, 4), cc: 0 });
      }
    });
    shots = ns;
  }
}
```

**参考**: `games/src/divarr.js`: L65-L87

## 使用例ゲーム

このタグを使用しているゲーム:

- DIVARR (`games/description/divarr.md`)