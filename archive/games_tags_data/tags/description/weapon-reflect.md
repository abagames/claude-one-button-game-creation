# weapon-reflect

**カテゴリ**: weapon | **優先度**: minimal | **代表例**: RAID

## 概要

| 項目     | 内容                                                                                               |
| :------- | :------------------------------------------------------------------------------------------------- |
| 要約     | 発射物が壁で反射する                                                                               |
| 詳細     | 弾や爆弾が画面端や壁に当たると跳ね返り、障害物の背後や遠距離の敵を攻撃できる                       |
| リスク   | 反射軌道の計算ミスで敵に命中しない、または意図しない方向に飛ぶ                                     |
| リワード | 反射を利用した間接攻撃により戦略的な敵配置への対応が可能、角度調整の習熟が攻略の鍵                 |

## タグ相性

| 関係   | タグ                                                 |
| :----- | :--------------------------------------------------- |
| 相性良 | weapon-artillery, on_holding-adjust_angle, field-holes |
| 排他   | weapon-homing（自動追尾とは相反）                    |
| 依存   | なし                                                 |

## 実装例

```js
// RAID より抜粋
// 爆弾が画面左右端で反射する
if (bomb != null) {
  bomb.vel.y += 0.1;  // 重力による加速
  bomb.vel.mul(0.99);
  bomb.pos.add(bomb.vel);
  bomb.pos.y -= scr;
  color("red");
  bar(bomb.pos, 3, 3, bomb.vel.angle);
  if (
    (bomb.pos.x < 0 && bomb.vel.x < 0) ||
    (bomb.pos.x > 99 && bomb.vel.x > 0)
  ) {
    bomb.vel.x *= -1;  // 壁での反射
  }
}
```

**参考**: `games/src/raid.js`: L119-L135

## 使用例ゲーム

このタグを使用しているゲーム:

- RAID (`games/description/raid.md`) - 爆弾が壁で反射しながら落下、建物を破壊
- PAINT BALL (`games/description/paint_ball.md`) - 黄色いボールが壁で反射しながらグリッドを塗る
- ZONE B (`games/description/zone_b.md`) - プレイヤーと敵が壁で反射しながら移動
