using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Taiji.Framework.Interfaces
{
    public interface IServiceBootloader
    {
        string ServiceBackendUrl { get; set; }

        string ServiceFrontendUrl { get; set; }

        string Version { get; set; }

        string Name { get; set; }

        string Icon { get; set; }

        string Description { get; set; }

        void RegistService(IServiceCollection services);

        IApplicationBuilder RegistAppContext(IApplicationBuilder applicationBuilder);
    }
}