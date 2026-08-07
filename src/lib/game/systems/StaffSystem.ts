import { GameState } from '../state';

export interface StaffMember {
  id: string;
  name: string;
  role: 'cashier' | 'stocker' | 'manager';
  wage: number;
  skill: number;
  morale: number;
  isWorking: boolean;
  shiftStart: number; // Hour (0-23)
  shiftEnd: number; // Hour (0-23)
}

export class StaffSystem {
  private staff: Map<string, StaffMember> = new Map();

  update(deltaTime: number, state: GameState): void {
    // Check shift schedules
    this.checkShifts(state);
    
    // Calculate wages
    this.calculateWages(deltaTime, state);
    
    // Update staff performance based on morale
    this.updateStaffPerformance();
  }

  private checkShifts(state: GameState): void {
    const currentHour = state.hour;
    
    this.staff.forEach((staffMember) => {
      const shouldBeWorking = currentHour >= staffMember.shiftStart && currentHour < staffMember.shiftEnd;
      
      if (shouldBeWorking && !staffMember.isWorking) {
        staffMember.isWorking = true;
        console.log(`${staffMember.name} started their shift`);
      } else if (!shouldBeWorking && staffMember.isWorking) {
        staffMember.isWorking = false;
        console.log(`${staffMember.name} ended their shift`);
      }
    });
  }

  private calculateWages(deltaTime: number, state: GameState): void {
    // Calculate wages for working staff
    // Wage is per hour, so we calculate based on deltaTime
    const hoursWorked = deltaTime / (1000 * 60 * 60);
    
    this.staff.forEach((staffMember) => {
      if (staffMember.isWorking) {
        const wageCost = hoursWorked * staffMember.wage;
        // This would deduct from store cash
        console.log(`${staffMember.name} wage cost: ${wageCost.toFixed(2)}`);
      }
    });
  }

  private updateStaffPerformance(): void {
    // Staff performance affects their effectiveness
    // Higher morale and skill = better performance
    this.staff.forEach((staffMember) => {
      // Morale slowly decreases over time
      if (staffMember.isWorking && Math.random() < 0.01) {
        staffMember.morale = Math.max(0, staffMember.morale - 1);
      }
    });
  }

  // Hire new staff
  hireStaff(name: string, role: 'cashier' | 'stocker' | 'manager', wage: number): string {
    const id = `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newStaff: StaffMember = {
      id,
      name,
      role,
      wage,
      skill: 1, // Starting skill level
      morale: 100,
      isWorking: false,
      shiftStart: 9, // Default 9 AM start
      shiftEnd: 17, // Default 5 PM end
    };
    
    this.staff.set(id, newStaff);
    console.log(`Hired ${name} as ${role} with wage ${wage}`);
    return id;
  }

  // Fire staff
  fireStaff(staffId: string): boolean {
    const staffMember = this.staff.get(staffId);
    if (staffMember) {
      this.staff.delete(staffId);
      console.log(`Fired ${staffMember.name}`);
      return true;
    }
    return false;
  }

  // Get staff member
  getStaffMember(staffId: string): StaffMember | undefined {
    return this.staff.get(staffId);
  }

  // Get all staff
  getAllStaff(): StaffMember[] {
    return Array.from(this.staff.values());
  }

  // Get working staff
  getWorkingStaff(): StaffMember[] {
    return this.getAllStaff().filter(staff => staff.isWorking);
  }

  // Set shift schedule
  setShiftSchedule(staffId: string, startHour: number, endHour: number): boolean {
    const staffMember = this.staff.get(staffId);
    if (staffMember) {
      staffMember.shiftStart = startHour;
      staffMember.shiftEnd = endHour;
      return true;
    }
    return false;
  }

  // Boost staff morale
  boostMorale(staffId: string, amount: number): boolean {
    const staffMember = this.staff.get(staffId);
    if (staffMember) {
      staffMember.morale = Math.min(100, staffMember.morale + amount);
      return true;
    }
    return false;
  }

  // Train staff (improves skill)
  trainStaff(staffId: string): boolean {
    const staffMember = this.staff.get(staffId);
    if (staffMember) {
      staffMember.skill += 1;
      console.log(`${staffMember.name} skill increased to ${staffMember.skill}`);
      return true;
    }
    return false;
  }

  // Calculate total monthly wages
  calculateTotalWages(): number {
    let total = 0;
    this.staff.forEach(staffMember => {
      // Assuming 8-hour shifts, 5 days a week
      total += staffMember.wage * 8 * 5 * 4; // Monthly estimate
    });
    return total;
  }
}