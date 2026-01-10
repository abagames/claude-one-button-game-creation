# rule-surround

**カテゴリ**: rule | **優先度**: minimal | **代表例**: TT FENCE

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | ブロックやひもで囲むルール構造 |
| 詳細     | ブロックやひもで囲まれた空間を作成する。特定の領域を囲むことや、大きな領域を囲んでより多くの報酬を得ることを目指すなどの追加ルールを検討できる |
| リスク   | 囲い込みの失敗、領域判定の誤り、囲い込み戦略の非効率性 |
| リワード | 囲い込みスキルの習得による効率的な領域確保、囲い込みパターンの習得による戦略的な操作、囲い込み成功による報酬の獲得 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | player-bar, rule-chain, field-pins, player-scaffold, rule-mathematics |
| 排他   | field-auto_scroll（囲い込みと矛盾） |
| 依存   | -（単独で機能するが、囲い込み要素を持つメカニクスと組み合わせると効果的） |

## 実装例

```js
// tt_fence.js L255-313 より
// 囲い込み領域を検出して爆発させるメカニクス
function bomb() {
  let bc = 0;
  let bp = vec();
  bombAnimGrid = times(gridSize, () => times(gridSize, () => false));
  const p = vec();

  // 囲まれた空きマスを検出（bombEdgeGridで外周から到達不可）
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      p.set(x, y);
      if (canPlaceGrid(p) && !bombEdgeGrid[x][y]) {  // 囲まれたマス
        // 周囲のブロックを爆発対象に
        angleOfs.forEach(([ox, oy]) => {
          if (!bombAnimGrid[x + ox][y + oy]) {
            bombAnimGrid[x + ox][y + oy] = true;
            bc++;
            bp.add(x + ox, y + oy);
          }
        });
      }
    }
  }

  // 爆発の連鎖（囲い込みサイズに応じて拡大）
  for (let i = 0; i < floor(sqrt(bc) * 0.5); i++) {
    // 隣接ブロックにも爆発を拡大
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (bombAnimGrid[x][y]) {
          angleOfs.forEach(([ox, oy]) => {
            p.set(x + ox, y + oy);
            if (existsGrid(p) && !bombAnimGrid[p.x][p.y]) {
              bombAnimGrid[p.x][p.y] = true;
              bc++;
            }
          });
        }
      }
    }
  }

  // 爆発処理とスコア計算
  if (bc > 0) {
    play("explosion");
    bp.div(bc);
    const sc = ceil(bc * sqrt(bc));  // 囲い込みサイズの1.5乗
    addScore(sc, (bp.x - gridSize / 2) * 6 + 53, (bp.y - gridSize / 2) * 6 + 56);
    damageTarget = clamp(damageTarget - sc * 0.1, 0, 99);  // ダメージ減少
  }
}
```

**参考**: `games/src/tt_fence.js`: L255-L313

## 使用例ゲーム

このタグを使用しているゲーム:

- TT FENCE (`games/description/tt_fence.md`) - ブロック囲い込みゲーム