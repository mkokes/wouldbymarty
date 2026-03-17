import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('orders')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .order('desc')
      .collect();
  },
});

export const getById = query({
  args: { id: v.id('orders') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    items: v.array(v.object({
      productId: v.id('products'),
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('orders', {
      ...args,
      status: 'pending',
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('orders'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
