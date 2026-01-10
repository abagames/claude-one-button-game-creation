# rule-classify

**カテゴリ**: rule | **優先度**: low | **代表例**: BOARDING

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | キャラクターを分類するルール構造 |
| 詳細     | 各キャラクターの分類を確認しながら適切な行動を取る。属性や特性に基づいて適切な処理を行う必要がある |
| リスク   | 分類の誤判断、属性の見落とし、適切な行動の選択失敗 |
| リワード | 分類スキルの習得による効率的な進行、属性活用による戦略的な操作、適切な行動選択による報酬の獲得 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-match, rule-physics, field-pins, on_pressed-reverse_state, player-multiple |
| 排他   | rule-random（分類と矛盾） |
| 依存   | -（単独で機能するが、分類要素を持つメカニクスと組み合わせると効果的） |

## 実装例

```js
// boarding.js L163-220 より
// 乗客を赤/青ゲートに分類するメカニクス
passengers = passengers.filter((p) => {
  p.vel.y += 0.2;
  p.vel.mul(0.9);
  p.prevPos.set(p.pos);
  p.pos.add(p.vel);
  color(p.type < 0 ? "red" : "blue");  // 乗客の色（type: -1=赤, 1=青）
  const c = char(addWithCharCode("a", p.type + 1 + (floor(ticks / 30) % 2)), p.pos)
    .isColliding.char;

  // 板に当たって跳ね返り
  if (c.e || c.f) {
    p.bc++;  // バウンス回数をカウント
  }

  // ゲートに到達（y > gy）
  if (p.pos.y > gy) {
    // 分類判定: x座標と乗客タイプで正しいゲートかチェック
    const isOk = (p.pos.x - 50) * p.type > 0;  // 左半分=赤、右半分=青
    if (isOk) {
      // 正しい分類
      if (p.bc > 0) {
        play("powerUp");
        addScore(p.bc, p.pos);  // バウンス回数に応じたスコア
        const oy = p.bc * 2 * difficulty;
        tgy += oy;  // ゲート位置下降（余裕増加）
      }
      return false;
    } else {
      // 誤った分類
      play("hit");
      addScore(-1 - p.bc, p.pos);  // ペナルティ
      let oy = sqrt(1 + p.bc) * difficulty;
      tgy -= oy;  // ゲート位置上昇（危険）
      return false;
    }
  }
  return true;
});
```

**参考**: `games/src/boarding.js`: L163-L220

## 使用例ゲーム

このタグを使用しているゲーム:

- BOARDING (`games/description/boarding.md`) - 色分類ゲーム
- LASER FORTRESS (`games/description/laser_fortress.md`) - レーザー分類ゲーム
- TEETER (`games/description/teeter.md`) - バランス分類ゲーム