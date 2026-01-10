# field-bottomless

**カテゴリ**: field | **優先度**: medium | **代表例**: M RIDER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | キャラクターが画面下に落ちるとゲームオーバーになる。 |
| 詳細     | 落下しないように、地形を利用して巧みに移動し、落ちないようにする必要がある。 |
| リスク   | 落下すると即座にゲームオーバーになる。 |
| リワード | 落下を回避することで、生存時間が延長され、高スコアが得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_pressed-jump, field-floors | ジャンプで落下を防ぐ。プラットフォームを利用して安全な足場を確保する。 |
| 排他   | - | - |
| 依存   | - | - |

## 実装例

```js
// m_rider.js L91-93 より
// 画面下に落ちたらゲームオーバー
if ((rider.missile != null && rider.pos.y < -1) || rider.pos.y > 99) {
  play("explosion");
  end();
}

// floors_5.js L184-187 も同様
if (car.pos.y > 99) {
  play("explosion");
  end();
}
```

**参考**: `games/src/m_rider.js`: L91-L93, `games/src/floors_5.js`: L184-L187

## 使用例ゲーム

このタグを使用しているゲーム:

- M RIDER (`games/description/m_rider.md`)
- CATAPULT (`games/description/catapult.md`)
- HOLES (`games/description/holes.md`)
- MIRROR FLOOR (`games/description/mirror_floor.md`)
- TILTED (`games/description/tilted.md`)
- FLOORS 5 (`games/description/floors_5.md`)
- FLOATER (`games/description/floater.md`)
- GOLFME (`games/description/golfme.md`)
- ZARTAN (`games/description/zartan.md`)
- JUJUMP (`games/description/jujump.md`)
- REFBALS (`games/description/refbals.md`)