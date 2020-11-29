using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Taiji.Host.DataContract;
using Taiji.Host.Services;

namespace Taiji.Host
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            var pt = new PluginTable();
            services.AddSingleton<PluginTable>(pt);
            services.AddSingleton<PluginServiceCollection>();
            var plugin = new PluginCollector(pt);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.MapWhen(ctx =>
            {
                var pt = ctx.RequestServices.GetService<PluginTable>();
                var moduleName = ctx.Request.Path.Value.Split('/')[1];
                return pt.ContainsKey(moduleName);
            }, appbuilder =>
            {
                appbuilder.Use(next => async ctx =>
                {
                    var pluginServiceCollectionDic = appbuilder.ApplicationServices.GetService<PluginServiceCollection>();
                    var pluginApp = appbuilder.ApplicationServices.GetService<PluginTable>();
                    var pluginName = ctx.Request.Path.Value.Split('/')[1];
                    var plugin = pluginApp[pluginName];

                    if (!pluginServiceCollectionDic.ContainsKey(pluginName))
                    {
                        var _pluginServiceCollection = new ServiceCollection();
                        _pluginServiceCollection.AddSingleton<ILoggerFactory>(new LoggerFactory());
                        pluginServiceCollectionDic.Add(pluginName, _pluginServiceCollection);
                     
                    }
                    var pluginServiceCollection = pluginServiceCollectionDic[pluginName];

                    plugin.Bootloader.RegistService(pluginServiceCollection);
                    var _app = new ApplicationBuilder(pluginServiceCollection.BuildServiceProvider());
                    await plugin.Bootloader.RegistAppContext(_app).Build().Invoke(ctx);
                });
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:8000");
                }
            });
        }
    }
}
