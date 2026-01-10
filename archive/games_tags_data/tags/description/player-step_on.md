# player-step_on

**カテゴリ**: player | **優先度**: low | **代表例**: UP DOWN PRESS

## 概要

| 項目     | 内容                                                                                               |
| :------- | :------------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが敵を踏みつけることができる                                                 |
| 詳細     | 上から敵を踏みつけるタイミングを取ることで、敵を倒したりスコアを得たりするリターンを得られる       |
| リスク   | 踏みつけに失敗すると側面や下から衝突し、ゲームオーバーやダメージを受ける                           |
| リワード | 正確なジャンプタイミングと落下位置の調整で高スコアを得られ、連続踏みつけでマルチプライヤー増加     |

## タグ相性

| 関係   | タグ                                                   |
| :----- | :----------------------------------------------------- |
| 相性良 | on_pressed-jump, field-auto_scroll, rule-combo_multiplier |
| 排他   | なし                                                   |
| 依存   | on_pressed-jump（踏みつけにはジャンプが必要）          |

## 実装例

```js
// UP DOWN PRESS より抜粋
// ジャンプ下降中かつ車に接触した場合に踏みつけ判定
const isPressing = myCar.state === "jump" && myCar.vy >= 0;
if (isPressing && (cl.cyan || cl.blue)) {
  play("powerUp");
  addScore(multiplier, p);
  if (multiplier < 16) {
    multiplier *= 2;  // マルチプライヤー倍増
  }
  particle(p);
  myCar.vy = -2;  // 踏みつけ後に再ジャンプ
  return true;    // 踏みつけた車を消去
}
```

**参考**: `games/src/up_down_press.js`: L167-L177

## 使用例ゲーム

このタグを使用しているゲーム:

- UP DOWN PRESS (`games/description/up_down_press.md`) - ジャンプ下降中に他の車を踏むとスコア獲得、マルチプライヤー倍増
- M FIELD (`games/description/m_field.md`) - 敵を上から踏むと反発、横や下から接触するとゲームオーバー
