import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    images: v.array(v.string()),
    category: v.string(),
    inventory: v.number(),
    woodType: v.optional(v.string()),
    finish: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    createdAt: v.number(),
  }),

  orders: defineTable({
    userId: v.string(),
    items: v.array(v.object({
      productId: v.id('products'),
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    status: v.string(),
    total: v.number(),
    shippingAddress: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postal_code: v.string(),
      country: v.string(),
    }),
    paymentId: v.optional(v.string()),
    createdAt: v.number(),
  }),

  carts: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id('products'),
      quantity: v.number(),
    })),
    updatedAt: v.number(),
  }),
});
