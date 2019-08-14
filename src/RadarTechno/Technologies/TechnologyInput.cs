using System;
using System.ComponentModel.DataAnnotations;

namespace RadarTechno.Technologies
{
    public class TechnologyInput
    {
        
        public string Id
        {
            get;
            set;
        }
        
        public int Version { get; set; } = 0;

        [Required]
        [StringLength(256)]
        public string Name { get; set; }
        
        public string Key { get; set; }

        [Required]
        public string Category { get; set; }

        [StringLength(4096)]
        public string Description { get; set; }

        [StringLength(4096)]
        public string Scope { get; set; }

        public string Reporter { get; set; }
        
        public DateTime UpdateDate { get; set; } = DateTime.Now;
    }
}