# field-weather

**カテゴリ**: field | **優先度**: low | **代表例**: KITE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 天候や風が関係する要素のフィールド構造 |
| 詳細     | 自然障害や風の影響を受けた現象でプレイヤーが影響を受ける |
| リスク   | 風の影響による移動制御困難、天候変化への適応不足、自然障害の予測失敗 |
| リワード | 風を利用した効率的な移動、天候変化を利用した戦略的行動、自然障害を利用した加速 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-water, field-space, on_holding-thrust |
| 排他   | field-1D（天候効果が活かせない） |
| 依存   | -（単独で機能するが、天候メカニクスと組み合わせると効果的） |

## 実装例

```js
// kite.js L106-186 より
// 風メカニクス（長押しで風を吹かせる）
if (input.isPressed) {
  kite.vel.add(difficulty * 0.2, -difficulty * 0.2);  // 凧に風の力
}
kite.vel.y += difficulty * 0.01;  // 重力
kite.vel.mul(0.95);  // 減衰
kite.pos.add(kite.vel);

// 風オブジェクトの生成（長押し時に多く発生）
nextWindTicks -= input.isPressed ? 3 : 1;
while (nextWindTicks < 0) {
  winds.push({
    pos: vec(-3, rnd(0, 87)),
    vel: vec(rnd(1, 2) * sd * (input.isPressed ? 2 : 1), 0),  // 長押しで強風
  });
  nextWindTicks += 30 / sd;
}

// 風が凧に当たると加速
color("light_cyan");
remove(winds, (w) => {
  w.pos.add(w.vel);
  const c = char("c", w.pos).isColliding.rect;
  if (c.blue) {  // 凧（青）に衝突
    play("hit");
    kite.vel.add(w.vel);  // 風の力を凧に伝える
    return true;
  }
  return w.pos.x > 203;
});
```

**参考**: `games/src/kite.js`: L106-L186

## 使用例ゲーム

このタグを使用しているゲーム:

- KITE (`games/description/kite.md`) - 風を利用した移動
- THUNDER (`games/description/thunder.md`) - 雷と風
- SHINY (`games/description/shiny.md`) - 天候変化
- DESCENT S (`games/description/descent_s.md`) - 風を利用した降下