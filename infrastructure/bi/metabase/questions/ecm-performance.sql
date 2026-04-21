-- =============================================================================
-- NextPhoton Analytics: ECM (EduCare Manager) Performance Analysis
-- =============================================================================
-- Description: Comprehensive analytics for ECM effectiveness including
--              learner ratios, intervention rates, response times, and outcomes
-- Data Source: Primary application database (PostgreSQL/NeonDB)
-- Refresh: Recommended every hour
-- Dashboard: ECM Performance, Quality Metrics, Operations
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ECM Overview Metrics
-- -----------------------------------------------------------------------------
WITH ecm_learner_counts AS (
    SELECT
        e.id AS ecm_id,
        e.user_id,
        e.name AS ecm_name,
        e.classification AS ecm_level,
        e.max_learners_capacity,
        e.is_active,
        e.hired_at,

        -- Learner counts
        COUNT(DISTINCT l.id) AS assigned_learners,
        COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'active') AS active_learners,
        COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'at_risk') AS at_risk_learners,

        -- Capacity utilization
        ROUND(
            COUNT(DISTINCT l.id)::DECIMAL / NULLIF(e.max_learners_capacity, 0) * 100,
            2
        ) AS capacity_utilization_pct

    FROM ecm_profiles e
    LEFT JOIN learner_profiles l ON l.ecm_id = e.id
    WHERE e.is_active = TRUE
    GROUP BY e.id, e.user_id, e.name, e.classification, e.max_learners_capacity, e.is_active, e.hired_at
),

-- -----------------------------------------------------------------------------
-- ECM Activity Metrics (Last 30 Days)
-- -----------------------------------------------------------------------------
ecm_activities AS (
    SELECT
        ecm_id,

        -- Communication metrics
        COUNT(*) FILTER (WHERE activity_type = 'guardian_contact') AS guardian_contacts,
        COUNT(*) FILTER (WHERE activity_type = 'learner_check_in') AS learner_check_ins,
        COUNT(*) FILTER (WHERE activity_type = 'progress_review') AS progress_reviews,
        COUNT(*) FILTER (WHERE activity_type = 'intervention') AS interventions,
        COUNT(*) FILTER (WHERE activity_type = 'educator_coordination') AS educator_coordinations,

        -- Response time metrics (in hours)
        AVG(response_time_minutes) / 60.0 AS avg_response_time_hours,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time_minutes) / 60.0 AS median_response_time_hours,

        -- Activity volume
        COUNT(*) AS total_activities

    FROM ecm_activity_logs
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY ecm_id
),

-- -----------------------------------------------------------------------------
-- Learner Outcome Metrics per ECM
-- -----------------------------------------------------------------------------
ecm_outcomes AS (
    SELECT
        l.ecm_id,

        -- Session metrics for ECM's learners
        COUNT(DISTINCT ls.id) AS total_sessions,
        COUNT(DISTINCT ls.id) FILTER (WHERE ls.status = 'completed') AS completed_sessions,
        ROUND(
            COUNT(DISTINCT ls.id) FILTER (WHERE ls.status = 'completed')::DECIMAL
            / NULLIF(COUNT(DISTINCT ls.id), 0) * 100,
            2
        ) AS session_completion_rate,

        -- Assignment metrics
        COUNT(DISTINCT a.id) AS total_assignments,
        COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'submitted' AND a.submitted_at <= a.due_date) AS on_time_submissions,
        ROUND(
            COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'submitted' AND a.submitted_at <= a.due_date)::DECIMAL
            / NULLIF(COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'submitted'), 0) * 100,
            2
        ) AS on_time_submission_rate,

        -- Progress metrics
        AVG(pr.overall_score) AS avg_learner_progress_score,

        -- Satisfaction metrics
        AVG(f.rating) FILTER (WHERE f.feedback_type = 'ecm_satisfaction') AS avg_satisfaction_rating

    FROM learner_profiles l
    LEFT JOIN learning_sessions ls ON ls.learner_id = l.id
        AND ls.scheduled_start_time >= CURRENT_DATE - INTERVAL '30 days'
    LEFT JOIN assignments a ON a.learner_id = l.id
        AND a.created_at >= CURRENT_DATE - INTERVAL '30 days'
    LEFT JOIN progress_records pr ON pr.learner_id = l.id
        AND pr.recorded_at >= CURRENT_DATE - INTERVAL '30 days'
    LEFT JOIN feedback f ON f.ecm_id = l.ecm_id
        AND f.created_at >= CURRENT_DATE - INTERVAL '30 days'
    WHERE l.ecm_id IS NOT NULL
    GROUP BY l.ecm_id
),

-- -----------------------------------------------------------------------------
-- Intervention Effectiveness
-- -----------------------------------------------------------------------------
intervention_metrics AS (
    SELECT
        i.ecm_id,

        -- Intervention counts by type
        COUNT(*) AS total_interventions,
        COUNT(*) FILTER (WHERE i.intervention_type = 'academic') AS academic_interventions,
        COUNT(*) FILTER (WHERE i.intervention_type = 'behavioral') AS behavioral_interventions,
        COUNT(*) FILTER (WHERE i.intervention_type = 'attendance') AS attendance_interventions,

        -- Intervention outcomes
        COUNT(*) FILTER (WHERE i.outcome = 'successful') AS successful_interventions,
        COUNT(*) FILTER (WHERE i.outcome = 'partial') AS partial_interventions,
        COUNT(*) FILTER (WHERE i.outcome = 'unsuccessful') AS unsuccessful_interventions,

        ROUND(
            COUNT(*) FILTER (WHERE i.outcome = 'successful')::DECIMAL
            / NULLIF(COUNT(*), 0) * 100,
            2
        ) AS intervention_success_rate,

        -- Time to resolution
        AVG(EXTRACT(EPOCH FROM (i.resolved_at - i.created_at)) / 86400) AS avg_resolution_days

    FROM interventions i
    WHERE i.created_at >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY i.ecm_id
)

