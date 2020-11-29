using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taiji.Framework.Interfaces;

namespace Taiji.DataServer
{
    public class BootLoader : IServiceBootloader
    {
        public string ServiceBackendUrl { get; set; } = "/dataserver/api";
        public string ServiceFrontendUrl { get; set; } = "/dataserver";
        public string Version { get; set; } = "1.0.0";
        public string Name { get; set; } = "dataserver";
        public string Icon { get; set; } = "图标base64";
        public string Description { get; set; } = "用以提供数据微服务的管理工具+";

        public IApplicationBuilder RegistAppContext(IApplicationBuilder app)
        {
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
            //}

            //app.UseHttpsRedirection();
            //app.UseStaticFiles();
            //app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "/dataserver/{controller}/{action=Index}/{id?}");
            });

            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "ClientApp";

            //    //if (env.IsDevelopment())
            //    //{
            //    spa.UseReactDevelopmentServer(npmScript: "start");
            //    //}
            //});
            return app;
        }

        public void RegistService(IServiceCollection services)
        {
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }
    }
}
