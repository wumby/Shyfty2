import Foundation

@MainActor
final class FeedViewModel: ObservableObject {
    @Published var signals: [Signal] = []
    @Published var selectedLeague: String = "ALL"
    @Published var selectedType: String = "ALL"
    @Published var isLoading = false
    @Published var errorMessage: String?

    func loadSignals() async {
        isLoading = true
        errorMessage = nil

        do {
            signals = try await APIClient.shared.fetchSignals(
                league: selectedLeague == "ALL" ? nil : selectedLeague,
                signalType: selectedType == "ALL" ? nil : selectedType
            )
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}

