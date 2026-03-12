-- Final Financial Anatomy Schema

-- Core Transactional Table
CREATE TABLE IF NOT EXISTS raw_orders (
    order_id VARCHAR(50) PRIMARY KEY,
    platform VARCHAR(50),
    gross_revenue DECIMAL(12, 2) NOT NULL,
    cogs DECIMAL(12, 2) NOT NULL,
    shipping_cost DECIMAL(12, 2) NOT NULL,
    transaction_fee DECIMAL(12, 2) NOT NULL,
    returns_reserve DECIMAL(12, 2) DEFAULT 0.00,
    order_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ad Spend Data
CREATE TABLE IF NOT EXISTS ad_spend_fact (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    platform VARCHAR(50),
    campaign_id VARCHAR(100),
    spend_amount DECIMAL(12, 2) NOT NULL
);

-- Benchmarking Configuration
CREATE TABLE IF NOT EXISTS benchmark_targets (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) UNIQUE,
    target_cogs_pct DECIMAL(5, 2) NOT NULL,
    target_cac_pct DECIMAL(5, 2) NOT NULL
);

-- Unit Economics View: The Financial Dissection Layer
CREATE OR REPLACE VIEW vw_unit_economics AS
SELECT 
    order_id,
    platform,
    gross_revenue,
    cogs,
    shipping_cost,
    transaction_fee,
    returns_reserve,
    order_timestamp,
    -- Calculation: COGS Percentage of Revenue
    CASE 
        WHEN gross_revenue = 0 THEN 0 
        ELSE (cogs / gross_revenue) * 100 
    END as cogs_pct,
    -- Calculation: Contribution Margin (Revenue minus all explicit costs)
    (gross_revenue - cogs - shipping_cost - transaction_fee - returns_reserve) as contribution_margin,
    -- Calculation: Contribution Margin Percentage
    CASE 
        WHEN gross_revenue = 0 THEN 0 
        ELSE ((gross_revenue - cogs - shipping_cost - transaction_fee - returns_reserve) / gross_revenue) * 100 
    END as margin_pct
FROM raw_orders;

-- Seed initial benchmarks
INSERT INTO benchmark_targets (category, target_cogs_pct, target_cac_pct) 
VALUES ('Standard', 30.00, 30.00)
ON CONFLICT (category) DO NOTHING;
