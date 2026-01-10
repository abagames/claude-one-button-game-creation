# weapon-change_field

**カテゴリ**: weapon | **優先度**: low | **代表例**: GRENADIER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 地形を変化させる武器 |
| 詳細     | 攻撃によって逃げ道を作るために地面に穴を開けたり、攻撃によってトゲを作り出したりするなど、プレイヤーにとって有利不利な仕組みをゲームに組み込むことができる |
| リスク   | 地形変化が予期せぬ影響を及ぼし、プレイヤーに不利な状況を作り出す可能性がある |
| リワード | 戦略的な地形操作が可能になり、ゲームの多様性と戦術的深みが増す |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-holes, field-spike |
| 排他   | field-regenerate |
| 依存   | なし |

## 実装例

```js
// grenadier.js L105-118 より
// グレネードが地面に着弾すると穴が開く
grenades = grenades.filter((g) => {
  g.pos.add(g.vel);
  g.vel.y += 0.1 * difficulty;  // 重力
  if (text("o", g.pos).isColliding.char.e) {
    return false;  // 敵に命中
  }
  if (g.pos.y > 68) {  // 地面に到達
    play("hit");
    particle(g.pos, 10, 1, -PI / 2, PI * 0.7);
    holes.push({ x: g.pos.x });  // 穴を生成（地形変化）
    return false;
  }
  return true;
});

// L93-98: 穴の描画と判定（プレイヤーが隠れられる）
holes = holes.filter((h) => {
  h.x -= scr;
  box(h.x, 70, 6, 10);  // 穴を白で描画
  return h.x > -4;
});
```

**参考**: `games/src/grenadier.js`: L93-L98, L105-L118

## 使用例ゲーム

このタグを使用しているゲーム:

- GRENADIER (`games/description/grenadier.md`)
- R WHEEL (`games/description/r_wheel.md`)