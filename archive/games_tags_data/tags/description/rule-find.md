# rule-find

**カテゴリ**: rule | **優先度**: minimal | **代表例**: FIND A STAR

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 対象のオブジェクトを区別・発見するルール構造 |
| 詳細     | ヒントに基づいて対象の位置を探す。特定の条件を満たすオブジェクトを見つけ出し、適切な行動を取る必要がある |
| リスク   | 対象の見落とし、ヒントの誤解釈、探索の非効率性 |
| リワード | 対象発見による報酬の獲得、探索スキルの習得による効率的な進行、ヒント活用による戦略的な操作 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-classify, player-limited_vision, field-multiple, obstacle-foresee |
| 排他   | rule-random（発見と矛盾） |
| 依存   | -（単独で機能するが、探索要素を持つメカニクスと組み合わせると効果的） |

## 実装例

```js
// zone_b.js L161-194 より
// 視界範囲内の敵を発見・撃破するメカニクス
const shownRange = 30;  // 発見可能範囲

remove(enemies, (e) => {
  const av = angleVels[e.angle];
  e.pos.add(av[0] * e.speed, av[1] * e.speed);

  // 視界範囲内かチェック（発見判定）
  const isShown = e.pos.distanceTo(player.pos) < shownRange;

  if (isShown) {
    color("black");
    char("b", e.pos.x + av[0] * 2, e.pos.y + av[1] * 2, {
      rotation: e.angle,
    });
  }

  // 発見状態に応じて表示/非表示
  color(isShown ? "red" : "transparent");
  const c = char("a", e.pos, { rotation: e.angle }).isColliding;

  // 発見した敵を撃破
  if (c.char.d) {
    play("explosion");
    addScore(multiplier, e.pos);
    multiplier++;
    return true;
  }
});

// 弾丸も視界範囲で表示/非表示
remove(bullets, (b) => {
  const isShown =
    b.side === "player" || b.pos.distanceTo(player.pos) < shownRange;
  color(isShown ? (b.side === "enemy" ? "purple" : "cyan") : "transparent");
  // ...
});
```

**参考**: `games/src/zone_b.js`: L161-L194（視界制限による発見メカニクス）

## 使用例ゲーム

このタグを使用しているゲーム:

- FIND A STAR (`games/description/find_a_star.md`) - 対象発見ゲーム
- 類似メカニクスを含むゲーム: ZONE B (player-limited_vision), MORTAR (player-limited_vision)