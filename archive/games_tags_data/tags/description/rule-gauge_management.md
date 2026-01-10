# rule-gauge_management

**カテゴリ**: rule | **優先度**: low | **代表例**: D LASER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 圧力下で上昇または下降するゲージを管理する。プレイヤーは共有メーターを監視し、失敗しきい値に達する前に空にするか補充する行動を取る。 |
| 詳細     | プレイヤーはゲージの状態を常に監視し、適切なタイミングでアクションを取る必要がある。ゲージが一定値を超えるとペナルティが発生する。 |
| リスク   | ゲージ管理に失敗すると、ゲームオーバーになるか、ペナルティが発生するリスクがある。 |
| リワード | ゲージを適切に管理することで、安定した進行やボーナスが得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-time_limit, on_pressed-attack, obstacle-well_up |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// g_press.js L82-152 より
// 水位ゲージの管理メカニクス
// 泡が生成されると水位上昇
nextBubbleTicks--;
if (nextBubbleTicks < 0) {
  const size = rnd(5, 9);
  bubbles.push({
    pos: vec(rnd(20 + size, 80 - size), waterY + size / 2),
    vel: vec(0, (-rnd(1, 2) / size) * difficulty),
    size,
  });
  targetWaterY += size * 0.03;  // 水位目標値上昇
  nextBubbleTicks += rnd(10, 50) / difficulty;
}

// ドロップが水に落ちると水位下降
remove(drops, (d) => {
  d.vel.y += difficulty * 0.1;
  d.pos.add(d.vel);
  box(d.pos, 2);
  if (d.pos.y > waterY + 1) {
    dropTicks = 9 / difficulty;
    play("laser");
    targetWaterY -= 0.35;  // 水位目標値下降
    return true;
  }
});

// 水位がゲージ最大値に達したらゲームオーバー
waterY += (targetWaterY - waterY) * 0.2;  // 実際の水位を目標に近づける
color("purple");
rect(0, waterY, 100, 101 - waterY);  // 水面を描画
if (
  press.vw === 0 &&
  drops.length === 0 &&
  waterY >= 100 &&
  targetWaterY >= 100
) {
  play("lucky");
  end();  // 水位が画面外に達したらゲームオーバー
}
```

**参考**: `games/src/g_press.js`: L82-L152

## 使用例ゲーム

このタグを使用しているゲーム:

- D LASER (`games/description/d_laser.md`)
- G PRESS (`games/description/g_press.md`)