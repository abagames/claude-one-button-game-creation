# weapon-explosion

**カテゴリ**: weapon | **優先度**: medium | **代表例**: flipbomb

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 爆発を起こす武器メカニクス。範囲内の敵やオブジェクトに影響を与える |
| 詳細     | 爆発は広範囲に影響を及ぼし、複数の敵を同時に倒すことができる。爆発のタイミング、位置、範囲の制御が戦略的要素となる。連鎖反応を起こすことで大規模な効果を生み出すこともある |
| リスク   | 爆発範囲内にプレイヤー自身が入るとダメージを受けることがある。爆発のタイミングや位置の誤りが失敗につながる |
| リワード | 爆発の連鎖反応や複数敵の同時撃破による高スコア。爆発の反動を利用した移動や戦略的な位置取り |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-chain, rule-combo_multiplier, weapon-time_limit, obstacle-penalty |
| 排他   | weapon-auto_aiming（精密な照準が不要になるため） |
| 依存   | on_pressed-shoot, on_released-throw（爆発のトリガーとして必要） |

## 実装例

```js
// flipbomb より抜粋
// 爆発エフェクトと連鎖処理
color("purple");
explosions = explosions.filter((e) => {
  let a = e.a;
  const r = e.t < 20 ? e.t * 0.5 : 20 * 0.5 - (e.t - 20);
  const s = e.t === 0 ? 10 : r + 3;
  times(5, (i) => {
    box(vec(e.p).addWithAngle(a, r), s, s);
    a += (PI * 2) / 5;
  });
  e.t++;
  e.a += 0.2;
  return e.t < 30;
});

// 爆発による敵の撃破とスコア処理
if (bc.cyan || bc.purple) {
  play("hit");
  explosions.push({ p: b.p, t: 0, a: rnds(PI) });
  color("purple");
  particle(b.p, 16, 3);
  addScore(multiplier, b.p);
  multiplier++;
  return false;
}
```

**参考**: `games/src/flipbomb.js`: L39-L103

## 使用例ゲーム

このタグを使用しているゲーム:

- FLIPBOMB (`games/description/flipbomb.md`) - フリッパーでボールを跳ね上げ、爆弾を誘爆させるゲーム。爆発の連鎖反応がコアメカニクス
- M FIELD (`games/description/m_field.md`) - 地雷を踏んで爆発を起こし、敵を巻き込んで倒すゲーム。爆発のタイミングと位置戦略が重要
- BOMB UP (`games/description/bomb_up.md`) - 爆弾を投げて起爆させ、岩を破壊するゲーム。爆発の反動で自機も移動する
- REFLECTOR (`games/description/reflector.md`) - 爆発を利用して敵を倒すゲーム
- M_JAMMING (`games/description/m_jamming.md`) - 爆発を利用した敵の消去ゲーム
- MORTAR (`games/description/mortar.md`) - 爆発を利用した砲撃ゲーム
- SIGHT ON (`games/description/sight_on.md`) - 爆発を利用した照準ゲーム