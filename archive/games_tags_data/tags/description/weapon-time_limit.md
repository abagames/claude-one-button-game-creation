# weapon-time_limit

**カテゴリ**: weapon | **優先度**: low | **代表例**: V BOMB

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 設定された時間後に爆発する武器 |
| 詳細     | 敵の動きを予測したり、敵を爆発に誘い込んだりする必要がある。時間制限付きの爆発攻撃を提供する |
| リスク   | 時間内に敵を爆発範囲内に誘導できないと、攻撃が無駄になる可能性がある |
| リワード | 戦略的な敵の誘導とタイミング管理が可能になり、効率的な敵の一掃ができる |

## タグ相性


| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | weapon-explosion, rule-time_limit |
| 排他   | weapon-instant |
| 依存   | なし |

## 実装例

```js
// v_bomb.js L108-146 より
// 爆弾のカウントダウンと爆発処理
remove(bombs, (b) => {
  b.vy += 0.1 * difficulty;
  b.pos.y += b.vy;
  // カウントダウン表示
  color(b.count <= 1 ? "red" : "black");
  let ty = b.pos.y - (10 - b.count) * 2;
  text(`${ceil(b.count)}`, b.pos.x, ty);  // 残り秒数を表示

  // カウントダウン処理
  b.count -= 1 / 60;  // 毎フレーム減少

  // タイマー終了で爆発
  if (b.count <= 0) {
    play("explosion");
    particle(b.pos, 20, 3, -PI / 2, PI / 8);
    explosions.push({ pos: vec(b.pos), height: 6 });  // 爆発エフェクト生成
    return true;
  }
});
```

**参考**: `games/src/v_bomb.js`: L108-L146

## 使用例ゲーム

このタグを使用しているゲーム:

- V BOMB (`games/description/v_bomb.md`)
- M FIELD (`games/description/m_field.md`)