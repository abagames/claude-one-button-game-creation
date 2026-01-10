# field-multiple

**カテゴリ**: field | **優先度**: low | **代表例**: UD CAVE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 複数のフィールドが同時に表示されるフィールド構造 |
| 詳細     | 複数のフィールドの状態を同時に把握する必要があり、ゲームが複雑になる。各フィールド間の相互作用や独立したメカニクスを管理する必要がある |
| リスク   | 複数フィールドの同時管理による認知負荷の増加、フィールド間の相互作用の予測失敗、個別フィールドの状態把握の困難 |
| リワード | 複数フィールドを活用した戦略的な操作、フィールド間の相互作用を利用した効率的なプレイ、同時管理による高度な認知スキルの習得 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-inverted, player-follow, rule-time_limit, on_holding-reverse_state |
| 排他   | field-1D（複数フィールドと矛盾） |
| 依存   | -（単独で機能するが、複数フィールドを活用するメカニクスと組み合わせると効果的） |

## 実装例

```js
// ud_cave.js L126-156 より
// 上下2つのフィールドを同時に操作するメカニクス
let playerX = 0;  // 両フィールド共通のX位置

// 入力で左右移動（上下フィールドで反転動作）
playerX = clamp(
  playerX + (input.isPressed ? 1 : -1) * difficulty * 0.5,
  -25, 25
);

// 上フィールドのプレイヤー（playerX + 25の位置）
color("black");
const c1 = char("a", playerX + 25, 90).isColliding.rect;

// 下フィールドのプレイヤー（75 - playerXの位置、反転）
const c2 = char("a", 75 - playerX, 10).isColliding.rect;

// どちらかが壁に衝突でゲームオーバー
if (c1.red || c2.red) {
  play("explosion");
  end();
}

// 両フィールドのゴールド処理
color("yellow");
remove(golds, (g) => {
  g.pos.y += g.vy * vy;
  const c = char("$", g.pos).isColliding;
  if (c.rect.red) {
    return true;  // 壁に当たって消滅
  }
  if (c.char.a) {  // どちらかのプレイヤーが取得
    play("powerUp");
    multiplier++;
    return true;
  }
  return g.vy > 0 ? g.pos.y > 103 : g.pos.y < -3;
});
```

**参考**: `games/src/ud_cave.js`: L126-L156

## 使用例ゲーム

このタグを使用しているゲーム:

- UD CAVE (`games/description/ud_cave.md`) - 上下反転フィールド
- TWO FACED (`games/description/two_faced.md`) - 複数キャラクター管理