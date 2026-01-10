# rule-mathematics

**カテゴリ**: rule | **優先度**: low | **代表例**: DANGO

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 数学的要素や数値に関わる。数値を等しくすることや、数式を含む計算を実行するタスクが含まれる。 |
| 詳細     | プレイヤーは数字や数式を操作して計算を行い、特定の条件を満たす必要がある。加減乗除などの基本的な数学演算がゲームメカニクスに組み込まれる。 |
| リスク   | 誤った計算や数式の組み立てにより、ゲームオーバーになるか、得点が得られないリスクがある。 |
| リワード | 正しい計算や数式の完成により、高得点やボーナスが得られる。 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-match, on_pressed-pierce, rule-time_limit, on_holding-adjust_angle |
| 排他   | - |
| 依存   | - |

## 実装例

```js
// dango.js L55-72 より
// 数式を組み立ててスコア計算するメカニクス
if (stickTicks > 19) {
  stickTicks = 0;
  // 数式文字列の整形
  if (expStr.startsWith("+")) {
    expStr = expStr.substring(1);  // 先頭の+を削除
  } else if (expStr.startsWith("*")) {
    expStr = `0${expStr}`;  // 先頭が*なら0を追加
  }
  // 数式を評価してスコア計算
  expAdd = expStr.length === 0 ? 0 : Function(`return ${expStr};`)();
  addScore(expAdd);

  // スコアに応じて残り串数を回復
  const sl = stickLeft;
  stickLeft = clamp(stickLeft + floor(expAdd / 100), -1, 9);
  stickAdd = stickLeft - sl;
  if (stickAdd > 0) {
    play("powerUp");
  } else if (expAdd > 0) {
    play("coin");
  }
}

// L129: 団子に演算子と数字を割り当て
exp: `${rnd() < 0.5 ? "+" : "*"}${rndi(2, 10)}`,
```

**参考**: `games/src/dango.js`: L55-L72, L129

## 使用例ゲーム

このタグを使用しているゲーム:

- NUMBER BALL (`games/description/number_ball.md`)
- DANGO (`games/description/dango.md`)
- SUM TEN (`games/description/sum_ten.md`)
- NUMBER LINE (`games/description/number_line.md`)