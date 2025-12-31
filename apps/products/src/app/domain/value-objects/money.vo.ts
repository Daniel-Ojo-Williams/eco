export class Money {
    private constructor(private readonly amount: number) {
        this.validate(amount);
        this.amount = Number(amount.toFixed(2));
    }

    static create(amount: number): Money {
        return new Money(amount);
    }

    static zero(): Money {
        return new Money(0);
    }

    private validate(amount: number): void {
        if (amount < 0) {
            throw new Error("Amount must be greater than or equal to 0.");
        }
        if (!Number.isFinite(amount)) {
            throw new Error("Amount has to be a finite number");
        }
    }

    getAmount(): number {
        return this.amount;
    }

    add(other: Money): Money {
        return Money.create(other.getAmount() + this.amount);
    }

    subtract(other: Money): Money {
        if (this.amount < other.getAmount()) {
            throw new Error("Amount to subtract must be less than or equal to the amount.");
        }
        return Money.create(this.amount - other.getAmount());
    }

    multiply(factor: number): Money {
        return Money.create(this.amount * factor);
    }

    equals(other: Money): boolean {
        return this.amount === other.getAmount();
    }

    isGreaterThan(other: Money): boolean {
        return this.amount > other.getAmount();
    }

    isLessThan(other: Money): boolean {
        return this.amount < other.getAmount();
    }
}