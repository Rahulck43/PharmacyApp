using System.Text.Json;
using Microsoft.Extensions.Options;
using PharmacyApp.Infrastructure.Options;

namespace PharmacyApp.Infrastructure.Persistence;

public sealed class JsonDataStore : IDisposable
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true
    };

    private readonly SemaphoreSlim _lock = new(1, 1);
    private readonly string _filePath;

    public JsonDataStore(IOptions<StorageOptions> options)
    {
        _filePath = Path.GetFullPath(options.Value.FilePath);
    }

    public async Task<T> ReadAsync<T>(Func<PharmacyData, T> read, CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken);
        try
        {
            var data = await LoadAsync(cancellationToken);
            return read(data);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<T> UpdateAsync<T>(Func<PharmacyData, T> update, CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken);
        try
        {
            var data = await LoadAsync(cancellationToken);
            var result = update(data);
            await SaveAsync(data, cancellationToken);
            return result;
        }
        finally
        {
            _lock.Release();
        }
    }

    public Task UpdateAsync(Action<PharmacyData> update, CancellationToken cancellationToken) =>
        UpdateAsync(data =>
        {
            update(data);
            return true;
        }, cancellationToken);

    public void Dispose() => _lock.Dispose();

    private async Task<PharmacyData> LoadAsync(CancellationToken cancellationToken)
    {
        if (!File.Exists(_filePath))
        {
            var empty = new PharmacyData();
            await SaveAsync(empty, cancellationToken);
            return empty;
        }

        await using var stream = File.OpenRead(_filePath);
        return await JsonSerializer.DeserializeAsync<PharmacyData>(stream, SerializerOptions, cancellationToken)
            ?? new PharmacyData();
    }

    private async Task SaveAsync(PharmacyData data, CancellationToken cancellationToken)
    {
        var directory = Path.GetDirectoryName(_filePath);
        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }

        var tempPath = _filePath + ".tmp";

        await using (var stream = File.Create(tempPath))
        {
            await JsonSerializer.SerializeAsync(stream, data, SerializerOptions, cancellationToken);
        }

        File.Move(tempPath, _filePath, overwrite: true);
    }
}
