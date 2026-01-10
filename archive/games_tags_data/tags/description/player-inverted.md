# player-inverted

**カテゴリ**: player | **優先度**: medium | **代表例**: BOTTOP

## 概要

| 項目     | 内容                                                                                           |
| :------- | :--------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが反転した状態で存在する                                                 |
| 詳細     | 複数のフィールドに同時に存在するプレイヤーを制御し、1つの入力で複数の状態を同時に管理する必要がある |
| リスク   | 一方を救う操作がもう一方を危険に晒す認知的ジレンマ                                             |
| リワード | 両キャラクターの状態を同時に把握し最適解を見つける空間認識力が習熟の鍵                         |

## タグ相性

| 関係   | タグ                                               |
| :----- | :------------------------------------------------- |
| 相性良 | field-multiple, on_pressed-jump, field-auto_scroll |
| 排他   | player-single（単一プレイヤー前提のタグ）          |
| 依存   | なし                                               |

## 実装例

```js
// BOTTOP より抜粋
// 上下に鏡像のキャラクターを配置し、同一入力で逆方向に動かす
if (
  char(c, 9, 8 + y, { mirror: { y: -1 } }).isColliding.char.d ||
  char(c, 9, 92 - y).isColliding.char.d
) {
  play("explosion");
  end();
}
```

**参考**: `games/src/bottop.js`: L95-L100

## 使用例ゲーム

このタグを使用しているゲーム:

- BOTTOP (`games/description/bottop.md`) - 上下に鏡像の2キャラが存在し、ジャンプで逆方向に移動
- REBIRTH (`games/description/rebirth.md`) - 左右2つの世界を反転しながらダイヤを収集
- UD CAVE (`games/description/ud_cave.md`) - 上下2つの洞窟を同時操作、下側は左右反転
- SCREEN (`games/description/screen.md`) - 画面中央で左右を往復し両サイドを防衛
- LIGHT DARK (`games/description/light_dark.md`) - 明暗2つの世界をボタンで切り替え
- TWO FACED (`games/description/two_faced.md`) - 左右2エリア間を転送される蛇ゲーム
