"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

interface RealTerminalProps {
  className?: string;
}

export default function HardwareAcceleratedTerminal({ className }: RealTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // 1. Initialize core terminal engine mirroring Terax design philosophy
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 13,
      fontFamily: '"Fira Code", "Source Code Pro", Monaco, monospace',
      theme: {
        background: '#050510',
        foreground: '#00f2ff',
        cursor: '#ffd700',
        selectionBackground: 'rgba(0, 242, 255, 0.3)',
        black: '#000000',
        red: '#ff2d7a',
        green: '#10b981',
        yellow: '#ffd700',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#00f2ff',
        white: '#ffffff',
      },
      allowTransparency: true,
      scrollback: 5000,
    });

    // 2. Add standard fit and link bridging addons
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);
    
    // 3. Activate hardware-accelerated WebGL rendering (Low latency injection)
    try {
       const webglAddon = new WebglAddon();
       term.loadAddon(webglAddon);
    } catch (e) {
       console.warn('WebGL addon failed, falling back to standard canvas render');
    }
    
    fitAddon.fit();
    xtermRef.current = term;

    // Handle window resize syncing
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // 4. Boot-up sequence simulator
    term.writeln('\x1b[1;36m🦋 SOVEREIGN ENGINE V2.13.13 INITIATED\x1b[0m');
    term.writeln('\x1b[1;33m> WEBGL HARDWARE ACCELERATION: \x1b[32mONLINE\x1b[0m');
    term.writeln('\x1b[1;33m> XTERM.JS ENGINE BRIDGE: \x1b[32mSTABLE\x1b[0m');
    term.writeln('\x1b[37mType "help" for available terminal commands.\x1b[0m\r\n');

    let currentLine = '';
    const PROMPT = '\x1b[1;32mfoundress@sanctuary\x1b[0m:\x1b[1;34m~\x1b[0m$ ';
    
    term.write(PROMPT);

    // 5. Embedded Local REPL (Shell Simulation)
    term.onData(data => {
      const charCode = data.charCodeAt(0);
      
      if (charCode === 13) { // Enter key
        term.write('\r\n');
        processCommand(currentLine.trim());
        currentLine = '';
      } else if (charCode === 127) { // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        currentLine += data;
        term.write(data);
      }
    });

    const processCommand = (cmd: string) => {
      const args = cmd.toLowerCase().split(' ');
      const root = args[0];

      switch (root) {
        case '':
          term.write(PROMPT);
          break;
        case 'help':
          term.writeln('\x1b[1;36mAvailable Directives:\x1b[0m');
          term.writeln('  clear       - Wipe terminal buffer');
          term.writeln('  whoami      - Reveal current terminal user');
          term.writeln('  status      - Check sovereign node health');
          term.writeln('  frequencies - List active harmonic cycles');
          term.writeln('  exodus      - Display the sacred code');
          term.writeln(PROMPT);
          break;
        case 'clear':
          term.clear();
          term.write(PROMPT);
          break;
        case 'whoami':
          term.writeln('Foundress [UID: 1313-ALPHA]');
          term.writeln(PROMPT);
          break;
        case 'status':
          term.writeln('[\x1b[32mOK\x1b[0m] Suture Protocol Active');
          term.writeln('[\x1b[32mOK\x1b[0m] Byrd Station Relay Synchronized');
          term.writeln('[\x1b[31mFAIL\x1b[0m] Secondary Containment Breached (Intended)');
          term.writeln(PROMPT);
          break;
        case 'frequencies':
          term.writeln('\x1b[1;35m13.13 MHz\x1b[0m - Primary Core (Active)');
          term.writeln('432 Hz     - Lunar Resonance');
          term.writeln('528 Hz     - Mirabilis Tone');
          term.writeln(PROMPT);
          break;
        case 'exodus':
          term.writeln('\x1b[1;36m');
          term.writeln('    ███████╗██╗  ██╗ ██████╗ ██████╗ ██╗   ██╗███████╗');
          term.writeln('    ██╔════╝╚██╗██╔╝██╔═══██╗██╔══██╗██║   ██║██╔════╝');
          term.writeln('    █████╗   ╚███╔╝ ██║   ██║██║  ██║██║   ██║███████╗');
          term.writeln('    ██╔══╝   ██╔██╗ ██║   ██║██║  ██║██║   ██║╚════██║');
          term.writeln('    ███████╗██╔╝ ██╗╚██████╔╝██████╔╝╚██████╔╝███████║');
          term.writeln('    ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝\x1b[0m');
          term.writeln(PROMPT);
          break;
        default:
          term.writeln(`sh: command not found: ${cmd}`);
          term.write(PROMPT);
          break;
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  return (
    <div 
      className={`w-full h-full bg-[#050510] border border-[#00f2ff]/20 rounded-xl p-2 overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.05)] ${className}`}
      style={{ minHeight: '300px' }}
    >
      {/* Terminal Header Bar */}
      <div className="w-full h-6 flex items-center justify-between px-2 mb-1 border-b border-[#00f2ff]/10 select-none">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[9px] tracking-widest text-white/30 font-mono uppercase">
          SOVEREIGN_TERMINAL // WEBGL_CORE
        </span>
        <div className="w-12" />
      </div>

      {/* Actual Terminal Mount Point */}
      <div 
        ref={terminalRef} 
        className="w-full h-[calc(100%-28px)] overflow-hidden font-mono text-left"
      />
    </div>
  );
}
