namespace RadarTechno
{
    public class Filter
    {
        public Filter(string field, string value)
        {
            this.Field = field;
            this.Value = value;
        }

        public string Field { get; set; }
        public string Value { get; set; }
    }
}