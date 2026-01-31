-- =============================================================================
-- NextPhoton Analytics: Monthly Revenue Analysis
-- =============================================================================
-- Description: Comprehensive revenue analytics including MRR, ARPU, cohort
--              analysis, payment methods, and financial forecasting
-- Data Source: Primary application database (PostgreSQL/NeonDB)
-- Refresh: Recommended daily for financial reporting
-- Dashboard: Financial, Executive Overview, Revenue Analysis
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Monthly Revenue Summary
-- -----------------------------------------------------------------------------
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', completed_at) AS revenue_month,

        -- Total Revenue
        SUM(amount) AS total_revenue,
        COUNT(*) AS transaction_count,
        COUNT(DISTINCT guardian_id) AS paying_customers,

        -- Revenue by Type
        SUM(amount) FILTER (WHERE transaction_type = 'session_payment') AS session_revenue,
        SUM(amount) FILTER (WHERE transaction_type = 'subscription') AS subscription_revenue,
        SUM(amount) FILTER (WHERE transaction_type = 'credit_pack') AS credit_pack_revenue,
        SUM(amount) FILTER (WHERE transaction_type = 'one_time') AS one_time_revenue,

        -- Revenue by Gateway
        SUM(amount) FILTER (WHERE payment_gateway = 'stripe') AS stripe_revenue,
        SUM(amount) FILTER (WHERE payment_gateway = 'razorpay') AS razorpay_revenue,

        -- Transaction counts by type
        COUNT(*) FILTER (WHERE transaction_type = 'subscription') AS subscription_count,
        COUNT(*) FILTER (WHERE transaction_type = 'session_payment') AS session_payment_count

    FROM transactions
    WHERE status = 'completed'
      AND completed_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
    GROUP BY 1
),

-- -----------------------------------------------------------------------------
-- Monthly Recurring Revenue (MRR)
-- -----------------------------------------------------------------------------
mrr_calculation AS (
    SELECT
        DATE_TRUNC('month', billing_period_start) AS mrr_month,

        -- New MRR (first-time subscribers)
        SUM(monthly_amount) FILTER (
            WHERE subscription_start_date >= DATE_TRUNC('month', billing_period_start)
        ) AS new_mrr,

        -- Expansion MRR (upgrades)
        SUM(amount_change) FILTER (
            WHERE amount_change > 0
            AND subscription_start_date < DATE_TRUNC('month', billing_period_start)
        ) AS expansion_mrr,

        -- Contraction MRR (downgrades)
        ABS(SUM(amount_change) FILTER (
            WHERE amount_change < 0
            AND status = 'active'
        )) AS contraction_mrr,

        -- Churned MRR (cancellations)
        SUM(monthly_amount) FILTER (
            WHERE status = 'cancelled'
            AND cancelled_at >= DATE_TRUNC('month', billing_period_start)
            AND cancelled_at < DATE_TRUNC('month', billing_period_start) + INTERVAL '1 month'
        ) AS churned_mrr,

        -- Active MRR
        SUM(monthly_amount) FILTER (WHERE status = 'active') AS active_mrr,

        -- Subscriber counts
        COUNT(DISTINCT guardian_id) FILTER (WHERE status = 'active') AS active_subscribers,
        COUNT(DISTINCT guardian_id) FILTER (
            WHERE subscription_start_date >= DATE_TRUNC('month', billing_period_start)
        ) AS new_subscribers,
        COUNT(DISTINCT guardian_id) FILTER (
            WHERE cancelled_at >= DATE_TRUNC('month', billing_period_start)
        ) AS churned_subscribers

    FROM subscriptions
    WHERE billing_period_start >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
    GROUP BY 1
),

-- -----------------------------------------------------------------------------
-- Average Revenue Per User (ARPU)
-- -----------------------------------------------------------------------------
arpu_calculation AS (
    SELECT
        DATE_TRUNC('month', t.completed_at) AS arpu_month,

        -- ARPU (All paying users)
        ROUND(
            SUM(t.amount)::DECIMAL / NULLIF(COUNT(DISTINCT t.guardian_id), 0),
            2
        ) AS arpu,

        -- ARPPU (Average Revenue Per Paying User - for session payments)
        ROUND(
            SUM(t.amount) FILTER (WHERE t.transaction_type = 'session_payment')::DECIMAL
            / NULLIF(COUNT(DISTINCT t.guardian_id) FILTER (WHERE t.transaction_type = 'session_payment'), 0),
            2
        ) AS arppu_sessions,

        -- Average Order Value
        ROUND(AVG(t.amount), 2) AS avg_order_value

    FROM transactions t
    WHERE t.status = 'completed'
      AND t.completed_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
    GROUP BY 1
),

-- -----------------------------------------------------------------------------
-- Revenue by Subscription Plan
-- -----------------------------------------------------------------------------
plan_revenue AS (
    SELECT
        DATE_TRUNC('month', t.completed_at) AS plan_month,
        s.plan_name,
        SUM(t.amount) AS revenue,
        COUNT(DISTINCT t.guardian_id) AS customers
    FROM transactions t
    JOIN subscriptions s ON s.id = t.subscription_id
    WHERE t.status = 'completed'
      AND t.transaction_type = 'subscription'
      AND t.completed_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
    GROUP BY 1, 2
)

