# player-scaffold

**カテゴリ**: player | **優先度**: low | **代表例**: SCAFFOLD

## 概要

| 項目     | 内容                                                                                               |
| :------- | :------------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが足場や地形に沿って移動する                                                 |
| 詳細     | プレイヤーが足場を作り、その足場に沿ってキャラクターが移動する。直接制御ではなく間接的にキャラクターを導く |
| リスク   | 足場の配置ミスでキャラクターが危険な場所に誘導される                                               |
| リワード | 足場の配置パターンを先読みし、効率的なルートを構築する計画力が習熟の鍵                             |

## タグ相性

| 関係   | タグ                                                |
| :----- | :-------------------------------------------------- |
| 相性良 | player-automatic, on_pressed-fall, field-auto_scroll |
| 排他   | on_holding-move（直接移動操作との組み合わせは稀）   |
| 依存   | なし                                                |

## 実装例

```js
// SCAFFOLD より抜粋
// プレイヤーが足場キャラクターに沿って上下に移動
let type;
for (let i = 0; i < 9; i++) {
  const c = box(player.x + 4, player.y, 1, 6).isColliding.char;
  if (c.a) {
    type = 0;
    player.y--;  // 下り坂
  } else if (c.b) {
    type = 1;
    player.y--;  // 平坦
  } else if (c.c) {
    type = 2;
    player.y--;  // 上り坂
  } else {
    if (type != null) break;
    player.y++;  // 足場がなければ落下
  }
}
if (type === 0) {
  player.y += 4;  // 下り坂の場合は4ピクセル下がる
}
```

**参考**: `games/src/scaffold.js`: L179-L199

## 使用例ゲーム

このタグを使用しているゲーム:

- SCAFFOLD (`games/description/scaffold.md`) - 足場を設置しながら進む、足場の角度（上り/平坦/下り）を選択
- LADDER DROP (`games/description/ladder_drop.md`) - 梯子で登り降り可能、パネル落下で足場を構築
