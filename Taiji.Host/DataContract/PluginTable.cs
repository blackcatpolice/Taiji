using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Taiji.Host.DataContract
{
    public class PluginTable : Dictionary<string, PluginItem>
    {
    }

    public class PluginItem
    {
        public string Name { get; set; }
        public string Version { get; set; }
        public string TargetUrl { get; set; }
    }
}
