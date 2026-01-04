export class MoneyVO {
    private constructor(private readonly amount: number) {
        this.validate(amount);
        this.amount = Number(amount.toFixed(2));
    }

    static create(amount: number): MoneyVO {
        return new MoneyVO(amount);
    }

    static zero(): MoneyVO {
        return new MoneyVO(0);
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

    add(other: MoneyVO): MoneyVO {
        return MoneyVO.create(other.getAmount() + this.amount);
    }

    subtract(other: MoneyVO): MoneyVO {
        if (this.amount < other.getAmount()) {
            throw new Error("Amount to subtract must be less than or equal to the amount.");
        }
        return MoneyVO.create(this.amount - other.getAmount());
    }

    multiply(factor: number): MoneyVO {
        if (factor < 0) {
            throw new Error("Factor must be greater than or equal to 0.");
        }
        if (!Number.isFinite(factor)) {
            throw new Error("Factor has to be a finite number");
        }
        return MoneyVO.create(this.amount * factor);
    }

    equals(other: MoneyVO): boolean {
        return this.amount === other.getAmount();
    }

    isGreaterThan(other: MoneyVO): boolean {
        return this.amount > other.getAmount();
    }

    isLessThan(other: MoneyVO): boolean {
        return this.amount < other.getAmount();
    }
}