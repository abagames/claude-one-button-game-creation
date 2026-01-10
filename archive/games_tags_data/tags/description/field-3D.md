# field-3D

**カテゴリ**: field | **優先度**: minimal | **代表例**: PILLARS 3D

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 奥行きのある広大な3次元ビューを持つフィールド構造 |
| 詳細     | 遠くまで見える能力を活かして、2Dに比べてより広い範囲にオブジェクトを配置できる。奥行き感や遠近法を活用した視覚表現が可能 |
| リスク   | 奥行き感による距離判断の誤り、遠近法の視覚的混乱、3D空間での位置把握の困難 |
| リワード | 3D空間を活用した広範囲な視野、奥行き感による戦略的な位置取り、遠近法を活用した視覚的な予測 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-auto_scroll, player-follow, weapon-artillery, rule-proximity_bonus |
| 排他   | field-1D（次元制限と矛盾） |
| 依存   | -（単独で機能するが、奥行きを活用するメカニクスと組み合わせると効果的） |

## 実装例

```js
// growth.js L30-78 より
// 擬似3D遠近表現（奥行きに応じたサイズ変化）
let player = { x: 9, vx: 1, size: 5 };
let enemies = [];

// 長押しでプレイヤーサイズ拡大（3D的な存在感）
player.size += ((input.isPressed ? 50 : 5) - player.size) *
  clamp(player.vx, 1, 999) * 0.01;
player.vx += (15 / player.size - 1) * 0.02 * sqrt(difficulty);

// プレイヤーを描画（サイズが3D的な大きさを表現）
color("yellow");
rect(0, floorY, player.x + player.size / 2, -player.size);

// 敵の3D遠近表現
remove(enemies, (e) => {
  e.x -= scr;
  color(e.size > player.size ? "red" : "cyan");

  // x座標に応じてスケーリング（奥にいるほど小さく表示）
  const sc = e.x > 100 ? (e.x - 100) / 300 + 1 : 1;  // 遠近法スケール
  const sz = e.size / sc;  // スケール適用後のサイズ

  const c = rect(e.x / sc, floorY, sz, -sz).isColliding.rect;
  if (c.yellow) {  // プレイヤーとの衝突
    if (e.size > player.size) {
      play("explosion");
      end();  // 大きい敵は負け
    } else {
      play(e.size < 5 ? "hit" : "powerUp");
      particle(e.x, floorY - e.size / 2, ss, ss, 0, PI / 2);
      addScore(ceil(clamp(player.vx, 1, 999) * e.size), e.x, floorY - player.size);
    }
    return true;
  }
});
```

**参考**: `games/src/growth.js`: L30-L78

## 使用例ゲーム

このタグを使用しているゲーム:

- GROWTH (`games/description/growth.md`) - 3D的なサイズ変化ゲーム
- 類似メカニクスを含むゲーム: METEO PLANET (field-space), ORBIT MAN (field-space)