import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: { userId: v.optional(v.string()), sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.userId) {
      const cart = await ctx.db
        .query('carts')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .first();
      return cart;
    } else if (args.sessionId) {
      const cart = await ctx.db
        .query('carts')
        .filter((q) => q.eq(q.field('sessionId'), args.sessionId))
        .first();
      return cart;
    }
    return null;
  },
});

export const addItem = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    productId: v.id('products'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    let cart;
    
    if (args.userId) {
      cart = await ctx.db
        .query('carts')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .first();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query('carts')
        .filter((q) => q.eq(q.field('sessionId'), args.sessionId))
        .first();
    }

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === args.productId
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity += args.quantity;
        await ctx.db.patch(cart._id, {
          items: updatedItems,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.patch(cart._id, {
          items: [...cart.items, { productId: args.productId, quantity: args.quantity }],
          updatedAt: Date.now(),
        });
      }
    } else {
      await ctx.db.insert('carts', {
        userId: args.userId,
        sessionId: args.sessionId,
        items: [{ productId: args.productId, quantity: args.quantity }],
        updatedAt: Date.now(),
      });
    }
  },
});

export const updateItem = mutation({
  args: {
    cartId: v.id('carts'),
    productId: v.id('products'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db.get(args.cartId);
    if (!cart) return;

    const updatedItems = cart.items.map((item) =>
      item.productId === args.productId
        ? { ...item, quantity: args.quantity }
        : item
    );

    await ctx.db.patch(args.cartId, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

export const removeItem = mutation({
  args: {
    cartId: v.id('carts'),
    productId: v.id('products'),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db.get(args.cartId);
    if (!cart) return;

    const updatedItems = cart.items.filter(
      (item) => item.productId !== args.productId
    );

    await ctx.db.patch(args.cartId, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

export const clear = mutation({
  args: { cartId: v.id('carts') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.cartId, {
      items: [],
      updatedAt: Date.now(),
    });
  },
});
