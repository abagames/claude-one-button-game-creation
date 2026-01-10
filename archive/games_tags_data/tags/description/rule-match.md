# rule-match

**カテゴリ**: rule | **優先度**: medium | **代表例**: FORFOUR

## 概要

| 項目     | 内容                      |
| :------- | :------------------------ |
| 要約     | 色、数字、形をマッチングするルール構造 |
| 詳細     | 色やその他の要素の配置を観察しながら、適切なタイミングと場所で行動を取る必要がある。マッチング条件を満たすことで報酬を得たり、ゲームを進行させる |
| リスク   | マッチング条件の見落とし、タイミングの誤判断、マッチング対象の誤認識 |
| リワード | マッチング条件の習得による効率的な進行、マッチングパターンの予測による戦略的な操作、マッチング成功による報酬の獲得 |

## タグ相性

| 関係   | タグ                   |
| :----- | :--------------------- |
| 相性良 | rule-mathematics, weapon-artillery, on_holding-adjust_angle, field-outpost |
| 排他   | rule-random（マッチングと矛盾） |
| 依存   | -（単独で機能するが、マッチング要素を持つメカニクスと組み合わせると効果的） |

## 実装例

```js
// number_ball.js L49-85 より
// 数字マッチングのメカニクス
remove(floors, (f, i) => {
  f.x -= scr;
  color(i == 0 ? "light_red" : "light_green");
  rect(f.x, 50, f.width - 2, 10);
  rx = f.x + f.width;
  if (f.value != null) {
    color("red");
    text(`${f.value}`, f.x + 7, 55);  // 床の数字を表示
    let isRemoving = false;
    // ボールと床の数字マッチング判定
    balls.forEach((b) => {
      if (b.state === "onFloor" &&
          b.pos.x > f.x - 3 && b.pos.x < rx + 3 &&
          f.value === b.value) {  // 数字が一致
        isRemoving = true;
      }
    });
    if (isRemoving) {
      play("coin");
      addScore(f.value * multiplier, f.x + 7, 50);  // マッチ成功
      if (multiplier < 16) {
        multiplier *= 2;  // マルチプライヤー増加（最大16倍）
      }
      return true;  // 床を消去
    }
  }
});

// L140-148: 発射時にマルチプライヤー半減
if (input.isJustReleased || b.vel.angle < -PI * 0.47) {
  play("powerUp");
  if (multiplier > 1) {
    multiplier /= 2;  // マルチプライヤー半減
  }
  b.state = "flying";
}
```

**参考**: `games/src/number_ball.js`: L49-L85, L140-L148

## 使用例ゲーム

このタグを使用しているゲーム:

- NUMBER BALL (`games/description/number_ball.md`) - 数字マッチング砲撃ゲーム
- COLOR ROLL (`games/description/color_roll.md`) - 色マッチングゲーム
- PHOTON LINE (`games/description/photon_line.md`) - 光線マッチングゲーム
- RPS (`games/description/rps.md`) - ジャンケンマッチングゲーム
- FORFOUR (`games/description/forfour.md`) - 4つ揃えマッチングゲーム
- FLOORS 5 (`games/description/floors_5.md`) - 床マッチングゲーム