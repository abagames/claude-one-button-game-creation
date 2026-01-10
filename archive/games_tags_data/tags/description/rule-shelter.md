# rule-shelter

**カテゴリ**: rule | **優先度**: minimal | **代表例**: D LASER

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | カバーの後ろに隠れるルール構造 |
| 詳細     | 避けにくい攻撃をカバーを使って回避する。安全地帯を活用して生存時間を延ばし、戦略的な位置取りを行う |
| リスク   | カバーの位置把握の失敗、安全地帯からの脱出タイミングの誤り、カバー利用の非効率性 |
| リワード | カバー活用による安全な生存、カバー位置の習得による効率的な回避、カバーと攻撃パターンの組み合わせによる戦略的な操作 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-gauge_management, on_holding-stop, field-auto_scroll, weapon-ray, obstacle-chase |
| 排他   | rule-exposed（カバーと矛盾） |
| 依存   | -（単独で機能するが、回避要素を持つメカニクスと組み合わせると効果的） |

## 実装例

```js
// d_laser.js L73-86, L117-135 より
// シールドでレーザーから隠れるメカニクス
// シールドの移動と配置
remove(shields, (s) => {
  s.pos.y += scr;  // スクロール
  if (abs(s.pos.x - s.tx) < 1) {
    s.pos.x = s.tx;  // 目標位置に到達
    color("blue");   // 配置完了=青
  } else {
    s.pos.x += (s.tx - s.pos.x) * 0.2;  // 目標へ移動中
    color("light_blue");
  }
  box(s.pos, 8, 4);  // シールドを描画
  color("black");
  char("c", s.pos.x, s.pos.y + 4);  // シールドの装飾
  return s.pos.y > 99;
});

// レーザーがシールドで止まる判定
lasers.forEach((l) => {
  if (l.isHit) {
    l.pos.y += scr;  // 止まったレーザーはスクロール
  } else {
    l.pos.y += sqrt(difficulty) * 9;  // レーザー伸長
    color("transparent");
    // シールド(青)との衝突判定
    if (rect(l.pos.x, 10, 10, l.pos.y).isColliding.rect.blue) {
      l.isHit = true;  // シールドに当たった
      // シールドの位置まで戻す
      for (let i = 0; i < 99; i++) {
        l.pos.y--;
        if (!rect(l.pos.x, 10, 10, l.pos.y).isColliding.rect.blue) {
          break;
        }
      }
    }
  }
  color("red");
  rect(l.pos.x, 10, 10, l.pos.y);  // レーザー描画
});
```

**参考**: `games/src/d_laser.js`: L73-L86, L117-L135

## 使用例ゲーム

このタグを使用しているゲーム:

- D LASER (`games/description/d_laser.md`) - レーザーカバーゲーム