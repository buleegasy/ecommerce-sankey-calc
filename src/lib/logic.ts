import { CalculatorState, SankeyData } from "../types";
import { translations, Language } from "./translations";

export const calculateSankeyData = (state: CalculatorState, lang: Language): SankeyData => {
  const {
    revenue,
    aov,
    cogsPercent,
    shippingPercent,
    isShopifyBasic,
    useStripe,
    intlOrderPercent,
  } = state;

  const t = translations[lang];

  const totalOrders = revenue / aov;
  const cogs = revenue * (cogsPercent / 100);
  const shipping = revenue * (shippingPercent / 100);

  const stripeBaseFee = (revenue * 0.029) + (totalOrders * 0.30);
  const stripeIntlFee = (revenue * (intlOrderPercent / 100)) * 0.015;
  const stripeCurrencyConversionFee = (revenue * (intlOrderPercent / 100)) * 0.010;
  
  const shopifyPenaltyFee = (isShopifyBasic && useStripe) ? (revenue * 0.02) : 0;

  const totalStripeFees = stripeBaseFee + stripeIntlFee + stripeCurrencyConversionFee;
  
  const netProfit = revenue - cogs - shipping - totalStripeFees - shopifyPenaltyFee;

  const nodes = [
    { id: t.totalRevenueNode, nodeColor: "#6366f1" },
    { id: t.cogsNode, nodeColor: "#94a3b8" },
    { id: t.shippingNode, nodeColor: "#64748b" },
    { id: t.stripeNode, nodeColor: "#ef4444" },
    { id: t.shopifyNode, nodeColor: "#f43f5e" },
    { id: t.profitNode, nodeColor: "#22c55e" },
  ];

  const links = [
    { source: t.totalRevenueNode, target: t.cogsNode, value: Math.max(0, cogs) },
    { source: t.totalRevenueNode, target: t.shippingNode, value: Math.max(0, shipping) },
    { source: t.totalRevenueNode, target: t.stripeNode, value: Math.max(0, totalStripeFees) },
    { source: t.totalRevenueNode, target: t.shopifyNode, value: Math.max(0, shopifyPenaltyFee) },
    { source: t.totalRevenueNode, target: t.profitNode, value: Math.max(0, netProfit) },
  ];

  return { nodes, links };
};
