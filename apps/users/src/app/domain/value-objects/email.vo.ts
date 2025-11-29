export class Email {
    private readonly value: string;
    private constructor(email: string) {
        this.validate(email);
        this.value = email;
    }

    static create(email: string) {
        return new Email(email);
    }

    private validate(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    getValue() {
        return this.value;
    }

    equals(email: Email) {
        return this.value === email.getValue();
    }
}