-- -----------------------------------------------------------------------------
-- Final Output: Comprehensive Monthly Revenue Report
-- -----------------------------------------------------------------------------
SELECT
    mr.revenue_month::DATE AS month,

    -- Total Revenue Metrics
    mr.total_revenue,
    mr.transaction_count,
    mr.paying_customers,

    -- Revenue Breakdown
    mr.session_revenue,
    mr.subscription_revenue,
    mr.credit_pack_revenue,
    ROUND(mr.subscription_revenue::DECIMAL / NULLIF(mr.total_revenue, 0) * 100, 2) AS subscription_revenue_pct,

    -- MRR Metrics
    COALESCE(mrr.active_mrr, 0) AS mrr,
    COALESCE(mrr.new_mrr, 0) AS new_mrr,
    COALESCE(mrr.expansion_mrr, 0) AS expansion_mrr,
    COALESCE(mrr.contraction_mrr, 0) AS contraction_mrr,
    COALESCE(mrr.churned_mrr, 0) AS churned_mrr,

    -- Net MRR Change
    COALESCE(mrr.new_mrr, 0) + COALESCE(mrr.expansion_mrr, 0)
    - COALESCE(mrr.contraction_mrr, 0) - COALESCE(mrr.churned_mrr, 0) AS net_mrr_change,

    -- Subscriber Metrics
    COALESCE(mrr.active_subscribers, 0) AS active_subscribers,
    COALESCE(mrr.new_subscribers, 0) AS new_subscribers,
    COALESCE(mrr.churned_subscribers, 0) AS churned_subscribers,

    -- Churn Rate
    ROUND(
        COALESCE(mrr.churned_subscribers, 0)::DECIMAL
        / NULLIF(LAG(mrr.active_subscribers) OVER (ORDER BY mr.revenue_month), 0) * 100,
        2
    ) AS subscriber_churn_rate,

    ROUND(
        COALESCE(mrr.churned_mrr, 0)::DECIMAL
        / NULLIF(LAG(mrr.active_mrr) OVER (ORDER BY mr.revenue_month), 0) * 100,
        2
    ) AS revenue_churn_rate,

    -- ARPU Metrics
    arpu.arpu,
    arpu.arppu_sessions,
    arpu.avg_order_value,

    -- Month-over-Month Growth
    ROUND(
        (mr.total_revenue - LAG(mr.total_revenue) OVER (ORDER BY mr.revenue_month))::DECIMAL
        / NULLIF(LAG(mr.total_revenue) OVER (ORDER BY mr.revenue_month), 0) * 100,
        2
    ) AS revenue_growth_pct,

    -- Year-over-Year Comparison
    LAG(mr.total_revenue, 12) OVER (ORDER BY mr.revenue_month) AS revenue_prev_year,
    ROUND(
        (mr.total_revenue - LAG(mr.total_revenue, 12) OVER (ORDER BY mr.revenue_month))::DECIMAL
        / NULLIF(LAG(mr.total_revenue, 12) OVER (ORDER BY mr.revenue_month), 0) * 100,
        2
    ) AS yoy_growth_pct

FROM monthly_revenue mr
LEFT JOIN mrr_calculation mrr ON mrr.mrr_month = mr.revenue_month
LEFT JOIN arpu_calculation arpu ON arpu.arpu_month = mr.revenue_month
ORDER BY mr.revenue_month DESC;


-- =============================================================================
-- Revenue Cohort Analysis (LTV by Signup Month)
-- =============================================================================
-- WITH user_cohorts AS (
--     SELECT
--         u.id AS user_id,
--         DATE_TRUNC('month', u.created_at) AS cohort_month,
--         u.created_at AS signup_date
--     FROM users u
--     WHERE u.role = 'guardian'
-- ),
-- cohort_revenue AS (
--     SELECT
--         uc.cohort_month,
--         DATE_TRUNC('month', t.completed_at) AS revenue_month,
--         EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', t.completed_at), uc.cohort_month)) AS months_since_signup,
--         COUNT(DISTINCT uc.user_id) AS customers,
--         SUM(t.amount) AS revenue
--     FROM user_cohorts uc
--     LEFT JOIN transactions t ON t.guardian_id = uc.user_id AND t.status = 'completed'
--     WHERE t.completed_at >= uc.signup_date
--     GROUP BY 1, 2, 3
-- )
-- SELECT
--     cohort_month::DATE AS cohort,
--     months_since_signup,
--     customers,
--     revenue,
--     ROUND(revenue::DECIMAL / NULLIF(customers, 0), 2) AS revenue_per_customer,
--     SUM(revenue) OVER (
--         PARTITION BY cohort_month
--         ORDER BY months_since_signup
--     ) AS cumulative_revenue
-- FROM cohort_revenue
-- ORDER BY cohort_month DESC, months_since_signup;


-- =============================================================================
-- Payment Method Performance
-- =============================================================================
-- SELECT
--     DATE_TRUNC('month', completed_at) AS month,
--     payment_gateway,
--     payment_method,
--     COUNT(*) AS transaction_count,
--     SUM(amount) AS total_revenue,
--     ROUND(AVG(amount), 2) AS avg_transaction_value,
--     COUNT(*) FILTER (WHERE status = 'failed') AS failed_count,
--     ROUND(
--         COUNT(*) FILTER (WHERE status = 'failed')::DECIMAL / COUNT(*) * 100,
--         2
--     ) AS failure_rate
-- FROM transactions
-- WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
-- GROUP BY 1, 2, 3
-- ORDER BY month DESC, total_revenue DESC;
