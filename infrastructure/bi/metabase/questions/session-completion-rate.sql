-- =============================================================================
-- NextPhoton Analytics: Session Completion Rate Analysis
-- =============================================================================
-- Description: Comprehensive session analytics including completion rates,
--              cancellation patterns, educator performance, and subject trends
-- Data Source: Primary application database (PostgreSQL/NeonDB)
-- Refresh: Recommended every 30 minutes
-- Dashboard: Session Analytics, Educator Performance, Quality Metrics
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Session Completion Overview - Last 30 Days
-- -----------------------------------------------------------------------------
WITH session_metrics AS (
    SELECT
        DATE_TRUNC('day', scheduled_start_time) AS session_date,
        subject,
        session_type,
        educator_id,

        -- Session counts by status
        COUNT(*) AS total_sessions,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_sessions,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_sessions,
        COUNT(*) FILTER (WHERE status = 'no_show') AS no_show_sessions,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_sessions,
        COUNT(*) FILTER (WHERE status = 'scheduled') AS scheduled_sessions,

        -- Rating metrics
        AVG(rating) FILTER (WHERE status = 'completed') AS avg_rating,
        COUNT(*) FILTER (WHERE rating IS NOT NULL) AS rated_sessions,

        -- Duration metrics
        AVG(EXTRACT(EPOCH FROM (actual_end_time - actual_start_time)) / 60)
            FILTER (WHERE status = 'completed') AS avg_duration_minutes,

        -- Punctuality metrics
        COUNT(*) FILTER (
            WHERE status = 'completed'
            AND actual_start_time <= scheduled_start_time + INTERVAL '5 minutes'
        ) AS on_time_sessions,

        -- Revenue
        SUM(session_cost) FILTER (WHERE status = 'completed') AS total_revenue

    FROM learning_sessions
    WHERE scheduled_start_time >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY 1, 2, 3, 4
),

-- -----------------------------------------------------------------------------
-- Educator Performance Summary
-- -----------------------------------------------------------------------------
educator_performance AS (
    SELECT
        sm.educator_id,
        e.name AS educator_name,
        e.classification AS educator_level,

        SUM(sm.total_sessions) AS total_sessions,
        SUM(sm.completed_sessions) AS completed_sessions,
        SUM(sm.cancelled_sessions) AS cancelled_sessions,

        ROUND(
            SUM(sm.completed_sessions)::DECIMAL / NULLIF(SUM(sm.total_sessions), 0) * 100,
            2
        ) AS completion_rate,

        ROUND(AVG(sm.avg_rating), 2) AS avg_rating,
        ROUND(AVG(sm.avg_duration_minutes), 0) AS avg_duration_minutes,
        SUM(sm.total_revenue) AS total_revenue

    FROM session_metrics sm
    JOIN educator_profiles e ON e.id = sm.educator_id
    GROUP BY sm.educator_id, e.name, e.classification
),

-- -----------------------------------------------------------------------------
-- Subject Performance Summary
-- -----------------------------------------------------------------------------
subject_performance AS (
    SELECT
        subject,

        SUM(total_sessions) AS total_sessions,
        SUM(completed_sessions) AS completed_sessions,
        SUM(cancelled_sessions) AS cancelled_sessions,

        ROUND(
            SUM(completed_sessions)::DECIMAL / NULLIF(SUM(total_sessions), 0) * 100,
            2
        ) AS completion_rate,

        ROUND(AVG(avg_rating), 2) AS avg_rating,
        SUM(total_revenue) AS total_revenue

    FROM session_metrics
    GROUP BY subject
),

