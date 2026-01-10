# field-outpost

**カテゴリ**: field | **優先度**: high | **代表例**: HEXMIN

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 敵やアイテムに到達するとゲームオーバーになる防衛ポイントがあるフィールド構造 |
| 詳細     | プレイヤーキャラクターが倒されるだけでなく、他のゲームオーバー条件を設定することも可能。時間制限など、プレイヤーが敵の配置を考慮して対応する必要がある複雑さをゲームに加える |
| リスク   | 防衛ポイントへの敵到達、誤射による味方へのダメージ、複数方向からの同時攻撃 |
| リワード | 連続防衛によるスコア倍率上昇、効率的な敵処理による時間稼ぎ、戦略的優先順位判断による高得点 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-multiple, on_pressed-turn, weapon-wipe, rule-classify |
| 排他   | field-auto_scroll（防衛ポイントが動的に変化しすぎる） |
| 依存   | -（単独で機能するが、防衛メカニクスと組み合わせると効果的） |

## 実装例

```js
// hexmin.js L51-96 より
// 6方向から敵が中心に向かって接近（laneChangeTicks毎に進む）
laneChangeTicks--;
if (laneChangeTicks < 0) {
  for (let i = 0; i < 6; i++) {
    let l = lanes[i];
    if (l.value > 0) {
      play("hit");
      l.value++;  // 敵が中心に一歩近づく
      if (l.value > 4) {  // 中心到達でゲームオーバー
        play("explosion");
        end();
      }
    }
  }
  // 新しい敵をランダムなレーンに追加
  nextLaneAddingCount--;
  if (nextLaneAddingCount < 0) {
    let li = rndi(6);
    for (let i = 0; i < 6; i++) {
      const l = lanes[li];
      if (l.value === 0) {
        l.value = 1;  // 敵を配置
        break;
      }
      li = wrap(li + 1, 0, 6);
    }
  }
}
// 矢印方向の敵を消去
lanes.forEach((l, j) => {
  if (l.value === 4) {  // 中心直前の敵
    const oa = wrap(j - arrowAngle, 0, 6);
    if (oa === 0 || oa === 2) {  // 矢印方向と一致
      play("coin");
      addScore(multiplier, 50, 50);
      l.value = 0;  // 敵を消去
    }
  }
});
```

**参考**: `games/src/hexmin.js`: L51-L96

## 使用例ゲーム

このタグを使用しているゲーム:

- HEXMIN (`games/description/hexmin.md`) - 六角形防衛、6方向からの敵接近
- LASER FORTRESS (`games/description/laser_fortress.md`) - 基地防衛、敵味方識別
- PAINT BALL (`games/description/paint_ball.md`) - 砲台防衛、陣地塗り替え
- S_SHAKE (`games/description/s_shake.md`) - フィールド変化防衛
- WIPER (`games/description/wiper.md`) - 連鎖爆発防衛