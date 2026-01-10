# rule-proximity_bonus

**カテゴリ**: rule | **優先度**: low | **代表例**: L RAIN

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | リスクに近づくとポイントが得られる。障害物の近くにボーナスアイテムを配置し、障害物に近づくとポイントや資源を得る。リスクとリターンのバランスを取る手段として利用する。 |
| 詳細     | プレイヤーは危険な場所に近づくことで、ボーナスや高得点が得られる。リスクとリターンのバランスを考慮した戦略的なプレイが求められる。 |
| リスク   | 危険に近づきすぎると、ゲームオーバーになるリスクがある。 |
| リワード | 危険に近づくことで、高得点やボーナスが得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-combo_multiplier, field-weather, on_pressed-turn |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// thunder.js L79-101, L142-158 より
// 雷が近くで落ちるほど多くの星が発生する近接ボーナス
remove(lines, (l) => {
  l.ticks--;
  if (activeTicks > 0) {
    if (l.ticks > 0) {
      // 雷の到達点で星を生成（近接ボーナスの源）
      stars.push({ pos: vec(l.to), vel: vec(0, -l.to.y * 0.02) });
    }
    return true;
  }
  if (l.ticks > 0) {
    l.to.add(l.vel);
    // 雷が地面に到達
    if (activeTicks < 0 && (l.to.y > 90 || lines.length > 160)) {
      play("explosion");
      let al = l;
      color("yellow");
      for (let i = 0; i < 99; i++) {
        particle(al.to, 30, 2);
        al.isActive = true;
        al = al.prevLine;
        if (al == null) { break; }
      }
      activeTicks = ceil(20 / sqrt(difficulty));
      multiplier = 1;  // マルチプライヤーリセット
    }
  }
});

// 星を回収してスコア獲得（連続で拾うほどマルチプライヤー上昇）
remove(stars, (s) => {
  s.vel.y += 0.1 * difficulty;
  s.pos.add(s.vel);
  const c = char("a", s.pos).isColliding.char;
  if (c.b || c.c) {  // プレイヤーと衝突
    play("coin");
    addScore(multiplier, s.pos);  // 近接ボーナス：連続で拾うほど高得点
    multiplier++;
    return true;
  }
});
```

**参考**: `games/src/thunder.js`: L79-L101, L142-L158

## 使用例ゲーム

このタグを使用しているゲーム:

- THUNDER (`games/description/thunder.md`)
- METEO PLANET (`games/description/meteo_planet.md`)
- SLASHES (`games/description/slashes.md`)