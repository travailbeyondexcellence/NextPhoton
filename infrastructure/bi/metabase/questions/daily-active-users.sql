-- =============================================================================
-- NextPhoton Analytics: Daily Active Users (DAU) Query
-- =============================================================================
-- Description: Calculates daily, weekly, and monthly active users with trends
-- Data Source: Primary application database (PostgreSQL/NeonDB)
-- Refresh: Recommended every 15 minutes for real-time dashboard
-- Dashboard: Executive Overview, User Growth
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Daily Active Users (DAU) - Last 30 Days
-- Users who performed any meaningful activity
-- -----------------------------------------------------------------------------
WITH daily_activity AS (
    SELECT
        DATE_TRUNC('day', created_at) AS activity_date,
        user_id,
        COUNT(*) AS activity_count
    FROM user_activity_logs
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      AND activity_type IN ('session_attended', 'assignment_submitted', 'login', 'feature_used')
    GROUP BY 1, 2
),

-- -----------------------------------------------------------------------------
-- DAU by Day
-- -----------------------------------------------------------------------------
dau_by_day AS (
    SELECT
        activity_date,
        COUNT(DISTINCT user_id) AS dau,
        SUM(activity_count) AS total_activities
    FROM daily_activity
    GROUP BY activity_date
),

-- -----------------------------------------------------------------------------
-- Weekly Active Users (WAU) - Rolling 7-day window
-- -----------------------------------------------------------------------------
wau_by_day AS (
    SELECT
        d.activity_date,
        COUNT(DISTINCT da.user_id) AS wau
    FROM (
        SELECT DISTINCT activity_date FROM dau_by_day
    ) d
    LEFT JOIN daily_activity da
        ON da.activity_date BETWEEN d.activity_date - INTERVAL '6 days' AND d.activity_date
    GROUP BY d.activity_date
),

-- -----------------------------------------------------------------------------
-- Monthly Active Users (MAU) - Rolling 30-day window
-- -----------------------------------------------------------------------------
mau_by_day AS (
    SELECT
        d.activity_date,
        COUNT(DISTINCT da.user_id) AS mau
    FROM (
        SELECT DISTINCT activity_date FROM dau_by_day
    ) d
    LEFT JOIN daily_activity da
        ON da.activity_date BETWEEN d.activity_date - INTERVAL '29 days' AND d.activity_date
    GROUP BY d.activity_date
),

-- -----------------------------------------------------------------------------
-- DAU by User Role
-- -----------------------------------------------------------------------------
dau_by_role AS (
    SELECT
        da.activity_date,
        u.role,
        COUNT(DISTINCT da.user_id) AS dau
    FROM daily_activity da
    JOIN users u ON u.id = da.user_id
    GROUP BY da.activity_date, u.role
)

-- -----------------------------------------------------------------------------
-- Final Output: Combined DAU/WAU/MAU with Engagement Ratio
-- -----------------------------------------------------------------------------
SELECT
    d.activity_date::DATE AS date,
    d.dau,
    d.total_activities,
    w.wau,
    m.mau,

    -- Engagement Ratios
    ROUND(d.dau::DECIMAL / NULLIF(w.wau, 0) * 100, 2) AS dau_wau_ratio,
    ROUND(d.dau::DECIMAL / NULLIF(m.mau, 0) * 100, 2) AS dau_mau_ratio,
    ROUND(w.wau::DECIMAL / NULLIF(m.mau, 0) * 100, 2) AS wau_mau_ratio,

    -- Day-over-Day Growth
    ROUND(
        (d.dau - LAG(d.dau) OVER (ORDER BY d.activity_date))::DECIMAL
        / NULLIF(LAG(d.dau) OVER (ORDER BY d.activity_date), 0) * 100,
        2
    ) AS dau_growth_pct,

    -- 7-Day Moving Average
    ROUND(AVG(d.dau) OVER (
        ORDER BY d.activity_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) AS dau_7day_avg

FROM dau_by_day d
LEFT JOIN wau_by_day w ON w.activity_date = d.activity_date
LEFT JOIN mau_by_day m ON m.activity_date = d.activity_date
ORDER BY d.activity_date DESC;


-- =============================================================================
-- Supporting Query: DAU Breakdown by Role
-- =============================================================================
-- SELECT
--     activity_date::DATE AS date,
--     role,
--     dau,
--     ROUND(dau::DECIMAL / SUM(dau) OVER (PARTITION BY activity_date) * 100, 2) AS percentage
-- FROM dau_by_role
-- ORDER BY activity_date DESC, dau DESC;


-- =============================================================================
-- Supporting Query: New vs Returning Users
-- =============================================================================
-- WITH user_first_activity AS (
--     SELECT
--         user_id,
--         MIN(DATE_TRUNC('day', created_at)) AS first_activity_date
--     FROM user_activity_logs
--     GROUP BY user_id
-- ),
-- daily_users AS (
--     SELECT
--         DATE_TRUNC('day', ua.created_at) AS activity_date,
--         ua.user_id,
--         CASE
--             WHEN ufa.first_activity_date = DATE_TRUNC('day', ua.created_at)
--             THEN 'new'
--             ELSE 'returning'
--         END AS user_type
--     FROM user_activity_logs ua
--     JOIN user_first_activity ufa ON ufa.user_id = ua.user_id
--     WHERE ua.created_at >= CURRENT_DATE - INTERVAL '30 days'
-- )
-- SELECT
--     activity_date::DATE AS date,
--     COUNT(DISTINCT CASE WHEN user_type = 'new' THEN user_id END) AS new_users,
--     COUNT(DISTINCT CASE WHEN user_type = 'returning' THEN user_id END) AS returning_users,
--     COUNT(DISTINCT user_id) AS total_dau
-- FROM daily_users
-- GROUP BY activity_date
-- ORDER BY activity_date DESC;
