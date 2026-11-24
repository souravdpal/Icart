// If the /o/ and /social/ ids are not the user's id, change how session.ts fills them.
export type RouteCtx = { userId?: string; ordersId?: string; socialId?: string };

type RouteDef = {
  label: string;
  description: string; // shown to the AI: write "use when..." keywords here
  external?: boolean;
  path: (ctx: RouteCtx) => string | null; // null = not available
};

export const ROUTE_REGISTRY: Record<string, RouteDef> = {
  home: {
    label: "Home",
    description: "Home page with featured products",
    path: () => "/",
  },
  new: {
    label: "New arrivals",
    description:
      "Page with the newest and latest products. Use for ANY request about new arrivals, new products, latest items or what's new",
    path: () => "/new/prod",
  },
  cart: {
    label: "Cart",
    description: "The user's shopping cart: items they added, quantities, going on to checkout",
    path: () => "/cart",
  },
  profile: {
    label: "My profile",
    description:
      "Account and profile settings. Use for ANY request to change or update personal details: email (Gmail), name, phone, address, profile photo, or other account info",
    path: ({ userId }) => (userId ? `/u/${userId}` : null),
  },
  orders: {
    label: "My orders",
    description: "The user's orders: order history, tracking and order status",
    path: ({ ordersId }) => (ordersId ? `/o/${ordersId}` : null),
  },
  social: {
    label: "Social & meets",
    description: "Social area to meet and connect with other people, find communities and events",
    path: ({ socialId }) => (socialId ? `/social/${socialId}` : null),
  },
  partner: {
    label: "Become a partner",
    description: "Join the platform as a partner: partnership program, selling on the platform",
    path: () => "/patner/v2",
  },
  about: {
    label: "About us",
    description: "About this store and the project's creator (Sourav)",
    path: () => "/about",
  },
  creator: {
    label: "Sourav's portfolio",
    description:
      "Creator's personal portfolio website (external). Use for who built this project, the developer, his work, hiring or contacting him",
    external: true,
    path: () => "https://souravdp.vercel.app",
  },
};

export function resolveRoute(key: string, ctx: RouteCtx) {
  const def = Object.hasOwn(ROUTE_REGISTRY, key) ? ROUTE_REGISTRY[key] : undefined;
  if (!def) return null;
  const path = def.path(ctx);
  return path ? { label: def.label, path, external: !!def.external } : null;
}

export function routesForPrompt() {
  return Object.entries(ROUTE_REGISTRY)
    .map(([key, d]) => `- ${key}: ${d.description}`)
    .join("\n");
}