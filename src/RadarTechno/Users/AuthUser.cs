using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RadarTechno.Users
{
    public class AuthUser
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(256, MinimumLength = 7)]
        public string Password { get; set; }
    }
}
