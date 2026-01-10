# CHARGE BEAM (charge_beam)

- Source: `reference/games/charge_beam.js`
- Tags: on_holding:charge, field:1D, obstacle:penalty

## Tag Summaries
- **on_holding:charge**: Charge energy. Charge the required amount of energy and release the button to execute the attack.
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.

## Key Functions
- `update` (line 66)
- `addCoinPenalty` (line 272)

## Input Handling
- L82: `if (input.isPressed && charge < 99) {`

## Comment Notes
- L53: @type {{x: number, size: number, type: "enemy" | "coin"}[]}
