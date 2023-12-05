import { GraphQLObjectType, GraphQLSchema, GraphQLFloat, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import data from './data.json';
import { Promotion, TermsOfSales, Region, Country, Pricing } from './types';
import fs from 'fs';
// Pricing Type
const pricingType = new GraphQLObjectType<Pricing>({
    name: 'Pricing',
    fields: {
        retailPrice: { type: GraphQLFloat },
        indicativeRetailPrice: { type: GraphQLFloat },
        discountPercentage: { type: GraphQLFloat },
        wholesalePrice: { type: GraphQLFloat },
        priceAfterDiscount: { type: GraphQLFloat }
    }
});

// Country Type
const countryType = new GraphQLObjectType<Country>({
    name: 'Country',
    fields: {
        countryName: { type: GraphQLString },
        countryCode: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        pricing: { type: pricingType }
    }
});

// Region Type
const regionType = new GraphQLObjectType<Region>({
    name: 'Region',
    fields: {
        regionCode: { type: GraphQLString },
        countries: { type: new GraphQLList(countryType) }
    }
});

// TermsOfSales Type
const termsOfSalesType = new GraphQLObjectType<TermsOfSales>({
    name: 'TermsOfSales',
    fields: {
        tosId: { type: GraphQLString },
        regions: { type: new GraphQLList(regionType) }
    }
});

// Promotion Type
const promotionType = new GraphQLObjectType<Promotion>({
    name: 'Promotion',
    fields: {
        promotionId: { type: GraphQLString },
        promotionName: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        termsOfSales: { type: new GraphQLList(termsOfSalesType) }
    }
});

// Mutation Type
const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        addPromotion: {
            type: promotionType,
            args: {
                promotionId: { type: new GraphQLNonNull(GraphQLString) },
                promotionName: { type: new GraphQLNonNull(GraphQLString) },
                startDate: { type: new GraphQLNonNull(GraphQLString) },
                endDate: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, { promotionId, promotionName, startDate, endDate }) => {
                const newPromotion: Promotion = {
                    promotionId,
                    promotionName,
                    startDate,
                    endDate,
                    termsOfSales: []
                };
                data.promotions.push(newPromotion as never);
                fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
                return newPromotion;
            }
        },
        updatePromotion: {
            type: promotionType,
            args: {
                promotionId: { type: new GraphQLNonNull(GraphQLString) },
                promotionName: { type: GraphQLString },
                startDate: { type: GraphQLString },
                endDate: { type: GraphQLString }
            },
            resolve: (_, { promotionId, promotionName, startDate, endDate }) => {
                const promotion = data.promotions.find(p => p.promotionId === promotionId);
                if (promotion) {
                    if (promotionName) promotion.promotionName = promotionName;
                    if (startDate) promotion.startDate = startDate;
                    if (endDate) promotion.endDate = endDate;
                    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
                }
                return promotion;
            }
        },
        deletePromotion: {
            type: GraphQLString,
            args: {
                promotionId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, { promotionId }) => {
                const index = data.promotions.findIndex(p => p.promotionId === promotionId);
                if (index > -1) {
                    data.promotions.splice(index, 1);
                    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
                    return `Promotion with ID ${promotionId} deleted.`;
                }
                return `Promotion with ID ${promotionId} not found.`;
            }
        }
    }
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        promotions: {
            type: new GraphQLList(promotionType),
            args: {
                promotionName: { type: GraphQLString },
                regionCode: { type: GraphQLString }
            },
            resolve: (_, args) => {
                let promotionsData: Promotion[] = JSON.parse(JSON.stringify(data.promotions));
                if (args.promotionName) {
                    promotionsData = promotionsData.filter(promotion => promotion.promotionName === args.promotionName);
                }
                if (args.regionCode) {
                    promotionsData.forEach(promotion => {
                        promotion.termsOfSales.forEach(tos => {
                            tos.regions = tos.regions.filter(region => region.regionCode === args.regionCode);
                        });
                    });
                }
                return promotionsData;
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

export default schema;
