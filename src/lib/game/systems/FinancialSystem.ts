import { GameState } from '../state';

export interface Transaction {
  id: string;
  type: 'sale' | 'purchase' | 'wage' | 'expense' | 'loan' | 'repayment';
  amount: number;
  description: string;
  timestamp: number;
}

export class FinancialSystem {
  private transactions: Transaction[] = [];
  private dailyRevenue: number = 0;
  private dailyExpenses: number = 0;

  update(deltaTime: number, state: GameState): void {
    // Reset daily counters at midnight
    if (state.hour === 0 && state.minute === 0) {
      this.resetDailyCounters();
    }
  }

  private resetDailyCounters(): void {
    this.dailyRevenue = 0;
    this.dailyExpenses = 0;
  }

  // Record a transaction
  recordTransaction(type: Transaction['type'], amount: number, description: string): void {
    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount,
      description,
      timestamp: Date.now(),
    };

    this.transactions.push(transaction);

    // Update daily counters
    if (type === 'sale') {
      this.dailyRevenue += amount;
    } else {
      this.dailyExpenses += amount;
    }

    console.log(`Transaction: ${type} - ${amount} (${description})`);
  }

  // Calculate daily profit
  calculateDailyProfit(): number {
    return this.dailyRevenue - this.dailyExpenses;
  }

  // Calculate total revenue for a period
  calculateRevenueForPeriod(startTime: number, endTime: number): number {
    return this.transactions
      .filter(txn => txn.type === 'sale' && txn.timestamp >= startTime && txn.timestamp <= endTime)
      .reduce((total, txn) => total + txn.amount, 0);
  }

  // Calculate total expenses for a period
  calculateExpensesForPeriod(startTime: number, endTime: number): number {
    return this.transactions
      .filter(txn => txn.type !== 'sale' && txn.timestamp >= startTime && txn.timestamp <= endTime)
      .reduce((total, txn) => total + txn.amount, 0);
  }

  // Get recent transactions
  getRecentTransactions(limit: number = 10): Transaction[] {
    return this.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Get transactions by type
  getTransactionsByType(type: Transaction['type']): Transaction[] {
    return this.transactions.filter(txn => txn.type === type);
  }

  // Calculate profit margin
  calculateProfitMargin(revenue: number, expenses: number): number {
    if (revenue === 0) return 0;
    return ((revenue - expenses) / revenue) * 100;
  }

  // Loan system
  private loans: Map<string, { amount: number; interestRate: number; dueTime: number }> = new Map();

  takeLoan(amount: number, interestRate: number, repaymentDays: number, state: GameState): string {
    const loanId = `loan_${Date.now()}`;
    const dueTime = state.gameTime + (repaymentDays * 24 * 60 * 60); // Convert days to seconds
    
    this.loans.set(loanId, {
      amount,
      interestRate,
      dueTime,
    });

    this.recordTransaction('loan', amount, `Loan taken: ${loanId}`);
    console.log(`Loan taken: ${amount} at ${interestRate}% interest, due in ${repaymentDays} days`);
    
    return loanId;
  }

  repayLoan(loanId: string): boolean {
    const loan = this.loans.get(loanId);
    if (!loan) return false;

    const totalRepayment = loan.amount * (1 + loan.interestRate / 100);
    this.recordTransaction('repayment', totalRepayment, `Loan repayment: ${loanId}`);
    
    this.loans.delete(loanId);
    console.log(`Loan repaid: ${totalRepayment}`);
    
    return true;
  }

  // Check for overdue loans
  checkOverdueLoans(state: GameState): string[] {
    const overdueLoans: string[] = [];
    
    this.loans.forEach((loan, loanId) => {
      if (state.gameTime > loan.dueTime) {
        overdueLoans.push(loanId);
      }
    });
    
    return overdueLoans;
  }

  // Calculate total debt
  calculateTotalDebt(): number {
    let total = 0;
    this.loans.forEach(loan => {
      total += loan.amount * (1 + loan.interestRate / 100);
    });
    return total;
  }

  // Get financial summary
  getFinancialSummary(): {
    cash: number;
    dailyRevenue: number;
    dailyExpenses: number;
    dailyProfit: number;
    totalDebt: number;
    activeLoans: number;
  } {
    return {
      cash: 0, // Would get from game state
      dailyRevenue: this.dailyRevenue,
      dailyExpenses: this.dailyExpenses,
      dailyProfit: this.calculateDailyProfit(),
      totalDebt: this.calculateTotalDebt(),
      activeLoans: this.loans.size,
    };
  }
}