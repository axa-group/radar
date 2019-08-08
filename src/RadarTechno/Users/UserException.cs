using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace RadarTechno.Users
{
    public class UserException : Exception
    {
        public UserException() : base() { }

        public UserException(string message) : base(message) { }

        public UserException(string message, params object[] args)
            : base(String.Format(CultureInfo.CurrentCulture, message, args))
        {
        }
    }
}
