# on_pressed-reverse_state

**カテゴリ**: on_pressed | **優先度**: high | **代表例**: NS CLIMB

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 属性や状態を反転する。 |
| 詳細     | さまざまな属性が存在する。例えば、オブジェクトの方向、パスの状態、通過するべきレーンやフィールド、極性など。 |
| リスク   | 状態反転のタイミングミスでゲームバランスが崩れる。複雑な状態管理が必要になる。 |
| リワード | 迅速な状態反転で戦略的優位性。戦略的な状態計画でゲームが複雑化。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-inverted, field-multiple, rule-time_manipulation |
| 排他   | on_holding-reverse_state |
| 依存   | - |

## 実装例

```js
// ns_climb.js L45-71 より
// ボタン押下でプレイヤーの極性（N/S）を反転
if (input.isJustPressed) {
  type = type === "N" ? "S" : "N";  // N極とS極を切り替え
  play(type === "N" ? "laser" : "select");
}
pos.add(vel);
vel.x *= 0.98;
vel.y += 0.001 * difficulty;

// L62-71: 極性に応じた描画
color(type === "N" ? "red" : "blue");  // N=赤、S=青
box(pos, 7, 7);
color("white");
text(type, pos.x - 1, pos.y - 1);

// L66-71: 磁石との相互作用（同極は反発、異極は引き付け）
magnets.forEach((m) => {
  if (m.type !== "") {
    const d = pos.distanceTo(m.pos);
    const a = pos.angleTo(m.pos);
    // 同じ極性なら反発（-1）、異なる極性なら引き付け（+1）
    vel.addWithAngle(a, (difficulty / d / d) * (m.type === type ? -1 : 1));
  }
});
```

**参考**: `games/src/ns_climb.js`: L45-L71

## 使用例ゲーム

このタグを使用しているゲーム:

- NS CLIMB (`games/description/ns_climb.md`)