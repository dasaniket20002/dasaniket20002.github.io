import type { RapierRigidBody } from "@react-three/rapier";

export class BodyRegistry {
  private bodies: (RapierRigidBody | null)[];

  constructor(size: number) {
    this.bodies = new Array(size).fill(null);
  }

  set(index: number, body: RapierRigidBody | null) {
    this.bodies[index] = body;
  }

  get(index: number): RapierRigidBody | null {
    return this.bodies[index];
  }
}
