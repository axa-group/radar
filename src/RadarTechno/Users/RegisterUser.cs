using System.ComponentModel.DataAnnotations;

namespace RadarTechno.Users
{
    public class RegisterUser
    {

        public RegisterUser(string name, string email, string password, string entity, string role)
        {
            Name = name;
            Email = email;
            Password = password;
            EntityList = new string[] {entity};
            Role = role;
        }

        [StringLength(256, MinimumLength = 2)]
        [RegularExpression("^[a-zâãäåæçèéêëìíîïðñòóôõøùúûüýþÿiA-Z -]*$")]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }
        // Not an AXA standard 
        [Required] 
        [StringLength(256, MinimumLength = 7)]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public string[] EntityList { get; set; }
    }
}