-- -----------------------------------------------------------------------------
-- Final Output: Comprehensive ECM Performance Report
-- -----------------------------------------------------------------------------
SELECT
    elc.ecm_id,
    elc.ecm_name,
    elc.ecm_level,
    elc.is_active,
    DATE_PART('day', CURRENT_DATE - elc.hired_at) AS tenure_days,

    -- Capacity Metrics
    elc.assigned_learners,
    elc.active_learners,
    elc.at_risk_learners,
    elc.max_learners_capacity,
    elc.capacity_utilization_pct,

    -- Learner Risk Ratio
    ROUND(
        elc.at_risk_learners::DECIMAL / NULLIF(elc.active_learners, 0) * 100,
        2
    ) AS at_risk_ratio_pct,

    -- Activity Metrics
    COALESCE(ea.total_activities, 0) AS total_activities_30d,
    COALESCE(ea.guardian_contacts, 0) AS guardian_contacts_30d,
    COALESCE(ea.learner_check_ins, 0) AS learner_check_ins_30d,
    COALESCE(ea.progress_reviews, 0) AS progress_reviews_30d,
    COALESCE(ea.interventions, 0) AS interventions_30d,

    -- Response Time
    ROUND(COALESCE(ea.avg_response_time_hours, 0)::DECIMAL, 2) AS avg_response_time_hours,
    ROUND(COALESCE(ea.median_response_time_hours, 0)::DECIMAL, 2) AS median_response_time_hours,

    -- Activity per Learner
    ROUND(
        COALESCE(ea.total_activities, 0)::DECIMAL / NULLIF(elc.active_learners, 0),
        2
    ) AS activities_per_learner,

    -- Outcome Metrics
    COALESCE(eo.session_completion_rate, 0) AS learner_session_completion_rate,
    COALESCE(eo.on_time_submission_rate, 0) AS learner_on_time_submission_rate,
    ROUND(COALESCE(eo.avg_learner_progress_score, 0)::DECIMAL, 2) AS avg_learner_progress_score,
    ROUND(COALESCE(eo.avg_satisfaction_rating, 0)::DECIMAL, 2) AS avg_satisfaction_rating,

    -- Intervention Metrics
    COALESCE(im.total_interventions, 0) AS total_interventions_90d,
    COALESCE(im.intervention_success_rate, 0) AS intervention_success_rate,
    ROUND(COALESCE(im.avg_resolution_days, 0)::DECIMAL, 1) AS avg_intervention_resolution_days,

    -- ECM Performance Score (Weighted Composite)
    ROUND(
        (
            COALESCE(eo.session_completion_rate, 0) * 0.25 +
            COALESCE(eo.on_time_submission_rate, 0) * 0.20 +
            COALESCE(im.intervention_success_rate, 0) * 0.25 +
            COALESCE(eo.avg_satisfaction_rating, 0) * 20 +
            LEAST(100, COALESCE(ea.total_activities, 0)::DECIMAL / NULLIF(elc.active_learners, 0) * 10) * 0.10
        ),
        2
    ) AS ecm_performance_score

FROM ecm_learner_counts elc
LEFT JOIN ecm_activities ea ON ea.ecm_id = elc.ecm_id
LEFT JOIN ecm_outcomes eo ON eo.ecm_id = elc.ecm_id
LEFT JOIN intervention_metrics im ON im.ecm_id = elc.ecm_id
WHERE elc.is_active = TRUE
ORDER BY ecm_performance_score DESC NULLS LAST;


-- =============================================================================
-- ECM Workload Distribution
-- =============================================================================
-- SELECT
--     ecm_level,
--     COUNT(*) AS ecm_count,
--     SUM(assigned_learners) AS total_learners,
--     ROUND(AVG(assigned_learners), 1) AS avg_learners_per_ecm,
--     ROUND(AVG(capacity_utilization_pct), 2) AS avg_capacity_utilization,
--     MIN(assigned_learners) AS min_learners,
--     MAX(assigned_learners) AS max_learners
-- FROM ecm_learner_counts
-- WHERE is_active = TRUE
-- GROUP BY ecm_level
-- ORDER BY ecm_level;


-- =============================================================================
-- ECM Activity Trends (Weekly)
-- =============================================================================
-- SELECT
--     DATE_TRUNC('week', created_at) AS week,
--     activity_type,
--     COUNT(*) AS activity_count,
--     COUNT(DISTINCT ecm_id) AS active_ecms,
--     ROUND(AVG(response_time_minutes) / 60.0, 2) AS avg_response_hours
-- FROM ecm_activity_logs
-- WHERE created_at >= CURRENT_DATE - INTERVAL '12 weeks'
-- GROUP BY 1, 2
-- ORDER BY week DESC, activity_count DESC;


-- =============================================================================
-- At-Risk Learner Analysis by ECM
-- =============================================================================
-- SELECT
--     e.name AS ecm_name,
--     l.id AS learner_id,
--     l.name AS learner_name,
--     l.risk_score,
--     l.risk_factors,
--     l.last_session_date,
--     l.days_since_activity,
--     i.intervention_count,
--     i.last_intervention_date
-- FROM learner_profiles l
-- JOIN ecm_profiles e ON e.id = l.ecm_id
-- LEFT JOIN (
--     SELECT
--         learner_id,
--         COUNT(*) AS intervention_count,
--         MAX(created_at) AS last_intervention_date
--     FROM interventions
--     GROUP BY learner_id
-- ) i ON i.learner_id = l.id
-- WHERE l.status = 'at_risk'
-- ORDER BY l.risk_score DESC, e.name;
