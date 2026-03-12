export interface CalculatorState {
  revenue: number;           // Default: 10000
  aov: number;               // Average Order Value. Default: 50
  cogsPercent: number;       // Default: 30 (%)
  shippingPercent: number;   // Default: 15 (%)
  isShopifyBasic: boolean;   // Default: true
  useStripe: boolean;        // Default: true
  intlOrderPercent: number;  // Default: 20 (%)
}

export interface SankeyNode {
  id: string;
  nodeColor?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}
