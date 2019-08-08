using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RadarTechno
{
    public class Validation
    {
        public bool Validate(object model, bool isRecurssive = false)
        {
            if (model == null)
            {
                return false;
            }
            var context = new ValidationContext(model, null, null);
            var list = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(model, context, list, true);
            if (!isValid)
            {
                return false;
            }
            return true;
        }
    }
}
