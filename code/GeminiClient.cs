using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using System;
using System.IO;

namespace code
{
    public class GeminiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
    private readonly string _endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";

        public GeminiClient()
        {
            _httpClient = new HttpClient();
            _apiKey = LoadApiKey();
        }

        private string LoadApiKey()
        {
            var envPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ".env");
            if (!File.Exists(envPath))
                throw new Exception(".env file not found");
            foreach (var line in File.ReadAllLines(envPath))
            {
                if (line.StartsWith("GEMINI_API_KEY="))
                    return line.Substring("GEMINI_API_KEY=".Length).Trim();
            }
            throw new Exception("GEMINI_API_KEY not found in .env");
        }

        public async Task<string> AskAsync(string prompt)
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            string raw = string.Empty;
            try
            {
                var response = await _httpClient.PostAsync(_endpoint + "?key=" + _apiKey, content);
                raw = await response.Content.ReadAsStringAsync();
                if (!response.IsSuccessStatusCode)
                {
                    // Try to extract error message from Gemini API
                    try
                    {
                        using var errDoc = JsonDocument.Parse(raw);
                        if (errDoc.RootElement.TryGetProperty("error", out var errorProp))
                        {
                            var msg = errorProp.GetProperty("message").GetString();
                            return $"Gemini API error: {msg}";
                        }
                    }
                    catch { }
                    return $"Gemini API error: {response.StatusCode} - {raw}";
                }
                using var doc = JsonDocument.Parse(raw);
                var root = doc.RootElement;
                if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                {
                    var candidate = candidates[0];
                    if (candidate.TryGetProperty("content", out var contentProp))
                    {
                        if (contentProp.TryGetProperty("parts", out var parts) && parts.GetArrayLength() > 0)
                        {
                            var part = parts[0];
                            if (part.TryGetProperty("text", out var text))
                                return text.GetString() ?? "";
                        }
                    }
                }
                return "No answer from Gemini API.";
            }
            catch (Exception ex)
            {
                return $"Gemini API call failed: {ex.Message}\nRaw response: {raw}";
            }
        }
    }
}
