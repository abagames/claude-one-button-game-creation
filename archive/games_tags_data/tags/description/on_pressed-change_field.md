# on_pressed-change_field

**カテゴリ**: on_pressed | **優先度**: minimal | **代表例**: S SHAKE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン押下時にフィールドを変化させる |
| 詳細     | オブジェクトの動作をフィールドを変化させることで変更する |
| リスク   | フィールド変化による予期せぬオブジェクト動作 |
| リワード | 戦略的なフィールド操作によるゲーム状況の制御 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-regenerate, weapon-change_field, rule-chain |
| 排他   | field-auto_scroll（自動スクロールと手動フィールド変化の競合） |
| 依存   | 特になし |

## 実装例

```js
// s_shake.js L53-58, L97-113 より
// ボタン押下でフィールド（地形）を揺らすメカニクス
if (input.isJustPressed) {
  play("jump");
  heightRatio = 3;  // 地形の高さを3倍に変化させる
  multiplier = 1;
}
heightRatio += (1 - heightRatio) * 0.05;  // 徐々に元に戻る

// L97-113: フィールド変化による敵への影響
if (e.isOnGround) {
  if (input.isJustPressed) {
    let vy = 0;
    // 地形変化で敵を押し上げる
    for (let i = 0; i < 99; i++) {
      e.pos.y--;
      vy--;
      if (box(e.pos, 6).isColliding.rect.black) {
        // 地形に当たるまで上昇→空中状態に
        e.vel.y = vy * sqrt(difficulty) * 0.3;
        e.isOnGround = false;
        break;
      }
    }
  }
}
// 敵が画面上に飛び出すとスコア獲得
if (e.pos.y < -3) {
  play("coin");
  addScore(multiplier, e.pos.x, clamp(9 + multiplier * 3, 9, 60));
  multiplier++;
}
```

**参考**: `games/src/s_shake.js`: L53-L58, L97-L156

## 使用例ゲーム

このタグを使用しているゲーム:

- S SHAKE (`games/description/s_shake.md`)