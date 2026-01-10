# weapon-artillery

**カテゴリ**: weapon | **優先度**: low | **代表例**: THROW M

## 概要

| 項目     | 内容                                                                                               |
| :------- | :------------------------------------------------------------------------------------------------- |
| 要約     | 発射物が重力の影響で放物線軌道を描く                                                               |
| 詳細     | 砲弾・手榴弾・釣り針などが重力加速度の影響を受けて弧を描き、発射角度と初速によって着弾点が変化する |
| リスク   | 角度や力の調整ミスで的を外す、弾道予測の失敗                                                       |
| リワード | 弾道計算能力の習熟、精密照準による遠距離ターゲットへの狙撃成功                                     |

## タグ相性

| 関係   | タグ                                                      |
| :----- | :-------------------------------------------------------- |
| 相性良 | on_holding-adjust_angle, on_released-throw, rule-physics  |
| 排他   | weapon-homing（自動追尾とは相反）                         |
| 依存   | なし                                                      |

## 実装例

```js
// THROW M より抜粋
// 発射物に重力を加算し放物線軌道を実現
remove(shots, (s) => {
  s.pos.add(s.vel);
  s.vel.y += difficulty * 0.07;  // 重力による加速度
  char("e", s.pos);
  return s.pos.y > 103;  // 画面外で消滅
});
// ...
// 角度に基づいて初速ベクトルを設定
shots.push({
  pos: vec(player.pos),
  vel: vec().addWithAngle(player.fireAngle, sqrt(difficulty) * 3),
});
```

**参考**: `games/src/throw_m.js`: L85-L90, L180-L183

## 使用例ゲーム

このタグを使用しているゲーム:

- THROW M (`games/description/throw_m.md`) - 放物線砲撃で敵を撃破、角度調整と重力計算
- GRENADIER (`games/description/grenadier.md`) - 手榴弾を放物線で投擲、着弾点に新しい穴を生成
- CAST N (`games/description/cast_n.md`) - 釣り糸を放物線で投げ、水中で減速する物理挙動
- NUMBER BALL (`games/description/number_ball.md`) - 数字ボールを放物線で投げて合体させる
- RAID (`games/description/raid.md`) - 敵拠点への放物線爆撃
