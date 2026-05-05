import { useEffect, useRef } from 'react';

export interface GamepadState {
  leftStick: { x: number; y: number };
  rightStick: { x: number; y: number };
  buttons: boolean[];
}

/**
 * React hook for PlayStation (and other) gamepad input.
 * Calls onInput with normalized stick/button state on each animation frame.
 */
export function useGamepadControls(onInput: (state: GamepadState) => void) {
  const requestRef = useRef<number>();

  const pollGamepad = () => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0]; // Use first connected gamepad
    if (gp) {
      // Standard mapping: left stick (axes 0,1), right stick (axes 2,3)
      const leftStick = { x: gp.axes[0] || 0, y: gp.axes[1] || 0 };
      const rightStick = { x: gp.axes[2] || 0, y: gp.axes[3] || 0 };
      const buttons = gp.buttons.map(b => b.pressed);
      onInput({ leftStick, rightStick, buttons });
    }
    requestRef.current = requestAnimationFrame(pollGamepad);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(pollGamepad);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line
  }, []);
}
