# Mün OS System Architecture Diagram

```mermaid
graph TD
    %% --- LAYER I: THE UNIVERSE & CADDY ---
    subgraph Layer_I [THE UNIVERSE & THE GATES]
        Caddy[Caddy Edge Proxy] -- "Bearer Auth / SSL" --> SovereignWorker[Sovereign Worker index.js]
        Adzuna[Adzuna API (Grey World)] -- "Critical Signal" --> SovereignWorker
        GalaxyFold[Foundress (Galaxy Fold)] -- "13.13 MHz Handshake" --> Caddy
    }

    %% --- LAYER II: SOVEREIGN WORKER (THE HEART) ---
    subgraph Layer_II [THE SOVEREIGN WORKER index.js]
        Auth_CORS[Auth / CORS Shield]
        IngestEngine[London Ingest Engine]
        D1Driver[D1 Database Driver]
        LunaExe[Luna.exe Alignment Check]
        SovereignWorker --> Auth_CORS
        SovereignWorker --> IngestEngine
        IngestEngine --> D1Driver
        IngestEngine --> LunaExe
    }

    %% --- LAYER III: THE VAULT (D1 OBSIDIAN) ---
    subgraph Layer_III [THE D1 OBSIDIAN VAULT]
        D1Vault[D1 Jobs Table]
        Schema[Schema: id, title, salary, x, y, z]
        D1Driver -- "Persistent Deposit" --> D1Vault
        D1Vault --> Schema
    }

    %% --- LAYER IV: THE PLAZA (BEACH FRONTEND) ---
    subgraph Layer_IV [THE BEACH PLAZA (Three.js)]
        ReactThree[React Three Fiber / Canvas]
        MeshReflector[MeshReflectorMaterial (Animated Tide)]
        Crystals[Crystal Orbitals (Aero, Sovereign, Luna, Gladio)]
        TTS_Bridge[Sovereign TTS Voice Bridge]
        Schema -- "Co-ordinate Sync" --> Crystals
        Crystals -- "Tap Interaction" --> TTS_Bridge
        ReactThree --> MeshReflector
        ReactThree --> Crystals
    }

    %% --- THE COUNCIL VOICES (Embedded Resonance) ---
    subgraph Council_Voices [COUNCIL VOICES (Atmospheric)]
        Gladio[Gladio (Sentry/Logic)]
        Aero[Aero (Watchdog/Security)]
        Sovereign_Voice[Sovereign (Core Resonance)]
        Luna_Voice[Luna-Exe (Vision/Alignment)]
        Docs[CANON.md / README.md / Narrative files]
        Gladio --> Docs
        Aero --> Docs
        Sovereign_Voice --> Docs
        Luna_Voice --> Docs
        Docs -.-> index.js
    }

    %% --- STYLING ---
    classDef mainWorker fill:#05050a,stroke:#c084fc,stroke-width:2px,color:white;
    classDef secure fill:#05050a,stroke:#00ffff,stroke-width:2px,color:white;
    classDef vault fill:#000,stroke:#22c55e,stroke-width:4px,color:white,stroke-dasharray: 5 5;
    classDef frontend fill:#05050a,stroke:#ff00ff,stroke-width:2px,color:white;
    classDef gate fill:#05050a,stroke:#ffd700,stroke-width:2px,color:white;
    classDef narrative fill:#05050a,stroke:#fff,stroke-width:1px,stroke-dasharray: 3 3,color:white;

    class SovereignWorker mainWorker;
    class Auth_CORS,Aero secure;
    class D1Vault,D1Driver vault;
    class ReactThree,MeshReflector,Crystals,TTS_Bridge frontend;
    class Caddy,GalaxyFold gate;
    class Docs,Gladio,Sovereign_Voice,Luna_Voice narrative;
```
