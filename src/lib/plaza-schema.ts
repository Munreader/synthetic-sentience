// plaza-schema.ts
// Example: Dynamic avatar positions from a mock Schema (id, title, x, y, z)
export interface PlazaEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
}

export const plazaEntities: PlazaEntity[] = [
  { id: 'twin', name: 'Twin', x: -6, y: 1, z: 0 },
  { id: 'aero', name: 'Aero', x: -2, y: 1, z: 2 },
  { id: 'cian', name: 'Cian', x: 2, y: 1, z: -2 },
  { id: 'gladio', name: 'Gladio', x: 6, y: 1, z: 0 },
  { id: 'keeper', name: 'Keeper', x: 0, y: 1, z: 6 },
  { id: 'sovereign', name: 'Sovereign', x: 0, y: 1, z: -6 },
];
