using MongoDB.Driver;

namespace RadarTechno
{
    public interface IRadarDatabase
    {
        IMongoCollection<T> GetCollection<T>(string name);
    }
}