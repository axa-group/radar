using System.Threading.Tasks;

namespace RadarTechno.Users
{
    public interface IUserService
    {
        Task<User> Authenticate(string email, string password);
        Task<User> Create(RegisterUser registerUser);
        Task<User> GetById(string id);
        Task HandleNewAdminsRoles(string[] oldAdminList, string[] newAdminList, string entityId);
    }
}
