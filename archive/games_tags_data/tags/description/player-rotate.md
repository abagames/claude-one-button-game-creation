# player-rotate

**カテゴリ**: player | **優先度**: medium | **代表例**: ORBIT MAN

## 概要

| 項目     | 内容                                                                                          |
| :------- | :-------------------------------------------------------------------------------------------- |
| 要約     | プレイヤーキャラクターが自動的に回転し続ける                                                  |
| 詳細     | プレイヤーまたはその一部（砲塔、紐など）が一定速度で回転し、タイミングを合わせて発射・移動・攻撃を行う必要がある。方向が時間とともに変化するため、適切なタイミングでアクションを実行する技術が求められる |
| リスク   | 回転のタイミングを見誤ると、意図しない方向に発射・移動してしまう。回転速度が上がると判断時間が短縮される |
| リワード | 回転のパターンを習熟すると、複数の目標を一度に狙ったり、最適な角度でアクションを実行できる     |

## タグ相性

| 関係   | タグ                                                                      |
| :----- | :------------------------------------------------------------------------ |
| 相性良 | on_pressed-go_forward, on_holding-extend, on_holding-stop, field-pins     |
| 排他   | なし                                                                      |
| 依存   | なし                                                                      |

## 実装例

```js
// ORBIT MAN より抜粋
// 惑星の周りを自動回転
man.angle += difficulty * 0.03 * man.av;
color("light_blue");
bar(man.planet.pos, 99, 4, man.angle, -man.planet.radius * 0.015);
```

**参考**: `games/src/orbit_man.js`: L67-L69

```js
// PIN CLIMB より抜粋
// 紐が自動回転
cord.angle += difficulty * 0.05;
line(cord.pin, vec(cord.pin).addWithAngle(cord.angle, cord.length));
```

**参考**: `games/src/pin_climb.js`: L57-L60

## 使用例ゲーム

このタグを使用しているゲーム:

- ORBIT MAN (`games/description/orbit_man.md`) - 惑星の周りを回転し、タイミングを合わせて次の惑星へ発射
- PIN CLIMB (`games/description/pin_climb.md`) - ピンに固定された紐が回転し、伸ばして次のピンに移動
- ROLL HOLD (`games/description/roll_hold.md`) - 砲塔が自動回転、長押しで停止して射撃
- CLEAN ROBO (`games/description/clean_robo.md`) - 三角形ロボットが自動回転、長押しで停止して隙間を通過
- PAINT BALL (`games/description/paint_ball.md`) - 回転しながら地形を塗装
- SQUARE BAR (`games/description/square_bar.md`) - 棒が回転して幾何学パターンを描く
- TWIN P (`games/description/twin_p.md`) - 2本の棒が回転
- REVOLVE A (`games/description/revolve_a.md`) - 回転しながら接続されたオブジェクトを操作
- TWO FACED (`games/description/two_faced.md`) - 複数のフィールドで回転
- ARCFIRE (`games/description/arcfire.md`) - アーチ状の武器で回転しながら攻撃
