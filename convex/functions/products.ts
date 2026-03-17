import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('products').collect();
  },
});

export const getById = query({
  args: { id: v.id('products') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('category'), args.category))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    images: v.array(v.string()),
    category: v.string(),
    inventory: v.number(),
    woodType: v.optional(v.string()),
    finish: v.optional(v.string()),
    dimensions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('products', {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id('products'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    inventory: v.optional(v.number()),
    woodType: v.optional(v.string()),
    finish: v.optional(v.string()),
    dimensions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id('products') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
