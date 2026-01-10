# obstacle-fall

**カテゴリ**: obstacle | **優先度**: low | **代表例**: TAPE J

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 高さから降下する障害物 |
| 詳細     | 障害物を避けたり破壊したりする必要がある。上方から降下してくる障害物に対する回避行動が求められる |
| リスク   | 落下してくる障害物のタイミングや位置を誤ると、回避に失敗する可能性がある |
| リワード | 落下パターンを読み取る能力が向上し、予測に基づいた戦略的な移動が可能になる |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-auto_scroll, on_pressed-jump |
| 排他   | obstacle-well_up |
| 依存   | なし |

## 実装例

```js
// meteo_planet.js L83-104 より
// 落下障害物を一定間隔で生成
nextFallingsTicks--;
if (nextFallingsTicks < 0) {
  const cc = rndi(6);
  let dist = 70;
  let angle = nextFallingAngle * (PI / 2);
  times(11, (i) => {
    let type = abs(i - 5);
    if (type <= cc) {
      fallings.push({ dist, angle, type: type === 0 ? 0 : cc - type + 1 });
    }
    dist += 6;
  });
  nextFallingsTicks = rnd(30, 50) / sqrt(sd);
}

// L103-128: 落下物の移動とプレイヤーとの衝突
remove(fallings, (f) => {
  f.dist -= 0.5 * sd;  // プレイヤーに向かって接近
  fp.set(50, 50).addWithAngle(f.angle - angle, f.dist);
  if (f.type === 0) {
    const c = char("c", fp).isColliding.char;
    if (c.a || c.b) {
      play("explosion");
      end();  // 障害物と衝突でゲームオーバー
    }
  }
});
```

**参考**: `games/src/meteo_planet.js`: L83-L104, L103-L128

## 使用例ゲーム

このタグを使用しているゲーム:

- TAPE J (`games/description/tape_j.md`)
- METEO PLANET (`games/description/meteo_planet.md`)
- UP SHOT (`games/description/up_shot.md`)
- WIPER (`games/description/wiper.md`)