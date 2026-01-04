interface ShippingAddressProps {
    city: string;
    street: string;
    country: string;
    postalCode: string;
}

export class ShippingAddressVO {
    private constructor(private readonly props: ShippingAddressProps) {}

    static create(props: ShippingAddressProps): ShippingAddressVO {
            if (!props.postalCode?.trim()) {
                throw new Error('Postal code is required');
            }
            
            if (!props.city?.trim()) {
                throw new Error('City is required');
            }
            
            if (!props.country?.trim()) {
                throw new Error('Country is required');
            }
            
            if (!props.street?.trim()) {
                throw new Error('Street is required');
            }
            
        return new ShippingAddressVO(props);
    }

    update(props: Partial<ShippingAddressProps>): ShippingAddressVO {
        return new ShippingAddressVO({
            ...this.props,
            ...props
        });
    }

    getCity(): string {
        return this.props.city;
    }

    getStreet(): string {
        return this.props.street;
    }

    getCountry(): string {
        return this.props.country;
    }

    getPostalCode(): string {
        return this.props.postalCode;
    }

    getValue(): ShippingAddressProps {
        return { ...this.props };
    }
    
    equals(other: ShippingAddressVO): boolean {
        return (
            this.props.city === other.props.city &&
            this.props.street === other.props.street &&
            this.props.country === other.props.country &&
            this.props.postalCode === other.props.postalCode
        );
    }

    toString(): string {
        return `${this.props.street}, ${this.props.city}, ${this.props.country} ${this.props.postalCode}`;
    }
}