export enum UserRole {
    ADMIN = "admin",
    VENDOR = "vendor",
    CUSTOMER = "customer",
    SUPPORT = "support",
}

export class UserRoles {
    private readonly roles: UserRole[];
    private constructor(roles: UserRole[]) {
        if (!roles.length) throw new Error("User must have at least one role.");
        this.roles = roles;
    }
    
    static create(roles: UserRole[]) {
        return new UserRoles(roles);
    }

    hasRole(role: UserRole): boolean {
        return this.roles.includes(role);
    }

    addRole(role: UserRole): UserRoles {
        if (this.roles.includes(role)) return this;
        return new UserRoles([...this.roles, role]);
    }

    getRoles(): UserRole[] {
        return [...this.roles];
    }

    removeRole(role: UserRole): UserRoles {
        if (!this.roles.includes(role)) return this;
        if (this.roles.length === 1) throw new Error("Can not remove last role. User must have at least one role.");
        return new UserRoles(this.roles.filter(r => r !== role));
    }
}