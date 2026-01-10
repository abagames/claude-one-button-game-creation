# on_holding-defenseless

**カテゴリ**: on_holding | **優先度**: minimal | **代表例**: HYPER LASER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 防御が弱まり無力になる |
| 詳細     | ボタンを押し続けている間は攻撃できるが、防御が弱くなる |
| リスク   | 攻撃中は被弾しやすく、タイミングを誤ると即死 |
| リワード | 高火力攻撃による敵の一掃 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-ray, weapon-wipe, obstacle-foresee |
| 排他   | on_holding-defend（攻撃と防御は両立しない） |
| 依存   | 特になし |

## 実装例

```js
// reflector.js L83-104 より
// 長押しでリフレクターを強化するが移動速度が低下（無防備）
if (input.isPressed) {
  ufo.power += (1 - ufo.power) * 0.05;  // パワー増加
} else {
  ufo.power *= 0.9;  // パワー減衰
}
// 長押し中は移動速度が半減（無防備状態）
ufo.pos.x += ufo.vx * sqrt(difficulty) * (input.isPressed ? 0.5 : 1) * 0.5;
if (!input.isPressed) {
  // 離している間は角度が変化
  ufo.angle = clamp(
    ufo.angle - ufo.vx * sqrt(difficulty) * 0.07,
    -PI / 4,
    PI / 4
  );
}
color("black");
char(addWithCharCode("a", floor(ticks / 15) % 2), ufo.pos);
color("blue");
// リフレクターのサイズはパワーに反比例（長押しで強化）
bar(
  vec(ufo.pos).addWithAngle(ufo.angle + PI / 2, 6),
  9 - ufo.power * 9,       // 長押しでバーが短くなる
  3 + ufo.power * 3,       // 長押しでバーが太くなる
  ufo.angle
);
```

**参考**: `games/src/reflector.js`: L83-L104

## 使用例ゲーム

このタグを使用しているゲーム:

- REFLECTOR (`games/description/reflector.md`)
