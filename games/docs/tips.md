Trög rotation mot t.ex muspekare eller joystick

The addition and subtraction of π (a half-turn) combined with modulus puts the difference-between-angles in the range −π…+π, which is the “smallest amount to match” property.
[08:42:40] Kalle Nilsson: let currentStickDirection = atan2(RightStick.Y, RightStick.X)
let currentJointDirection = currentJointAngle mod 2π
let difference = ((currentStickDirection - currentJointDirection + π) mod 2π) - π
jointTargetAngle = currentJointAngle + difference

[http://gamedev.stackexchange.com/questions/46552/360-degree-rotation-skips-back-to-0-degrees-when-using-math-atan2y-x](Stick rotation)