-- -----------------------------------------------------------------------------
-- Daily Completion Trends
-- -----------------------------------------------------------------------------
daily_trends AS (
    SELECT
        session_date,

        SUM(total_sessions) AS total_sessions,
        SUM(completed_sessions) AS completed_sessions,
        SUM(cancelled_sessions) AS cancelled_sessions,
        SUM(no_show_sessions) AS no_show_sessions,

        ROUND(
            SUM(completed_sessions)::DECIMAL / NULLIF(SUM(total_sessions), 0) * 100,
            2
        ) AS completion_rate,

        ROUND(
            SUM(cancelled_sessions)::DECIMAL / NULLIF(SUM(total_sessions), 0) * 100,
            2
        ) AS cancellation_rate,

        ROUND(AVG(avg_rating), 2) AS avg_rating,
        SUM(total_revenue) AS daily_revenue

    FROM session_metrics
    GROUP BY session_date
)

-- -----------------------------------------------------------------------------
-- Final Output: Daily Session Metrics with Trends
-- -----------------------------------------------------------------------------
SELECT
    dt.session_date::DATE AS date,
    dt.total_sessions,
    dt.completed_sessions,
    dt.cancelled_sessions,
    dt.no_show_sessions,
    dt.completion_rate,
    dt.cancellation_rate,
    dt.avg_rating,
    dt.daily_revenue,

    -- Week-over-Week comparison
    LAG(dt.completion_rate, 7) OVER (ORDER BY dt.session_date) AS completion_rate_prev_week,
    dt.completion_rate - LAG(dt.completion_rate, 7) OVER (ORDER BY dt.session_date) AS completion_rate_change,

    -- 7-Day Moving Averages
    ROUND(AVG(dt.completion_rate) OVER (
        ORDER BY dt.session_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 2) AS completion_rate_7day_avg,

    ROUND(AVG(dt.total_sessions) OVER (
        ORDER BY dt.session_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) AS sessions_7day_avg

FROM daily_trends dt
ORDER BY dt.session_date DESC;


-- =============================================================================
-- Cancellation Analysis by Reason
-- =============================================================================
-- SELECT
--     DATE_TRUNC('week', cancelled_at) AS week,
--     cancelled_by,
--     cancellation_reason,
--     COUNT(*) AS cancellation_count,
--     AVG(EXTRACT(EPOCH FROM (scheduled_start_time - cancelled_at)) / 3600)
--         AS avg_notice_hours,
--     ROUND(
--         COUNT(*)::DECIMAL / SUM(COUNT(*)) OVER (PARTITION BY DATE_TRUNC('week', cancelled_at)) * 100,
--         2
--     ) AS percentage
-- FROM learning_sessions
-- WHERE status = 'cancelled'
--   AND cancelled_at >= CURRENT_DATE - INTERVAL '90 days'
-- GROUP BY 1, 2, 3
-- ORDER BY week DESC, cancellation_count DESC;


-- =============================================================================
-- Session Type Performance Comparison
-- =============================================================================
-- SELECT
--     session_type,
--     COUNT(*) AS total_sessions,
--     COUNT(*) FILTER (WHERE status = 'completed') AS completed,
--     ROUND(
--         COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*) * 100,
--         2
--     ) AS completion_rate,
--     ROUND(AVG(rating) FILTER (WHERE status = 'completed'), 2) AS avg_rating,
--     ROUND(AVG(session_cost) FILTER (WHERE status = 'completed'), 2) AS avg_cost,
--     SUM(session_cost) FILTER (WHERE status = 'completed') AS total_revenue
-- FROM learning_sessions
-- WHERE scheduled_start_time >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY session_type
-- ORDER BY total_sessions DESC;


-- =============================================================================
-- Peak Hours Analysis
-- =============================================================================
-- SELECT
--     EXTRACT(HOUR FROM scheduled_start_time) AS hour_of_day,
--     EXTRACT(DOW FROM scheduled_start_time) AS day_of_week,
--     COUNT(*) AS total_sessions,
--     COUNT(*) FILTER (WHERE status = 'completed') AS completed,
--     ROUND(
--         COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*) * 100,
--         2
--     ) AS completion_rate
-- FROM learning_sessions
-- WHERE scheduled_start_time >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY 1, 2
-- ORDER BY total_sessions DESC;
