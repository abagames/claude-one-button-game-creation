# weapon-vertical

**カテゴリ**: weapon | **優先度**: low | **代表例**: FOOT LASER

## 概要

| 項目     | 内容                                                                                               |
| :------- | :------------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーが前方以外の方向（上下など垂直方向）に攻撃を発射する                                     |
| 詳細     | 通常の横方向ではなく、上方や下方に弾やレーザーを発射することで、落下物や空中敵など異なる角度の敵を攻撃できる |
| リスク   | 前方の敵には直接対応できず、位置取りやタイミングが重要になる                                       |
| リワード | 独特な攻撃軸により、敵の配置パターンやステージ設計に多様性が生まれる                               |

## タグ相性

| 関係   | タグ                                                    |
| :----- | :------------------------------------------------------ |
| 相性良 | on_pressed-jump, on_holding-shoot, obstacle-fall        |
| 排他   | なし                                                    |
| 依存   | なし                                                    |

## 実装例

```js
// FOOT LASER より抜粋
// 空中にいる間、足元から地面まで垂直にレーザーを描画
if (!player.isOnFloor) {
  color("light_blue");
  rect(player.pos.x + 2, player.pos.y, 2, floorHeight - player.pos.y);
}
// ...
// レーザーとの衝突判定で敵を撃破
if (c.rect.light_blue) {
  play("coin");
  addScore(player.multiplier, e.pos.x + player.multiplier * 2, e.pos.y);
  particle(e.pos.x + 2, e.pos.y, 3, 2, -PI / 2, PI);
  player.multiplier++;
  return true;
}
```

**参考**: `games/src/foot_laser.js`: L143-L146, L193-L198

## 使用例ゲーム

このタグを使用しているゲーム:

- FOOT LASER (`games/description/foot_laser.md`) - 空中で足元から地面まで垂直レーザーを発射、下の敵を自動攻撃
- UP SHOT (`games/description/up_shot.md`) - 長押しで停止し上方向に連射、落下する岩を破壊
- REFLECTOR (`games/description/reflector.md`) - 反射弾が縦方向にも飛び、様々な角度で戦車を攻撃
- R WHEEL (`games/description/r_wheel.md`) - 車輪から上下に弾を発射
