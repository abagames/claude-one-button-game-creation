# player-string

**カテゴリ**: player | **優先度**: low | **代表例**: ZARTAN

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターがひもやロープで接続されている                                          |
| 詳細     | ひもやロープで別のオブジェクト（杭、凧など）と接続されたプレイヤーを操作する。ひもには張力や長さの制約があり、接続先との相互作用で間接的に移動を制御する。振り子やスイングの物理挙動が特徴的 |
| リスク   | ひもの張力で意図しない方向に引っ張られる。スイングの軌道を誤ると危険な位置に移動してしまう    |
| リワード | ひもの物理挙動を習熟すると、効率的なスイング移動や位置取りが可能。間接制御の爽快感がある      |

## タグ相性

| 関係   | タグ                                                           |
| :----- | :------------------------------------------------------------- |
| 相性良 | field-pins, on_pressed-jump_into_another, field-weather, field-auto_scroll |
| 排他   | なし                                                           |
| 依存   | なし                                                           |

## 実装例

```js
// ZARTAN より抜粋
// 長押しでアンカーに向かって引っ張られる
if (input.isPressed && anchor) {
  v.add(vec(anchor).sub(p).div(199));
  line(p, anchor);
  if (anchor.x < 0) {
    anchor = null;
  }
}
```

**参考**: `games/src/zartan.js`: L60-L66

```js
// KITE より抜粋
// 紐の長さ制約で引っ張り合う
const d = player.pos.distanceTo(kite.pos);
if (d > stringDist) {
  const a = player.pos.angleTo(kite.pos);
  player.vel.addWithAngle(a, (d - stringDist) * 0.05);
  kite.vel.addWithAngle(a + PI, (d - stringDist) * 0.01);
  kite.pos.addWithAngle(a + PI, d - stringDist);
}
```

**参考**: `games/src/kite.js`: L161-L167

## 使用例ゲーム

このタグを使用しているゲーム:

- ZARTAN (`games/description/zartan.md`) - ボタンで最も近い杭にロープ接続、長押しで引っ張られてスイング
- KITE (`games/description/kite.md`) - 凧とプレイヤーが紐で繋がり、風で凧を操作して間接的にプレイヤーを制御
