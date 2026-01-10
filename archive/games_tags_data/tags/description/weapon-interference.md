# weapon-interference

**カテゴリ**: weapon | **優先度**: low | **代表例**: COUNTER B

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 敵の攻撃を妨害する武器 |
| 詳細     | 敵の攻撃と同時に自分の攻撃を行うタイミングを計る。敵の攻撃をキャンセルしたり、妨害したりする効果を持つ |
| リスク   | 妨害のタイミングを誤ると、逆効果になる可能性がある |
| リワード | 敵の攻撃を効果的に無効化できるため、防御と攻撃のバランスが向上する |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-friendly_fire, on_pressed-shoot |
| 排他   | weapon-auto_aiming |
| 依存   | なし |

## 実装例

```js
// counter_b.js L148-156 より
// プレイヤーのビームと敵のビームが衝突するとカウンター発動
const c = box(bp, 5).isColliding.rect;
if (counter.pos == null && c.cyan) {  // プレイヤービーム(cyan)と衝突
  play("powerUp");
  multiplier = 1;
  counter.pos = vec(player.pos.x + player.beamLength, player.pos.y);
  counter.enemy = e;  // 敵をカウンター対象に
  counter.radius = 1;
  color("purple");
  particle(counter.pos, 30, 5);
}

// L164-178: カウンター球で敵を撃破
const c = bar(e.pos, 2, 3, e.angle).isColliding.rect;
if (c.purple || c.light_cyan) {  // カウンター球(purple)に触れた敵を撃破
  play("coin");
  addScore(multiplier, e.pos);
  multiplier *= 2;
  return true;
}
```

**参考**: `games/src/counter_b.js`: L148-L156, L164-L178

## 使用例ゲーム

このタグを使用しているゲーム:

- COUNTER B (`games/description/counter_b.md`)
- REFLECTOR (`games/description/reflector.md`)