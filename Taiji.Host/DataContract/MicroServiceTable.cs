using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taiji.Host.DataContract
{
    public class MicroServiceTable : Dictionary<string, MicroServiceTableItem>
    {
    }

    public class MicroServiceTableItem
    {
        public string Name { get; set; }
        public string Version { get; set; }
        public string ProdUrl { get; set; } 
        public string DevUrl { get; set; }
    }
}
