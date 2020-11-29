using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taiji.Framework.Interfaces;

namespace Taiji.Host.DataContract
{
    public class PluginTable:Dictionary<string, PluginItem>
    {
        
    }
    public class PluginItem
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public string Version { get; set; } 
        public string ServiceBackendUrl { get; set; }
        public string ServiceFrontendUrl { get; set; }
        public IServiceBootloader Bootloader { get; internal set; }
    }
}
