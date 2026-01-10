# on_holding-charge

**カテゴリ**: on_holding | **優先度**: minimal | **代表例**: CHARGE BEAM

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | エネルギーをチャージする |
| 詳細     | 必要なエネルギーをチャージし、ボタンを離すと攻撃を実行する |
| リスク   | チャージ中の無防備状態での被弾 |
| リワード | 溜めた分だけ強力な攻撃が可能 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | on_released-throw, weapon-explosion |
| 排他   | on_holding-move（チャージ中に移動すると狙いがブレる） |
| 依存   | 特になし |

## 実装例

```js
// charge_beam.js L80-111 より
// 長押しでチャージ蓄積、離すとチャージレベルに応じた弾を発射
if (shotX == null) {
  text("BEAM", 30, 55);
  if (input.isPressed && charge < 99) {
    play("hit");
    charge += difficulty * 1.5;  // チャージ蓄積
    color("cyan");
    let c = charge;
    let x = 60;
    if (c < 25) {
      rect(x, 53, c, 5);  // チャージゲージ表示
      shotSize = 1;
    } else {
      rect(x, 53, 25, 5);
      c -= 25;
      x += 27;
      shotSize = 1;
      while (c > 9) {
        rect(x, 53, 9, 5);
        x += 11;
        c -= 9;
        shotSize++;  // チャージ量に応じて弾サイズ増加
      }
      rect(x, 53, c, 5);
      shotSize++;
    }
    color("black");
  } else if (charge > 0) {
    play("laser");
    shotX = 10;  // チャージ解放、弾発射
    charge = 0;
  }
}
```

**参考**: `games/src/charge_beam.js`: L80-L111

## 使用例ゲーム

このタグを使用しているゲーム:

- CHARGE BEAM (`games/description/charge_beam.md`)
