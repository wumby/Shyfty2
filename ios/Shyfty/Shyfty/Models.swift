import Foundation

struct Signal: Identifiable, Decodable, Hashable {
    struct SummaryTemplateInputs: Decodable, Hashable {
        let currentValue: Double
        let baselineValue: Double
        let movementPct: Double?
        let baselineWindow: String
        let trendDirection: String

        enum CodingKeys: String, CodingKey {
            case currentValue = "current_value"
            case baselineValue = "baseline_value"
            case movementPct = "movement_pct"
            case baselineWindow = "baseline_window"
            case trendDirection = "trend_direction"
        }
    }

    let id: Int
    let playerID: Int
    let playerName: String
    let teamName: String
    let leagueName: String
    let signalType: String
    let metricName: String
    let currentValue: Double
    let baselineValue: Double
    let zScore: Double
    let explanation: String
    let importance: Double
    let baselineWindow: String
    let eventDate: Date
    let movementPct: Double?
    let metricLabel: String
    let trendDirection: String
    let summaryTemplate: String
    let summaryTemplateInputs: SummaryTemplateInputs
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case playerID = "player_id"
        case playerName = "player_name"
        case teamName = "team_name"
        case leagueName = "league_name"
        case signalType = "signal_type"
        case metricName = "metric_name"
        case currentValue = "current_value"
        case baselineValue = "baseline_value"
        case zScore = "z_score"
        case explanation
        case importance
        case baselineWindow = "baseline_window"
        case eventDate = "event_date"
        case movementPct = "movement_pct"
        case metricLabel = "metric_label"
        case trendDirection = "trend_direction"
        case summaryTemplate = "summary_template"
        case summaryTemplateInputs = "summary_template_inputs"
        case createdAt = "created_at"
    }
}

struct Player: Identifiable, Decodable, Hashable {
    let id: Int
    let name: String
    let position: String
    let teamName: String
    let leagueName: String
    let signalCount: Int?

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case position
        case teamName = "team_name"
        case leagueName = "league_name"
        case signalCount = "signal_count"
    }
}

struct MetricSeriesPoint: Decodable, Hashable {
    let gameDate: Date
    let metrics: [String: Double]

    enum CodingKeys: String, CodingKey {
        case gameDate = "game_date"
        case metrics
    }
}
