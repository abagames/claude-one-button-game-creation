# on_pressed-jump_into_another

**カテゴリ**: on_pressed | **優先度**: low | **代表例**: CYWALL

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ボタン押下時に次のウェイポイントに飛び移る（テレポート） |
| 詳細     | 次のウェイポイントはピンでマークされているため、そこに移動するのが安全かどうかを評価し、正確なタイミングでテレポートを実行する必要がある |
| リスク   | 安全でないウェイポイントへのテレポートによる即時ゲームオーバー |
| リワード | 危険なエリアの迅速な回避と効率的な進行 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | field-pins, player-bar, rule-proximity_bonus |
| 排他   | on_pressed-select_route（テレポートとルート選択の競合） |
| 依存   | field-pins（ウェイポイントがピンでマークされる前提） |

## 実装例

```js
// cywall.js L59-73 より
// ボタン押下で次のウェイポイント（円）にジャンプ
if (playerCircle.next != null && input.isJustPressed) {
  // 移動経路上に障害物（赤い壁）があるかチェック
  if (line(playerCircle.p, playerCircle.next.p, 3).isColliding.rect["red"]) {
    play("explosion");
    end();  // 障害物に接触してゲームオーバー
  } else {
    play("coin");
    // 移動エフェクト（パーティクルを経路に沿って生成）
    const p = vec(playerCircle.p);
    const o = vec(playerCircle.next.p).sub(playerCircle.p).div(9);
    const a = o.angle;
    times(9, (i) => {
      particle(p, 4, 2, a + PI, 0.5);
      p.add(o);
    });
  }
  playerCircle = playerCircle.next;  // 次のウェイポイントに移動
}
```

**参考**: `games/src/cywall.js`: L59-L73

## 使用例ゲーム

このタグを使用しているゲーム:

- AERIAL BAR (`games/description/aerial_bar.md`)
- PORTAL J (`games/description/portal_j.md`)
- CYWALL (`games/description/cywall.md`)
- ZARTAN (`games/description/zartan.md`)