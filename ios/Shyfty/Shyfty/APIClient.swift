import Foundation

final class APIClient {
    static let shared = APIClient()

    private let decoder: JSONDecoder
    private let baseURL: URL

    private init() {
        decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        baseURL = Self.resolveBaseURL()
    }

    func fetchSignals(league: String? = nil, signalType: String? = nil) async throws -> [Signal] {
        var components = URLComponents(url: baseURL.appendingPathComponent("signals"), resolvingAgainstBaseURL: false)!
        components.queryItems = [
            league.map { URLQueryItem(name: "league", value: $0) },
            signalType.map { URLQueryItem(name: "signal_type", value: $0) },
            URLQueryItem(name: "limit", value: "50")
        ].compactMap { $0 }
        let (data, _) = try await URLSession.shared.data(from: components.url!)
        return try decoder.decode([Signal].self, from: data)
    }

    func fetchPlayer(id: Int) async throws -> Player {
        let (data, _) = try await URLSession.shared.data(from: baseURL.appendingPathComponent("players/\(id)"))
        return try decoder.decode(Player.self, from: data)
    }

    func fetchPlayerSignals(id: Int) async throws -> [Signal] {
        let (data, _) = try await URLSession.shared.data(from: baseURL.appendingPathComponent("players/\(id)/signals"))
        return try decoder.decode([Signal].self, from: data)
    }

    func fetchPlayerMetrics(id: Int) async throws -> [MetricSeriesPoint] {
        let (data, _) = try await URLSession.shared.data(from: baseURL.appendingPathComponent("players/\(id)/metrics"))
        return try decoder.decode([MetricSeriesPoint].self, from: data)
    }

    private static func resolveBaseURL() -> URL {
#if targetEnvironment(simulator)
        return URL(string: "http://127.0.0.1:8001/api")!
#else
        guard
            let configuredBaseURL = Bundle.main.object(forInfoDictionaryKey: "ShyftyAPIBaseURL") as? String,
            let baseURL = URL(string: configuredBaseURL),
            !configuredBaseURL.isEmpty
        else {
            preconditionFailure("Missing ShyftyAPIBaseURL in Info.plist for physical-device builds")
        }

        return baseURL
#endif
    }
}
