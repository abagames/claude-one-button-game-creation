# player-reciprocate

**カテゴリ**: player | **優先度**: low | **代表例**: BALL TOUR

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが水平または垂直に往復運動する                                          |
| 詳細     | プレイヤーが自動的にサイン波や線形運動で往復し、直接的な位置制御ができない。プレイヤーは移動パターンを予測しながら、速度調整や発射タイミングなどで間接的に制御する必要がある |
| リスク   | 往復のリズムを読み誤ると、障害物や敵弾に衝突する。速度上昇により判断時間が短縮される          |
| リワード | 往復パターンを習熟すると、最適なタイミングで攻撃や回避を実行できる。リズム感覚が重要な技術となる |

## タグ相性

| 関係   | タグ                                                              |
| :----- | :---------------------------------------------------------------- |
| 相性良 | on_holding-move, on_holding-adjust_angle, on_released-throw       |
| 排他   | なし                                                              |
| 依存   | なし                                                              |

## 実装例

```js
// BALL TOUR より抜粋
// サイン波で自動的に上下往復
player.yAngle += difficulty * 0.05;
player.pos.y = sin(player.yAngle) * 30 + 50;
```

**参考**: `games/src/ball_tour.js`: L88-L89

```js
// TR BEAM より抜粋
// UFOがsin波で往復
// x = sin(angle)*40+50, angle += 0.03√d
```

**参考**: `games/description/tr_beam.md`

## 使用例ゲーム

このタグを使用しているゲーム:

- BALL TOUR (`games/description/ball_tour.md`) - サイン波で上下に往復しながらボールを収集、スパイクを回避
- REFLECTOR (`games/description/reflector.md`) - UFOが左右に往復、反射板で敵弾を跳ね返す
- THROW M (`games/description/throw_m.md`) - 右端で上下往復しながら放物線砲撃で敵を攻撃
- EMBATTLED (`games/description/embattled.md`) - 自動で上下に往復、敵陣営同士の誤射を誘発
- TR BEAM (`games/description/tr_beam.md`) - UFOがsin波で往復、トラクタービームでボール引き寄せ
