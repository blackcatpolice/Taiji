using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Taiji.Framework.Interfaces;
using Taiji.Host.DataContract;

namespace Taiji.Host.Services
{
    public class PluginCollector
    {
        public PluginCollector(PluginTable pluginTable)
        {
            //collect 内置插件
            var currDir = AppContext.BaseDirectory;
            var getTargetPluginDll = Directory.GetFiles(currDir, "Taiji.*.dll");
            foreach (var dllItem in getTargetPluginDll)
            {
                var ass = Assembly.LoadFile(dllItem);
                var assTypes = ass.GetTypes();
                var bootloaderType = assTypes.Where(x => x.GetInterfaces().Contains(typeof(IServiceBootloader))).FirstOrDefault();
                if (bootloaderType == null) continue;
                var bootloader = (IServiceBootloader)Activator.CreateInstance(bootloaderType);
                pluginTable.Add(bootloader.Name, new PluginItem
                {
                    Name = bootloader.Name,
                    Description = bootloader.Description,
                    Icon = bootloader.Icon,
                    Version = bootloader.Version,
                    ServiceBackendUrl = bootloader.ServiceBackendUrl,
                    ServiceFrontendUrl = bootloader.ServiceFrontendUrl,
                    Bootloader = bootloader
                });
            }
        }
    }
}
