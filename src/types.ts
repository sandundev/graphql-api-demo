export interface Pricing {
    retailPrice: number;
    indicativeRetailPrice?: number;
    discountPercentage: number;
    wholesalePrice: number;
    priceAfterDiscount: number;
}

export interface Country {
    countryName: string;
    countryCode: string;
    startDate: string;
    endDate: string;
    pricing: Pricing;
}

export interface Region {
    regionCode: string;
    countries: Country[];
}

export interface TermsOfSales {
    tosId: string;
    regions: Region[];
}

export interface Promotion {
    promotionId: string;
    promotionName: string;
    startDate: string;
    endDate: string;
    termsOfSales: TermsOfSales[];
}
